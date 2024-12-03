// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import {
    iconColorLightTheme,
    lmColorWhiteOne,
    dmColorGreyOne,
    dmColorGreyTwo,
    dmColorGreyFour,
    dmColorGreyFive,
    dmColorBlueOne,
    panelHeaderFontSize,
    panelHeaderFontWeight
} from "../../gui-variables.styles";

interface EmissionLayoutExpandedProps {
    $light?: boolean;
}

export const EmissionLayoutContainer = styled.div<EmissionLayoutExpandedProps>`
    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
    height: 100%;
    overflow: hidden;
    padding: 0.2rem;

    .emission-layout-particles {
        position: static;
        height: 100%;
        width: auto;
        background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFive)};

        padding: 0.2rem;

        .emission-layout {
            height: 100%;

            &__filter {
                border: 1px solid ${dmColorGreyTwo};
                font-size: 12px;
                padding: 10px;

                &__content {
                    display: flex;

                    &__item {
                        margin-right: 60px;

                        .checkbox_container {
                            margin-top: 15px;
                        }
                    }
                }
            }

            &__content {
                font-size: 0.8rem;
                height: calc(100% - 94px);

                &__line {
                    margin: 1rem 0;
                    height: 1px;
                    width: 100%;
                    background-color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
                }

                &__main {
                    overflow: auto;
                    height: 93%;
                    &__item {
                        .header-label {
                            font-size: ${panelHeaderFontSize};
                            font-weight: ${panelHeaderFontWeight};
                            margin-top: 10px;
                        }

                        .item-content {
                            margin-top: 10px;
                            display: flex;
                            align-items: center;

                            .item-label {
                                width: 180px;
                            }

                            .item-body {
                                width: 155px;

                                .item-body-radio {
                                    display: flex;
                                }

                                .item-body-input {
                                    width: 155px;
                                    height: 30px;
                                    background-color: ${dmColorGreyFour};
                                    color: ${dmColorBlueOne};
                                    border: 1px solid ${dmColorGreyTwo};
                                    padding-left: 10px;

                                    &:hover {
                                        border: 1px solid ${dmColorBlueOne};
                                    }
                                }

                                .item-body-range {
                                    display: flex;
                                    align-items: center;

                                    &__slider {
                                        margin-top: 3px;
                                    }

                                    &__label {
                                        margin-left: 5px;
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
