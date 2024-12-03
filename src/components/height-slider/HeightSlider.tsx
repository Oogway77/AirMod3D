// q@ts-nocheck
/* qeslint-disable */
import { FormEvent, useEffect, useState } from "react";
import { POI } from "@core";
import { RangeInput } from "../common";
import { HeightSliderContainer } from "./height-slider.style";

const HeightSlider = () => {
    const geoTech = window.geoTech;
    const movePOITool = geoTech.movePOITool;
    const [open, setOpen] = useState(false);
    const [height, setHeight] = useState(0);
    const [heightStr, setHeightStr] = useState("");

    const meterToFeet = 3.28084;
    const feetToMeter = 1 / meterToFeet;

    const updateHeight = (val: number) => {
        setHeight(val);

        movePOITool?.updateHeight(val * feetToMeter);
    };

    const onPOISelected = (argPOI: POI) => {
        // argPOI.updateBottomHeight(scene);
        // geoTech.updateBottomHeightPOI(argPOI);
        const value = argPOI.getVerticalLength() * meterToFeet;
        setHeight(value);
        setHeightStr(value.toFixed(2));
        setOpen(true);
    };

    const onDeactivated = () => {
        setOpen(false);
    };

    const onHeightChanged = (h: number) => {
        const value = h * meterToFeet;
        setHeight(value);
        setHeightStr(value.toFixed(2));
    };

    useEffect(() => {
        movePOITool?.poiSelected.addEventListener(onPOISelected);
        movePOITool?.heightChanged.addEventListener(onHeightChanged);
        movePOITool?.deactivated.addEventListener(onDeactivated);
    }, []);

    const onSliderChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;

        if (Number.isNaN(target.value)) {
            return;
        }

        const val = parseFloat(target.value);
        setHeightStr(val.toFixed(2));
        updateHeight(val);
    };

    const onInputChange = (e: any) => {
        let val = e.target.value;
        let valStr = val;

        if (val === "" || val === "-") {
            val = "0";
            valStr = "";
        }

        if (Number.isNaN(+val)) {
            return;
        }

        setHeightStr(valStr);
        updateHeight(parseFloat(val));
    };

    const content = (
        <HeightSliderContainer>
            <div className="panel">
                <h4 className="header">Height (feet)</h4>

                <table style={{ width: "100%", tableLayout: "fixed" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "80%" }}>
                                <RangeInput
                                    value={height}
                                    min={0}
                                    max={10000}
                                    step={1}
                                    width={`${(height / 10000) * 100}%`}
                                    disabled={false}
                                    onChange={onSliderChange}
                                />
                            </td>
                            <td style={{ width: "20%" }}>
                                <input
                                    style={{ width: "100%" }}
                                    className="input"
                                    value={heightStr}
                                    onChange={onInputChange}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </HeightSliderContainer>
    );

    return <> {open && content}</>;
};

export default HeightSlider;
