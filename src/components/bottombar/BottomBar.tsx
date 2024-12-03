/* qeslint-disable */
// q@ts-nocheck
import { useState, useEffect } from "react";
import {
    Cartesian2,
    Cartesian3,
    Cartographic,
    defined,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Math as CesiumMath
} from "cesium";
import MovingComponent from "react-moving-text";
import { errHeightOfGoogle3DTiles } from "@core";
import { getWorldPosition } from "@core/getWorldPosition";
import { BottomBarContainer } from "./bottombar.styles";

const scratchCartesian = new Cartesian3();

const BottomBar = () => {
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [, setAltitude] = useState("");
    const [cameraAltitude, setCameraAltitude] = useState("");
    const [cameraPitch, setCameraPitch] = useState("");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [statusMessage] = useState("");

    const latLongShowType = "DEGREES_MINUTES_SECONDS";

    const distancePrecision = 3;
    const viewer = window.geoTech.mapViewer.viewer;
    const scene = viewer.scene;

    const clear = () => {
        setLongitude("");
        setLatitude("");
        setAltitude("");
        setCameraPitch("");
        setCameraAltitude("");
    };

    const preRenderListener = () => {
        const caltitude = `Camera ${viewer.camera.positionCartographic.height.toFixed(distancePrecision)}m`;
        const cpitch = `Pitch ${CesiumMath.toDegrees(viewer.camera.pitch).toFixed(3)}`;
        setCameraAltitude(caltitude);
        setCameraPitch(cpitch);
    };

    const handler = new ScreenSpaceEventHandler(scene.canvas);

    const handlerInputAction = (movement: { endPosition: Cartesian2 }) => {
        const pickedPosition = getWorldPosition(scene, movement.endPosition, scratchCartesian);

        if (!defined(pickedPosition)) {
            clear();
            return;
        }

        // @ts-ignore
        const cartographic = Cartographic.fromCartesian(pickedPosition!);

        // const longitudeValue = MeasureUnits.longitudeToString(cartographic.longitude, latLongShowType);
        const longitudeValue = CesiumMath.toDegrees(cartographic.longitude).toFixed(5);
        setLongitude(longitudeValue);

        // const latitudeValue = MeasureUnits.latitudeToString(cartographic.latitude, latLongShowType);
        const latitudeValue = CesiumMath.toDegrees(cartographic.latitude).toFixed(5);
        setLatitude(latitudeValue);

        const height = cartographic.height + errHeightOfGoogle3DTiles;

        const altitudeValue = `${height.toFixed(distancePrecision)}m`;
        setAltitude(altitudeValue);
    };

    const connect = () => {
        scene.preRender.addEventListener(preRenderListener);

        handler.setInputAction(handlerInputAction, ScreenSpaceEventType.MOUSE_MOVE);
    };

    /*
    useCustomEventListener(SET_STATUS_MESSAGE, (data: { message: string }) => {
        setStatusMessage(data.message);
    });
    */

    useEffect(() => {
        connect();

        return function () {
            scene.preRender.removeEventListener(preRenderListener);
            handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        };
    }, [latLongShowType]);

    return (
        <BottomBarContainer id="bottombar-container">
            <div className="container">
                <div className="coordinate">
                    <div className="item_text">{latitude}</div>
                    <div className="item_text">{longitude}</div>
                    <div className="item_text">{cameraPitch}</div>
                    <div className="item_text">{cameraAltitude}</div>
                </div>
                <div className="status__message">
                    <MovingComponent
                        type="fadeIn"
                        duration="2000ms"
                        delay="0s"
                        direction="normal"
                        timing="ease"
                        iteration="infinite"
                        fillMode="backwards"
                    >
                        {statusMessage}
                    </MovingComponent>
                </div>
            </div>
        </BottomBarContainer>
    );
};

export default BottomBar;
