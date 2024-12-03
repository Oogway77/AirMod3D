// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";
import React, { FormEventHandler } from "react";

import {
    dmColorGreyOne,
    dmColorGreyTwo,
    colorRed,
    iconColorLightTheme,
    dmColorBlueOne,
    iconActiveColorLightTheme
} from "../../gui-variables.styles";

interface ButtonProps {
    light?: boolean;
    width?: string;
    type?: "submit" | "reset" | "button";
    $marginRight?: string;
    marginLeft?: string;
    $textColor?: string;
    $backgroundColor?: string;
    buttonStyle?: string;
    disabled?: boolean;
    onClick?: FormEventHandler;
    children?: React.ReactNode;
}

const ButtonContainer = styled.button<ButtonProps>`
    background-color: ${(props) => props.$backgroundColor};
    color: ${(props) => (props.light ? iconColorLightTheme : props.$textColor)};
    width: ${(props) => props.width};
    padding: 0.2rem 0.5rem;
    border: 1px solid ${(props) => (props.light ? iconColorLightTheme : props.$backgroundColor)};
    font-weight: 500;
    font-size: 0.9rem;
    border-radius: 3px;
    transition: all 0.3s ease-in-out;
    letter-spacing: 1px;
    cursor: pointer;
    margin-right: ${(props) => props.$marginRight};
    margin-left: ${(props) => props.marginLeft};

    &:hover {
        background-color: ${(props) => (props.light ? iconActiveColorLightTheme : "transparent")};
        color: ${(props) => (props.light ? iconColorLightTheme : props.$backgroundColor)};
        border: 1px solid ${(props) => (props.light ? "transparent" : props.$backgroundColor)};
    }

    &:active {
        opacity: 0.5;
    }

    &.full-width {
        width: 100%;
    }

    &.close {
        font-size: 0.7rem;
        background-color: transparent;
        border: 2px solid ${(props) => (props.light ? iconColorLightTheme : props.$textColor)};

        &:hover {
            color: ${colorRed};
            border: 2px solid ${colorRed};
        }
    }

    &.outline {
        font-size: 0.7rem;
        background-color: transparent;
        border: 2px solid ${(props) => (props.light ? iconColorLightTheme : props.$textColor)};

        &:hover {
            color: ${(props) => (props.light ? iconActiveColorLightTheme : dmColorBlueOne)};
            border: 2px solid ${(props) => (props.light ? iconActiveColorLightTheme : dmColorBlueOne)};
        }
    }

    &:disabled {
        background-color: transparent;
        color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyOne)};
        border: 1px solid ${dmColorGreyTwo};
        cursor: not-allowed;

        &:hover {
            color: ${dmColorGreyOne};
            border: 1px solid ${dmColorGreyTwo};
        }
    }
`;

const Button = ({
    light,
    width,
    type,
    $marginRight,
    marginLeft,
    $textColor,
    $backgroundColor,
    buttonStyle,
    disabled,
    onClick,
    children
}: ButtonProps) => (
    <ButtonContainer
        light={light}
        type={type}
        $marginRight={$marginRight}
        marginLeft={marginLeft}
        onClick={onClick}
        width={width}
        $textColor={$textColor}
        $backgroundColor={$backgroundColor}
        className={buttonStyle}
        disabled={disabled}
    >
        {children}
    </ButtonContainer>
);

export default Button;
