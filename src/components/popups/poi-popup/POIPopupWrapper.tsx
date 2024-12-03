// q@ts-nocheck
/* qeslint-disable */
import { useEffect, useState } from "react";
import { Cartesian2 } from "cesium";
import { POI } from "@core";
import POIPopup from "./POIPopup";
import { useActions } from "../../../hooks/useActions";

const POIPopupWrapper = () => {
    const poiManager = window.geoTech.poiManager;

    const [open, setOpen] = useState(false);
    const [poi, setPOI] = useState({} as POI);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isModalCenter, setIsModalCenter] = useState(false);

    const { setCurrentActivePOI } = useActions();

    useEffect(() => {
        const onPOISeleted = (argPOI: POI, argPosition: Cartesian2) => {
            if (window.geoTech.mapTool) {
                return;
            }
            setOpen(false);
            setIsModalCenter(false);
            setPosition(argPosition);
            setPOI(argPOI);
            setCurrentActivePOI(argPOI);

            poiManager.setCurrentPOI(argPOI);
        };

        const onPOICreated = (createdPOI: POI | undefined) => {
            if (createdPOI) {
                setOpen(false);
                setIsModalCenter(true);
                setPOI(createdPOI);

                poiManager.setCurrentPOI(createdPOI);
            }
        };

        window.geoTech.poiManager.poiSelected.addEventListener(onPOISeleted);
        window.geoTech.addPOITool?.poiCreated.addEventListener(onPOICreated);

        return function () {
            const success = window.geoTech.poiManager.poiSelected.removeEventListener(onPOISeleted);
            const success1 = window.geoTech.addPOITool?.poiCreated.removeEventListener(onPOICreated);
            console.assert(success, success1, "error");
        };
    }, []);

    return (
        <>
            {open && (
                <POIPopup
                    poi={poi}
                    isModalCenter={isModalCenter}
                    setOpen={setOpen}
                    left={`${position.x}px`}
                    top={`${position.y}px`}
                />
            )}
        </>
    );
};

export default POIPopupWrapper;
