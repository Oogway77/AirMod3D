// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";
import { dmColorBlueOne, dmColorGreyOne, dmColorGreyTwo, dmColorGreyFive } from "../gui-variables.styles";

export const SimulationPlayerContainer = styled.div`
    width: 300px;
    position: absolute;
    bottom: 10%;
    right: calc(50% - 150px);
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

    .player-panel {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export const PlayButton = styled.button<{ isPlaying: boolean }>`
    background-color: ${(props) => (props.isPlaying ? dmColorGreyTwo : dmColorGreyTwo)};
    color: white;
    border: 3px solid ${dmColorBlueOne};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    outline: none;
    transition: background-color 0.3s;
    margin: 6px 15px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;

    &:hover {
        /* background-color: ${(props) => (props.isPlaying ? dmColorBlueOne : dmColorBlueOne)}; */
        opacity: 0.5;
    }

    .player-icon {
        color: ${dmColorBlueOne};
    }
`;
