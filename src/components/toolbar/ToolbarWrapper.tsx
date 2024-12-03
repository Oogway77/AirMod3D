/* eslint-disable no-alert */
// q@ts-nocheck
/* qeslint-disable */
import { useEffect } from "react";
import { useCustomEventListener } from "react-custom-events";
import { GeoTechEventsTypes } from "@core/Events";
import { CalciteAction, CalciteActionGroup, CalciteTooltip } from "@esri/calcite-components-react";
import toast from "react-hot-toast";
import { DataActionIds } from "../data-action-ids";

const ToolbarWrapper = () => {
    const geoTech = window.geoTech;
    const uiManager = geoTech.uiManager;

    useEffect(() => {
        const onActiveSiteChanged = () => {
            if (!geoTech.poiManager.activeSite) {
                uiManager.disableOrEnableAction(DataActionIds.Info, true);
                uiManager.disableOrEnableAction(DataActionIds.Download, true);
                uiManager.disableOrEnableAction(DataActionIds.Add, true);
                uiManager.disableOrEnableAction(DataActionIds.Move, true);
            } else {
                uiManager.disableOrEnableAction(DataActionIds.Info, false);
                uiManager.disableOrEnableAction(DataActionIds.Download, false);
                uiManager.disableOrEnableAction(DataActionIds.Add, false);
                uiManager.disableOrEnableAction(DataActionIds.Move, false);
            }
        };
        geoTech.poiManager?.activeSiteChanged.addEventListener(onActiveSiteChanged);
    }, []);

    const determineNavigationHelperRight = () => {
        const initialNavigationHelperRight = 15;
        const gap = uiManager.getShellPanelEndGap();

        if (uiManager.shellPanelEndHidden) {
            uiManager.setNavigationHelperRight(0);
        } else {
            if (uiManager.shellPanelEndActionBarExpanded) {
                uiManager.setNavigationHelperRight(initialNavigationHelperRight + gap);
            } else {
                uiManager.setNavigationHelperRight(initialNavigationHelperRight);
            }
        }
    };

    useCustomEventListener(GeoTechEventsTypes.PanelEndClicked, () => {
        determineNavigationHelperRight();
    });

    return (
        <CalciteActionGroup>
            <CalciteAction
                id="action-info"
                data-action-id={DataActionIds.Info}
                icon="information"
                text="Info"
                disabled
                onClick={() => {
                    const infos = document.getElementsByClassName("info-layout-particles--active");

                    if (infos.length === 0) {
                        geoTech.requireUiInfoLayoutOpen();
                    } else {
                        geoTech.requireUiInfoLayoutClose();
                    }
                }}
            >
                <CalciteTooltip reference-element="action-info" placement="right" closeOnClick={true}>
                    <span>Info</span>
                </CalciteTooltip>
            </CalciteAction>
            <CalciteAction
                id="action-navigation-instructions"
                data-action-id={DataActionIds.NavigationInstructions}
                icon="question"
                text="Navigation Instructions"
                onClick={() => {
                    uiManager.hideCesiumNavigationHelper();
                    uiManager.toggleNavigationHelper();
                }}
            >
                <CalciteTooltip
                    reference-element="action-navigation-instructions"
                    placement="right"
                    closeOnClick={true}
                >
                    <span>Toggle Navigation Help</span>
                </CalciteTooltip>
            </CalciteAction>
            <CalciteAction
                id="action-play-model"
                data-action-id={DataActionIds.Play}
                icon="play"
                text="Play Model"
                onClick={() => {
                    uiManager.hideCesiumNavigationHelper();

                    if (geoTech.playModelTool.activate) {
                        geoTech.deactivateCurrentMapTool();
                    } else {
                        geoTech.activatePlayModel();
                    }
                }}
            >
                <CalciteTooltip reference-element="action-play-model" placement="right" closeOnClick={true}>
                    <span>Play Model</span>
                </CalciteTooltip>
            </CalciteAction>
            <CalciteAction
                id="action-download"
                data-action-id={DataActionIds.Download}
                icon="download"
                text="Download GeoJSON"
                disabled
                onClick={() => {
                    uiManager.hideCesiumNavigationHelper();

                    geoTech.downloadPOIFiles();
                }}
            >
                <CalciteTooltip reference-element="action-download" placement="right" closeOnClick={true}>
                    <span>Download GeoJSON</span>
                </CalciteTooltip>
            </CalciteAction>
            <CalciteAction
                id="action-move"
                data-action-id={DataActionIds.Move}
                icon="move"
                text="Move POI"
                disabled
                onClick={() => {
                    uiManager.hideCesiumNavigationHelper();

                    if (geoTech.movePOITool.activated) {
                        geoTech.deactivateCurrentMapTool();
                    } else {
                        geoTech.activateMovePOI();
                    }
                }}
            >
                <CalciteTooltip reference-element="action-move" placement="right" closeOnClick={true}>
                    <span>Move</span>
                </CalciteTooltip>
            </CalciteAction>
            <CalciteAction
                id="action-add-poi"
                data-action-id={DataActionIds.Add}
                icon="plus"
                text="Add POI"
                disabled
                onClick={() => {
                    uiManager.hideCesiumNavigationHelper();

                    if (!geoTech.poiManager.activeSite) {
                        toast.error(
                            "Pease search for a new Entity or select one from your favorites and then add a POI!",
                            {
                                style: {
                                    fontSize: "12pt",
                                    borderRadius: "10px",
                                    background: "#333",
                                    color: "#fff"
                                }
                            }
                        );
                        uiManager.openPanel(DataActionIds.Entities);
                        return;
                    }

                    if (geoTech.addPOITool.activated) {
                        geoTech.deactivateCurrentMapTool();
                    } else {
                        geoTech.activateAddPOI(geoTech.poiManager.activeSite);
                    }
                }}
            >
                <CalciteTooltip reference-element="action-add-poi" placement="right" closeOnClick={true}>
                    <span>Add POI</span>
                </CalciteTooltip>
            </CalciteAction>
        </CalciteActionGroup>
    );
};

export default ToolbarWrapper;
