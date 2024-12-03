/* qeslint-disable */
// q@ts-nocheck

import {
    Cartesian2,
    Cartesian3,
    Cesium3DTileFeature,
    Cesium3DTileset,
    defined,
    DeveloperError,
    Event,
    KeyboardEventModifier,
    Ray,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Viewer
} from "cesium";

import VisibilityState from "./VisibilityState";

let origCesiumWidgetScreenSpaceHandlerLeftClickHandler:
    | ScreenSpaceEventHandler.PositionedEventCallback
    | ScreenSpaceEventHandler.MotionEventCallback
    | ScreenSpaceEventHandler.WheelEventCallback
    | ScreenSpaceEventHandler.TwoPointEventCallback
    | ScreenSpaceEventHandler.TwoPointMotionEventCallback
    | undefined;

let origCesiumWidgetScreenSpaceHandlerLeftDoubleClickHandler:
    | ScreenSpaceEventHandler.PositionedEventCallback
    | ScreenSpaceEventHandler.MotionEventCallback
    | ScreenSpaceEventHandler.WheelEventCallback
    | ScreenSpaceEventHandler.TwoPointEventCallback
    | ScreenSpaceEventHandler.TwoPointMotionEventCallback
    | undefined;

const cartesianScratch = new Cartesian3();
const rayScratch = new Ray();

let oldCursorStyle: string | undefined;

const visibilityState = new VisibilityState();

export enum MouseButton {
    LeftButton = 1,
    RightButton = 2,
    MidButton = 4,
    LeftRightButtons = 8
}

export interface MouseEvent {
    pos: Cartesian2;
    button: MouseButton | undefined;
    keyboardModifier: KeyboardEventModifier | undefined;
}

export interface MapToolConstructorOptions {
    viewer: Viewer;
    name: string;
    cursorStyle?: string;
}

/**
 * Abstract base class for all map tools
 * Map tools are user interactive tools for manipulating the canvas
 */

export abstract class MapTool {
    private _active: boolean;
    protected readonly _viewer: Viewer;
    protected _name: string;
    private _cursorStyle: string | undefined;
    private readonly _activated: Event;
    private readonly _deactivated: Event;

    constructor(options: MapToolConstructorOptions) {
        if (!defined(options.name)) {
            throw new DeveloperError("name should be given");
        }

        this._active = false;
        this._viewer = options.viewer;
        this._name = options.name;
        this._cursorStyle = options.cursorStyle;

        this._activated = new Event();
        this._deactivated = new Event();
    }

    get name() {
        return this._name;
    }

    get activated() {
        return this._activated;
    }

    get deactivated() {
        return this._deactivated;
    }

    get scene() {
        return this._viewer.scene;
    }

    // eslint-disable-next-line class-methods-use-this
    get instructions() {
        return [];
    }

    isActive() {
        return this._active;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    activate(activateOptions: any = undefined) {
        this._activated.raiseEvent();

        if (this._cursorStyle) {
            oldCursorStyle = this._viewer.canvas.style.cursor;
            this._viewer.canvas.style.cursor = this._cursorStyle;
        }

        this._active = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deactivate(deactivateOptions: any = undefined) {
        this._deactivated.raiseEvent();

        if (oldCursorStyle) {
            this._viewer.canvas.style.cursor = oldCursorStyle;
        }

        this._active = false;
    }

    disableOrigCesiumWidgetScreenSpaceHandler() {
        origCesiumWidgetScreenSpaceHandlerLeftClickHandler =
            this._viewer.cesiumWidget.screenSpaceEventHandler.getInputAction(ScreenSpaceEventType.LEFT_CLICK);
        origCesiumWidgetScreenSpaceHandlerLeftDoubleClickHandler =
            this._viewer.cesiumWidget.screenSpaceEventHandler.getInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        this._viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        this._viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

    enableOrigCesiumWidgetScreenSpaceHandler() {
        if (origCesiumWidgetScreenSpaceHandlerLeftClickHandler) {
            this._viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(
                origCesiumWidgetScreenSpaceHandlerLeftClickHandler,
                ScreenSpaceEventType.LEFT_CLICK
            );
        }

        if (origCesiumWidgetScreenSpaceHandlerLeftDoubleClickHandler) {
            this._viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(
                origCesiumWidgetScreenSpaceHandlerLeftDoubleClickHandler,
                ScreenSpaceEventType.LEFT_DOUBLE_CLICK
            );
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    canvasMoveEvent(event: MouseEvent) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    canvasDoubleClickEvent(event: MouseEvent) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    canvasPressEvent(event: MouseEvent) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    canvasReleaseEvent(event: MouseEvent) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    wheelEvent(event: MouseEvent) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    keyPressEvent(event: KeyboardEvent) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    keyReleaseEvent(event: KeyboardEvent) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    canvasClickEvent(event: MouseEvent) {}

    getWorldPosition(mousePosition: Cartesian2, result: Cartesian3) {
        const viewer = this._viewer;
        const scene = viewer.scene;

        let position;
        if (scene.pickPositionSupported) {
            // Hide every primitive that isn't a tileset
            visibilityState.hide(scene);

            // Don't pick default 3x3, or scene.pick may allow a mousePosition that isn't on the tileset to pickPosition.
            const pickedObject = scene.pick(mousePosition, 1, 1);

            visibilityState.restore(scene);

            if (
                defined(pickedObject) &&
                (pickedObject instanceof Cesium3DTileFeature || pickedObject.primitive instanceof Cesium3DTileset)
            ) {
                // check to let us know if we should pick against the globe instead
                position = scene.pickPosition(mousePosition, cartesianScratch);

                if (defined(position)) {
                    return Cartesian3.clone(position, result);
                }
            }
        }

        if (!defined(scene.globe)) {
            return undefined;
        }

        const ray = scene.camera.getPickRay(mousePosition, rayScratch);

        if (!ray) {
            return undefined;
        }

        position = scene.globe.pick(ray, scene, cartesianScratch);

        if (position) {
            return Cartesian3.clone(position, result);
        }

        return undefined;
    }

    getWorldPositionOn3DTiles(mousePosition: Cartesian2, result: Cartesian3) {
        const viewer = this._viewer;
        const scene = viewer.scene;

        let position;
        if (scene.pickPositionSupported) {
            // Hide every primitive that isn't a tileset
            visibilityState.hide(scene);

            // Don't pick default 3x3, or scene.pick may allow a mousePosition that isn't on the tileset to pickPosition.
            const pickedObject = scene.pick(mousePosition, 1, 1);

            visibilityState.restore(scene);

            if (
                defined(pickedObject) &&
                (pickedObject instanceof Cesium3DTileFeature || pickedObject.primitive instanceof Cesium3DTileset)
            ) {
                // check to let us know if we should pick against the globe instead
                position = scene.pickPosition(mousePosition, cartesianScratch);

                if (defined(position)) {
                    return Cartesian3.clone(position, result);
                }
            }
        }

        return undefined;
    }

    protected pickPrimitive(position: Cartesian2) {
        const scene = this.scene;

        const pickedObject = scene.pick(position, 1, 1);

        if (!pickedObject) {
            return undefined;
        }

        if (!pickedObject.primitive) {
            return undefined;
        }

        return pickedObject.primitive;
    }
}
