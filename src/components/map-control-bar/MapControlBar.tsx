import { useEffect, useState } from "react";
import { useCustomEventListener } from "react-custom-events";
import { GeoTechEventsTypes } from "@core/Events";

import { MapControlBarContainer } from "./map-control-bar.styles";
import EyeIconSvg from "../../assets/map-control-bar-svgs/Eye.svg?react";
import CollapseIconSvg from "../../assets/map-control-bar-svgs/Collapse.svg?react";
import HomeIconSvg from "../../assets/map-control-bar-svgs/Home.svg?react";
import ZoomInIconSvg from "../../assets/map-control-bar-svgs/ZoomIn.svg?react";
import ZoomOutIconSvg from "../../assets/map-control-bar-svgs/ZoomOut.svg?react";

const MapControlBar = () => {
    const geoTech = window.geoTech;
    const uiManager = geoTech.uiManager;
    const [shellPanelsHidden, setShellPanelsHidden] = useState(false);

    const determineRight = () => {
        const initialRight = 65;
        const gapToCompass = -27;
        const initialCompassRight = initialRight + gapToCompass;
        const gap = uiManager.getShellPanelEndGap();

        if (uiManager.shellPanelEndHidden) {
            uiManager.setCompassRight(gapToCompass + gap);
            uiManager.setMapControlBarRight(gap);
        } else {
            if (uiManager.shellPanelEndActionBarExpanded) {
                uiManager.setCompassRight(initialCompassRight + gap);
                uiManager.setMapControlBarRight(initialRight + gap);
            } else {
                uiManager.setMapControlBarRight(initialRight);
                uiManager.setCompassRight(initialCompassRight);
            }
        }
    };

    useCustomEventListener(GeoTechEventsTypes.PanelEndClicked, () => {
        determineRight();
    });

    useEffect(() => {
        determineRight();
    }, []);

    const handleZoomIn = () => {
        geoTech.navigationHelper.zoom(0.5);
    };

    const handleZoomOut = () => {
        geoTech.navigationHelper.zoom(2);
    };

    const handleHome = () => {
        geoTech.navigationHelper.resetView();
    };

    const panelEndHidden = () => {
        const shellPanelEnd = uiManager.shellPanelEnd;

        if (shellPanelEnd) {
            return uiManager.shellPanelEndHidden;
        }

        return false;
    };

    return (
        <MapControlBarContainer id="map-control-bar-container" className="map-control-bar-container">
            <div className="btn-container">
                <button
                    onClick={() => {
                        if (panelEndHidden()) {
                            uiManager.showHideShellPanels(false);
                            setShellPanelsHidden(false);
                        } else {
                            uiManager.showHideShellPanels(true);
                            setShellPanelsHidden(true);
                        }

                        determineRight();
                    }}
                    className="icon-button"
                >
                    {shellPanelsHidden ? <EyeIconSvg /> : <CollapseIconSvg />}
                </button>
            </div>
            <div className="btn-container">
                <button onClick={handleHome} className="icon-button">
                    <HomeIconSvg />
                </button>
            </div>
            <div className="btn-container">
                <button onClick={handleZoomIn} className="icon-button">
                    <ZoomInIconSvg />
                </button>
            </div>
            <div className="btn-container">
                <button onClick={handleZoomOut} className="icon-button">
                    <ZoomOutIconSvg />
                </button>
            </div>
        </MapControlBarContainer>
    );
};

export default MapControlBar;
