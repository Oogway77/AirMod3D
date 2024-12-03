// q@ts-nocheck
/* qeslint-disable */
import { FormEvent, useState, useEffect } from "react";
import {
    Transforms,
    Ellipsoid,
    HeadingPitchRoll,
    Math as CesiumMath,
    // EntityCollection,
    // Cesium3DTileset,
    PointPrimitiveCollection,
    // Entity,
    // Model,
    Cartesian3,
    Matrix4,
    // Cesium3DTileStyle,
    // Cesium3DTileset,
    Color
} from "cesium";
import ReactJson from "react-json-view";
import { Radio } from "@mui/material";
import { allPOIEntityTypes, POIEntityType } from "@core";
import { SelectInputDataItem } from "../../../types/common";
import { EmissionDataProps } from "../../../types/Emission";
import { dmColorGreyOne, dmColorBlueOne } from "../../gui-variables.styles";
import { Button, SelectInput, CustomDatePicker, RangeInput, CheckBox } from "../../common";
import { useActions } from "../../../hooks/useActions";
// import { generateGLTF } from "../../../util/generateGLTF";

import { EmissionLayoutContainer } from "./emission-layout.styles";

interface EmissionLayoutProps {}

enum UnitType {
    Metric = "Metric",
    US = "US"
}

interface SelectUnitTypeProps {
    active: boolean;
    type: UnitType;
}

const EmissionLayout = ({}: EmissionLayoutProps) => {
    const { setCurrentActivePOI } = useActions();

    const geoTech = window.geoTech;
    const poiManager = geoTech.poiManager;
    const POILists = poiManager.POILists;
    const apiInterface = geoTech.apiInterface;

    const COCList: SelectInputDataItem[] = [
        { label: "Benzene", value: 1 },
        { label: "Chromium", value: 2 },
        { label: "Arsenic", value: 3 },
        { label: "Lead", value: 4 },
        { label: "Toluene", value: 5 }
    ];

    const verticalStabilityList: SelectInputDataItem[] = [
        { label: "Very unstable", value: "A" },
        { label: "Moderately unstable", value: "B" },
        { label: "Slightly unstable", value: "C" },
        { label: "Neutral", value: "D" },
        { label: "Moderately stable", value: "E" },
        { label: "Very stable", value: "F" }
    ];

    const roughnessList: SelectInputDataItem[] = [
        { label: "Urban", value: "urban" },
        { label: "Farm village", value: "farm" }
    ];

    const simulatinTimeList: SelectInputDataItem[] = [
        { label: "10 hours", value: 10 },
        { label: "20 hours", value: 20 }
    ];

    const showJson = false;

    const jsonExample: EmissionDataProps = {
        epn_source: "None",
        coc: "Benzene",
        coc_percent: 0.001,
        event_date: new Date().toDateString(),
        event_length: 0,
        diameter: 0.5,
        velocity: 10,
        temp: 60,
        wdir: 0,
        wspd: 5,
        roughness: "urban",
        stability: "C",
        simh: 20
    };

    const [emissionData, setEmissionData] = useState<EmissionDataProps>(jsonExample);
    const [emissionPointList, setEmissionPointList] = useState<SelectInputDataItem[]>([{ label: "None", value: 1 }]);
    const [currentEmissionPoint, setCurrentEmissionPoint] = useState<SelectInputDataItem>(emissionPointList[0]);
    const [currentCOC, setCurrentCOC] = useState<SelectInputDataItem>(COCList[0]);
    const [COCPercent, setCOCPercent] = useState(0.001);
    const [eventDate, setEventDate] = useState(new Date());
    // const [isGenerating, setIsGenerating] = useState(false);
    const [eventLength, setEventLength] = useState(0);
    const [sourceHeight, setSourceHeight] = useState(50);
    const [sourceDiameter, setSourceDiameter] = useState(0.5);
    const [sourceVelocity, setSourceVelocity] = useState(10.0);
    const [sourceTemperature, setSourceTemperature] = useState(60);
    const [windSpeed, setWindSpeed] = useState(5);
    const [windDirection, setWindDirection] = useState(0);
    const [emissionSize, setEmissionSize] = useState(9);
    const [verticalStability, setVerticalStability] = useState<SelectInputDataItem>(verticalStabilityList[0]);
    const [roughness, setRoughness] = useState<SelectInputDataItem>(roughnessList[0]);
    const [simulationTime, setSimulationTime] = useState<SelectInputDataItem>(simulatinTimeList[0]);
    const [poiEntityFilters, setPOIEntityFilters] = useState(allPOIEntityTypes);
    const [updated, setUpdated] = useState(false);
    const [unitTypes, setUnitTypes] = useState<SelectUnitTypeProps[]>([
        {
            active: false,
            type: UnitType.Metric
        },
        {
            active: true,
            type: UnitType.US
        }
    ]);

    const isUnitMetric = unitTypes[0].active;

    const meterToFeet = 3.28084;
    const feetToMeter = 1 / meterToFeet;

    const celsiusToFahrenheit = (val: number) => val * 1.8 + 32;
    const fahrenheitToCelsius = (val: number) => ((val - 32) * 5) / 9;

    const handleChangePOIEntityType = (val: boolean, type: POIEntityType) => {
        if (val) {
            if (poiEntityFilters.includes(type)) {
                return;
            }

            setPOIEntityFilters([...poiEntityFilters, type]);
        } else {
            if (!poiEntityFilters.includes(type)) {
                return;
            }

            const filteredRes = poiEntityFilters.filter((filter) => filter !== type);
            setPOIEntityFilters(filteredRes);
        }
    };

    const updateEmissionPointListData = async () => {
        const epList: SelectInputDataItem[] = [];

        if (poiManager.activeSite) {
            const res = await apiInterface.fetchPOIsWithEntityNumber(poiManager.activeSite.entity_number);

            if (res?.data.features.length > 0) {
                const features = res?.data.features;

                for (let i = 0; i < features.length; i++) {
                    let isUse = true;

                    if (!poiEntityFilters.includes(POIEntityType.ENTITY)) {
                        if (features[i]?.properties.type === "ENTITY") {
                            isUse = false;
                        }
                    }

                    if (!poiEntityFilters.includes(POIEntityType.EPN)) {
                        if (features[i]?.properties.type === "EPN") {
                            isUse = false;
                        }
                    }

                    if (isUse) {
                        epList.push({ label: features[i]?.properties?.ID, value: features[i]?.properties?.ID });
                    }
                }
            }
        }

        setEmissionPointList(epList);

        if (poiManager.currentPOI) {
            setCurrentEmissionPoint({ label: poiManager.currentPOI.id, value: poiManager.currentPOI.id });
            setSourceHeight(poiManager.currentPOI.height);
        }
    };

    useEffect(() => {
        updateEmissionPointListData();
    }, []);

    useEffect(() => {
        updateEmissionPointListData();
    }, [poiEntityFilters]);

    useEffect(() => {
        if (updated) {
            updateEmissionPointListData();
            setUpdated(false);
        }
    }, [updated]);

    const handleEmissionPointFieldChange = (e: { value: string | number }) => {
        const { value } = e;

        const fieldName = typeof value === "string" ? value : value.toString();
        const newFieldData = emissionPointList.find((item) => item.value === fieldName);
        if (newFieldData) {
            setCurrentEmissionPoint(newFieldData);
            setEmissionData({
                ...emissionData,
                epn_source: newFieldData.label
            });

            for (let i = 0; i < POILists.length; i++) {
                const currentPOI = POILists[i].pois.filter((poi) => poi.id === fieldName);

                if (currentPOI.length > 0) {
                    setSourceHeight(currentPOI[0].height);
                    geoTech.zoomToPOI(currentPOI[0]);

                    poiManager.setCurrentPOI(currentPOI[0]);

                    setCurrentActivePOI(currentPOI[0]);
                    return;
                }
            }
        }
    };

    const handleCOCFieldChange = (e: { value: string | number }) => {
        const { value } = e;

        const fieldName = typeof value === "string" ? value : value.toString();
        const newFieldData = COCList.find((item) => item.value === fieldName);
        if (newFieldData) {
            setCurrentCOC(newFieldData);
            setEmissionData({
                ...emissionData,
                coc: newFieldData.label
            });
        }
    };

    const handleVerticalStabilityFieldChange = (e: { value: string | number }) => {
        const { value } = e;

        const fieldName = typeof value === "string" ? value : value.toString();
        const newFieldData = verticalStabilityList.find((item) => item.value === fieldName);
        if (newFieldData) {
            setVerticalStability(newFieldData);
            setEmissionData({
                ...emissionData,
                stability: fieldName
            });
        }
    };

    const handleRoughnessFieldChange = (e: { value: string | number }) => {
        const { value } = e;

        const fieldName = typeof value === "string" ? value : value.toString();
        const newFieldData = roughnessList.find((item) => item.value === fieldName);
        if (newFieldData) {
            setRoughness(newFieldData);
            setEmissionData({
                ...emissionData,
                roughness: newFieldData.label
            });
        }
    };

    const handleSimulationTimeFieldChange = (e: { value: string | number }) => {
        const { value } = e;

        const fieldName = typeof value === "string" ? value : value.toString();
        const newFieldData = simulatinTimeList.find((item) => item.value === fieldName);
        if (newFieldData) {
            setSimulationTime(newFieldData);
            setEmissionData({
                ...emissionData,
                simh: Number(newFieldData.value)
            });
        }
    };

    const handleCOCPercentChange = (e: any) => {
        let val = 0;

        if (e.target.value === "") {
            val = 0;
        } else {
            val = parseFloat(e.target.value);
        }

        if (val < 0) {
            val = 0;
        }

        setCOCPercent(val);
        setEmissionData({
            ...emissionData,
            coc_percent: val
        });
    };

    const handleEventDateChange = (value: Date) => {
        setEventDate(value);
        setEmissionData({
            ...emissionData,
            event_date: value.toDateString()
        });
    };

    const handleEventLengthChange = (e: any) => {
        let val = 0;

        if (e.target.value === "") {
            val = 0;
        } else {
            val = parseFloat(e.target.value);
        }

        if (val < 0) {
            val = 0;
        }

        setEventLength(val);
        setEmissionData({
            ...emissionData,
            event_length: val
        });
    };

    const handleSourceHeightChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;

        const val = parseFloat(target.value);
        const realValue = isUnitMetric ? val : val * feetToMeter;
        setSourceHeight(realValue);

        if (poiManager.currentPOI) {
            poiManager.currentPOI.setVerticalLength(realValue);
        }
    };

    const handleSourceDiameterChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;

        let val = parseFloat(target.value);
        val = isUnitMetric ? val : val * feetToMeter;
        val = Number(val.toFixed(2));
        setSourceDiameter(val);
        setEmissionData({
            ...emissionData,
            diameter: val
        });
    };

    const handleSourceVelocityChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;

        let val = parseFloat(target.value);
        val = isUnitMetric ? val : val * feetToMeter;
        val = Number(val.toFixed(2));
        setSourceVelocity(val);
        setEmissionData({
            ...emissionData,
            velocity: val
        });
    };

    const handleSourceTemperatureChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;

        let val = parseFloat(target.value);
        val = isUnitMetric ? val : fahrenheitToCelsius(val);
        val = Number(val.toFixed(2));
        setSourceTemperature(val);
        setEmissionData({
            ...emissionData,
            temp: val
        });
    };

    const handleWindSpeedChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;

        const val = parseFloat(target.value);
        setWindSpeed(val);
        setEmissionData({
            ...emissionData,
            wspd: val
        });
    };

    const handleWindDirectionChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;

        const val = parseFloat(target.value);
        setWindDirection(val);
        setEmissionData({
            ...emissionData,
            wdir: val
        });
    };

    const handleEmissionSizeChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;

        const val = parseFloat(target.value);
        setEmissionSize(val);
    };

    // const createCubePoints = (modelMatrix: Matrix4, size: number, numPointsPerSide: number) => {
    //     const points = [];
    //     const colors = [];
    //     const step = size / numPointsPerSide;

    //     // Center the cube around (0, 0, 0) in local space
    //     const halfSize = size / 2;

    //     for (let x = -halfSize; x <= halfSize; x += step) {
    //         for (let y = -halfSize; y <= halfSize; y += step) {
    //             for (let z = -halfSize; z <= halfSize; z += step) {
    //                 // Create a point at (x, y, z) in local space
    //                 const localPoint = new Cartesian3(x, y, z);

    //                 // Transform to world coordinates using modelMatrix
    //                 const worldPoint = Matrix4.multiplyByPoint(modelMatrix, localPoint, new Cartesian3());
    //                 points.push(worldPoint);

    //                 // Assign color based on a condition (optional)
    //                 if (x + y + z > 1.5 * halfSize) {
    //                     colors.push(Color.RED);
    //                 } else {
    //                     colors.push(Color.GREEN);
    //                 }
    //             }
    //         }
    //     }

    //     return { points, colors };
    // };

    const createPoints = (origin: Cartesian3, size: number, numPointsPerSide: number) => {
        const points = [];
        const colors = [];
        const step = size / numPointsPerSide;

        // Center the cube around the origin
        const halfSize = size / 2;

        for (let x = -halfSize; x <= halfSize; x += step) {
            for (let y = -halfSize; y <= halfSize * 2; y += step) {
                for (let z = -halfSize; z <= halfSize; z += step) {
                    const localPoint = new Cartesian3(x, y, z);

                    // Transform to world coordinates using modelMatrix
                    const modelMatrix1 = Transforms.eastNorthUpToFixedFrame(origin);
                    const worldPoint = Matrix4.multiplyByPoint(modelMatrix1, localPoint, new Cartesian3());

                    // const pointPosition = Cartesian3.add(origin, new Cartesian3(x, y, z), new Cartesian3());
                    points.push(worldPoint); // Save position

                    // const colorValue = Math.floor(Math.random() * 3);

                    // if (colorValue === 0) {
                    //     colors.push(Color.TRANSPARENT);
                    // } else if (colorValue === 1) {
                    //     colors.push(Color.RED);
                    // } else {
                    //     colors.push(Color.GREEN);
                    // }
                    colors.push(Color.GREEN);
                }
            }
        }

        return { points, colors };
    };

    const generateCloud = async () => {
        const primitives = geoTech.scene.primitives;
        const position = poiManager.currentPOI?.getEmissionPosition() as Cartesian3;
        // const position1 = poiManager.selectedPOI?.getEmissionPosition1() as Cartesian3;

        // const modelMatrix = Transforms.headingPitchRollToFixedFrame(
        //     position,
        //     new HeadingPitchRoll(CesiumMath.toRadians(windDirection))
        // );

        // const modelScale = 3;

        if (poiManager.selectedCloud) {
            geoTech.scene.primitives.remove(poiManager.selectedCloud);
        }

        if (poiManager.selectedPointCloud) {
            poiManager.selectedPointCloud.removeAll();
        } else {
            poiManager.selectedPointCloud = new PointPrimitiveCollection();
            primitives.add(poiManager.selectedPointCloud);
        }

        // const { points } = createCubePoints(modelMatrix, 3, 10);

        const { points, colors } = createPoints(position, 10, 3);

        // const tileset = await Cesium3DTileset.fromUrl("/resources/tiles/tileset.json");

        // primitives.add(tileset);

        // // Position the tileset in the Cesium scene
        // tileset.readyPromise.then(() => {
        //     // const boundingSphere = tileset.boundingSphere;
        //     // const center = boundingSphere.center;

        //     // Set the position to where you want to place the tileset
        //     // const modelMatrix1 = Transforms.eastNorthUpToFixedFrame(position);
        //     // tileset.modelMatrix = modelMatrix1;

        //     geoTech.viewer.zoomTo(tileset);
        // });

        points.forEach((point, index) => {
            poiManager.selectedPointCloud?.add({
                position: point,
                pixelSize: 10,
                color: colors[index],
                outlineColor: Color.BLACK,
                outlineWidth: 0
            });
        });

        // poiManager.selectedPointCloud.values.forEach((enti) => {
        //     geoTech.viewer.entities.add(enti);
        // });
        // geoTech.viewer.entities.add(poiManager.selectedPointCloud);
        // geoTech.viewer.zoomTo(poiManager.selectedPointCloud);
        // console.error("entities", geoTech.viewer.entities);
        // const positions = [];

        // positions.push(position);
        // positions.push(position1);

        // const line = new PolylinePrimitive({
        //     positions: points,
        //     color: Color.RED,
        //     width: 10.5,
        //     show: true,
        //     allowPicking: true
        // });

        // primitives.add(line);
        // geoTech.viewer.zoomTo(line);
        // console.error("points", modelMatrix);
        // const tileset = await Cesium3DTileset.fromUrl("/resources/tiles/tileset.json");
        // // tileset.modelMatrix = modelMatrix;
        // const stylexx = new Cesium3DTileStyle({
        //     pointSize: "5",
        //     color: Color.RED
        // });
        // const stylexx = new Cesium3DTileStyle({
        //     pointSize: "5",
        //     show: true
        // });
        // tileset.style = stylexx;
        // primitives.add(tileset);
        // geoTech.viewer.zoomTo(tileset);
        // geoTech.viewer.zoomTo(tileset);
        // console.error("tileset", tileset);
        // geoTech.viewer.zoomTo(tileset, new HeadingPitchRoll(0.0, -1.0, 50.0));
        // flare.modelMatrix = modelMatrix;

        // const flare = await Model.fromGltfAsync({
        //     id: "point_cloud",
        //     modelMatrix: modelMatrix,
        //     url: "/resources/model.glb",
        //     scale: modelScale
        // });
        // primitives.add(flare);
        // const stylexx = new Cesium3DTileStyle({
        //     color: {
        //         conditions: [
        //             ["${TEMPERATURE} > 0.5", "color("red")"],
        //             ["${TEMPERATURE} <= 0.5", "color("blue")"]
        //         ]
        //     }
        // });

        // flare.style = stylexx;
        // poiManager.selectedModel = flare;
        // poiManager.selectedCloud = primitives.add(flare);

        // tileset.readyPromise.then((tile) => {
        //     tile.modelMatrix = modelMatrix;
        //     geoTech.viewer.zoomTo(tile, new HeadingPitchRoll(0.0, -1.0, 50.0));
        //     console.error("attribute", tile);
        //     // Create a style for conditional coloring
        //     // const style = new Cesium3DTileStyle({
        //     //     color: {
        //     //         conditions: [
        //     //             ["${TEMPERATURE} > 0.5", "color("red")"],
        //     //             ["${TEMPERATURE} <= 0.5", "color("blue")"]
        //     //         ]
        //     //     }
        //     // });
        //     // flare.style = style;
        // });
        geoTech.activatePlayModel();
    };

    const getCalculatedPositionFromOrigin = () => {
        const originPos = poiManager.currentPOI?.getEmissionPosition() as Cartesian3;
        const ellipsoid = Ellipsoid.WGS84;
        const ENU = new Matrix4();

        Transforms.eastNorthUpToFixedFrame(originPos, ellipsoid, ENU);

        const length = 10;
        const newX = length * Math.sin(CesiumMath.toRadians(windDirection));
        const newY = length * Math.cos(CesiumMath.toRadians(windDirection));

        const offset = new Cartesian3(newX, newY, 0);
        const changedPos = Matrix4.multiplyByPoint(ENU, offset, new Cartesian3());
        return changedPos;
    };

    const getCalculatedPositionFromOrigin1 = (points: Cartesian3[]) => {
        const rePoints: Cartesian3[] = [];
        points.forEach((eachPoint) => {
            const ellipsoid = Ellipsoid.WGS84;
            const ENU = new Matrix4();

            Transforms.eastNorthUpToFixedFrame(eachPoint, ellipsoid, ENU);

            const length = 10;
            const newX = length * Math.sin(CesiumMath.toRadians(windDirection));
            const newY = length * Math.cos(CesiumMath.toRadians(windDirection));

            const offset = new Cartesian3(newX, newY, 0);
            const changedPos = Matrix4.multiplyByPoint(ENU, offset, new Cartesian3());
            rePoints.push(changedPos);
        });

        return rePoints;
    };

    const changeWinddirection = async () => {
        if (poiManager.selectedCloud) {
            const position = getCalculatedPositionFromOrigin();
            const hpr = new HeadingPitchRoll(CesiumMath.toRadians(windDirection));
            poiManager.selectedCloud.modelMatrix = Transforms.headingPitchRollToFixedFrame(position, hpr);
        }

        if (poiManager.selectedPointCloud) {
            poiManager.selectedPointCloud.removeAll(); // Clear existing points
            const originPos = poiManager.currentPOI?.getEmissionPosition() as Cartesian3;
            const { points, colors } = createPoints(originPos, 6, 3);
            const updatedPositions = getCalculatedPositionFromOrigin1(points);
            updatedPositions.forEach((pos, index) => {
                poiManager.selectedPointCloud?.add({
                    position: pos,
                    color: colors[index],
                    pixelSize: 8
                });
            });
        }

        if (poiManager.activeSite) {
            const poiList = poiManager.getPOIList(poiManager.activeSite);
            poiList?.pois.forEach((cpoi) => {
                cpoi.changePrticleCloudSimulationProps({
                    windDirection: windDirection,
                    windSpeed: windSpeed,
                    emissionSize: emissionSize
                });
            });
        }
    };

    const handleEventInfoJSON = async () => {
        // await generateGLTF();
        await generateCloud();
        // await gnerateSmoke();
        changeWinddirection();
    };

    const handleModifyCloud = async () => {
        handleEventInfoJSON();
    };

    useEffect(() => {
        changeWinddirection();
    }, [windDirection, windSpeed, emissionSize]);

    const handleChangeUnitType = (checked: boolean, unitType: UnitType, index: number) => {
        unitTypes.forEach((item) => {
            item.active = false;
        });
        unitTypes[index].active = checked;
        setUnitTypes([...unitTypes]);
    };

    return (
        <EmissionLayoutContainer id="emission-layout-container" $light={false}>
            <div className={`emission-layout-particles`}>
                <div className="emission-layout">
                    <div className="emission-layout__filter">
                        <div>Filter</div>
                        <div className="emission-layout__filter__content">
                            <div className="emission-layout__filter__content__item">
                                {allPOIEntityTypes.map((type) => {
                                    const label = type as string;
                                    const id = `checkbox-${label}`;

                                    return (
                                        <div className="checkbox_container" key={id}>
                                            <CheckBox
                                                id={id}
                                                label={label}
                                                $styleData={{ marginLeft: "0px", color: dmColorGreyOne }}
                                                checked
                                                onChange={(val) => {
                                                    handleChangePOIEntityType(val, type);
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="emission-layout__content">
                        <div className="emission-layout__content__line" />
                        <div className="emission-layout__content__main">
                            <div className="emission-layout__content__main__item">
                                <div className="header-label">Emission Event</div>
                                <div className="item-content">
                                    <div className="item-label">- Entity:</div>
                                    <div className="item-body">
                                        {poiManager.activeSite?.entity_number || "No entity selected"}
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Emission Point:</div>
                                    <div className="item-body">
                                        <SelectInput
                                            selectedItemData={currentEmissionPoint}
                                            items={emissionPointList}
                                            callback={handleEmissionPointFieldChange}
                                        />
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Chemical of Concern (COC):</div>
                                    <div className="item-body">
                                        <SelectInput
                                            selectedItemData={currentCOC}
                                            items={COCList}
                                            callback={handleCOCFieldChange}
                                        />
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- COC Percent:</div>
                                    <div className="item-body">
                                        <input
                                            className="item-body-input"
                                            type="number"
                                            value={COCPercent}
                                            onChange={handleCOCPercentChange}
                                        />
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Event Date:</div>
                                    <div className="item-body">
                                        <CustomDatePicker value={eventDate} handleChangeDate={handleEventDateChange} />
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Event Length (hours):</div>
                                    <div className="item-body">
                                        <input
                                            className="item-body-input"
                                            type="number"
                                            value={eventLength}
                                            onChange={handleEventLengthChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="emission-layout__content__main__item">
                                <div className="header-label">Industrial Stack Controls</div>
                                <div className="item-content">
                                    <div className="item-label">Metric/US Units:</div>
                                    <div className="item-body">
                                        <div className="item-body-radio">
                                            {unitTypes.map((item, index) => (
                                                <div className="" key={item.type}>
                                                    <Radio
                                                        checked={item.active}
                                                        onChange={(e) =>
                                                            handleChangeUnitType(e.target.checked, item.type, index)
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
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Source Height ({isUnitMetric ? "m" : "ft"}):</div>
                                    <div className="item-body">
                                        <div className="item-body-range">
                                            <div className="item-body-range__slider">
                                                <RangeInput
                                                    value={sourceHeight * (isUnitMetric ? 1 : meterToFeet)}
                                                    min={0}
                                                    max={1000}
                                                    step={1}
                                                    width={`${
                                                        ((sourceHeight * (isUnitMetric ? 1 : meterToFeet)) / 1000) * 100
                                                    }%`}
                                                    disabled={false}
                                                    onChange={handleSourceHeightChange}
                                                    onMouseUp={handleModifyCloud}
                                                />
                                            </div>
                                            <span className="item-body-range__label">
                                                {(sourceHeight * (isUnitMetric ? 1 : meterToFeet)).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Source Diameter ({isUnitMetric ? "m" : "ft"}):</div>
                                    <div className="item-body">
                                        <div className="item-body-range">
                                            <div className="item-body-range__slider">
                                                <RangeInput
                                                    value={sourceDiameter * (isUnitMetric ? 1 : meterToFeet)}
                                                    min={0}
                                                    max={50}
                                                    step={0.1}
                                                    width={`${
                                                        ((sourceDiameter * (isUnitMetric ? 1 : meterToFeet)) / 50) * 100
                                                    }%`}
                                                    disabled={false}
                                                    onChange={handleSourceDiameterChange}
                                                />
                                            </div>
                                            <span className="item-body-range__label">
                                                {(sourceDiameter * (isUnitMetric ? 1 : meterToFeet)).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Source Velocity ({isUnitMetric ? "m" : "ft"}/s):</div>
                                    <div className="item-body">
                                        <div className="item-body-range">
                                            <div className="item-body-range__slider">
                                                <RangeInput
                                                    value={sourceVelocity * (isUnitMetric ? 1 : meterToFeet)}
                                                    min={0}
                                                    max={100}
                                                    step={0.1}
                                                    width={`${
                                                        ((sourceVelocity * (isUnitMetric ? 1 : meterToFeet)) / 100) *
                                                        100
                                                    }%`}
                                                    disabled={false}
                                                    onChange={handleSourceVelocityChange}
                                                />
                                            </div>
                                            <span className="item-body-range__label">
                                                {(sourceVelocity * (isUnitMetric ? 1 : meterToFeet)).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Source Temperature ({isUnitMetric ? "C" : "F"}):</div>
                                    <div className="item-body">
                                        <div className="item-body-range">
                                            <div className="item-body-range__slider">
                                                <RangeInput
                                                    value={
                                                        isUnitMetric
                                                            ? sourceTemperature
                                                            : celsiusToFahrenheit(sourceTemperature)
                                                    }
                                                    min={-100}
                                                    max={200}
                                                    step={1}
                                                    width={`${
                                                        (((isUnitMetric
                                                            ? sourceTemperature
                                                            : celsiusToFahrenheit(sourceTemperature)) +
                                                            100) /
                                                            300) *
                                                        100
                                                    }%`}
                                                    disabled={false}
                                                    onChange={handleSourceTemperatureChange}
                                                />
                                            </div>
                                            <span className="item-body-range__label">
                                                {(isUnitMetric
                                                    ? sourceTemperature
                                                    : celsiusToFahrenheit(sourceTemperature)
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="emission-layout__content__main__item">
                                <div className="header-label">Atmosphere / Environment controls</div>
                                <div className="item-content">
                                    <div className="item-label">- Wind Speed (m/s):</div>
                                    <div className="item-body">
                                        <div className="item-body-range">
                                            <div className="item-body-range__slider">
                                                <RangeInput
                                                    value={windSpeed}
                                                    min={0}
                                                    max={200}
                                                    step={1}
                                                    width={`${(windSpeed / 200) * 100}%`}
                                                    disabled={false}
                                                    onChange={handleWindSpeedChange}
                                                />
                                            </div>
                                            <span className="item-body-range__label">{windSpeed}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Wind Direction (deg):</div>
                                    <div className="item-body">
                                        <div className="item-body-range">
                                            <div className="item-body-range__slider">
                                                <RangeInput
                                                    value={windDirection}
                                                    min={0}
                                                    max={360}
                                                    step={1}
                                                    width={`${(windDirection / 360) * 100}%`}
                                                    disabled={false}
                                                    onChange={handleWindDirectionChange}
                                                />
                                            </div>
                                            <span className="item-body-range__label">{windDirection}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Emission Size:</div>
                                    <div className="item-body">
                                        <div className="item-body-range">
                                            <div className="item-body-range__slider">
                                                <RangeInput
                                                    value={emissionSize}
                                                    min={0}
                                                    max={9}
                                                    step={1}
                                                    width={`${(emissionSize / 9) * 100}%`}
                                                    disabled={false}
                                                    onChange={handleEmissionSizeChange}
                                                />
                                            </div>
                                            <span className="item-body-range__label">{emissionSize}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Vertical Stability:</div>
                                    <div className="item-body">
                                        <SelectInput
                                            selectedItemData={verticalStability}
                                            items={verticalStabilityList}
                                            callback={handleVerticalStabilityFieldChange}
                                        />
                                    </div>
                                </div>
                                <div className="item-content">
                                    <div className="item-label">- Roughness:</div>
                                    <div className="item-body">
                                        <SelectInput
                                            selectedItemData={roughness}
                                            items={roughnessList}
                                            callback={handleRoughnessFieldChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="emission-layout__content__main__item">
                                <div className="header-label">Other controls</div>
                                <div className="item-content">
                                    <div className="item-label">- Simulation Time(hrs):</div>
                                    <div className="item-body">
                                        <SelectInput
                                            selectedItemData={simulationTime}
                                            items={simulatinTimeList}
                                            callback={handleSimulationTimeFieldChange}
                                        />
                                    </div>
                                </div>
                                <div className="item-content">
                                    <Button
                                        $textColor={dmColorGreyOne}
                                        buttonStyle="outline"
                                        $marginRight="0.5rem"
                                        onClick={handleEventInfoJSON}
                                    >
                                        Create Emission Event 3D Model
                                    </Button>
                                </div>
                            </div>
                            {showJson && (
                                <div className="emission-layout__content__main__item">
                                    <div className="header-label">Display JSON</div>
                                    <div style={{ maxHeight: "300px", marginTop: "10px" }}>
                                        {
                                            <ReactJson
                                                style={{ width: "100%", padding: "5px" }}
                                                src={jsonExample}
                                                name="JSON"
                                                enableClipboard={false}
                                                displayDataTypes={false}
                                                quotesOnKeys={false}
                                                indentWidth={2}
                                                displayObjectSize={false}
                                                theme="threezerotwofour"
                                            />
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </EmissionLayoutContainer>
    );
};

export default EmissionLayout;
