// q@ts-nocheck
/* qeslint-disable */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { SettingsState } from "../state";

export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        visibleCloud: false
    } as SettingsState,
    reducers: {
        setVisibleCloud: (state, { payload }: PayloadAction<boolean>) => {
            state.visibleCloud = payload;
        }
    }
});

export const { setVisibleCloud } = settingsSlice.actions;

export const getSettingsVisibleCloud = (state: RootState) => state.settings.visibleCloud;

export default settingsSlice.reducer;
