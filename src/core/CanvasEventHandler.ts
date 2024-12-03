/* qeslint-disable */
// q@ts-nocheck

import { Cartesian2, KeyboardEventModifier, ScreenSpaceEventHandler, Scene, ScreenSpaceEventType } from "cesium";

import { MapTool, MouseButton, MouseEvent } from "./MapTool";

export interface CanvasEventHandlerParent {
    mapTool: MapTool | undefined;
    setMapTool: (tool: MapTool, activateOptions: any) => void;
}

export class CanvasEventHandler {
    private readonly _parent: CanvasEventHandlerParent;
    private readonly _scene: Scene;
    private readonly _sseh: ScreenSpaceEventHandler;
    private _mouseLeftButtonDowned: boolean = false;
    private _mouseRightButtonDowned: boolean = false;

    constructor(options: { parent: CanvasEventHandlerParent; scene: Scene }) {
        this._parent = options.parent;

        const scene = options.scene;

        this._sseh = new ScreenSpaceEventHandler(scene.canvas);
        this._scene = scene;
    }

    activate() {
        const sseh = this._sseh;

        sseh.setInputAction(this._mouseMove.bind(this), ScreenSpaceEventType.MOUSE_MOVE);
        sseh.setInputAction(
            this._mouseMoveCtrl.bind(this),
            ScreenSpaceEventType.MOUSE_MOVE,
            KeyboardEventModifier.CTRL
        );
        sseh.setInputAction(
            this._mouseMoveShift.bind(this),
            ScreenSpaceEventType.MOUSE_MOVE,
            KeyboardEventModifier.SHIFT
        );

        sseh.setInputAction(this._leftButtonDoubleClick.bind(this), ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        sseh.setInputAction(this._leftDown.bind(this), ScreenSpaceEventType.LEFT_DOWN);
        sseh.setInputAction(this._rightDown.bind(this), ScreenSpaceEventType.RIGHT_DOWN);

        sseh.setInputAction(this._leftUp.bind(this), ScreenSpaceEventType.LEFT_UP);
        sseh.setInputAction(this._leftUpCtrl.bind(this), ScreenSpaceEventType.LEFT_UP, KeyboardEventModifier.CTRL);
        sseh.setInputAction(this._leftUpShift.bind(this), ScreenSpaceEventType.LEFT_UP, KeyboardEventModifier.SHIFT);

        sseh.setInputAction(this._rightUp.bind(this), ScreenSpaceEventType.RIGHT_UP);
        sseh.setInputAction(this._rightUpCtrl.bind(this), ScreenSpaceEventType.RIGHT_UP, KeyboardEventModifier.CTRL);
        sseh.setInputAction(this._rightUpShift.bind(this), ScreenSpaceEventType.RIGHT_UP, KeyboardEventModifier.SHIFT);

        sseh.setInputAction((wheel: any) => {
            this._wheel(wheel);
        }, ScreenSpaceEventType.WHEEL);
        sseh.setInputAction(
            (wheel: any) => {
                this._wheelCtrl(wheel);
            },
            ScreenSpaceEventType.WHEEL,
            KeyboardEventModifier.CTRL
        );

        sseh.setInputAction(this._leftClick.bind(this), ScreenSpaceEventType.LEFT_CLICK);
        sseh.setInputAction(
            this._leftClickShift.bind(this),
            ScreenSpaceEventType.LEFT_CLICK,
            KeyboardEventModifier.SHIFT
        );

        const { canvas } = this._scene;

        // needed to put focus on the canvas
        canvas.setAttribute("tabindex", "0");

        canvas.onclick = function () {
            canvas.focus();
        };

        canvas.addEventListener("keydown", this._handleKeyDown.bind(this));
        canvas.addEventListener("keyup", this._handleKeyUp.bind(this));
    }

    deactivate() {
        const sseh = this._sseh;

        sseh.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        sseh.removeInputAction(ScreenSpaceEventType.LEFT_CLICK, KeyboardEventModifier.SHIFT);

        sseh.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        sseh.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE, KeyboardEventModifier.SHIFT);
        sseh.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
        sseh.removeInputAction(ScreenSpaceEventType.LEFT_UP);
        sseh.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

    static _makeMouseEvent(pos: Cartesian2, button?: MouseButton, keyboardModifier?: KeyboardEventModifier) {
        return {
            pos,
            button,
            keyboardModifier
        };
    }

    static _makeWheelEvent(wheel: Cartesian2, button?: MouseButton, keyboardModifier?: KeyboardEventModifier) {
        return {
            wheel,
            button,
            keyboardModifier
        };
    }

    _mouseMove(movement: ScreenSpaceEventHandler.MotionEvent) {
        let button;

        if (this._mouseLeftButtonDowned && this._mouseRightButtonDowned) {
            button = MouseButton.LeftRightButtons;
        } else if (this._mouseLeftButtonDowned) {
            button = MouseButton.LeftButton;
        } else if (this._mouseRightButtonDowned) {
            button = MouseButton.RightButton;
        }

        const event = CanvasEventHandler._makeMouseEvent(movement.endPosition, button, undefined);

        this._handleMouseMove(event);
    }

    _mouseMoveCtrl(movement: ScreenSpaceEventHandler.MotionEvent) {
        const event = CanvasEventHandler._makeMouseEvent(movement.endPosition, undefined, KeyboardEventModifier.CTRL);

        this._handleMouseMove(event);
    }

    _mouseMoveShift(movement: ScreenSpaceEventHandler.MotionEvent) {
        const event = CanvasEventHandler._makeMouseEvent(movement.endPosition, undefined, KeyboardEventModifier.SHIFT);

        this._handleMouseMove(event);
    }

    _handleMouseMove(event: MouseEvent) {
        if (this._parent.mapTool) {
            this._parent.mapTool.canvasMoveEvent(event);
        }

        const scene = this._scene;

        if (scene.requestRenderMode) {
            scene.requestRender();
        }
    }

    _leftButtonDoubleClick(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(movement.position, MouseButton.LeftButton);

        this._handleDoubleClick(event);
    }

    _handleDoubleClick(event: MouseEvent) {
        if (this._parent.mapTool) {
            this._parent.mapTool.canvasDoubleClickEvent(event);
        }

        const scene = this._scene;

        if (scene.requestRenderMode) {
            scene.requestRender();
        }
    }

    _leftDown(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(movement.position, MouseButton.LeftButton);

        this._handleDown(event);

        this._mouseLeftButtonDowned = true;
    }

    _rightDown(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(movement.position, MouseButton.RightButton);

        this._handleDown(event);

        this._mouseRightButtonDowned = true;
    }

    _handleDown(event: MouseEvent) {
        if (this._parent.mapTool) {
            this._parent.mapTool.canvasPressEvent(event);
        }

        const scene = this._scene;

        if (scene.requestRenderMode) {
            scene.requestRender();
        }
    }

    _leftUp(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(movement.position, MouseButton.LeftButton);

        this._handleUp(event);

        this._mouseLeftButtonDowned = false;
    }

    _leftUpCtrl(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(
            movement.position,
            MouseButton.LeftButton,
            KeyboardEventModifier.CTRL
        );

        this._handleUp(event);
    }

    _leftUpShift(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(
            movement.position,
            MouseButton.LeftButton,
            KeyboardEventModifier.SHIFT
        );

        this._handleUp(event);
    }

    _rightUp(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(movement.position, MouseButton.RightButton);

        this._handleUp(event);

        this._mouseRightButtonDowned = false;
    }

    _rightUpCtrl(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(
            movement.position,
            MouseButton.RightButton,
            KeyboardEventModifier.CTRL
        );

        this._handleUp(event);
    }

    _rightUpShift(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(
            movement.position,
            MouseButton.RightButton,
            KeyboardEventModifier.SHIFT
        );

        this._handleUp(event);
    }

    _handleUp(event: MouseEvent) {
        if (this._parent.mapTool) {
            this._parent.mapTool.canvasReleaseEvent(event);
        }

        const scene = this._scene;

        if (scene.requestRenderMode) {
            scene.requestRender();
        }
    }

    _leftClick(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(movement.position, MouseButton.LeftButton);

        this._handleClick(event);
    }

    _leftClickShift(movement: ScreenSpaceEventHandler.PositionedEvent) {
        const event = CanvasEventHandler._makeMouseEvent(
            movement.position,
            MouseButton.LeftButton,
            KeyboardEventModifier.SHIFT
        );

        this._handleClick(event);
    }

    _handleClick(event: MouseEvent) {
        if (this._parent.mapTool) {
            this._parent.mapTool.canvasClickEvent(event);
        }

        const scene = this._scene;

        if (scene.requestRenderMode) {
            scene.requestRender();
        }
    }

    _wheel(wheel: Cartesian2) {
        const event = CanvasEventHandler._makeWheelEvent(wheel);

        this._handleWheel(event);
    }

    _wheelCtrl(wheel: Cartesian2) {
        const event = CanvasEventHandler._makeWheelEvent(wheel, undefined, KeyboardEventModifier.CTRL);

        this._handleWheel(event);
    }

    _handleWheel(event: any) {
        if (this._parent.mapTool) {
            this._parent.mapTool.wheelEvent(event);
        }

        const scene = this._scene;

        if (scene.requestRenderMode) {
            scene.requestRender();
        }
    }

    _handleKeyDown(event: KeyboardEvent) {
        if (this._parent.mapTool) {
            this._parent.mapTool.keyPressEvent(event);
        }

        const scene = this._scene;

        if (scene.requestRenderMode) {
            scene.requestRender();
        }
    }

    _handleKeyUp(event: KeyboardEvent) {
        if (this._parent.mapTool) {
            this._parent.mapTool.keyReleaseEvent(event);
        }

        const scene = this._scene;

        if (scene.requestRenderMode) {
            scene.requestRender();
        }
    }
}
