/* eslint-disable react/forbid-prop-types */
// q@ts-nocheck
/* qeslint-disable */
import { useState, useRef, useEffect } from "react";
import Select, { StylesConfig } from "react-select";
import { SelectInputDataItem } from "../../../types/common";
import { dmColorGreyTwo, dmColorGreyFour, dmColorBlueOne } from "../../gui-variables.styles";
import { SelectInputStyles } from "./select-input.styles";

/**
 *
 * @param selectedItemData
 * @param {Array} items
 * @param {function} callback
 * @returns {*}
 * @constructor
 */

interface SelectInputProps {
    selectedItemData: SelectInputDataItem;
    items: SelectInputDataItem[];
    callback: (e: { value: string | number }) => void;
}

const SelectInput = ({ selectedItemData, items, callback }: SelectInputProps) => {
    const inputRef = useRef(null);

    const [selectedItem, setSelectedItem] = useState(items[0]);

    // Styling for select field
    type IsMulti = false;
    const customStyles: StylesConfig<SelectInputDataItem, IsMulti> = {
        option: (provided, state) => {
            let colorValue = "#edf9ff";

            if (state.isSelected) {
                colorValue = dmColorBlueOne;
            }

            return {
                ...provided,
                borderBottom: "1px solid #ddd",
                color: colorValue,
                // color: state.
                padding: 20,
                cursor: "pointer"
            };
        },
        singleValue: (provided) => ({
            ...provided,
            color: dmColorBlueOne
        }),
        input: (provided) => ({
            ...provided,
            color: " #fff"
        }),
        control: (styles) => ({
            ...styles,
            cursor: "pointer",
            border: `1px solid ${dmColorGreyTwo}`,
            "&:hover": {
                border: `1px solid ${dmColorBlueOne}`
            }
        }),
        dropdownIndicator: (styles, state: { isFocused: boolean }) => {
            let colorValue = "white";

            if (state.isFocused) {
                colorValue = `${dmColorBlueOne}`;
            }

            return {
                ...styles,
                color: colorValue
            };
        }
    };

    useEffect(() => {
        if (selectedItemData.label !== selectedItem.label || selectedItemData.value !== selectedItem.value) {
            setSelectedItem(selectedItemData);
        }
    }, [selectedItemData]);

    const handleItemChange = (e: SelectInputDataItem) => {
        setSelectedItem(e);
        callback(e);
    };

    const liList = items.map((value) => (
        <li role="presentation" onClick={(e) => handleItemChange(e as unknown as SelectInputDataItem)} key={`${value}`}>
            {/* https://stackoverflow.com/questions/76898372/getting-type-element-is-not-assignable-to-type-reactnode-when-creating-a */}
            {/* @ts-ignore */}
            {value}
        </li>
    ));

    return (
        <SelectInputStyles>
            <div className="select-input--container container">
                <div className="select-input--wrapper">
                    <div className="select-input">
                        <Select
                            onChange={(e) => handleItemChange(e as unknown as SelectInputDataItem)}
                            styles={customStyles}
                            options={items}
                            placeholder="Select item"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            value={selectedItem}
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    primary25: dmColorGreyTwo,
                                    primary: dmColorGreyTwo,
                                    neutral0: dmColorGreyFour
                                }
                            })}
                        />
                    </div>
                </div>

                {inputRef.current && <ul className="input-tag-list">{liList}</ul>}
            </div>
        </SelectInputStyles>
    );
};

export default SelectInput;
