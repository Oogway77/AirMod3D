// q@ts-nocheck
/* qeslint-disable */
import React from "react";
import { GeoTech } from "@core/GeoTech";

type GeoTechViewerWrapperProps = {
    geoTech: GeoTech;
};

class GeoTechViewerWrapper extends React.Component<GeoTechViewerWrapperProps> {
    componentWillUnmount() {
        const { geoTech } = this.props;

        const geoTechViewer = geoTech.mainViewer;

        if (geoTechViewer.attached) {
            geoTechViewer.detach();
        }
    }

    /**
     * @argument {HTMLDivElement} container
     */
    containerRef = (container: HTMLDivElement | null) => {
        const { geoTech } = this.props;

        const geoTechViewer = geoTech.mainViewer;

        if (geoTechViewer.attached) {
            geoTechViewer.detach();
        }

        if (container !== null) {
            geoTechViewer.attach(container);
        }
    };

    render() {
        return (
            <>
                <div id="geo-tech-viewer-wrapper" ref={this.containerRef} style={{ width: "100%", height: "100%" }} />
            </>
        );
    }
}

export default GeoTechViewerWrapper;
