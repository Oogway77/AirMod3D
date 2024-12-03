// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";
import { dmColorGreyOne, dmColorGreyTwo } from "../../../gui-variables.styles";

export const TabEmssionContainer = styled.div`
    height: 100%;
    margin-left: 20px;
    color: ${dmColorGreyOne};
    font-size: 12px;

    .mode_container {
        margin-top: 20px;
        display: flex;

        .text {
            margin-left: 20px;
        }
    }

    .radio-group_container {
        margin-top: 15px;
        margin-bottom: 20px;

        .label {
            margin-bottom: 5px;
        }

        .content {
            border: 1px solid ${dmColorGreyTwo};
            width: 250px;

            &--item {
                display: flex;
                align-items: center;
            }
        }
    }
`;
