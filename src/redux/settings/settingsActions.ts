// q@ts-nocheck
/* qeslint-disable */
import { Dispatch } from "react";
import { setVisibleCloud } from "./settingsReducer";

export const setSettingsVisibleCloud = (value: boolean) => async (dispatch: Dispatch<any>) =>
    dispatch(setVisibleCloud(value));
