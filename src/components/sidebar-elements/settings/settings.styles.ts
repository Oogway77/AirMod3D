// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";
import { dmColorGreyOne, dmColorBlueOne, iconColorLightTheme } from "../../gui-variables.styles";

interface SettingsContainerProps {
    light?: boolean;
}

export const SettingsContainer = styled.div<SettingsContainerProps>`
    height: 350px;
    display: flex;

    .tab_container {
        width: 140px;
        display: flex;
        flex-direction: column;
        height: 100%;

        .tab_item {
            margin-top: 15px;
            font-size: 14px;
            font-weight: 500;
            color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyOne)};
            cursor: pointer;

            &:hover {
                color: ${dmColorBlueOne};
            }
        }

        .selected_item {
            padding-left: 10px;
            border-left: 4px solid;
            color: ${dmColorBlueOne};
            border-color: ${dmColorBlueOne};
        }
    }

    .main_container {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;

        .btn_container {
            width: 100%;
            text-align: right;
        }

        button,
        span,
        div {
            color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyOne)};
        }
    }
`;
