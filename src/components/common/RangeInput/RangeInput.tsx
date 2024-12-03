// q@ts-nocheck
/* qeslint-disable */
import { FormEventHandler } from "react";
import styled from "styled-components";
import { dmColorBlueOne, dmColorBlueThree, dmColorGreyTwo, dmColorGreySix } from "../../gui-variables.styles";

interface RangeSpanInnerProps {
    width?: string;
    disabled?: boolean;
}

interface RangeInputProps extends RangeSpanInnerProps {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    onChange?: FormEventHandler;
    onMouseUp?: FormEventHandler;
}

const defaultProps: RangeInputProps = {
    value: 0,
    min: 0,
    max: 1,
    step: 0.1,
    width: "0",
    className: "",
    disabled: false,
    onChange: () => {},
    onMouseUp: () => {}
};

const RangeInputContainer = styled.div`
    width: 100%;
    position: relative;
`;

const RangeSpanOuter = styled.span`
    position: absolute;
    left: 2px;
    top: 10px;
    width: 98%;
    height: 0.3rem;
    border-radius: 5px;
    background-color: ${dmColorGreySix};
    overflow: hidden;
`;

const Input = styled.input`
    height: 25px;
    -webkit-appearance: none;
    width: 100%;
    transform: translateX(2px);
    background-color: transparent;

    &:focus {
        outline: none;
    }

    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 3px;
        cursor: pointer;
        box-shadow: 0px 0px 0px #000000;
        border-radius: 1px;
        border: 0px solid #000000;
    }

    &::-webkit-slider-thumb {
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid ${dmColorBlueOne};
        height: 13px;
        width: 13px;
        border-radius: 25px;
        background: ${dmColorBlueOne};
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -7px;
        transform: translateY(2px);
    }

    &::-moz-range-track {
        width: 100%;
        height: 3px;
        cursor: pointer;
        box-shadow: 0px 0px 0px #000000;
        background: ${dmColorBlueThree};
        border-radius: 1px;
        border: 0px solid #000000;
    }

    &::-moz-range-thumb {
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid ${dmColorBlueOne};
        height: 13px;
        width: 13px;
        border-radius: 25px;
        background: ${dmColorBlueOne};
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -7px;
    }

    &::-ms-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        background: red;
        border-color: transparent;
        color: transparent;
    }

    &::-ms-fill-lower {
        background: red;
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 0px #000000;
    }

    &::-ms-fill-upper {
        background: red;
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 0px #000000;
    }

    &::-ms-thumb {
        margin-top: 1px;
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid ${dmColorBlueOne};
        height: 18px;
        width: 18px;
        border-radius: 25px;
        background: #a1d0ff;
        cursor: pointer;
    }

    &:focus::-ms-fill-lower {
        background: ${dmColorBlueOne};
    }

    &:focus::-ms-fill-upper {
        background: ${dmColorBlueOne};
    }

    &::-ms-progress-value {
        background-color: orange;
    }
`;

const RangeInput = ({ value, min, max, step, className, width, onChange, onMouseUp, disabled }: RangeInputProps) => (
    <RangeInputContainer className="range-input-container">
        <RangeSpanOuter>
            <span
                style={{
                    background: disabled ? dmColorGreyTwo : dmColorBlueOne,
                    width: width,
                    display: "block",
                    height: "100%"
                }}
            />
        </RangeSpanOuter>
        <Input
            type="range"
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className={className}
            onMouseUp={onMouseUp}
        />
    </RangeInputContainer>
);

export default RangeInput;
