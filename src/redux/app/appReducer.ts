// q@ts-nocheck
/* qeslint-disable */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import type { RootState } from "../store";
import { AppState } from "../state";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        loading: false,
        user: undefined,
        error: null
    } as AppState,
    reducers: {
        setUserLoginRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.user = undefined;
        },
        setUser: (state, { payload }: PayloadAction<User | undefined>) => {
            state.loading = false;
            state.user = payload;
        },
        setUserLoginFail: (state, { payload }: PayloadAction<string>) => {
            state.loading = false;
            state.user = undefined;
            state.error = payload;
        },
        setUserLogout: (state) => {
            state.loading = false;
            state.error = null;
            state.user = undefined;
        },
        setErrorData: (state, { payload }: PayloadAction<string>) => {
            state.error = payload;
        },
        clearErrorData: (state) => {
            state.error = null;
        }
    }
});

export const { setUserLoginRequest, setUser, setUserLoginFail, setUserLogout, setErrorData, clearErrorData } =
    appSlice.actions;

export const getCurrentUser = (state: RootState) => state.app.user;

export const getUserErrorData = (state: RootState) => state.app.error;

export default appSlice.reducer;
