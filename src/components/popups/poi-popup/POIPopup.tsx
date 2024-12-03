// q@ts-nocheck
/* qeslint-disable */
import { useEffect, useState } from "react";
import { GeoJsonProperties } from "geojson";
import { POI } from "@core";
import { BaseModal, Button, PopupTable } from "../../common";
import { dmColorGreyOne } from "../../gui-variables.styles";

interface POIPopupProps {
    poi: POI;
    setOpen: (flag: boolean) => void;
    left: string;
    top: string;
    isModalCenter: boolean;
}

const POIPopup = ({ poi, setOpen, left, top, isModalCenter }: POIPopupProps) => {
    const properties = poi.getPropertiesForUI();
    const [edit, setEdit] = useState(false);

    const [prop, setProp] = useState<GeoJsonProperties>(properties);
    const lightMode = false;

    useEffect(() => {
        if (prop) {
            const meterToFeet = 3.28084;
            setProp({
                ...prop,
                height: Number((prop.height * meterToFeet).toFixed(2)),
                longitude: Number(prop.longitude.toFixed(6)),
                latitude: Number(prop.latitude.toFixed(6))
            });
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = () => {
        setEdit(!edit);
    };

    return (
        <>
            <BaseModal
                $light={lightMode}
                left={left}
                top={top}
                handleClose={handleClose}
                title="POI Data"
                showLineBreak
                isModalCenter={isModalCenter}
                headerComponent={
                    <Button
                        $textColor={dmColorGreyOne}
                        buttonStyle="outline"
                        light={lightMode}
                        $marginRight="0.5rem"
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                }
            >
                <PopupTable onChanged={() => {}} edit={edit} properties={prop} fieldsInfo={{}} />
            </BaseModal>
        </>
    );
};

export default POIPopup;
