// q@ts-nocheck
/* qeslint-disable */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { TabEmissionContainer } from "./tab-emission.styles";
import { getSettingsVisibleCloud } from "../../../../redux";
import { Switch } from "../../../common";
import { useActions } from "../../../../hooks/useActions";

interface TabEmissionProps {
    isDefault: boolean;
    isShow: boolean;
}

const TabEmission = ({ isDefault, isShow }: TabEmissionProps) => {
    const showEmissionCloud = useSelector(getSettingsVisibleCloud);
    const { setSettingsVisibleCloud } = useActions();
    const poiManager = window.geoTech.poiManager;

    useEffect(() => {
        if (isDefault) {
            setSettingsVisibleCloud(true);
        }
    }, [isDefault]);

    useEffect(() => {
        poiManager.visibleEmissionCloud = showEmissionCloud;

        if (poiManager.activeSite) {
            const poiList = poiManager.getPOIList(poiManager.activeSite);
            poiList?.pois.forEach((cpoi) => {
                cpoi.setVisibleEmissionCloud(showEmissionCloud);
            });
        }
    }, [showEmissionCloud]);

    return !isShow ? (
        <></>
    ) : (
        <>
            <TabEmissionContainer>
                <div className="mode_container">
                    <Switch
                        id="switch-show-bottombar"
                        checked={showEmissionCloud}
                        onChange={(checked) => setSettingsVisibleCloud(checked)}
                    />
                    <div className="text">Show/Hide Emission Cloud</div>
                </div>
            </TabEmissionContainer>
        </>
    );
};

export default TabEmission;
