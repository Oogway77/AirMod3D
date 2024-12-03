// @ts-nocheck
/* eqslint-disable */
import styled from "styled-components";
import { Fragment } from "react";
import { TextAlign } from "@syncfusion/ej2-react-spreadsheet";
import { GeoJsonProperties } from "geojson";
import { useSelector } from "react-redux";
import ReactJson from "react-json-view";

import { dmColorGreyTwo, dmColorGreyOne } from "../../gui-variables.styles";
import { getCurrentActivePOI } from "../../../redux";

interface FieldsInfo {
    fieldName: string;
    fieldLabel: string;
    fieldType: string;
    fieldUnit?: string;
    fieldModifier?: Function;
    hidden?: string;
    style?: { textAlign: TextAlign | undefined };
}

interface PopupProps {
    edit: boolean;
    properties: GeoJsonProperties | undefined;
    fieldsInfo: { [key: string]: FieldsInfo };
    onChanged: () => void;
}

function isJsonString(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const PopupTableContainer = styled.table`
    width: 100%;
    font-weight: 500;
    font-size: 0.6rem;
    word-break: break-word;

    td {
        padding-bottom: 0.5rem;
    }

    tr {
        margin-bottom: 1rem;
    }

    .left {
        width: 125px;
    }

    .popup-table-input {
        background-color: ${dmColorGreyTwo};
        border: none;
        border-radius: 3px;
        padding: 0.25rem 0.5rem;
        color: ${dmColorGreyOne};
        font-size: 0.7rem;
        font-weight: 600;
        font-family: "Montserrat", sans-serif !important;
        height: 22px;
        box-sizing: border-box;
        text-align: right;

        &.switch-checkbox {
            height: 0;
        }

        &::placeholder {
            color: ${dmColorGreyOne};
        }
    }
`;

const PopupTable = ({ onChanged, edit, properties, fieldsInfo }: PopupProps) => {
    const currentActivePOIChanged = useSelector(getCurrentActivePOI);

    const getValue = (key: string, value: FieldsInfo) => {
        if (!properties || (!value.fieldName.includes(".") && !properties[key]) || value.hidden) {
            return "";
        }

        if (value.fieldModifier) {
            return value.fieldModifier(properties[key]) + value.fieldUnit;
        }

        if (value.fieldName.includes(".")) {
            // in case of that field name has multiple hierarchical structures
            // ex: dateValue.start or dateValue.end
            const fieldNames = value.fieldName.split(".");
            let data = properties;
            fieldNames.forEach((fieldName) => {
                data = data[fieldName];
            });

            return data;
        }

        return `${properties[key]} ${value.fieldUnit}`;
    };

    const onChange = (e) => {
        const meterToFeet = 3.28084;
        const feetToMeter = 1 / meterToFeet;

        const changedPOI = currentActivePOIChanged;
        changedPOI?.setVerticalLength(Number(e.target.value) * feetToMeter);

        window.geoTech.movePOITool?.updateHeight(Number(e.target.value) * feetToMeter);
        onChanged();
    };

    return (
        <PopupTableContainer>
            <tbody>
                {fieldsInfo && Object.keys(fieldsInfo).length > 0
                    ? Object.entries(fieldsInfo).map(([key, value]) => (
                          <tr key={key}>
                              <td className="left" style={{ textAlign: "left" }}>
                                  {value.fieldLabel}:
                              </td>
                              <td style={{ textAlign: value.style ? value.style.textAlign : "right" }}>
                                  {getValue(key, value)}
                              </td>
                          </tr>
                      ))
                    : Object.entries(properties || {}).map(([key, value]) => {
                          let paddingLeft = 0;

                          if (key.charAt(0) === "\t") {
                              paddingLeft = 15;
                          }

                          const isObject = key === "FINS";

                          // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
                          const renderSimple = () => {
                              const label = <td style={{ textAlign: "right" }}>{value?.toString()}</td>;
                              const input = (
                                  <td style={{ textAlign: "right" }}>
                                      <input
                                          type="number"
                                          className="popup-table-input"
                                          value={value}
                                          onChange={onChange}
                                      />
                                  </td>
                              );

                              return (
                                  <tr key={key}>
                                      <td className="left" style={{ textAlign: "left", paddingLeft: paddingLeft }}>
                                          {key.trim()}:
                                      </td>

                                      {edit && key === "Height" ? input : label}
                                  </tr>
                              );
                          };

                          const onEdit = (data) => {
                              console.warn(data);
                          };

                          // eslint-disable-next-line arrow-body-style
                          const renderObject = () => {
                              return (
                                  <tr>
                                      <td colSpan={2}>
                                          <div style={{ maxHeight: "300px" }}>
                                              <ReactJson
                                                  style={{ width: "100%", padding: "5px" }}
                                                  src={value}
                                                  name={key}
                                                  enableClipboard={false}
                                                  displayDataTypes={false}
                                                  quotesOnKeys={false}
                                                  indentWidth={2}
                                                  displayObjectSize={false}
                                                  theme="threezerotwofour"
                                                  onEdit={onEdit}
                                              />
                                          </div>
                                      </td>
                                  </tr>
                              );
                          };

                          let needJsonView = true;

                          if (!isObject) {
                              needJsonView = false;
                          } else {
                              if (!value) {
                                  needJsonView = false;
                                  console.warn("empty value detected instead of valid json string");
                              }

                              if (!isJsonString(value)) {
                                  needJsonView = false;
                                  console.warn(`invalid json sting detected ${value}`);
                              }
                          }

                          return <Fragment key={key}>{needJsonView ? renderObject() : renderSimple()}</Fragment>;
                      })}
            </tbody>
        </PopupTableContainer>
    );
};

export default PopupTable;
