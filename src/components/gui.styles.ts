// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import {
    dmColorGreyTwo,
    dmColorGreyFour,
    dmColorBlueOne,
    dmColorGreyOne,
    dmColorBlack,
    dmColorBlueTwo,
    dmColorBlueFour,
    lmColorWhiteOne,
    iconColorLightTheme,
    iconHoverColorLightTheme,
    iconActiveColorLightTheme,
    lmColorBlueOne
} from "./gui-variables.styles";

interface GuiProps {
    $light?: boolean;
    $expanded?: boolean;
    $expandedContent?: boolean;
}

export const Sidebar = styled.nav<GuiProps>`
    height: 100%;
    width: 56px;
    bottom: inherit;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;

    @media only screen and (max-width: 600px) {
        transform: ${(props) => (props.$expanded ? "translateX(0)" : "translateX(-100%)")};
    }

    .icon {
        fill: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
        transition: all 0.2s ease-in-out;

        &--stroke {
            fill: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFour)};
            stroke: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
            stroke-width: 1px;
        }
    }

    .nav-toggle {
        height: 3.5rem;
        background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFour)};
        border: none;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        flex-direction: row;
        width: 450px;
        padding: 0 1rem;
        cursor: pointer;
        transition: width 0.2s ease;
        overflow: hidden;

        &_small {
            width: ${(props) => (props.$expandedContent ? "250px" : "56px")} !important;
        }

        .nav-item {
            margin-right: 15px;

            &_icon {
                height: 25px;
            }

            &_menu {
                font-size: 30px;
                color: white;
            }
        }
    }

    .content {
        height: calc(100% - 3.5rem);
        width: ${(props) => (props.$expandedContent ? "250px" : "56px")};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: auto;
        background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFour)};
        transition: width 0.2 ease;
        border-top: 1px solid ${dmColorGreyOne};

        &_hide {
            height: 0;
            border: none;
        }

        &::-webkit-scrollbar {
            display: none;
        }

        .top-nav {
            padding-top: 20px;

            .icon-content {
                cursor: pointer;
                display: flex;
                align-items: center;
                margin-bottom: 1rem;
                padding: 1rem;
                color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};

                &:hover {
                    background-color: ${(props) => (props.$light ? lmColorBlueOne : dmColorGreyTwo)};
                    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorBlueOne)};

                    svg {
                        fill: ${(props) => (props.$light ? iconHoverColorLightTheme : dmColorBlueOne)};
                    }
                }

                &__active {
                    background-color: ${(props) => (props.$light ? lmColorBlueOne : dmColorGreyTwo)};
                    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorBlueOne)};

                    svg {
                        fill: ${(props) => (props.$light ? iconHoverColorLightTheme : dmColorBlueOne)};
                    }
                }

                &__label {
                    font-size: 1rem;
                    margin-left: 15px;
                    margin-bottom: 5px;
                }
            }

            .icon-expand {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 1rem;
                padding: 1rem;
                color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};

                &__label {
                    font-size: 1rem;
                    font-weight: 600;
                }

                &__icon {
                    cursor: pointer;
                    &:hover {
                        svg {
                            fill: ${(props) => (props.$light ? iconColorLightTheme : dmColorBlueOne)};
                        }
                    }
                }
            }

            &__img {
                cursor: pointer;
                text-align: center;
            }

            @media only screen and (min-width: 600px) {
                .hide-sidebar {
                    background-color: blue;
                    display: none;
                }
            }
        }

        .bottom-nav {
            padding-bottom: 20px;

            &__img {
                cursor: pointer;
                text-align: center;
                padding: 1rem;

                &:hover {
                    background-color: ${(props) => (props.$light ? lmColorBlueOne : dmColorGreyTwo)};

                    svg {
                        fill: ${(props) => (props.$light ? iconHoverColorLightTheme : dmColorBlueOne)};
                    }
                }
            }
        }
    }

    .slider-nav {
        color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
        position: absolute;
        top: 45%;
        left: 35px;
        z-index: ${(props) => (props.$expanded ? 0 : 1)};
        overflow: hidden;
        border-radius: 3px;
        background-color: transparent;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 5.6rem;
        opacity: ${(props) => (props.$expanded ? 0 : 0.5)};
        pointer-events: ${(props) => props.$expanded && `none`};

        @media only screen and (min-width: 600px) {
            display: none;
        }

        &:hover {
            color: ${dmColorBlueOne};
        }
    }
`;

export const FilterExpanded = styled.div<GuiProps>`
    .extended-filter {
        position: fixed;
        top: 3.5rem;
        left: 0;
        height: calc(100% - 3.5rem);
        width: 350px;
        background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFour)};
        z-index: 0;
        transition: all 0.2s ease-in-out;
        padding-right: 1rem;
        transform: translateX(-22rem);

        &--active {
            width: 350px;
            transform: translateX(0);
            z-index: 1;
        }

        .filter {
            margin-left: 5rem;

            &__header {
                margin-top: 1.9rem;
                display: flex;
                justify-content: space-between;
            }

            &__headline {
                color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
                font-size: 1rem;
            }

            &__select {
                &--header {
                    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
                    margin-bottom: 1rem;
                }

                &--add {
                    margin-top: 1.75rem;
                }

                &--inputs {
                }

                &--btn {
                    cursor: pointer;
                    color: ${dmColorGreyOne};
                    background-color: ${dmColorBlueTwo};
                    padding: 0.65rem 1rem;
                    font-weight: 600;
                    font-size: 0.75rem;
                    border-radius: 5px;
                    transition: all 0.2s ease-in-out;
                    border: none;

                    &:hover {
                        background-color: ${dmColorBlueFour};
                    }
                }
            }
        }

        /* Filter Icons */

        .filter__icons {
            &--container {
                margin-top: 2.3rem;
                display: flex;
                justify-content: space-between;
                border-radius: 10px;
                background-color: ${dmColorBlack};
                overflow: hidden;
                border-radius: 10px;
            }

            &--wrapper {
                padding: 1rem 1.5rem;

                overflow: hidden;
                &--active {
                    .filter-icon {
                        fill: ${(props) => (props.$light ? iconActiveColorLightTheme : dmColorBlueOne)};
                    }
                    &--wells {
                        stroke: ${(props) => (props.$light ? iconActiveColorLightTheme : dmColorBlueOne)};
                        stroke-width: 2.5;
                    }
                }

                &:hover {
                    background-color: "black";
                    overflow: hidden;

                    .filter-icon {
                        fill: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyTwo)};

                        &--wells {
                            stroke: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyTwo)};
                        }
                    }
                }
            }

            &--line {
                margin: 1rem 0;
                height: 1px;
                width: 100%;
                background-color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
            }
        }

        .filter-icon {
            fill: ${dmColorGreyOne};

            &:hover {
                fill: ${dmColorBlueOne};
            }

            &--wells {
                stroke: ${dmColorGreyOne};
                stroke-width: 2.5;

                &:hover {
                    stroke: ${dmColorBlueOne};
                }
            }
        }
    }
`;
