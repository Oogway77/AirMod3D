/* eslint-disable class-methods-use-this */
/* eslint-disable dot-notation */
/* eslint-disable no-continue */
/* eslint-disable arrow-body-style */
import {
    Cartesian2,
    Cartesian3,
    Event,
    Model,
    Primitive,
    Scene,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    PointPrimitiveCollection
} from "cesium";
import { GeoTech } from "./GeoTech";
import { FavoritePOIsData } from "../types/common";
import { POIType, Site, CapturedCameraProps } from "./common";
import { POI } from "./POI";
import { POIList } from "./POIList";
import { FavoritePOIs } from "./FavoritePOIs";

interface ConstructorOptions {
    geoTech: GeoTech;
    scene: Scene;
}

export class POIManager {
    readonly _geoTech: GeoTech;
    readonly _scene: Scene;
    private _sites: Site[];
    private _activeSite: Site | undefined;
    private _poiLists: POIList[];
    private _favoritePOIs: FavoritePOIs;
    private _filters: POIType[];
    private _currentPOI: POI | undefined;
    private _selectedModel: Model | undefined;
    private _selectedCloud: Primitive | undefined;
    private _selectedPointCloud: PointPrimitiveCollection | undefined;
    private _selectedChimney: Primitive | undefined;
    private _visibleEmissionCloud: boolean;
    readonly _poiSelected: Event = new Event();
    readonly _activeSiteChanged: Event = new Event();

    constructor(options: ConstructorOptions) {
        this._geoTech = options.geoTech;
        this._sites = [];
        this._poiLists = [];
        this._scene = options.scene;
        this._visibleEmissionCloud = false;
        this._favoritePOIs = new FavoritePOIs({ entities: [] });

        const handler = new ScreenSpaceEventHandler(this._scene.canvas);

        handler.setInputAction((movement: { position: Cartesian2 }) => {
            this.selectPOI(movement.position);
        }, ScreenSpaceEventType.LEFT_CLICK);

        this._filters = [];

        this._filters.push(POIType.STACK);
        this._filters.push(POIType.FLARE);
        this._filters.push(POIType.FUGITIVE);
        this._filters.push(POIType.OTHER);
    }

    get sites() {
        return this._sites;
    }

    get POILists() {
        return this._poiLists!;
    }

    get favoritePOIs() {
        return this._favoritePOIs;
    }

    get activeSite() {
        return this._activeSite;
    }

    set activeSite(site: Site | undefined) {
        this._activeSite = site;
        this._activeSiteChanged.raiseEvent();
    }

    get poiSelected() {
        return this._poiSelected;
    }

    get activeSiteChanged() {
        return this._activeSiteChanged;
    }

    get selectedCloud() {
        return this._selectedCloud;
    }

    get selectedPointCloud() {
        return this._selectedPointCloud;
    }

    get selectedModel() {
        return this._selectedModel;
    }

    get selectedChimney() {
        return this._selectedChimney;
    }

    get visibleEmissionCloud() {
        return this._visibleEmissionCloud;
    }

    get currentPOI() {
        return this._currentPOI;
    }

    set currentPOI(poi: POI | undefined) {
        this._currentPOI = poi;
    }

    setCurrentPOI(poi: POI) {
        if (this._currentPOI) {
            this._currentPOI.dehighlight();
        }

        this._currentPOI = poi;
        this._currentPOI.highlight();
    }

    unsetCurrentPOI() {
        if (this._currentPOI) {
            this._currentPOI.dehighlight();
        }

        this._currentPOI = undefined;
    }

    set selectedCloud(primitive: Primitive | undefined) {
        this._selectedCloud = primitive;
    }

    set selectedPointCloud(collection: PointPrimitiveCollection | undefined) {
        this._selectedPointCloud = collection;
    }

    set selectedModel(model: Model | undefined) {
        this._selectedModel = model;
    }

    set selectedChimney(primitive: Primitive | undefined) {
        this._selectedChimney = primitive;
    }

    set sites(val: Site[]) {
        this._sites = val;
    }

    set visibleEmissionCloud(val: boolean) {
        this._visibleEmissionCloud = val;
    }

    getSite(siteName: string) {
        for (let i = 0; i < this.sites.length; i++) {
            if (this.sites[i].entity_name === siteName) {
                return this.sites[i];
            }
        }

        return undefined;
    }

    cleanPOIList() {
        this._poiLists.forEach((poiList) => {
            poiList.clearPrimitives();
        });
        this._poiLists = [];
        this._sites = [];
        this.activeSite = undefined;
        this._currentPOI = undefined;
    }

    createPOIList(site: Site) {
        const poiList = new POIList({
            site: site,
            geoJson: undefined,
            scene: this._scene
        });

        this._poiLists.push(poiList);

        return poiList;
    }

    getPOIList(site: Site) {
        for (let i = 0; i < this._poiLists.length; i++) {
            const poiList = this._poiLists[i];

            if (poiList.site.entity_number === site.entity_number) {
                return poiList;
            }
        }

        return undefined;
    }

    getPOIByName(name: string) {
        for (let i = 0; i < this._poiLists.length; i++) {
            const poiList = this._poiLists[i];

            const pois = poiList.pois;

            for (let j = 0; j < pois.length; j++) {
                const poi = pois[i];
                const properties = poi.properties;

                if (!properties) {
                    continue;
                }

                if (properties["name"] && properties["name"] === name) {
                    return poi;
                }
            }
        }

        return undefined;
    }

    getPOIFromPrimitive(primitive: any) {
        for (let i = 0; i < this._poiLists.length; i++) {
            const ret = this._poiLists[i].getPOIFromPrimitive(primitive);

            if (ret) {
                return ret;
            }
        }

        return undefined;
    }

    selectPOI(position: Cartesian2) {
        const scene = this._scene;

        const pickedObject = scene.pick(position, 1, 1);

        if (!pickedObject) {
            return;
        }

        if (!pickedObject.primitive) {
            return;
        }

        const poi = this.getPOIFromPrimitive(pickedObject.primitive);

        if (poi) {
            this._poiSelected.raiseEvent(poi, position);
        }
    }

    get filters() {
        return this._filters;
    }

    // eslint-disable-next-line class-methods-use-this
    allPOITypes() {
        const ret = [];

        ret.push(POIType.STACK);
        ret.push(POIType.FLARE);
        ret.push(POIType.FUGITIVE);
        ret.push(POIType.OTHER);

        return ret;
    }

    updateFilter(add: boolean, argType: POIType) {
        if (add) {
            if (this._filters.includes(argType)) {
                return;
            }

            this._filters.push(argType);
        } else {
            if (!this._filters.includes(argType)) {
                return;
            }

            this._filters = this.filters.filter((type) => type !== argType);
        }

        for (let i = 0; i < this._poiLists.length; i++) {
            this._poiLists[i].setFilter(this._filters);
        }
    }

    getClonedFilters() {
        const filters = [];

        for (let i = 0; i < this._filters.length; i++) {
            filters.push(this._filters[i]);
        }

        return filters;
    }

    getCurrentCameraProps() {
        const camera = this._scene.camera;
        const position = Cartesian3.clone(camera.positionWC);
        const heading = camera.heading;
        const pitch = camera.pitch;
        const roll = camera.roll;

        const item: CapturedCameraProps = {
            position: position,
            heading: heading,
            pitch: pitch,
            roll: roll
        };

        return item;
    }

    updateFavoriteProps(siteNumber: string, poiId: string, changedId: string) {
        const item = this.getCurrentCameraProps();
        this._favoritePOIs.updateFavoritePOI(siteNumber, poiId, changedId, item);

        this._geoTech.saveUserSettings();
    }

    updateFavorite(site: Site, poi: POI, value: boolean) {
        const item = this.getCurrentCameraProps();

        if (value) {
            this._favoritePOIs.addFavoritePOI(site, poi, poi.id, item);
        } else {
            this._favoritePOIs.removeFavoritePOI(site.entity_number, poi.id);
        }

        this._geoTech.saveUserSettings();
    }

    getFavoritePOIsData() {
        const poiData: FavoritePOIsData[] =
            this._favoritePOIs.entities.map(
                (entity) =>
                    ({
                        site: entity.site,
                        poiIDs: entity.fpois.map((fpoi) => {
                            return { poiID: fpoi.poi.id, changedID: fpoi.changedId, cameraProps: fpoi.cameraProps };
                        })
                    }) as FavoritePOIsData
            ) || [];

        return poiData;
    }

    _printSortedIds(poiList: POIList) {
        const ids = [];

        for (let j = 0; j < poiList.pois.length; j++) {
            const poi = poiList.pois[j];

            ids.push(poi.id);
        }

        ids.sort();

        console.warn(ids);
    }

    allPois() {
        const ret = [];

        for (let i = 0; i < this._poiLists.length; i++) {
            const poiList = this._poiLists[i];

            for (let j = 0; j < poiList.pois.length; j++) {
                const poi = poiList.pois[j];

                ret.push(poi);
            }
        }

        return ret;
    }
}
