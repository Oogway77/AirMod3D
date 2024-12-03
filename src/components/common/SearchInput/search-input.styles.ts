// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import { dmColorBlueOne, dmColorGreyTwo, iconColorLightTheme, lmColorWhiteTwo } from "../../gui-variables.styles";

interface SearchInputStylesProps {
    light?: boolean;
}

export const SearchInputStyles = styled.div<SearchInputStylesProps>`
    position: relative;

    .search-input {
        background-color: ${(props) => (props.light ? lmColorWhiteTwo : dmColorGreyTwo)};
        border: 1px solid ${(props) => (props.light ? iconColorLightTheme : dmColorGreyTwo)};
        border-radius: 8px;
        text-indent: 2.5rem;
        padding: 0.5rem 1.25rem 0.5rem 0;
        color: ${(props) => (props.light ? iconColorLightTheme : dmColorBlueOne)};
        width: 100%;
        font-size: 1rem;

        &:focus {
            outline: none;
        }
    }

    .icon {
        fill: ${(props) => (props.light ? iconColorLightTheme : dmColorBlueOne)};
        position: absolute;
        height: 1rem;
        width: 1rem;
        top: 10px;
        left: 7px;
    }
`;
