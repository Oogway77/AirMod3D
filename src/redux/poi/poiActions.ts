// q@ts-nocheck
/* qeslint-disable */
import { Dispatch } from "react";
import { POI } from "@core";
import { setActivePOI, clearActivePOI } from "./poiReducer";

export const setCurrentActivePOI = (value: POI) => async (dispatch: Dispatch<any>) => dispatch(setActivePOI(value));

export const clearCurrentActivePOI = () => async (dispatch: Dispatch<any>) => dispatch(clearActivePOI());
