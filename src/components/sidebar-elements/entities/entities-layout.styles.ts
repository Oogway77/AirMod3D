// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import {
    iconColorLightTheme,
    lmColorWhiteOne,
    dmColorBlueOne,
    dmColorBlueTwo,
    dmColorGreyOne,
    dmColorGreyTwo,
    dmColorGreyFive,
    panelHeaderFontSize,
    panelHeaderFontWeight
} from "../../gui-variables.styles";

interface EntitiesLayoutExpandedExpandedProps {
    $light?: boolean;
}

export const EntitiesLayoutContainer = styled.div<EntitiesLayoutExpandedExpandedProps>`
    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
    height: 100%;
    overflow: hidden;

    .extended-entities-layout {
        position: static;
        height: 100%;
        width: auto;
        background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFive)};

        padding: 0.2rem;

        .entities-layout {
            height: 100%;

            &__radio {
                font-size: 15px;
                display: flex;
            }

            &__filter {
                border: 1px solid ${dmColorGreyTwo};
                font-size: 12px;
                padding: 10px;

                .checkbox_container {
                    margin-top: 15px;

                    &__disabled {
                        pointer-events: none;
                        opacity: 0.7;
                    }
                }

                &__main {
                    display: flex;
                    justify-content: space-between;
                }
            }

            &__search {
                margin-top: 1rem;
                display: flex;
                justify-content: space-between;

                &__input-content {
                    width: 250px;
                }

                &__empty {
                    width: 100%;
                    height: 52px;
                }
            }

            &__content {
                border: 2px solid ${dmColorGreyOne};
                padding: 10px;
                margin-top: 1rem;
                height: calc(100% - 200px);
                overflow: auto;

                .projects-window-loader {
                    display: flex;
                    position: fixed;
                    width: 346px;
                    height: calc(100vh - 25rem);
                    text-align: center;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
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

                    &__checkbox {
                        color: ${dmColorGreyOne};

                        &:hover {
                            color: ${dmColorBlueOne};
                        }
                    }

                    &__text {
                        width: 270px;
                        max-width: 270px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        margin: 2px 0;
                    }

                    .tree-item {
                        &__active {
                            color: ${dmColorBlueTwo};
                            background-color: #1e3247;
                        }
                    }
                    .rating-content {
                        display: flex;
                        align-items: center;
                        margin-top: 5px;
                        margin-bottom: 5px;

                        .rating-star {
                            margin-right: 15px;
                        }
                    }

                    .icon-icon {
                        width: 13px;
                        margin-left: -10px;
                        margin-right: 7px;
                    }
                }
            }
        }
    }
`;
