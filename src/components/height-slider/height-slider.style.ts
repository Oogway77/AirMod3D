// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";
import { dmColorGreyOne, dmColorGreyTwo, dmColorGreyFive } from "../gui-variables.styles";

export const HeightSliderContainer = styled.div`
    width: 20vw;
    position: absolute;
    top: 10%;
    right: 5px;
    background-color: ${dmColorGreyFive};
    border: 3px solid ${dmColorGreyTwo};
    font-size: 0.8rem;

    .header {
        color: rgb(173, 181, 189);
        margin-bottom: 0.75rem;
    }

    .panel {
        padding: 0.5rem;
        margin-bottom: 0px;
    }

    .input {
        background-color: ${dmColorGreyTwo};
        border: none;
        border-radius: 3px;
        padding: 0.25rem 0.5rem;
        color: ${dmColorGreyOne};
        font-size: 0.7rem;
        font-weight: 600;
        font-family: "Montserrat", sans-serif !important;
        height: 22px;
        box-sizing: border-box;

        &.switch-checkbox {
            height: 0;
        }

        &::placeholder {
            color: ${dmColorGreyOne};
        }
    }
`;
