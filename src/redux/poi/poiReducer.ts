// q@ts-nocheck
/* qeslint-disable */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { POI } from "@core";
import type { RootState } from "../store";
import { POIState } from "../state";

export const poiSlice = createSlice({
    name: "poi",
    initialState: {
        activePOI: undefined
    } as POIState,
    reducers: {
        setActivePOI: (state, { payload }: PayloadAction<POI>) => {
            state.activePOI = payload;
        },
        clearActivePOI: (state) => {
            state.activePOI = undefined;
        }
    }
});

export const { setActivePOI, clearActivePOI } = poiSlice.actions;

export const getCurrentActivePOI = (state: RootState) => state.poi.activePOI;

export default poiSlice.reducer;
