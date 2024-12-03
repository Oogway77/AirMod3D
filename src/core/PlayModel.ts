import { Event, Primitive, Viewer } from "cesium";
import { MapTool } from "./MapTool";
import { POIManager } from "./POIManager";

export class PlayModel extends MapTool {
    private _poiManager: POIManager | undefined;
    private _selectedCloud: Primitive | undefined;

    protected readonly _cloudIsGenerated: Event = new Event();
    protected readonly _modelIsUpdated: Event = new Event();

    constructor(options: { viewer: Viewer }) {
        super({
            name: "PlayModel",
            viewer: options.viewer
        });
    }

    get cloudIsGenerated() {
        return this._cloudIsGenerated;
    }

    get modelIsUpdated() {
        return this._modelIsUpdated;
    }

    updateModel() {
        this._modelIsUpdated.raiseEvent();
    }

    activate(activateOptions: any): void {
        super.activate(activateOptions);

        this._poiManager = activateOptions.poiManager;
    }

    deactivate(deactivateOptions: { normallyDeactivate: boolean }): void {
        super.deactivate(deactivateOptions);

        this._poiManager = undefined;

        if (this._selectedCloud) {
            this._selectedCloud = undefined;
        }
    }

    setGeneratedCloud() {
        this._cloudIsGenerated.raiseEvent();
    }
}
