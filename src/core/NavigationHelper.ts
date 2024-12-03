import {
    Camera,
    Cartesian3,
    Cartographic,
    defined,
    IntersectionTests,
    Math as CesiumMath,
    Ray,
    Rectangle,
    SceneMode,
    Viewer
} from "cesium";

const cartesian3Scratch = new Cartesian3();
const unprojectedScratch = new Cartographic();
const rayScratch = new Ray();

class NavigationHelper {
    private _viewer: Viewer;

    constructor(options: { viewer: Viewer }) {
        this._viewer = options.viewer;
    }

    zoom(relativeAmount: number) {
        const viewer = this._viewer;
        const scene = viewer.scene;

        const sscc = scene.screenSpaceCameraController;

        // do not zoom if it is disabled

        if (!sscc.enableInputs || !sscc.enableZoom) {
            return;
        }

        const camera = scene.camera;
        let orientation;

        switch (scene.mode) {
            case SceneMode.MORPHING:
                break;
            case SceneMode.SCENE2D:
                camera.zoomIn(camera.positionCartographic.height * (1 - relativeAmount));
                break;
            default:
                let focus;

                if (defined(viewer.trackedEntity)) {
                    focus = new Cartesian3();
                } else {
                    focus = this._getCameraFocus(viewer, false);
                }

                if (!defined(focus)) {
                    // Camera direction is not pointing at the globe, so use the ellipsoid horizon point as
                    // the focal point.
                    const ray = new Ray(
                        camera.worldToCameraCoordinatesPoint(
                            scene.globe.ellipsoid.cartographicToCartesian(camera.positionCartographic)
                        ),
                        camera.directionWC
                    );
                    focus = IntersectionTests.grazingAltitudeLocation(ray, scene.globe.ellipsoid);

                    orientation = {
                        heading: camera.heading,
                        pitch: camera.pitch,
                        roll: camera.roll
                    };
                } else {
                    orientation = {
                        direction: camera.direction,
                        up: camera.up
                    };
                }

                const direction = Cartesian3.subtract(camera.position, focus, cartesian3Scratch);
                const movementVector = Cartesian3.multiplyByScalar(direction, relativeAmount, direction);
                const endPosition = Cartesian3.add(focus, movementVector, focus);

                if (defined(viewer.trackedEntity) || scene.mode === SceneMode.COLUMBUS_VIEW) {
                    // sometimes flyTo does not work (jumps to wrong position) so just set the position without any animation
                    // do not use flyTo when tracking an entity because during animatiuon the position of the entity may change
                    camera.position = endPosition;
                } else {
                    camera.flyTo({
                        destination: endPosition,
                        orientation: orientation,
                        duration: 0.5,
                        convert: false
                    });
                }
        }
    }

    resetView() {
        const viewer = this._viewer;

        const scene = viewer.scene;

        const sscc = scene.screenSpaceCameraController;
        if (!sscc.enableInputs) {
            return;
        }

        const camera = scene.camera;

        if (defined(viewer.trackedEntity)) {
            // when tracking do not reset to default view but to default view of tracked entity

            const trackedEntity = viewer.trackedEntity;
            viewer.trackedEntity = undefined;
            viewer.trackedEntity = trackedEntity;

            if (typeof camera.flyHome === "function") camera.flyHome();
        } else {
            // reset to a default position or view defined in the options

            const options = viewer.options;

            if (options.defaultResetView) {
                if (options.defaultResetView && options.defaultResetView instanceof Cartographic) {
                    camera.flyTo({
                        destination: scene.globe.ellipsoid.cartographicToCartesian(this.terria.options.defaultResetView)
                    });
                } else if (options.defaultResetView && options.defaultResetView instanceof Rectangle) {
                    try {
                        Rectangle.validate(options.defaultResetView);
                        camera.flyTo({
                            destination: options.defaultResetView,
                            orientation: {
                                heading: CesiumMath.toRadians(5.729578)
                            }
                        });
                    } catch (e) {
                        console.log(
                            "Cesium-navigation/ResetViewNavigationControl:   options.defaultResetView Cesium rectangle is  invalid!"
                        );
                    }
                }
            } else if (typeof camera.flyHome === "function") {
                camera.flyHome(1);
            } else {
                camera.flyTo({ destination: Camera.DEFAULT_VIEW_RECTANGLE, duration: 1 });
            }
        }
    }

    _getCameraFocus(viewer: Viewer, inWorldCoordinates: boolean, result: Cartesian3 | undefined = undefined) {
        const scene = viewer.scene;
        const camera = scene.camera;

        if (scene.mode === SceneMode.MORPHING) {
            return undefined;
        }

        if (!defined(result)) {
            result = new Cartesian3();
        }

        // TODO bug when tracking: if entity moves the current position should be used and not only the one when starting orbiting/rotating
        // TODO bug when tracking: reset should reset to default view of tracked entity

        if (defined(viewer.trackedEntity)) {
            result = viewer.trackedEntity.position.getValue(viewer.clock.currentTime, result);
        } else {
            rayScratch.origin = camera.positionWC;
            rayScratch.direction = camera.directionWC;
            result = scene.globe.pick(rayScratch, scene, result);
        }

        if (!defined(result)) {
            return undefined;
        }

        if (scene.mode === SceneMode.SCENE2D || scene.mode === SceneMode.COLUMBUS_VIEW) {
            result = camera.worldToCameraCoordinatesPoint(result, result);

            if (inWorldCoordinates) {
                result = scene.globe.ellipsoid.cartographicToCartesian(
                    scene.mapProjection.unproject(result, unprojectedScratch),
                    result
                );
            }
        } else {
            if (!inWorldCoordinates) {
                result = camera.worldToCameraCoordinatesPoint(result, result);
            }
        }

        return result;
    }
}

export default NavigationHelper;
