import { Cartesian2, Cartesian3, Event, Viewer } from "cesium";
import { MapTool, MouseButton, MouseEvent } from "./MapTool";
import { POIManager } from "./POIManager";
import { POI } from "./POI";

export class MovePOI extends MapTool {
    private _poiManager: POIManager | undefined;
    private _selectedPOI: POI | undefined;

    private _topHeightWhenClicked = 0;
    private readonly _mousePositionWhenClicked: Cartesian2 = new Cartesian2();
    protected readonly _poiSelected: Event = new Event();
    protected readonly _heightChanged: Event = new Event();
    protected readonly _locationChanged: Event = new Event();
    private _isDragging = false;

    constructor(options: { viewer: Viewer }) {
        super({
            name: "MovePOI",
            viewer: options.viewer
        });
    }

    get poiSelected() {
        return this._poiSelected;
    }

    get heightChanged() {
        return this._heightChanged;
    }

    get locationChanged() {
        return this._locationChanged;
    }

    activate(activateOptions: any): void {
        super.activate(activateOptions);

        this._poiManager = activateOptions.poiManager;
    }

    deactivate(deactivateOptions: { normallyDeactivate: boolean }): void {
        super.deactivate(deactivateOptions);

        this._poiManager = undefined;

        if (this._selectedPOI) {
            this._selectedPOI = undefined;
        }
    }

    setSelectedPOI(poi: POI) {
        this._selectedPOI = poi;
        window.geoTech.poiManager.currentPOI = poi;
        this._poiSelected.raiseEvent(poi);
    }

    _selectPOI(mousePosition: Cartesian2) {
        const pickedPrimitive = this.pickPrimitive(mousePosition);

        const poi = this._poiManager?.getPOIFromPrimitive(pickedPrimitive);

        if (poi) {
            this._poiSelected.raiseEvent(poi);
        }

        return poi;
    }

    canvasPressEvent(event: MouseEvent): void {
        if (event.button === MouseButton.LeftButton) {
            this.canvasPressEventByLeftButton(event.pos);
        } else if (event.button === MouseButton.RightButton) {
            this.canvasPressEventByRightButton(event.pos);
        }
    }

    canvasPressEventByLeftButton(pos: Cartesian2): void {
        const curSelectedPOI = this._selectPOI(pos);

        if (this._selectedPOI) {
            if (curSelectedPOI && !Object.is(curSelectedPOI, this._selectedPOI)) {
                // select another POI
                this._selectedPOI.dehighlight();
                this._selectedPOI = curSelectedPOI;

                window.geoTech.poiManager.setCurrentPOI(curSelectedPOI);

                this._readyVerticalDrag(pos);
            } else if (!curSelectedPOI) {
                const scene = this._viewer.scene;
                scene.screenSpaceCameraController.enableRotate = true;
                this._isDragging = false;
            } else {
                this._isDragging = true;
                this._readyVerticalDrag(pos);
            }
        } else {
            this._selectedPOI = curSelectedPOI;

            if (this._selectedPOI) {
                window.geoTech.poiManager.setCurrentPOI(curSelectedPOI);
                this._readyVerticalDrag(pos);
            }
        }
    }

    _readyVerticalDrag(pos: Cartesian2) {
        this._topHeightWhenClicked = this._selectedPOI!.height;
        Cartesian2.clone(pos, this._mousePositionWhenClicked);
        this.scene.screenSpaceCameraController.enableRotate = false;
    }

    canvasPressEventByRightButton(pos: Cartesian2): void {
        if (!this._selectedPOI) {
            return;
        }

        // change position
        const position = this.getWorldPosition(pos, new Cartesian3());

        if (!position) {
            return;
        }

        this._selectedPOI.changePosition(position);

        this._locationChanged.raiseEvent();
    }

    canvasMoveEvent(event: MouseEvent) {
        if (event.button !== MouseButton.LeftButton) {
            return;
        }

        if (!this._selectedPOI || !this._isDragging) {
            return;
        }

        const deltaY = this._mousePositionWhenClicked.y - event.pos.y;

        this._selectedPOI.height = this._topHeightWhenClicked + deltaY * 0.1;

        this._heightChanged.raiseEvent(this._selectedPOI.height);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canvasReleaseEvent(event: MouseEvent): void {
        const scene = this._viewer.scene;
        scene.screenSpaceCameraController.enableRotate = true;
        this._isDragging = false;
    }

    updateHeight(h: number) {
        if (!this._selectedPOI) {
            return;
        }

        this._selectedPOI.setVerticalLength(h);
        this._heightChanged.raiseEvent(h);
    }
}
