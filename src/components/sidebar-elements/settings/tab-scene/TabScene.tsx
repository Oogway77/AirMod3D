// q@ts-nocheck
/* qeslint-disable */
import { TabEmssionContainer } from "./tab-scene.styles";

interface TabEmissionProps {
    isDefault: boolean;
    isShow: boolean;
}

const TabScene = ({ isDefault, isShow }: TabEmissionProps) => {
    console.error("isDefault", isDefault);
    return !isShow ? (
        <></>
    ) : (
        <>
            <TabEmssionContainer>
                <div className="mode_container" />
            </TabEmssionContainer>
        </>
    );
};

export default TabScene;
