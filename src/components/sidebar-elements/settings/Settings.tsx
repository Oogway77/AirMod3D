// q@ts-nocheck
/* qeslint-disable */
import { ReactElement, useState } from "react";
import { SettingsContainer } from "./settings.styles";
import TabScene from "./tab-scene/TabScene";
import TabEmission from "./tab-emission/TabEmission";
import { Button } from "../../common";
import { colorRedBright, dmColorBlueSix } from "../../gui-variables.styles";

interface TabItem {
    title: string;
    content: ReactElement;
}

interface TabsState {
    scene: boolean;
    emission: boolean;
}

interface SettingsProps {
    onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [isDefault, setIsDefault] = useState(false);
    const [tabsState, setTabsState] = useState<TabsState>({
        scene: false,
        emission: true
    });

    const tabItems: TabItem[] = [
        {
            title: "Scene",
            content: <TabScene key="Scene" isShow={tabsState.scene} isDefault={isDefault} />
        },
        {
            title: "Emission",
            content: <TabEmission key="Appearance" isShow={tabsState.emission} isDefault={isDefault} />
        }
    ];

    const handleCancel = () => {
        onClose();
    };

    const handleDefault = () => {
        setIsDefault(true);
        setTimeout(() => {
            setIsDefault(false);
        }, 1000);
    };

    const changeIsShowOnlyOne = (title: string) => {
        const keyValueToChange = title.toLowerCase();
        const changedIsShowArray: TabsState = {
            scene: false,
            emission: false
        };

        changedIsShowArray[keyValueToChange as keyof TabsState] = true;

        setTabsState(changedIsShowArray);
    };

    const handleTabSelect = (title: string, index: number) => {
        setCurrentTabIndex(index);
        changeIsShowOnlyOne(title);
    };

    return (
        <>
            <SettingsContainer>
                <div className="tab_container">
                    {tabItems.map((item, index) => (
                        <div
                            className={`tab_item ${index === currentTabIndex ? "selected_item" : ""}`}
                            key={item.title}
                            role="presentation"
                            onClick={() => handleTabSelect(item.title, index)}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
                <div className="main_container">
                    {tabItems.map((item) => item.content)}
                    <div className="btn_container">
                        <Button
                            $textColor="White"
                            $backgroundColor={dmColorBlueSix}
                            onClick={handleDefault}
                            width="75px"
                            $marginRight="20px"
                        >
                            Default
                        </Button>
                        <Button
                            $textColor="White"
                            $backgroundColor={colorRedBright}
                            onClick={handleCancel}
                            width="75px"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </SettingsContainer>
        </>
    );
};

export default Settings;
