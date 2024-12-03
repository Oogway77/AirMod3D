// q@ts-nocheck
/* qeslint-disable */

import { useEffect } from "react";
import { emitCustomEvent } from "react-custom-events";

import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import "@esri/calcite-components/dist/components/calcite-navigation";
import "@esri/calcite-components/dist/components/calcite-navigation-logo";
import "@esri/calcite-components/dist/components/calcite-navigation-user";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-tooltip";

import {
    CalciteActionBar,
    CalciteAction,
    CalciteNavigation,
    CalciteNavigationLogo,
    CalciteNavigationUser,
    CalcitePanel,
    CalciteShell,
    CalciteShellPanel,
    CalciteTooltip
} from "@esri/calcite-components-react";
import { Toaster } from "react-hot-toast";

import EntityIconSvg from "../assets/side-nav-svgs/Entity.svg?react";
import FavoriteIconSvg from "../assets/side-nav-svgs/Favorite.svg?react";
import EmissionIconSvg from "../assets/side-nav-svgs/Emission.svg?react";
import SettingsIconSvg from "../assets/side-nav-svgs/Settings.svg?react";
import LogoutIconSvg from "../assets/side-nav-svgs/Logout.svg?react";
import BasemapIconSvg from "../assets/side-nav-svgs/Basemap.svg?react";

import { GeoTech } from "@core/GeoTech";
import { GeoTechEventsTypes } from "@core/Events";
import { DataActionIds } from "./data-action-ids";
import { GlobalStyles } from "./index.styles";
import BottomBar from "./bottombar/BottomBar";
import ToolbarWrapper from "./toolbar/ToolbarWrapper";
import POIPopupWrapper from "./popups/poi-popup/POIPopupWrapper";
import POICreatingPopupWrapper from "./popups/poi-creating-popup/POICreatingPopupWrapper";
import HeightSlider from "./height-slider/HeightSlider";
import SimulationPlayer from "./simulation-player/SimulationPlayer";
import GeoTechViewerWrapper from "./GeoTechViewerWrapper";
import EntitiesLayout from "./sidebar-elements/entities/EntitiesLayout";
import FavoritesLayout from "./sidebar-elements/favorites/FavoritesLayout";
import EmissionLayout from "./sidebar-elements/emission/EmissionLayout";
import { useActions } from "../hooks/useActions";
import AccountMenu from "./account-menu/AccountMenu";
import MapControlBar from "./map-control-bar/MapControlBar";
import InfoLayoutWrapper from "./sidebar-elements/info/InfoLayoutWrapper";
import BasemapPicker from "./basemap-picker/BaseMapPicker";

interface GUIProps {
    geoTech: GeoTech;
}

// eslint-disable-next-line arrow-body-style
const GUI = ({ geoTech }: GUIProps) => {
    const { setCurrentUser } = useActions();

    useEffect(() => {
        document.querySelectorAll("calcite-shell-panel")[1].addEventListener("click", () => {
            emitCustomEvent(GeoTechEventsTypes.PanelEndClicked);
        });

        geoTech.uiManager.initialize();
    }, []);

    const isMobile = geoTech.isMobile();

    return (
        <>
            <CalciteShell contentBehind>
                <CalciteNavigation slot="header">
                    <CalciteNavigationLogo
                        id="header-title"
                        heading="AirMod3D"
                        heading-level="1"
                        slot="logo"
                    ></CalciteNavigationLogo>
                    <CalciteNavigationUser
                        slot="user"
                        full-name={geoTech.currentUser.email}
                        username={geoTech.currentUser.email}
                    ></CalciteNavigationUser>
                </CalciteNavigation>

                <CalciteShellPanel slot="panel-start" hidden={isMobile}>
                    <CalciteActionBar slot="action-bar" expanded className="calcite-mode-dark">
                        <CalciteAction
                            id="action-entities"
                            data-action-id={DataActionIds.Entities}
                            aria-expanded="false"
                            appearance="solid"
                            text="Entities"
                        >
                            <EntityIconSvg />
                            <CalciteTooltip reference-element="action-entities" closeOnClick={true}>
                                <span>Entities</span>
                            </CalciteTooltip>
                        </CalciteAction>
                        <CalciteAction id="action-favorite" data-action-id={DataActionIds.Favorite} text="Favorite">
                            <FavoriteIconSvg />
                            <CalciteTooltip reference-element="action-favorite" closeOnClick={true}>
                                <span>Favorite</span>
                            </CalciteTooltip>
                        </CalciteAction>
                        <CalciteAction id="action-emission" data-action-id={DataActionIds.Emission} text="Emission">
                            <EmissionIconSvg />
                            <CalciteTooltip reference-element="action-emission" closeOnClick={true}>
                                <span>Emission</span>
                            </CalciteTooltip>
                        </CalciteAction>

                        <CalciteAction id="action-basemap" data-action-id={DataActionIds.Basemap} text="Basemap">
                            <BasemapIconSvg />
                            <CalciteTooltip reference-element="action-basemap" closeOnClick={true}>
                                <span>Basemap</span>
                            </CalciteTooltip>
                        </CalciteAction>

                        <CalciteAction
                            id="action-settings"
                            data-action-id={DataActionIds.Settings}
                            text="Settings"
                            slot="actions-end"
                        >
                            <SettingsIconSvg />
                            <CalciteTooltip reference-element="action-settings" closeOnClick={true}>
                                <span>Settings</span>
                            </CalciteTooltip>
                        </CalciteAction>
                        <CalciteAction
                            id="action-logout"
                            data-action-id={DataActionIds.Logout}
                            text="Logout"
                            slot="actions-end"
                            onClick={() => {
                                const geoTech = window.geoTech;

                                geoTech.logout();

                                setCurrentUser(undefined);
                            }}
                        >
                            <LogoutIconSvg />
                            <CalciteTooltip reference-element="action-logout" closeOnClick={true}>
                                <span>Logout</span>
                            </CalciteTooltip>
                        </CalciteAction>
                    </CalciteActionBar>

                    <CalcitePanel heading="Entities" data-panel-id={DataActionIds.Entities} closable closed hidden>
                        <EntitiesLayout />
                    </CalcitePanel>

                    <CalcitePanel heading="Favorite" data-panel-id={DataActionIds.Favorite} closable closed hidden>
                        <FavoritesLayout />
                    </CalcitePanel>

                    <CalcitePanel heading="Emission" data-panel-id={DataActionIds.Emission} closable closed hidden>
                        <EmissionLayout />
                    </CalcitePanel>

                    <CalcitePanel heading="Basemap" data-panel-id={DataActionIds.Basemap} closable closed hidden>
                        <BasemapPicker />
                    </CalcitePanel>
                </CalciteShellPanel>

                <CalciteShellPanel slot="panel-end" position="end" displayMode="dock" collapsed>
                    <CalciteActionBar slot="action-bar">
                        <CalciteAction
                            data-action-id={DataActionIds.Layers}
                            icon="layers"
                            text="Layers"
                            slot="trigger"
                            active
                        ></CalciteAction>

                        <ToolbarWrapper />
                    </CalciteActionBar>
                </CalciteShellPanel>

                <GeoTechViewerWrapper geoTech={geoTech} />

                <GlobalStyles />
                <POIPopupWrapper />
                <POICreatingPopupWrapper />
                <HeightSlider />
                <SimulationPlayer />
                <BottomBar />
                <MapControlBar />
                <InfoLayoutWrapper />
            </CalciteShell>

            <AccountMenu />
            <Toaster position="top-center" />
        </>
    );
};

export default GUI;
