// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";
import { useState } from "react";
import toast from "react-hot-toast";
import { Cartesian3 } from "cesium";
import { SelectInputDataItem } from "../../../types/common";
import { POIType } from "@core";
import { BaseModal, SelectInput, Button } from "../../common";
import {
    dmColorGreyFour,
    dmColorBlueOne,
    dmColorGreyTwo,
    colorRedBright,
    dmColorBlueFive
} from "../../gui-variables.styles";

interface POICreatingPopupProps {
    POIPosition: Cartesian3;
    setOpen: (flag: boolean) => void;
    left: string;
    top: string;
}

const POICreatingPopupContainer = styled.div`
    .item-content {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item-label {
            font-size: 18px;
            width: 130px;
        }

        .item-body {
            width: 155px;
        }

        .item-body-input {
            width: 155px;
            height: 30px;
            background-color: ${dmColorGreyFour};
            color: ${dmColorBlueOne};
            border: 1px solid ${dmColorGreyTwo};
            padding-left: 10px;

            &:hover {
                border: 1px solid ${dmColorBlueOne};
            }
        }
    }

    .button-content {
        display: flex;
        justify-content: right;
        margin-top: 30px;
    }
`;

const POICreatingPopup = ({ POIPosition, setOpen, left, top }: POICreatingPopupProps) => {
    const lightMode = false;
    const meterToFeet = 3.28084;
    const feetToMeter = 1 / meterToFeet;

    const poiTypeList: SelectInputDataItem[] = [
        { label: "STACK", value: POIType.STACK },
        { label: "FLARE", value: POIType.FLARE },
        { label: "FUGITIVE", value: POIType.FUGITIVE },
        { label: "OTHER", value: POIType.OTHER }
    ];

    const [poiType, setPOIType] = useState<SelectInputDataItem>(poiTypeList[3]);
    const [poiName, setPOIName] = useState("");
    const [poiHeight, setPOIHeight] = useState(100);

    const handleClose = () => {
        setOpen(false);
    };

    const handlePOITypeFieldChange = (e: { value: string | number }) => {
        const { value } = e;

        const fieldName = typeof value === "string" ? value : value.toString();
        const newFieldData = poiTypeList.find((item) => item.value === fieldName);
        if (newFieldData) {
            setPOIType(newFieldData);
        }
    };

    const handlePOINameChange = (e: any) => {
        setPOIName(e.target.value);
    };

    const handlePOIHeightChange = (e: any) => {
        setPOIHeight(e.target.value);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        const res = window.geoTech.addPOITool?.addPOIWithProperties(
            poiName,
            poiHeight * feetToMeter,
            poiType.value.toString(),
            POIPosition
        );

        if (res) {
            window.geoTech.deactivateCurrentMapTool();
            setOpen(false);
        } else {
            toast.error("POI with the same id exist!", {
                style: {
                    fontSize: "12pt",
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff"
                }
            });
        }
    };

    const isEmpty = !poiName || !poiHeight;

    return (
        <>
            <BaseModal
                $light={lightMode}
                left={left}
                top={top}
                handleClose={handleClose}
                title="Adding POI"
                showLineBreak
            >
                <POICreatingPopupContainer>
                    <div className="item-content">
                        <div className="item-label">Marker:</div>
                        <div className="item-body">
                            <SelectInput
                                selectedItemData={poiType}
                                items={poiTypeList}
                                callback={handlePOITypeFieldChange}
                            />
                        </div>
                    </div>
                    <div className="item-content">
                        <div className="item-label">Name(id):</div>
                        <div className="item-body">
                            <input className="item-body-input" value={poiName} onChange={handlePOINameChange} />
                        </div>
                    </div>
                    <div className="item-content">
                        <div className="item-label">Height(feet):</div>
                        <div className="item-body">
                            <input
                                type="number"
                                className="item-body-input"
                                value={poiHeight}
                                onChange={handlePOIHeightChange}
                            />
                        </div>
                    </div>
                    <div className="button-content">
                        <Button
                            onClick={handleCancel}
                            $backgroundColor={colorRedBright}
                            $textColor="white"
                            width="75px"
                            $marginRight="15px"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            $backgroundColor={dmColorBlueFive}
                            disabled={isEmpty}
                            width="85px"
                        >
                            Create
                        </Button>
                    </div>
                </POICreatingPopupContainer>
            </BaseModal>
        </>
    );
};

export default POICreatingPopup;
