import { DataActionIds } from "src/components/data-action-ids";
import { Event } from "cesium";

class UIManager {
    private _prevActionId = "";
    readonly _shellPanelsHidden: Event = new Event();

    constructor() {}

    initialize() {
        this._setupActionClickedListener();

        const panelStart = document.querySelector("calcite-shell-panel");
        const style = document.createElement("style");

        style.innerHTML = ".content { background: none!important; min-inline-size: 0!important; }";
        panelStart.shadowRoot.appendChild(style);

        const panels = document.querySelectorAll("calcite-panel");

        panels.forEach((panel) => {
            if (panel.hasAttribute("data-panel-id")) {
                panel?.addEventListener("calcitePanelClose", function (event) {
                    panel.hidden = true;
                });
            }
        });
    }

    get shellPanelStart() {
        const panels = document.querySelectorAll("calcite-shell-panel");

        if (!panels) {
            return undefined;
        }

        if (panels.length < 1) {
            return undefined;
        }

        return panels[0];
    }

    get shellPanelEnd() {
        const panels = document.querySelectorAll("calcite-shell-panel");

        if (!panels) {
            return undefined;
        }

        if (panels.length < 2) {
            return undefined;
        }

        return panels[1];
    }

    get shellPanelEndHidden() {
        const panelEnd = this.shellPanelEnd;
        if (!panelEnd) {
            return false;
        }

        return panelEnd.hidden;
    }

    get shellPanelsHidden() {
        return this._shellPanelsHidden;
    }

    get shellPanelEndActionBarExpanded() {
        const panelEnd = this.shellPanelEnd;

        if (!panelEnd) {
            return false;
        }

        return panelEnd.querySelector("calcite-action-bar").expanded;
    }

    get navigationHeight() {
        const navigation = document.querySelector("calcite-navigation");

        if (!navigation) {
            return 0;
        }

        return navigation.offsetHeight;
    }

    getShellPanelEndGap() {
        // difference between collapsed and expanded
        const panelEnd = this.shellPanelEnd;
        if (!panelEnd) {
            return;
        }
        if (panelEnd.hidden) {
            return 20;
        }
        return 150;
    }

    _setupActionClickedListener() {
        const actionBars = document.querySelectorAll("calcite-action-bar");

        actionBars.forEach((actionBar) => {
            actionBar.addEventListener("click", (event) => {
                const currentActionId = event.target["data-action-id"];

                const prevActionId = this._prevActionId;

                if (prevActionId) {
                    const prevAction = document.querySelector(`[data-action-id=${prevActionId}]`);

                    prevAction.active = false;

                    const prevPanel = document.querySelector(`[data-panel-id=${prevActionId}]`);

                    if (prevPanel) {
                        prevPanel.closed = true;
                        prevPanel.hidden = true;
                    }
                }

                if (currentActionId !== prevActionId) {
                    const action = document.querySelector(`[data-action-id=${currentActionId}]`);

                    if (currentActionId) {
                        action.active = true;
                    }

                    const panel = document.querySelector(`[data-panel-id=${currentActionId}]`);

                    if (panel) {
                        panel.closed = false;
                        panel.hidden = false;
                    }

                    this._prevActionId = currentActionId;
                } else {
                    this._prevActionId = "";
                }
            });
        });
    }

    setCompassRight(right: number) {
        const compass = document.getElementsByClassName("compass")[0] as HTMLElement;

        if (!compass) {
            return;
        }

        compass.style.right = `${right}px`;
    }

    setMapControlBarRight(right: number) {
        const compass = document.getElementsByClassName("map-control-bar-container")[0] as HTMLElement;

        if (!compass) {
            return;
        }

        compass.style.right = `${right}px`;
    }

    setNavigationHelperRight(right: number) {
        const navigationHelper = document.getElementsByClassName("cesium-navigation-help")[0] as HTMLElement;

        if (!navigationHelper) {
            return;
        }

        navigationHelper.style.right = `${right}px`;
    }

    disableOrEnableAction(actionId: DataActionIds, disabled: boolean) {
        const action = document.querySelector(`[data-action-id=${actionId}]`);
        if (disabled) {
            action.setAttribute("disabled", "true");
        } else {
            action.removeAttribute("disabled");
        }
    }

    setInforLayoutRight(right: number) {
        const infoLayout = document.getElementsByClassName("info-layout-particles")[0] as HTMLElement;

        if (!infoLayout) {
            return;
        }

        infoLayout.style.right = `${right}px`;
    }

    hideCesiumNavigationHelper() {
        const navigationHelper = document.getElementsByClassName("cesium-navigation-help")[0] as HTMLElement;

        navigationHelper.style.visibility = "hidden";
    }

    toggleNavigationHelper() {
        const toolBar = document.getElementsByClassName("cesium-viewer-toolbar")[0] as HTMLElement;
        const toolBarButtons = document.querySelectorAll(".cesium-toolbar-button");
        const navigationHelper = document.getElementsByClassName("cesium-navigation-help")[0] as HTMLElement;

        toolBarButtons.forEach((el) => {
            el.style.opacity = "0";
        });

        if (navigationHelper.style.visibility !== "visible") {
            toolBar.style.opacity = "1";
            toolBar.style.visibility = "visible";
            toolBar.style.background = "rgba(0,0,0,0)";
            navigationHelper.style.opacity = "1";
            navigationHelper.style.visibility = "visible";
            navigationHelper.style.transform = "none";
            navigationHelper.style.zIndex = "1000";
        } else {
            toolBar.style.opacity = "0";
            toolBar.style.visibility = "hidden";
            navigationHelper.style.opacity = "0";
            navigationHelper.style.transform = "scale(0.01)";
            navigationHelper.style.visibility = "hidden";
        }
    }

    toggleShellPanels() {
        const panelStart = this.shellPanelStart;

        if (panelStart) {
            panelStart.hidden = !panelStart.hidden;
        }

        const panelEnd = this.shellPanelEnd;

        if (panelEnd) {
            panelEnd.hidden = !panelEnd.hidden;
        }
    }

    showHideShellPanels(hidden: boolean) {
        const panelStart = this.shellPanelStart;

        if (panelStart) {
            panelStart.hidden = hidden;
        }

        const panelEnd = this.shellPanelEnd;

        if (panelEnd) {
            panelEnd.hidden = hidden;
        }
        this._shellPanelsHidden.raiseEvent();
    }

    openPanel(dataPanelId: DataActionIds) {
        const panel = document.querySelector(`[data-panel-id=${dataPanelId}]`);
        panel.closed = false;
        panel.hidden = false;
    }

    getNavigationHeight() {
        const navigation = document.querySelector("calcite-navigation");

        if (!navigation) {
            console.warn("failed to get navigation");
            return 0;
        }

        return navigation.offsetHeight;
    }

    extractNumberFromPixcel(pixelValue: string) {
        return Number(pixelValue.replace("px", ""));
    }
}

export default UIManager;
