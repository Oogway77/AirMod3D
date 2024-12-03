import { defined, DeveloperError, Event } from "cesium";
import { GeoTech } from "./GeoTech";
import { GeoTechMapViewer } from "./GeoTechMapViewer";

export class GeoTechViewer {
    readonly geoTech: GeoTech;
    mapContainer: HTMLElement | undefined;
    geoTechMapViewer: GeoTechMapViewer | undefined;
    readonly mapViewerCreated = new Event();
    readonly mapViewerDestroyed = new Event();
    destroyingGeoTechMapViewer: boolean = false;

    constructor(geoTech: GeoTech) {
        this.geoTech = geoTech;
    }

    get attached(): boolean {
        return this.mapContainer !== undefined;
    }

    createGeoTechMapViewer() {
        console.info("createGeoTechMapViewer");

        // preConditionStart
        if (defined(this.geoTechMapViewer)) {
            throw new DeveloperError("geoTechMapViewer already created!");
        }
        // preConditionEnd

        const root = document.getElementById(this.geoTech.rootElementId);

        const cesiumContainer = document.createElement("div");

        cesiumContainer.style.width = "100%";
        cesiumContainer.style.height = "100%";

        root!.append(cesiumContainer);
        const geoTechMapViewer = new GeoTechMapViewer(cesiumContainer, this.geoTech);

        this.geoTechMapViewer = geoTechMapViewer;

        this.mapViewerCreated.raiseEvent();

        return geoTechMapViewer;
    }

    attach(mapContainer: HTMLElement) {
        // preConditionStart
        if (!defined(this.geoTechMapViewer)) {
            throw new DeveloperError("geoTechMapViewer required!");
        }
        // preConditionEnd

        this.mapContainer = mapContainer;

        // move from root to this.mapContainer
        this.mapContainer.append(this.geoTechMapViewer!.viewer.container);
    }

    detach() {
        if (!this.mapContainer) {
            return;
        }

        // Detach from a container
        if (this.mapContainer.contains(this.geoTechMapViewer!.viewer.container)) {
            this.mapContainer?.removeChild(this.geoTechMapViewer!.viewer.container);
        }

        this.destroyMapViewer();

        this.mapContainer = undefined;
    }

    private destroyMapViewer() {
        if (this.destroyingGeoTechMapViewer) {
            return;
        }

        this.destroyingGeoTechMapViewer = true;

        const cesiumViewer = this.geoTechMapViewer?.viewer;

        cesiumViewer?.destroy();
        this.mapViewerDestroyed.raiseEvent();

        this.geoTechMapViewer = undefined;
        this.destroyingGeoTechMapViewer = false;
    }
}
