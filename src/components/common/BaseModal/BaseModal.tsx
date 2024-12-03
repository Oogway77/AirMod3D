// q@ts-nocheck
/* qeslint-disable */
import React, { FormEventHandler, useRef, useEffect, useState } from "react";
import { useDragControls } from "framer-motion";
import { GoTriangleRight, GoTriangleDown } from "react-icons/go";
import { Button } from "..";
import { dmColorGreyOne } from "../../gui-variables.styles";
import {
    BaseModalContainer,
    MainContainer,
    ModalData,
    ExtendedData,
    ExtendedContainer,
    BaseModalHeader,
    BaseModalHeaderTitle,
    BaseModalLineBreak,
    ChildContent
} from "./base-modal.styles";

export interface BaseModalProps {
    $light?: boolean;
    width?: string;
    height?: string;
    maxHeight?: string;
    top?: string;
    left?: string;
    right?: string;
    title?: string | React.ReactNode;
    zIndex?: number;
    isMobile?: boolean;
    showLineBreak?: boolean;
    isButtonAvailable?: boolean;
    isModalPortal?: boolean;
    isModalCenter?: boolean;
    extended?: boolean;
    handleClose?: FormEventHandler;
    children?: React.ReactNode;
    headerComponent?: React.ReactNode;
    extendedComponent?: React.ReactNode;
    extendedComponentWidth?: string;
    onMouseLeave?: () => void;
}

const BaseModal = ({
    $light,
    width,
    height,
    maxHeight,
    top,
    left,
    right,
    zIndex,
    title,
    showLineBreak,
    isButtonAvailable,
    isModalPortal,
    isModalCenter,
    isMobile,
    extended,
    handleClose,
    children,
    headerComponent,
    extendedComponent,
    extendedComponentWidth,
    onMouseLeave
}: BaseModalProps) => {
    const childRef = useRef() as React.MutableRefObject<HTMLDivElement>;
    const extendedRef = useRef() as React.MutableRefObject<HTMLDivElement>;
    const [customHeight] = useState(height);
    const [showExtended, setShowExtended] = useState(false);
    const dragControls = useDragControls();

    const setModalHeight = () => {
        if (height !== "auto") return;

        const childHeight = childRef.current?.clientHeight;
        if (childHeight) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const isScroll = childHeight > window.innerHeight * 0.8;
            // setCustomHeight(isScroll ? "85%" : "auto");
        }
    };

    const setDimension = () => {
        setModalHeight();
    };

    useEffect(() => {
        setModalHeight();
    }, [children]);

    useEffect(() => {
        window.addEventListener("resize", setDimension);

        setModalHeight();

        return () => {
            window.removeEventListener("resize", setDimension);
        };
    }, []);

    return (
        <BaseModalContainer>
            {isModalPortal && <div className="modal-portal" />}
            <MainContainer
                $light={$light}
                width={width}
                onMouseLeave={() => {
                    if (onMouseLeave) {
                        onMouseLeave();
                    }
                }}
                height={customHeight}
                maxHeight={maxHeight}
                whileDrag={{ opacity: 0.5 }}
                top={top}
                left={left}
                right={right}
                zIndex={zIndex}
                extended={extended && !isMobile}
                extendedComponentWidth={extendedComponentWidth}
                isModalCenter={isModalCenter}
                drag={!isModalPortal}
                dragControls={dragControls}
                dragListener={false}
                dragMomentum={false}
                style={{
                    boxShadow: " 0 0.5rem 1rem rgba(0, 0, 0, 1)"
                }}
            >
                <ModalData extended={extended && !isMobile} width={width}>
                    <BaseModalHeader
                        onPointerDown={(e) => {
                            if (!isModalPortal) dragControls.start(e);
                        }}
                        className="base-modal-header"
                    >
                        {title && <BaseModalHeaderTitle>{title}</BaseModalHeaderTitle>}
                        <div className="header-content">
                            {headerComponent}
                            {handleClose && (
                                <Button
                                    disabled={!isButtonAvailable}
                                    $textColor={dmColorGreyOne}
                                    buttonStyle="close"
                                    onClick={handleClose}
                                    light={$light}
                                >
                                    X
                                </Button>
                            )}
                        </div>
                    </BaseModalHeader>
                    {showLineBreak && <BaseModalLineBreak />}
                    {extended && isMobile && (
                        <ExtendedContainer>
                            <div
                                className="container-btn"
                                role="presentation"
                                onClick={() => setShowExtended(!showExtended)}
                            >
                                {showExtended ? <GoTriangleDown /> : <GoTriangleRight />}
                            </div>
                            {showExtended && <ExtendedData isMobile={isMobile}> {extendedComponent}</ExtendedData>}
                        </ExtendedContainer>
                    )}
                    <ChildContent>
                        <div className="base-modal-content" ref={childRef}>
                            {children}
                        </div>
                    </ChildContent>
                </ModalData>
                {extended && !isMobile && (
                    <ExtendedData
                        onPointerDown={(e) => {
                            const posY = e.clientY - extendedRef.current.getBoundingClientRect().top;
                            if (!isModalPortal && posY <= 55) dragControls.start(e);
                        }}
                        ref={extendedRef}
                    >
                        {extendedComponent}
                    </ExtendedData>
                )}
            </MainContainer>
        </BaseModalContainer>
    );
};

export default BaseModal;
