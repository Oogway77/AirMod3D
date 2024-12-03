// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";
import { motion } from "framer-motion";
import { dmColorGreyOne, iconColorLightTheme, dmColorGreyFive, lmColorWhiteOne } from "../../gui-variables.styles";
import { BaseModalProps } from "./BaseModal";

export const BaseModalContainer = styled.div`
    .modal-portal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 0;
    }
`;

export const MainContainer = styled(motion.div)<BaseModalProps>`
    background-color: ${dmColorGreyFive};
    ${(props) => props.$light && `background-color: ${lmColorWhiteOne};`}

    top: ${(props) => props.top};
    left: ${(props) => props.left};
    right: ${(props) => props.right};

    color: ${dmColorGreyOne};
    ${(props) => props.$light && `color: ${iconColorLightTheme};`}

    position: absolute;
    z-index: ${(props) => props.zIndex};
    border-radius: 3px;
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    max-height: ${(props) => props.maxHeight};

    ${(props) =>
        props.isModalCenter &&
        `
        position: fixed;
        top: 50%;
        left: 50%;
    `}

    ${(props) =>
        props.extended &&
        `
        display: flex;
        width: calc(${props.width} + ${props.extendedComponentWidth});
    `}
`;

export const ModalData = styled.div<BaseModalProps>`
    height: 100%;

    ${(props) =>
        props.extended &&
        `
        width: ${props.width};
    `}
`;

export const ExtendedContainer = styled.div`
    display: flex;

    .container-btn {
        font-size: 16px;
        margin-left: 10px;
    }
`;

interface ExtendedDataProps {
    isMobile?: boolean;
}

export const ExtendedData = styled.div<ExtendedDataProps>`
    display: flex;
    overflow: auto;

    ${(props) =>
        props.isMobile &&
        `
        height: 300px;
        margin: 0 1.5rem 0.5rem 0;
    `}
`;

export const BaseModalHeader = styled.div`
    padding: 1.5rem 1.5rem 0 1.5rem;
    display: flex;
    justify-content: space-between;

    .header-content {
        display: contents;
    }

    button {
        height: 24.5px;
    }
`;

export const BaseModalHeaderTitle = styled.span`
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.6rem;
    margin-right: auto;
`;

export const BaseModalLineBreak = styled.div`
    margin: 0 1.5rem 0.5rem 1.5rem;
    height: 1px;
    background-color: ${dmColorGreyOne};
`;

export const ChildContent = styled.div`
    margin: 0 1.5rem 1.5rem 1.5rem;
    height: calc(100% - 8rem);
    overflow-y: auto;
    overflow-x: hidden;
`;
