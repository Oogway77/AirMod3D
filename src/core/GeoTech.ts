/* qeslint-disable*/
import { Cartesian3, Cartographic, HeadingPitchRange, BoundingSphere, Event } from "cesium";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { emitCustomEvent } from "react-custom-events";
import { GeoTechViewer } from "./GeoTechViewer";
import { Site, CapturedCameraProps } from "./common";
import { CanvasEventHandler } from "./CanvasEventHandler";
import { MapTool } from "./MapTool";
import { AddPOI } from "./AddPOI";
import { MovePOI } from "./MovePOI";
import { PlayModel } from "./PlayModel";
import { saveStringAsTextFile } from "./saveStringAsTextFile";
import { POI } from "./POI";
import { POIManager } from "./POIManager";
import APIInterface from "./APIInterface";
import { GeoTechEventsTypes } from "./Events";
import UIManager from "./UIManager";
import NavigationHelper from "./NavigationHelper";

const USER_SETTINGS_TABLE = "user_settings";

export class GeoTech {
    readonly rootElementId = "root";
    readonly mainViewer = new GeoTechViewer(this);
    readonly apiInterface = new APIInterface();
    private _mapTool: MapTool | undefined;
    private _canvasEventHandler: CanvasEventHandler | undefined;

    private _addPOI: AddPOI | undefined;
    private _movePOI: MovePOI | undefined;
    private _playModel: PlayModel | undefined;
    private _poiManager: POIManager | undefined;
    protected readonly _mapToolDeactivated: Event = new Event();

    private _currentUser: User | undefined;
    private readonly _supabase: SupabaseClient;
    public uiManager = new UIManager();
    private _navigationHelper: NavigationHelper | undefined;

    constructor() {
        this._supabase = createClient(
            "https://csjlfktyrihyyhyxmpku.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzamxma3R5cmloeXloeXhtcGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4MzQ0NzAsImV4cCI6MjA0MjQxMDQ3MH0.jrRGYW_abfS9vZHmxEbhF57ef1RvdROcNRUvtuLXoLQ"
        );

        this._canvasEventHandler = undefined;

        this.mainViewer.mapViewerCreated.addEventListener(() => {
            this.onMapViewerCreated();
        });
    }

    get currentUser() {
        return this._currentUser;
    }

    set currentUser(user: User | undefined) {
        this._currentUser = user;
    }

    get supabase() {
        return this._supabase;
    }

    get viewer() {
        return this.mainViewer.geoTechMapViewer!.viewer;
    }

    get mapViewer() {
        return this.mainViewer.geoTechMapViewer!;
    }

    get scene() {
        return this.viewer.scene;
    }

    get poiManager() {
        return this._poiManager as POIManager;
    }

    get mapToolDeactivated() {
        return this._mapToolDeactivated;
    }

    isMobile() {
        return "ontouchstart" in document.documentElement && navigator.userAgent.match(/Mobi/) !== null;
    }

    // eslint-disable-next-line class-methods-use-this
    start() {
        console.info("start");
    }

    get mapTool() {
        return this._mapTool;
    }

    get addPOITool() {
        return this._addPOI;
    }

    get movePOITool() {
        return this._movePOI;
    }

    get playModelTool() {
        return this._playModel;
    }

    get navigationHelper() {
        return this._navigationHelper!;
    }

    setMapTool(mapTool: MapTool | undefined, activateOptions: any = undefined) {
        if (this._mapTool && !Object.is(this._mapTool, mapTool)) {
            this._mapTool.deactivate();
        }

        if (this._mapTool && Object.is(this._mapTool, mapTool)) {
            // already activated;
            return;
        }

        this._mapTool = mapTool;

        if (mapTool) {
            mapTool.activate(activateOptions);
        }
    }

    deactivateCurrentMapTool(deactivateOptions: any = undefined) {
        if (!this._mapTool) {
            return;
        }

        this._mapTool.deactivate(deactivateOptions);

        this._mapTool = undefined;
        this._mapToolDeactivated.raiseEvent();
    }

    activateAddPOI(site: Site) {
        const poiList = this.poiManager.getPOIList(site);

        this.setMapTool(this._addPOI, { poiList: poiList });
    }

    activateMovePOI() {
        this.setMapTool(this._movePOI, { poiManager: this.poiManager });

        if (this.poiManager.currentPOI) {
            this._movePOI?.setSelectedPOI(this.poiManager.currentPOI);
        }
    }

    activatePlayModel() {
        this.setMapTool(this._playModel, { poiManager: this.poiManager });

        if (this.poiManager.selectedPointCloud) {
            this._playModel?.setGeneratedCloud();
        }
    }

    toggleMovePOI() {
        if (this._movePOI?.isActive()) {
            this.deactivateCurrentMapTool();
        } else {
            this.activateMovePOI();
        }
    }

    togglePlayModel() {
        if (this._playModel?.isActive()) {
            this.deactivateCurrentMapTool();
        } else {
            this.activatePlayModel();
        }
    }

    onMapViewerCreated() {
        this._canvasEventHandler = new CanvasEventHandler({
            parent: this,
            scene: this.scene
        });

        this._canvasEventHandler.activate();

        const viewer = this.viewer;

        this._addPOI = new AddPOI({
            viewer: viewer
        });

        this._movePOI = new MovePOI({
            viewer: viewer
        });

        this._playModel = new PlayModel({
            viewer: viewer
        });

        this._poiManager = new POIManager({
            geoTech: this,
            scene: this.scene
        });

        this._navigationHelper = new NavigationHelper({
            viewer: viewer
        });
    }

    zoomToSite(site: Site) {
        const viewer = this.viewer;

        viewer.entities.values.forEach((entity) => {
            if (entity.properties && entity.properties.name && entity.properties.name.getValue() === site.entity_name) {
                viewer.zoomTo(entity, new HeadingPitchRange(viewer.scene.camera.heading, -0.1, 1000));
            }
        });
    }

    downloadPOIFiles() {
        const poiLists = this.poiManager.POILists;

        for (let i = 0; i < poiLists.length; i++) {
            const poiList = poiLists[i];

            if (poiList.site.entity_number === this.poiManager.activeSite?.entity_number) {
                const geoJson = poiList.exportAsGeoJSON();
                const site = poiList.site;
                saveStringAsTextFile(JSON.stringify(geoJson), site.entity_number);
            }
        }
    }

    flyToPOI(cameraProp: CapturedCameraProps) {
        const viewer = this.viewer;
        viewer.scene.camera.flyTo({
            destination: cameraProp.position,
            duration: 2,
            orientation: {
                heading: cameraProp.heading,
                pitch: cameraProp.pitch,
                roll: cameraProp.roll
            }
        });
    }

    zoomToPOI(poi: POI) {
        const viewer = this.viewer;
        poi.showHide(true);
        viewer.camera.flyToBoundingSphere(
            new BoundingSphere(poi.getPosition(new Cartesian3()), 2)
            // complete: function () {
            //     viewer.camera.setView({
            //             orientation: new HeadingPitchRoll(viewer.camera.heading, CesiumMath.toRadians(-19), viewer.camera.roll)
            //         });
            // }
        );
        // viewer.camera.setView({
        //     orientation: new HeadingPitchRoll(viewer.camera.heading, CesiumMath.toRadians(-19), viewer.camera.roll)
        // });

        // const cartographic = Cartographic.fromCartesian(poi.getPosition(new Cartesian3()));

        // const offset = (300 - cartographic.height) / Math.tan(19);
        // const longitudeValue = CesiumMath.toDegrees(cartographic.longitude);
        // const latitudeValue = CesiumMath.toDegrees(cartographic.latitude - offset/6371e3);

        // const pos = Cartesian3.fromDegrees(longitudeValue, latitudeValue, 300);

        // const startLonDeg = longitudeValue;
        // const startLatDeg = latitudeValue;
        // const bearingDeg = 0;
        // const distance = offset;

        // const start = Cartographic.fromDegrees(startLonDeg,startLatDeg);
        // const end = destGivenBearingStartDistance(bearingDeg, distance, start.latitude, start.longitude);
        // const myGeodesic = new EllipsoidGeodesic(start,end,viewer.scene.globe.ellipsoid);
        // const pos1 = Cartesian3.fromDegrees(end.longitude, end.latitude, 300);

        // // @ts-ignore
        // viewer.camera.flyTo({
        //     destination: pos,
        //     orientation: {
        //         pitch: CesiumMath.toRadians(-19.0)
        //     }
        // });
    }

    updateBottomHeightPOI(argPoi: POI) {
        const excludeObjects = [];

        const pois = this._poiManager!.allPois();

        for (let i = 0; i < pois.length; i++) {
            const poi = pois[i];

            excludeObjects.push(poi.billboard);
            excludeObjects.push(poi.polyline.primitive!);
        }

        const position = Cartesian3.fromDegrees(argPoi.longitude, argPoi.latitude);
        const clampedPosition = this.scene.clampToHeight(position, excludeObjects);

        if (!clampedPosition) {
            console.warn("failed to get clampedPosition");
            return;
        }

        const clampedCarto = Cartographic.fromCartesian(clampedPosition);

        if (!clampedCarto) {
            console.warn("failed to get clampedCarto");
        }

        if (clampedCarto.height > argPoi.height) {
            console.warn("invalid clampedCarto", clampedCarto);
            return;
        }

        argPoi.bottomHeight = clampedCarto.height;
    }

    getUserSettings() {
        const settings = {
            favoritePOIs: this.poiManager.getFavoritePOIsData()
        };

        return settings;
    }

    async fetchUserSettings() {
        if (!this.currentUser) {
            throw new Error("currentUser is required");
        }

        const { data: userSettings, error } = await this._supabase
            .from(USER_SETTINGS_TABLE)
            .select("settings")
            .eq("user_id", this.currentUser.id);

        if (error) {
            console.error(error);
            return;
        }

        if (!userSettings) {
            return;
        }

        if (userSettings.length === 0) {
            return;
        }

        return userSettings[0].settings;
    }

    async saveUserSettings() {
        if (!this.currentUser) {
            throw new Error("currentUser is required");
        }

        const fetchedUserSettings = await this.fetchUserSettings();

        const settings = this.getUserSettings();

        if (fetchedUserSettings) {
            // need to update

            const { data, error } = await this._supabase
                .from(USER_SETTINGS_TABLE)
                .update({ settings: settings })
                .eq("user_id", this.currentUser.id);

            if (error) {
                console.error(error);
                return false;
            }

            if (!data) {
                return false;
            }

            return true;
        }

        // insert
        const { data, error } = await this._supabase
            .from(USER_SETTINGS_TABLE)
            .insert([{ user_id: this.currentUser.id, settings: settings }]);

        if (error) {
            console.error(error);
            return false;
        }

        if (!data) {
            return false;
        }

        return true;
    }

    async logout() {
        try {
            const { error } = await this._supabase.auth.signOut();

            if (error) {
                console.error("soemthing went wrong");
                return;
            }

            this._currentUser = undefined;
        } catch (error) {
            console.error(error);
        }
    }

    requireUiInfoLayoutOpen() {
        emitCustomEvent(GeoTechEventsTypes.UiInfoLayoutOpenRequired);
    }

    requireUiInfoLayoutClose() {
        emitCustomEvent(GeoTechEventsTypes.UiInfoLayoutCloseRequired);
    }
}
