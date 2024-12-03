// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import {
    dmColorGreyOne,
    dmColorGreyTwo,
    iconColorLightTheme,
    dmColorBlueOne,
    colorRed,
    lmColorWhiteTwo,
    inputColorLightTheme
} from "../../gui-variables.styles";

interface SelectInputStylesProps {
    light?: boolean;
}

export const SelectInputStyles = styled.div<SelectInputStylesProps>`
    .select-input {
        /* width */
        ::-webkit-scrollbar {
            width: 10px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: blue;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: red;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    }
    .brush-histogram-filter {
        background-color: #b5ddff;

        &-labels {
            display: flex;
            justify-content: space-between;
            color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyOne)};
            font-weight: 600;
            margin-top: 0.25rem;
        }

        &-inputs {
            display: flex;
            justify-content: space-between;
            margin-top: 0.5rem;

            input {
                max-width: 5rem;
                border-radius: 3px;
                border: none;
                background-color: ${(props) => (props.light ? lmColorWhiteTwo : dmColorGreyTwo)};
                padding: 0.15rem 0.5rem;
                font-family: inherit;
                font-weight: 600;
                font-size: 0.75rem;
                -webkit-appearance: none;
                margin: 0;
                -moz-appearance: textfield;
                color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyOne)};
                border: 1px solid ${dmColorGreyOne};

                ::placeholder {
                    color: ${dmColorGreyOne};
                    font-weight: 600;
                }
            }

            &:focus {
                outline-color: #34758a;
            }
        }
    }

    .input-tag-list {
        list-style: none;
        color: ${dmColorGreyOne};
        font-size: 0.75rem;
        font-weight: 600;
        max-height: 9rem;
        overflow-y: auto;
        margin-top: 0.5rem;

        li {
            padding: 0.25rem 0;
            cursor: pointer;
            color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyOne)};
            padding-left: 0.2rem;

            &:hover {
                background-color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyTwo)};
                color: ${(props) => (props.light ? "#42f58d" : dmColorBlueOne)};
            }
        }
    }

    .input-tag-list-input {
        width: 100%;
        padding: 0.4rem 0.75rem;
        border-radius: 3px;
        background-color: ${(props) => (props.light ? inputColorLightTheme : dmColorGreyTwo)};
        border: none;
        font-weight: 600;
        border: 1px solid ${dmColorGreyOne};
        color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyOne)};

        font-family: inherit;

        &:focus {
            outline-color: #34758a;
        }

        ::placeholder {
            color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyOne)};
            font-weight: 600;
        }
    }

    .select-input--delete--btn {
        &:focus {
            outline: none;
        }
    }

    .select-input--delete--btn > * {
        transition: all 0.2s ease-in-out;
        transform: translateX(-5px);
        color: ${(props) => (props.light ? "#5e80ad" : "#84a3b0")};

        &:hover {
            color: ${(props) => (props.light ? "#42f58d" : dmColorBlueOne)};
        }

        &:active {
            color: #6b0000;
        }
    }

    .select-input-tags {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyOne)};
        font-size: 0.75rem;
        margin-bottom: 0.35rem;
        font-weight: 600;
        padding: 0.25rem;
        /* border: none; */

        &:hover {
            background-color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyTwo)};
            color: ${(props) => (props.light ? "#42f58d" : dmColorBlueOne)};
        }

        &--delete {
            cursor: pointer;
            transition: all 0.2s ease-in-out;

            &:hover {
                color: ${colorRed};
            }
        }
    }
`;
