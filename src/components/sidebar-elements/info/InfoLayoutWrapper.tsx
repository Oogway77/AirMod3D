// q@ts-nocheck
/* qeslint-disable */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCustomEventListener } from "react-custom-events";
import { GeoTechEventsTypes } from "@core/Events";

import { getCurrentActivePOI } from "../../../redux";
import { InfoLayoutExpanded } from "./info-layout.styles";
import { GUIOptions } from "../../gui-variables.styles";
import InfoLayout from "./InfoLayout";

const InfoLayoutWrapper = () => {
    const lightMode = false;
    const [isOpen, setIsOpen] = useState(false);
    const geoTech = window.geoTech;
    const uiManager = geoTech.uiManager;

    const currentActivePOI = useSelector(getCurrentActivePOI);

    useEffect(() => {
        setIsOpen(currentActivePOI !== undefined);
        determineInfoLayoutRight(currentActivePOI !== undefined);
    }, [currentActivePOI]);

    useEffect(() => {
        geoTech.uiManager.shellPanelsHidden.addEventListener(() => {
            setIsOpen(false);
        });
    }, []);

    useCustomEventListener(GeoTechEventsTypes.UiInfoLayoutCloseRequired, () => {
        if (isOpen) {
            setIsOpen(false);
            determineInfoLayoutRight(false);
        }
    });

    useCustomEventListener(GeoTechEventsTypes.UiInfoLayoutOpenRequired, () => {
        if (!isOpen) {
            setIsOpen(true);
            determineInfoLayoutRight(true);
        }
    });

    useCustomEventListener(GeoTechEventsTypes.PanelEndClicked, () => {
        setIsOpen(false);
        determineInfoLayoutRight(false);
    });

    const determineInfoLayoutRight = (opened: boolean) => {
        const initialInfoLayoutRight = 49;
        const gap = uiManager.getShellPanelEndGap();
        const initialMapControlBarRight = 65;
        const gapToCompass = -27;
        const initialCompassRight = initialMapControlBarRight + gapToCompass;

        if (uiManager.shellPanelEndHidden) {
            uiManager.setInforLayoutRight(0);
            if (opened) {
                uiManager.setMapControlBarRight(gap + uiManager.extractNumberFromPixcel(GUIOptions.inforLayout.width));
                uiManager.setCompassRight(
                    gapToCompass + gap + uiManager.extractNumberFromPixcel(GUIOptions.inforLayout.width)
                );
            } else {
                uiManager.setMapControlBarRight(gap);
                uiManager.setCompassRight(gapToCompass + gap);
            }
        } else {
            if (uiManager.shellPanelEndActionBarExpanded) {
                uiManager.setInforLayoutRight(initialInfoLayoutRight + gap);
                if (opened) {
                    uiManager.setMapControlBarRight(
                        initialMapControlBarRight +
                            gap +
                            uiManager.extractNumberFromPixcel(GUIOptions.inforLayout.width)
                    );
                    uiManager.setCompassRight(
                        initialCompassRight + gap + uiManager.extractNumberFromPixcel(GUIOptions.inforLayout.width)
                    );
                } else {
                    uiManager.setMapControlBarRight(initialMapControlBarRight + gap);
                    uiManager.setCompassRight(initialCompassRight + gap);
                }
            } else {
                uiManager.setInforLayoutRight(initialInfoLayoutRight);
                if (opened) {
                    uiManager.setMapControlBarRight(
                        initialMapControlBarRight + uiManager.extractNumberFromPixcel(GUIOptions.inforLayout.width)
                    );
                    uiManager.setCompassRight(
                        initialCompassRight + uiManager.extractNumberFromPixcel(GUIOptions.inforLayout.width)
                    );
                } else {
                    uiManager.setMapControlBarRight(initialMapControlBarRight);
                    uiManager.setCompassRight(initialCompassRight);
                }
            }
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        determineInfoLayoutRight(false);
    };

    return (
        <InfoLayoutExpanded id="info-layout-expanded" $light={lightMode}>
            <InfoLayout isOpen={isOpen} onClose={handleClose} />
        </InfoLayoutExpanded>
    );
};

export default InfoLayoutWrapper;
