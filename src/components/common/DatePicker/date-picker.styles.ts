// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";
import { dmColorBlueOne, dmColorGreyOne, dmColorGreyTwo, dmColorGreyFour } from "../../gui-variables.styles";

export const DatePickerContainer = styled.div`
    color: ${dmColorGreyOne};

    input {
        width: 100% !important;
        color: ${dmColorBlueOne};
        font-size: 14px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        background-color: ${dmColorGreyFour};
    }

    button {
        color: ${dmColorBlueOne};
    }

    label {
        color: ${dmColorGreyOne};
    }

    .MuiOutlinedInput-notchedOutline {
        border-color: ${dmColorGreyTwo} !important;
    }
`;
