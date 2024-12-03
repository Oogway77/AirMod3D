// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import {
    iconColorLightTheme,
    lmColorWhiteOne,
    dmColorGreyOne,
    dmColorGreyFive,
    dmColorGreyTwo
} from "../gui-variables.styles";

interface BasemapPickerProps {
    $light?: boolean;
}

export const BasemapPickerContainer = styled.div<BasemapPickerProps>`
    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
    position: static;
    width: auto;
    height: 100%;
    padding: 0.2rem;

    .base-map-picker {
        position: static;
        height: 100%;
        background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFive)};

        .base-map-picker-layout {
            height: 100%;

            &__content {
                font-size: 0.8rem;
                overflow-y: hidden;
                padding: 0.8rem 0.5rem;
                height: 100%;

                .current-basemap {
                    width: 100%;
                    height: 60px;
                    padding: 0.3rem;
                    border: 1px solid ${dmColorGreyTwo};
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    span {
                        font-size: 12pt;
                        color: ${dmColorGreyOne};
                    }

                    &__title {
                        margin-left: 1rem;
                        font-size: 14pt;
                        color: ${lmColorWhiteOne}!important;
                    }
                }

                .basemap-gallery {
                    margin-top: 10px;
                    height: 90%;
                    overflow-y: auto;

                    &__list {
                        flex-flow: column;
                        gap: 3px;
                        margin: 0;
                        padding-block: 3px;
                        padding-inline: 3px;
                        list-style: none;
                        transition: opacity 0.25s ease-in-out;
                        display: flex;
                        position: relative;

                        &__item {
                            box-sizing: border-box;
                            cursor: pointer;
                            border: 1px solid ${dmColorGreyTwo};
                            flex-direction: row;
                            align-items: center;
                            width: 100%;
                            transition:
                                background-color 0.25s ease-in-out,
                                border-color 0.25s ease-in-out;
                            animation: 0.5s ease-in-out esri-fade-in;
                            display: flex;
                            position: relative;

                            .thumbnail {
                                aspect-ratio: 1;
                                width: 80px;
                                min-width: 80px;
                            }

                            &.active {
                                border: 1px solid ${lmColorWhiteOne};
                            }

                            .item-content {
                                flex-direction: column;
                                gap: 12px;
                                min-width: 0;
                                padding-block: 2px;
                                padding-inline: 11px;
                                display: flex;

                                &__title {
                                    color: ${lmColorWhiteOne};
                                    justify-content: flex-start;
                                    align-items: center;
                                    width: 100%;
                                    height: 100%;
                                    font-size: 14px;
                                    transition:
                                        color 0.25s ease-in-out,
                                        font-weight 0.25s ease-in-out;
                                    display: flex;

                                    span {
                                        text-align: start;
                                        text-overflow: ellipsis;
                                        overflow-wrap: break-word;
                                        -webkit-line-clamp: 2;
                                        -webkit-box-orient: vertical;
                                        width: 100%;
                                        display: -webkit-box;
                                        overflow: hidden;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
