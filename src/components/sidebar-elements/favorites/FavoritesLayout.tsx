// q@ts-nocheck
/* qeslint-disable */
import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { FaEdit } from "react-icons/fa";
import { POI, Site, CapturedCameraProps } from "@core";
import { CustomTooltip, Button } from "../../common";
import { colorRedBright, dmColorBlueFive } from "../../gui-variables.styles";
import { useActions } from "../../../hooks/useActions";
import { FavoritePOIsData } from "../../../types/common";
import { FavoritesLayoutContainer } from "./favorites-layout.styles";

interface Props {}

const FavoritesLayout = ({}: Props) => {
    const geoTech = window.geoTech;
    const poiManager = geoTech.poiManager;
    const POILists = poiManager.POILists;
    const apiInterface = geoTech.apiInterface;
    const favoritePOIs = poiManager.favoritePOIs;
    const [updated, setUpdated] = useState(false);
    const [selectedNodeId, setSeletedNodeId] = useState("");
    const [editingPOIId, setEditingPOIId] = useState("");
    const [currentChangedName, setCurrentChangedName] = useState("");

    const { setCurrentActivePOI } = useActions();

    const onClickPOITreeItem = async (site: Site, poi: POI, cameraProps: CapturedCameraProps) => {
        let poiList = poiManager.getPOIList(site);
        poiManager.activeSite = site;

        if (poiList) {
            poiList.setVisible(true);

            POILists.forEach((list) => {
                if (list.site.entity_number !== poiList?.site.entity_number) {
                    list.setVisible(false);
                }
            });
        } else {
            poiList = poiManager.createPOIList(site);
        }

        const res = poiList.pois.filter((tpoi) => tpoi.id === poi.id);

        if (res.length < 1) {
            const resPOIs = await apiInterface.fetchPOIsWithEntityNumber(poiList.site.entity_number);

            if (resPOIs?.data.features.length > 0) {
                const features = resPOIs?.data.features;

                if (features.length > 0) {
                    poiList.siteCoordinate = features[0].geometry?.coordinates;
                    poiList.addSiteLabel(poiList.site);

                    for (let i = 0; i < features.length; i++) {
                        const resPOI = poiList.addPOIFromFeature(features[i]);

                        if (resPOI.id === poi.id) {
                            poiManager.setCurrentPOI(resPOI);

                            if (geoTech.movePOITool?.isActive()) {
                                geoTech.movePOITool.setSelectedPOI(resPOI);
                            }
                            setCurrentActivePOI(resPOI);
                        }
                    }
                }
            }
        } else {
            poiManager.setCurrentPOI(res[0]);

            if (geoTech.movePOITool?.isActive()) {
                geoTech.movePOITool.setSelectedPOI(res[0]);
            }

            setCurrentActivePOI(res[0]);
        }

        if (cameraProps.roll === 6.283185307179586) {
            geoTech.zoomToPOI(poi);
        } else {
            geoTech.flyToPOI(cameraProps);
        }
    };

    const loadData = (favoritePOIsDataList: FavoritePOIsData[]) => {
        favoritePOIsDataList.forEach(async (favoritePOIsData: FavoritePOIsData) => {
            const poiList = poiManager.createPOIList(favoritePOIsData.site);

            const resp = await apiInterface.fetchPOIsWithEntityNumber(favoritePOIsData.site.entity_number);

            if (!resp) {
                return;
            }

            const features = resp.data.features;

            if (features.length < 1) {
                return;
            }

            poiList.siteCoordinate = features[0].geometry.coordinates;
            poiList.addSiteLabel(favoritePOIsData.site);

            for (let i = 0; i < features.length; i++) {
                const respoi = poiList.addPOIFromFeature(features[i]);

                const filteredPOIData = favoritePOIsData.poiIDs.filter((poiData) => poiData.poiID === respoi.id);

                if (filteredPOIData.length > 0) {
                    poiManager.favoritePOIs.addFavoritePOI(
                        favoritePOIsData.site,
                        respoi,
                        filteredPOIData[0].changedID,
                        filteredPOIData[0].cameraProps
                    );
                }
            }

            poiList.setVisible(false);

            setUpdated(true);
        });
    };

    useEffect(() => {
        const promise = window.geoTech.fetchUserSettings();

        promise.then((settings) => {
            if (!settings) {
                return;
            }

            loadData(settings.favoritePOIs);
        });
    }, []);

    useEffect(() => {
        if (updated) {
            setUpdated(false);
        }
    }, [updated]);

    const onNodeSelect = (id: string) => {
        console.info("onNodeSelect");
        setSeletedNodeId(id);
    };

    const handleCancel = () => {
        setEditingPOIId("");
    };

    const handleSave = (siteNumber: string, poiId: string) => {
        poiManager.updateFavoriteProps(siteNumber, poiId, currentChangedName);
        setEditingPOIId("");
    };

    const handlePOINameChange = (e: any) => {
        setCurrentChangedName(e.target.value);
    };

    return (
        <FavoritesLayoutContainer id="favorite-layout-container" $light={false}>
            <div id="favorite-layout" className={`solar-layout-particles`}>
                <div className="solar-layout">
                    <div className="solar-layout__content">
                        <div className="toggles-container">
                            <SimpleTreeView
                                aria-label="entities-treeview"
                                // defaultCollapseIcon={<MdExpandMore />}
                                // defaultExpandIcon={<MdChevronRight />}
                                className="toggles-container__tree"
                            >
                                {favoritePOIs.entities.map((entity) => (
                                    <TreeItem
                                        key={entity.site.entity_number}
                                        itemId={entity.site.entity_number}
                                        label={
                                            <CustomTooltip
                                                title={`${entity.site.entity_number} : ${entity.site.entity_name}`}
                                                isRight
                                            >
                                                <div className="toggles-container__parent">
                                                    {entity.site.entity_number}: {entity.site.entity_name.split(" ")[0]}
                                                </div>
                                            </CustomTooltip>
                                        }
                                    >
                                        <SimpleTreeView
                                            aria-label="favorite-treeview"
                                            className="toggles-container__tree"
                                            // selected={selectedNodeId}
                                            // onNodeSelect={(event, id) => onNodeSelect(id)}
                                        >
                                            {entity.fpois.map((fpoi) => (
                                                <TreeItem
                                                    key={fpoi.poi.id}
                                                    itemId={fpoi.poi.id}
                                                    label={
                                                        <div className="rating-content">
                                                            <div className="rating-content__main">
                                                                <Rating
                                                                    className="rating-star"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onChange={(event, value) => {
                                                                        poiManager.updateFavorite(
                                                                            entity.site,
                                                                            fpoi.poi,
                                                                            !!value
                                                                        );
                                                                        setUpdated(true);
                                                                    }}
                                                                    value={1}
                                                                    max={1}
                                                                />
                                                                {editingPOIId !== fpoi.poi.id ? (
                                                                    fpoi.changedId
                                                                ) : (
                                                                    <input
                                                                        type="text"
                                                                        autoFocus
                                                                        className="rating-content__input"
                                                                        value={currentChangedName}
                                                                        onChange={handlePOINameChange}
                                                                        // https://stackoverflow.com/questions/35951771/react-autofocus-sets-cursor-to-beginning-of-input-value
                                                                        onFocus={(
                                                                            e: React.FocusEvent<
                                                                                HTMLInputElement,
                                                                                Element
                                                                            >
                                                                        ) => {
                                                                            const val = e.target.value;
                                                                            e.target.value = "";
                                                                            e.target.value = val;
                                                                        }}
                                                                        onClick={(
                                                                            e: React.MouseEvent<
                                                                                HTMLInputElement,
                                                                                MouseEvent
                                                                            >
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                        }}
                                                                        // https://stackoverflow.com/questions/71055614/why-is-the-space-key-being-filtered-out-by-muis-text-field-component
                                                                        onKeyDown={(
                                                                            event: React.KeyboardEvent<HTMLInputElement>
                                                                        ) => {
                                                                            if (event.code === "Space")
                                                                                event.stopPropagation();
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="rating-content__edit">
                                                                {editingPOIId === fpoi.poi.id ? (
                                                                    <div className="rating-content__edit__btns">
                                                                        <Button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleCancel();
                                                                            }}
                                                                            $backgroundColor={colorRedBright}
                                                                            $textColor="white"
                                                                            width="65px"
                                                                            $marginRight="5px"
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleSave(
                                                                                    entity.site.entity_number,
                                                                                    fpoi.poi.id
                                                                                );
                                                                            }}
                                                                            $backgroundColor={dmColorBlueFive}
                                                                            width="50px"
                                                                            disabled={!currentChangedName}
                                                                        >
                                                                            Save
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="rating-content__edit__icon"
                                                                        role="presentation"
                                                                        onClick={(
                                                                            e: React.MouseEvent<
                                                                                HTMLDivElement,
                                                                                MouseEvent
                                                                            >
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            setEditingPOIId(fpoi.poi.id);
                                                                            setCurrentChangedName(fpoi.poi.id);
                                                                        }}
                                                                    >
                                                                        <FaEdit />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    }
                                                    onClick={() => {
                                                        onClickPOITreeItem(entity.site, fpoi.poi, fpoi.cameraProps);
                                                    }}
                                                />
                                            ))}
                                        </SimpleTreeView>
                                    </TreeItem>
                                ))}
                            </SimpleTreeView>
                        </div>
                    </div>
                </div>
            </div>
        </FavoritesLayoutContainer>
    );
};

export default FavoritesLayout;
