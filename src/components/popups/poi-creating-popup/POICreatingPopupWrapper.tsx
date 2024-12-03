// q@ts-nocheck
/* qeslint-disable */
import { useEffect, useState } from "react";
import { Cartesian2, Cartesian3 } from "cesium";
// import { POI } from "@core";
import POICreatingPopup from "./POICreatingPopup";

const POICreatingPopupWrapper = () => {
    const [open, setOpen] = useState(false);
    const [poiPos, setPOIPos] = useState({} as Cartesian3);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const onClickedForAddPOI = (argPosition: Cartesian2, poiPosition: Cartesian3) => {
            setOpen(false);
            setPOIPos(poiPosition);
            setPosition(argPosition);
            setOpen(true);
        };

        window.geoTech.addPOITool?.clickedForAddPOI.addEventListener(onClickedForAddPOI);

        return function () {
            const success = window.geoTech.addPOITool?.clickedForAddPOI.removeEventListener(onClickedForAddPOI);
            console.assert(success, "error");
        };
    }, []);

    return (
        <>
            {open && (
                <POICreatingPopup
                    POIPosition={poiPos}
                    setOpen={setOpen}
                    left={`${position.x}px`}
                    top={`${position.y}px`}
                />
            )}
        </>
    );
};

export default POICreatingPopupWrapper;
