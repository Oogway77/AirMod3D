// q@ts-nocheck
/* qeslint-disable */
import { useEffect, useState } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";
import GUI from "./components/GUI";
import { GeoTech } from "./core/GeoTech";

interface MainProps {
    geoTech: GeoTech;
}

function Main({ geoTech }: MainProps) {
    const [mapViewerCreated, setMapViewerCreated] = useState(geoTech.mainViewer.geoTechMapViewer !== undefined);

    useEffect(() => {
        const onMapViewerCreated = () => {
            if (!mapViewerCreated) {
                setMapViewerCreated(true);
            }
        };

        geoTech.mainViewer.mapViewerCreated.addEventListener(onMapViewerCreated);

        return function () {
            geoTech.mainViewer.mapViewerCreated.removeEventListener(onMapViewerCreated);
        };
    }, []);

    return <>{mapViewerCreated && <GUI geoTech={geoTech} />}</>;
}

export default Main;
