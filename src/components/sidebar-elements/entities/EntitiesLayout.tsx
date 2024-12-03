// q@ts-nocheck
/* qeslint-disable */
import { Fragment, useState, useEffect } from "react";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import Rating from "@mui/material/Rating";
import { Rings as Loader } from "react-loader-spinner";
import { Radio } from "@mui/material";
import { BiArrowBack } from "react-icons/bi";
import { IoArrowForwardSharp } from "react-icons/io5";
import { allPOITypes, POI, POIList, POIType, EntitySearchType, EntityShowType } from "@core";
import { Button, CheckBox, SearchInput, CustomTooltip } from "../../common";
import { dmColorGreyOne, dmColorBlueFive, dmColorBlueOne } from "../../gui-variables.styles";
import markerPurple from "../../../assets/marker_purple.png";
import markerBlue from "../../../assets/marker_blue.png";
import markerGold from "../../../assets/marker_gold.png";
import markerRed from "../../../assets/marker_red.png";
import { useActions } from "../../../hooks/useActions";
import { EntitiesLayoutContainer } from "./entities-layout.styles";

interface SelectEntitySearchTypeProps {
    active: boolean;
    type: EntitySearchType;
}

interface SelectEntityShowTypeProps {
    active: boolean;
    type: EntityShowType;
}

interface EntitiesLayoutProps {}

const EntitiesLayout = ({}: EntitiesLayoutProps) => {
    const geoTech = window.geoTech;
    const poiManager = geoTech.poiManager;
    const POILists = poiManager.POILists;
    const apiInterface = geoTech.apiInterface;
    const [isInfoPage, setIsInfoPage] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [selectedNodeId, setSeletedNodeId] = useState("");
    const [searchString, setSearchString] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState(allPOITypes);
    const [currentPOIList, setCurrentPOIList] = useState<POIList | null>(null);
    const [entitySearchTypes, setEntitySearchTypes] = useState<SelectEntitySearchTypeProps[]>([
        {
            active: true,
            type: EntitySearchType.EPNS
        },
        {
            active: false,
            type: EntitySearchType.ALL
        }
    ]);

    const [entityShowTypes, setEntityShowTypes] = useState<SelectEntityShowTypeProps[]>([
        {
            active: true,
            type: EntityShowType.ALL
        },
        {
            active: false,
            type: EntityShowType.ONLY_CURRENT_POI
        },
        {
            active: false,
            type: EntityShowType.ONLY_FAVORITES
        }
    ]);

    const { setCurrentActivePOI, clearCurrentActivePOI } = useActions();

    const onClickPOITreeItem = (poi: POI) => {
        currentPOIList?.pois.forEach((cpoi) => cpoi.dehighlight());
        poi.highlight();
        geoTech.zoomToPOI(poi);
        geoTech.poiManager.setCurrentPOI(poi);

        if (geoTech.movePOITool?.isActive()) {
            geoTech.movePOITool.setSelectedPOI(poi);
        }
        setCurrentActivePOI(poi);
    };

    const handleCheckbox = (val: boolean, type: any) => {
        poiManager.updateFilter(val, type);
        setFilters(poiManager.getClonedFilters());
    };

    const loadEntitiesWithSearch = async () => {
        setIsLoading(true);
        const res = await apiInterface.fetchEntitiesWithSearchKey(searchString, entitySearchTypes[1].active);

        if (res) {
            poiManager.cleanPOIList();
            poiManager.sites = res.data.entities || [];
            poiManager.sites.forEach((site) => {
                poiManager.createPOIList(site);
            });
            setUpdated(true);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (updated) {
            setUpdated(false);
        }
    }, [updated]);

    useEffect(() => {
        const onPOICreated = (poi: POI | undefined) => {
            setSeletedNodeId(poi?.id || "");
            setUpdated(true);
            if (poi) {
                geoTech.zoomToPOI(poi);
                geoTech.poiManager.setCurrentPOI(poi);
                setCurrentActivePOI(poi);
                handleCheckbox(true, poi.getType());
            }
        };

        const removeListener = window.geoTech.addPOITool!.poiCreated.addEventListener(onPOICreated);

        return function () {
            removeListener();
        };
    }, []);

    useEffect(() => {
        if (isInfoPage && poiManager.activeSite) {
            const poiList = poiManager.getPOIList(poiManager.activeSite);
            if (poiList) {
                setCurrentPOIList(poiList);
            }
        }

        if (poiManager.currentPOI && isInfoPage) {
            setSeletedNodeId(poiManager.currentPOI.id);
        } else {
            setSeletedNodeId(poiManager.activeSite?.entity_number || "");
        }
    }, []);

    const markerFromPOIType = (type: string) => {
        if (type === POIType.STACK) {
            return markerRed;
        }

        if (type === POIType.FLARE) {
            return markerGold;
        }

        if (type === POIType.FUGITIVE) {
            return markerBlue;
        }

        return markerPurple;
    };

    const renderPOIs = (poiList: POIList | null) => {
        if (!poiList) {
            return <></>;
        }

        const POIs = poiList.pois;

        return (
            <>
                {POIs.map((poi: POI) => {
                    const renderTreeItem = () => (
                        <TreeItem
                            itemId={poi.id}
                            label={
                                <div className="rating-content">
                                    <Rating
                                        className="rating-star"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(event, value) => {
                                            poiManager.updateFavorite(poiList.site, poi, !!value);
                                            setUpdated(true);
                                        }}
                                        value={
                                            poiManager.favoritePOIs?.isFavorite(poiList.site.entity_number, poi.id)
                                                ? 1
                                                : null
                                        }
                                        max={1}
                                    />
                                    <img className="icon-icon" src={markerFromPOIType(poi.getType())} alt="Marker" />
                                    {poi.id}
                                </div>
                            }
                            onClick={() => {
                                onClickPOITreeItem(poi);
                            }}
                        />
                    );

                    return <Fragment key={poi.id}> {poi.getShow() && renderTreeItem()}</Fragment>;
                })}
            </>
        );
    };

    const handleChangeEntityShowType = (checked: boolean, unitType: EntityShowType, index: number) => {
        entityShowTypes.forEach((item) => {
            item.active = false;
        });
        entityShowTypes[index].active = checked;
        setEntityShowTypes([...entityShowTypes]);

        currentPOIList?.setFilterWithCondition(unitType);
    };

    const clearShowFilter = () => {
        entityShowTypes.forEach((item) => {
            item.active = false;
        });
        entityShowTypes[0].active = true;
        setEntityShowTypes([...entityShowTypes]);
        currentPOIList?.setFilterWithCondition(EntityShowType.ALL);
    };

    const onClickEntity = async (poiList: POIList) => {
        setIsLoading(true);
        setIsInfoPage(true);
        setCurrentPOIList(poiList);
        setFilters(allPOITypes);
        clearShowFilter();

        geoTech.poiManager.unsetCurrentPOI();
        clearCurrentActivePOI();
        allPOITypes.forEach((poiType) => {
            geoTech.poiManager.updateFilter(true, poiType);
        });

        geoTech.poiManager.activeSite = poiList.site;

        if (poiList.pois.length === 0) {
            const res = await apiInterface.fetchPOIsWithEntityNumber(poiList.site.entity_number);

            if (res?.data.features.length > 0) {
                const features = res?.data.features;

                poiList.siteCoordinate = features[0].geometry?.coordinates;

                if (poiList.siteCoordinate) {
                    poiList.addSiteLabel(poiList.site);
                }

                for (let i = 0; i < features.length; i++) {
                    poiList.addPOIFromFeature(features[i]);
                }
            }
            setUpdated(true);
        }
        setIsLoading(false);

        poiList.setVisible(true);
        POILists.forEach((list) => {
            if (list.site.entity_number !== poiList.site.entity_number) {
                list.setVisible(false);
            }
        });
        geoTech.zoomToSite(poiList.site);
    };

    const onNodeSelect = (id: string) => {
        console.info("onNodeSelect", id);
        setSeletedNodeId(id);
    };

    const onHandleSearch = () => {
        if (searchString) {
            loadEntitiesWithSearch();
        }
    };

    const onHandleBackToMain = () => {
        setIsInfoPage(false);
        setSeletedNodeId(poiManager.activeSite?.entity_number || "");
        clearShowFilter();
    };
    const onHandleForwardToActivePOI = () => {
        setIsInfoPage(true);
        setSeletedNodeId(poiManager.currentPOI?.id);
    };

    const handleChangeEntitySearchType = (checked: boolean, unitType: EntitySearchType, index: number) => {
        entitySearchTypes.forEach((item) => {
            item.active = false;
        });
        entitySearchTypes[index].active = checked;
        setEntitySearchTypes([...entitySearchTypes]);
    };

    return (
        <EntitiesLayoutContainer id="entities-layout-container">
            <div className={`extended-entities-layout`}>
                <div className="entities-layout">
                    {isInfoPage && (
                        <div className="entities-layout__filter">
                            <div>Filter</div>

                            <div className="entities-layout__filter__main">
                                <div className="entities-layout__filter__main__first">
                                    {allPOITypes.map((type) => {
                                        const label = type as string;
                                        const id = `checkbox-${label}`;
                                        const marker = markerFromPOIType(type);

                                        return (
                                            <div
                                                className={`checkbox_container ${
                                                    !entityShowTypes[0].active && "checkbox_container__disabled"
                                                }`}
                                                key={id}
                                            >
                                                <CheckBox
                                                    id={id}
                                                    label={label}
                                                    $styleData={{ marginLeft: "0px", color: dmColorGreyOne }}
                                                    icon={marker}
                                                    checked={filters.includes(type)}
                                                    onChange={(val) => {
                                                        handleCheckbox(val, type);
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="entities-layout__filter__main__second">
                                    <div className="entities-layout__filter__main__second__radios">
                                        {entityShowTypes.map((item, index) => (
                                            <div className="" key={item.type}>
                                                <Radio
                                                    checked={item.active}
                                                    onChange={(e) =>
                                                        handleChangeEntityShowType(e.target.checked, item.type, index)
                                                    }
                                                    value={item.type}
                                                    name="Show Type"
                                                    size="small"
                                                    sx={{
                                                        color: dmColorGreyOne,
                                                        "&.Mui-checked": {
                                                            color: dmColorBlueOne
                                                        }
                                                    }}
                                                />
                                                <span>{item.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {!isInfoPage && (
                        <>
                            <div className="entities-layout__radio">
                                {entitySearchTypes.map((item, index) => (
                                    <div className="" key={item.type}>
                                        <Radio
                                            checked={item.active}
                                            onChange={(e) =>
                                                handleChangeEntitySearchType(e.target.checked, item.type, index)
                                            }
                                            value={item.type}
                                            name="Unit Type"
                                            size="small"
                                            sx={{
                                                color: dmColorGreyOne,
                                                "&.Mui-checked": {
                                                    color: dmColorBlueOne
                                                }
                                            }}
                                        />
                                        <span>{item.type}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="entities-layout__search">
                                <div className="entities-layout__search__input-content">
                                    <SearchInput
                                        callback={(value) => setSearchString(value)}
                                        callbackEnter={() => {
                                            onHandleSearch();
                                        }}
                                    />
                                </div>
                                <Button
                                    onClick={onHandleSearch}
                                    $backgroundColor={dmColorBlueFive}
                                    disabled={!searchString || isLoading}
                                    width="85px"
                                >
                                    Search
                                </Button>
                            </div>
                        </>
                    )}
                    <div className={`entities-layout__content ${isInfoPage && "entities-layout__content__info"}`}>
                        {isLoading && (
                            <div className="projects-window-loader">
                                <Loader type="Oval" color="#00BFFF" height={60} width={60} />
                            </div>
                        )}
                        {isInfoPage ? (
                            <SimpleTreeView
                                aria-label="favorite-treeview"
                                className="entities-layout__content__tree"
                                // selected={selectedNodeId}
                                // onNodeSelect={(event, id) => onNodeSelect(id)}
                            >
                                {renderPOIs(currentPOIList)}
                            </SimpleTreeView>
                        ) : (
                            <SimpleTreeView
                                aria-label="entities-treeview"
                                className="entities-layout__content__tree"
                                // selected={selectedNodeId}
                                // onNodeSelect={(event, id) => onNodeSelect(id)}
                            >
                                {POILists.map((poiList: POIList) => {
                                    const site = poiList.site;

                                    return (
                                        <TreeItem
                                            key={site.entity_number}
                                            itemId={site.entity_number}
                                            label={
                                                <CustomTooltip
                                                    title={`${site.entity_number} : ${site.entity_name}`}
                                                    isRight
                                                >
                                                    <div className="entities-layout__content__tree__text">
                                                        {site.entity_name}
                                                    </div>
                                                </CustomTooltip>
                                            }
                                            onClick={() => {
                                                onClickEntity(poiList);
                                            }}
                                        />
                                    );
                                })}
                            </SimpleTreeView>
                        )}
                    </div>
                </div>
            </div>
        </EntitiesLayoutContainer>
    );
};

export default EntitiesLayout;
