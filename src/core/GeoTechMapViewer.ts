// qts-nocheck
/* qeslint-disable */
import {
    Camera,
    Cesium3DTileset,
    defined,
    DeveloperError,
    Ion,
    Math as CesiumMath,
    Matrix4,
    HeadingPitchRoll,
    Rectangle,
    Viewer,
    // @ts-ignore
    subscribeAndEvaluate,
    ProviderViewModel,
    Primitive,
    SceneMode
} from "cesium";
import viewerCesiumNavigationMixin from "./cesium-navigation-es6/viewerCesiumNavigationMixin";
import { GeoTech } from "./GeoTech";
import { CapturedCameraProps } from "./common";

export class GeoTechMapViewer {
    private readonly _geoTech: GeoTech;
    private readonly _viewer: Viewer;
    private _customTimePrimitive: Primitive | null = null;
    private _currentCameraProps: CapturedCameraProps | null = null;

    constructor(container: HTMLElement, geoTech: GeoTech) {
        // >>includeStart('debug', pragmas.debug);
        if (!defined(container)) {
            throw new DeveloperError("container is required.");
        }

        Ion.defaultAccessToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MzY2N2M2Yy00NDczLTQ1YmItYmJkOS1iMWMxMTAwYTQ4YjgiLCJpZCI6NjA2MiwiaWF0IjoxNjQzNzEyMjY1fQ.0cV0HEAt-9wQOXt8nOXNmVvDglqXRiPiOfoKpn2XYEk";

        const extent = Rectangle.fromDegrees(-121.064248, 27.195292, -61.3849, 42.600848);
        Camera.DEFAULT_VIEW_RECTANGLE = extent;
        Camera.DEFAULT_VIEW_FACTOR = 0;

        this._geoTech = geoTech;

        this._viewer = new Viewer(container, {
            timeline: false,
            fullscreenButton: false,
            sceneModePicker: false,
            navigationHelpButton: true,
            geocoder: false,
            homeButton: false,
            animation: false,
            baseLayerPicker: true,
            selectionIndicator: false,
            requestRenderMode: true,
            shouldAnimate: true,
            scene3DOnly: true
        });

        const viewer = this._viewer;

        const providerViewModels: ProviderViewModel[] = [];

        const removeMapsList = [
            "Blue Marble",
            "Earth at night",
            "ArcGIS World Hillshade",
            "Esri World Ocean",
            "Stamen Watercolor",
            "Stamen Toner"
        ];

        viewer.baseLayerPicker.viewModel.imageryProviderViewModels.forEach((viewModel) => {
            if (!removeMapsList.includes(viewModel.name)) {
                if (viewModel.name === "Bing Maps Aerial") {
                    viewModel.name = "Google 3d";
                }

                providerViewModels.push(viewModel);
            }
        });

        viewer.baseLayerPicker.viewModel.imageryProviderViewModels = providerViewModels;

        subscribeAndEvaluate(viewer.baseLayerPicker.viewModel, "selectedImagery", (newValue: ProviderViewModel) => {
            if (newValue.name !== "Google 3d") {
                this._currentCameraProps = geoTech.poiManager.getCurrentCameraProps();

                if (this._customTimePrimitive) {
                    this._customTimePrimitive.show = false;
                }
            } else if (this._customTimePrimitive) {
                this._customTimePrimitive.show = true;

                if (this._currentCameraProps) {
                    geoTech.flyToPOI(this._currentCameraProps);
                }
            }
        });

        /**
         * we can hide the globe but if we do so, user can not show blue sky
         */
        viewer.scene.globe.show = true;
        viewer.scene.skyAtmosphere.show = true;
        viewer.scene.highDynamicRange = true;

        // make sure user shows blue sky
        viewer.scene.globe.enableLighting = false;
        viewer.scene.globe.atmosphereLightIntensity = 20.0;

        const tilesetPromise = Cesium3DTileset.fromUrl(
            "https://tile.googleapis.com/v1/3dtiles/root.json?key=AIzaSyB0OID3f2be5GSXCMq7TFBfOlUmBiFBDrU"
        );

        tilesetPromise
            .then((tileset: Cesium3DTileset) => {
                this._customTimePrimitive = this.viewer.scene.primitives.add(tileset);
            })
            .catch((error: any) => {
                console.error(error);
            });

        const camera = viewer.camera;
        camera.percentageChanged = 0.01; // default

        camera.changed.addEventListener(() => {
            const pitch = CesiumMath.toDegrees(viewer.camera.pitch);

            if (pitch > -15) {
                camera.setView({
                    destination: camera.positionWC,
                    orientation: new HeadingPitchRoll(camera.heading, CesiumMath.toRadians(-15), camera.roll),
                    endTransform: Matrix4.IDENTITY
                });
            }
        });

        if (viewerCesiumNavigationMixin) {
            const options = {
                enableCompass: true,
                enableZoomControls: false,
                enableDistanceLegend: false,
                enableCompassOuterRing: true,
                defaultResetView: extent
            };

            viewerCesiumNavigationMixin(viewer, options);
        }
    }

    get viewer() {
        return this._viewer;
    }
}
