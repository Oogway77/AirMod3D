// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

interface ToolbarContainerWrapperProps {
    light?: boolean;
    $visible?: boolean;
}

export const ToolbarContainerWrapper = styled.div<ToolbarContainerWrapperProps>`
    .toolbar-button {
        @media only screen and (max-width: 600px) {
            position: absolute;
            top: 7px;
            right: 45px;
            z-index: 100;
        }

        @media only screen and (min-width: 600px) {
            display: none;
        }
    }
`;
