// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import {
    iconColorLightTheme,
    lmColorWhiteOne,
    dmColorGreyOne,
    dmColorGreyFive,
    panelHeaderFontSize,
    panelHeaderFontWeight,
    dmColorBlueOne,
    dmColorBlueTwo,
    dmColorGreyFour,
    dmColorGreyTwo
} from "../../gui-variables.styles";

interface FavoritesLayoutExpandedProps {
    $light?: boolean;
}

export const FavoritesLayoutContainer = styled.div<FavoritesLayoutExpandedProps>`
    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
    position: static;
    width: auto;
    height: 100%;
    padding: 0.2rem;

    .solar-layout-particles {
        position: static;
        height: 100%;
        background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFive)};

        .solar-layout {
            &__content {
                font-size: 0.8rem;

                .toggles-container {
                    border: 2px solid ${dmColorGreyOne};
                    padding: 10px;

                    overflow: auto;

                    &__parent {
                        margin-top: 5px;
                        font-size: 18px;
                        width: 300px;
                        max-width: 300px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    &__tree {
                        flex-grow: 1;

                        .MuiTreeItem-label {
                            &:hover {
                                color: ${dmColorBlueOne};
                            }
                        }

                        .Mui-selected {
                            color: ${dmColorBlueTwo};
                        }

                        .Mui-checked {
                            color: ${dmColorBlueTwo};
                        }

                        .rating-content {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-top: 5px;
                            margin-bottom: 5px;

                            &__main {
                                display: flex;
                                align-items: center;
                            }

                            .rating-star {
                                margin-right: 15px;
                            }

                            &__input {
                                width: 105px;
                                height: 25px;
                                background-color: ${dmColorGreyFour};
                                color: ${dmColorBlueOne};
                                border: 1px solid ${dmColorGreyTwo};

                                &:hover {
                                    border: 1px solid ${dmColorBlueOne};
                                }
                            }

                            &__edit {
                                display: flex;
                                justify-content: flex-end;

                                &__icon {
                                    font-size: 20px;
                                    margin-top: 5px;
                                }

                                &__btns {
                                    display: flex;
                                    font-size: 10px;
                                    margin: 5px 0;
                                }
                            }
                        }
                    }
                    &__item {
                        margin-top: 10px;
                        margin-bottom: 30px;
                    }
                }
            }
        }
    }
`;
