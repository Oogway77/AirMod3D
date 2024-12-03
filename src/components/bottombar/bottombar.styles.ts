// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

interface BottomBarContainerProps {}

export const BottomBarContainer = styled.div<BottomBarContainerProps>`
    position: absolute;
    height: 29px;
    z-index: 11;
    @media only screen and (max-width: 600px) {
        height: 50px;
        display: flex;
        text-align: center;
        justify-content: right;
        padding-bottom: 5px;
    }

    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(45, 58, 66, 0.7);
    color: white;

    transition: all 0.2s ease-in-out;
    transform: translateY(-0vh);

    .container {
        float: right;
        display: flex;

        @media only screen and (max-width: 600px) {
            float: none;
        }

        .coordinate {
            margin-top: 5px;
            text-align: right;
            display: flex;

            @media only screen and (max-width: 600px) {
                justify-content: center;
                text-align: center;
                flex-wrap: wrap;
            }
            height: 100%;
            overflow: hidden;
        }

        .status__message {
            color: #00ffff;
            margin: auto;
            margin-right: 15px;
            margin-bottom: 0;

            div {
                font-size: 12px;
            }
        }

        .item_text {
            font-size: 12px;
            margin-right: 15px;

            @media only screen and (max-width: 600px) {
                margin: 0 5px 0 5px;
            }
        }
    }
`;
