// q@ts-nocheck
/* qeslint-disable */
import { useEffect, useState } from "react";
import { GeoJsonProperties } from "geojson";
import { useSelector } from "react-redux";
import { POI } from "@core";
import { CalciteIcon } from "@esri/calcite-components-react";
import { PopupTable } from "../../common";
import { getCurrentActivePOI } from "../../../redux";
import { useActions } from "../../../hooks/useActions";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const InfoLayout = ({ isOpen, onClose }: Props) => {
    const geoTech = window.geoTech;
    const movePOITool = geoTech.movePOITool;
    const currentActivePOI = useSelector(getCurrentActivePOI);

    const meterToFeet = 3.28084;

    const { setCurrentActivePOI } = useActions();

    const [prop, setProp] = useState<GeoJsonProperties | undefined>();
    const [update, setUpdate] = useState(false);

    const onChanged = () => {
        setUpdate(true);
    };

    useEffect(() => {
        if (currentActivePOI) {
            const tempProps = currentActivePOI.getPropertiesForUI();

            setProp({
                ...tempProps,
                Height: Number((tempProps.Height * meterToFeet).toFixed(2)),
                longitude: Number(tempProps.longitude.toFixed(6)),
                latitude: Number(tempProps.latitude.toFixed(6))
            });
        }

        if (update) {
            setUpdate(false);
        }
    }, [currentActivePOI, update]);

    useEffect(() => {
        const onPOISelected = (poi: POI) => {
            setCurrentActivePOI(poi);
        };

        const onPOIParamChanged = () => {
            setUpdate(true);
        };

        movePOITool?.poiSelected.addEventListener(onPOISelected);
        movePOITool?.heightChanged.addEventListener(onPOIParamChanged);
        movePOITool?.locationChanged.addEventListener(onPOIParamChanged);

        return function () {
            movePOITool?.poiSelected.removeEventListener(onPOISelected);
            movePOITool?.heightChanged.removeEventListener(onPOIParamChanged);
            movePOITool?.locationChanged.removeEventListener(onPOIParamChanged);
        };
    }, []);

    return (
        <div id="info-layout" className={`info-layout-particles ${isOpen ? "info-layout-particles--active" : ""} `}>
            <div id="info-layout-content">
                <div className="info-layout__header">
                    <button
                        className="close-btn"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        <div className="icon-container">
                            <CalciteIcon icon="x"></CalciteIcon>
                        </div>
                    </button>
                    <div className="info-layout__header__label">Active POI Info</div>
                </div>
                <div className="info-layout__content">
                    <div className="info-layout__content__line" />
                    <div className="info-layout__content__main">
                        <PopupTable onChanged={onChanged} edit properties={prop} fieldsInfo={{}} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoLayout;
