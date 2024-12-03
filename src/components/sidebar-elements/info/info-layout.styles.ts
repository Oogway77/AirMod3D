// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import {
    iconColorLightTheme,
    lmColorWhiteOne,
    dmColorGreyOne,
    dmColorGreyFive,
    GUIOptions,
    panelHeaderFontSize,
    panelHeaderFontWeight,
    dmColorBlueOne
} from "../../gui-variables.styles";

interface InfoLayoutExpandedProps {
    $light?: boolean;
}

export const InfoLayoutExpanded = styled.div<InfoLayoutExpandedProps>`
    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};

    .info-layout-particles {
        position: fixed;
        top: ${GUIOptions.rightSideBar.top};
        right: ${GUIOptions.rightSideBar.width};
        height: 100%;
        width: ${GUIOptions.inforLayout.width};
        background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFive)};
        z-index: 0;
        transition: all 0.1s ease-in-out;
        padding-left: 1rem;
        padding-right: 1rem;
        transform: translateX(700px); // 450 + 56

        &--active {
            width: ${GUIOptions.inforLayout.width};
            transform: translateX(0);
            z-index: 1;
        }

        .info-layout {
            height: 100%;
            margin-left: 1rem;

            &__header {
                display: flex;
                text-align: center;
                align-items: center;
                margin-top: 2rem;
                color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
                font-size: ${panelHeaderFontSize};
                margin-bottom: 2rem;
                font-weight: ${panelHeaderFontWeight};
                position: relative;

                .close-btn {
                    padding-inline: 1rem;
                    padding-block: 0.75rem;
                    right: 0px;
                    line-height: 1rem;
                    position: absolute;
                    margin: 0px;
                    display: flex;
                    inline-size: auto;
                    cursor: pointer;
                    align-items: center;
                    justify-content: flex-start;
                    border-style: none;
                    line-height: 1rem;
                    outline-color: transparent;
                    background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFive)};
                    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
                    text-align: unset;
                    flex: 1 0 auto;

                    .icon-container {
                        pointer-events: none;
                        margin: 0px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-inline-size: 1rem;
                        min-block-size: 1.5rem;
                    }
                }

                &__icon {
                    font-size: 20px;
                    margin-right: 15px;
                    cursor: pointer;

                    &:hover {
                        color: ${(props) => (props.$light ? iconColorLightTheme : dmColorBlueOne)};
                    }
                }

                &__label {
                    margin-bottom: 0px;
                }
            }

            &__content {
                height: 100%;
                font-size: 0.8rem;

                &__line {
                    margin: 1rem 0;
                    height: 1px;
                    width: 100%;
                    background-color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
                }

                &__main {
                    height: calc(100% - 250px);
                    overflow: auto;
                }
            }
        }
    }
`;
