import { Cartesian3, Viewer, Event } from "cesium";
import { MapTool, MouseEvent } from "./MapTool";
import { POIList } from "./POIList";

export class AddPOI extends MapTool {
    private _poiList: POIList | undefined;
    protected readonly _clickedForAddPOI: Event = new Event();
    protected readonly _poiCreated: Event = new Event();

    constructor(options: { viewer: Viewer }) {
        super({
            name: "AddPOI",
            viewer: options.viewer
        });
    }

    get clickedForAddPOI() {
        return this._clickedForAddPOI;
    }

    get poiCreated() {
        return this._poiCreated;
    }

    activate(activateOptions: any): void {
        super.activate(activateOptions);

        this._poiList = activateOptions.poiList;
    }

    deactivate(deactivateOptions: { normallyDeactivate: boolean }): void {
        super.deactivate(deactivateOptions);

        this._poiList = undefined;
    }

    canvasPressEvent(event: MouseEvent): void {
        const position = this.getWorldPosition(event.pos, new Cartesian3());

        if (!position) {
            return;
        }

        this._clickedForAddPOI.raiseEvent(event.pos, position);
    }

    addPOIWithProperties(id: string, height: number, marker: string, position: Cartesian3): boolean {
        const samePOI = this._poiList?.pois.filter((poi) => poi.id === id);

        if (samePOI && samePOI.length > 0) {
            return false;
        }

        this._poiList?.addPOIFromProperties(id, height, marker, position);

        const createdPOI = this._poiList?.pois.filter((poi) => poi.id === id);
        this._poiCreated.raiseEvent(createdPOI[0] || undefined);

        return true;
    }
}
