import { GeoTech } from "../core/GeoTech";

declare global {
    interface Window {
        geoTech: GeoTech;
    }
}

export default global;
