// q@ts-nocheck
/* qeslint-disable */
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
    dmColorBlueFive,
    dmColorGreyTwo,
    iconColorLightTheme,
    dmColorGreySeven,
    dmColorGreyEight
} from "../../gui-variables.styles";

interface StyleData {
    marginLeft?: string;
    marginTop?: string;
    color?: string;
    borderColor?: string;
    markColor?: string;
    hoverBorderColor?: string;
}

interface LightModeWithStyleData {
    light?: boolean;
    $styleData?: StyleData;
}

interface CheckBoxProps extends LightModeWithStyleData {
    id?: string;
    label?: string;
    checked?: boolean;
    icon?: string;
    selectable?: boolean;
    selected?: boolean;
    onChange?: (checked: boolean, id: string) => void;
    onSelected?: (selected: boolean, id: string) => void;
}

const CheckBoxContainer = styled.div<LightModeWithStyleData>`
    display: flex;
    margin-top: ${(props) => (props.$styleData && props.$styleData.marginTop ? props.$styleData.marginTop : "6px")};

    .checkbox {
        display: block;
        cursor: pointer;
        width: 13px;
        height: 13px;
        margin-left: ${(props) =>
            props.$styleData && props.$styleData.marginLeft ? props.$styleData.marginLeft : "50px"};
    }
    .checkbox input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .checkbox-checkmark {
        position: absolute;
        height: 13px;
        width: 13px;
        border: 1.5px solid
            ${(props) => (props.$styleData?.borderColor ? props.$styleData.borderColor : dmColorGreyEight)};
        border-radius: 2px;

        &:hover {
            border-color: ${(props) =>
                props.$styleData?.hoverBorderColor ? props.$styleData.hoverBorderColor : dmColorGreyEight};
        }
    }

    .checkbox:hover input ~ .checkbox-checkmark {
        background-color: ${(props) => (props.light ? iconColorLightTheme : dmColorGreyTwo)};
    }

    .checkbox-checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    .checkbox input:checked ~ .checkbox-checkmark:after {
        display: block;
    }

    .checkbox .checkbox-checkmark:after {
        left: 3px;
        bottom: 1px;
        width: 2px;
        height: 7px;
        border: solid ${(props) => (props.$styleData?.markColor ? props.$styleData?.markColor : dmColorBlueFive)};
        border-width: 0 2.5px 2.5px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    .checkbox-label {
        margin-left: 10px;
        color: ${(props) => (props.$styleData?.color ? props.$styleData?.color : dmColorGreySeven)};
        font-size: 12px;

        &.blue-color {
            color: ${dmColorBlueFive};
        }
    }

    .icon-icon {
        height: 13px;
        margin-left: 7px;
        margin-right: -5px;
    }
`;

const CheckBox = ({
    id,
    $styleData,
    light,
    icon,
    label,
    checked,
    selectable,
    selected,
    onChange,
    onSelected
}: CheckBoxProps) => {
    const [isChecked, setIsChecked] = useState(checked);
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const handleChange = () => {
        if (onChange) {
            onChange(!isChecked, id || "0");
        }

        setIsChecked(!isChecked);
    };

    const handleSelected = () => {
        if (selectable) {
            const selectedValue = !isSelected;
            setIsSelected(selectedValue);

            if (onSelected) {
                onSelected(selectedValue, id || "0");
            }
        }
    };

    useEffect(() => setIsChecked(checked), [checked]);
    useEffect(() => setIsSelected(!!selected), [selected]);

    return (
        <CheckBoxContainer light={light} $styleData={$styleData}>
            <label className="checkbox">
                <input aria-label="Well" id={id} type="checkbox" checked={isChecked} onChange={handleChange} />
                <span className="checkbox-checkmark" />
            </label>

            {icon && <img className="icon-icon" src={icon} alt="Marker" />}

            <span
                role="presentation"
                onClick={handleSelected}
                className={`checkbox-label ${selectable && isSelected ? "blue-color" : ""}`}
            >
                {label}
            </span>
        </CheckBoxContainer>
    );
};

export default CheckBox;
