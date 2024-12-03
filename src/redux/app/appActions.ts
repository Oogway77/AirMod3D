// q@ts-nocheck
/* qeslint-disable */
import { Dispatch } from "react";
import { User } from "@supabase/supabase-js";
import { setUser, setErrorData, clearErrorData } from "./appReducer";

export const setCurrentUser = (user: User | undefined) => async (dispatch: Dispatch<any>) => {
    dispatch(setUser(user));
};

export const sendError = (error: string) => async (dispatch: Dispatch<any>) => dispatch(setErrorData(error));

export const clearError = () => async (dispatch: Dispatch<any>) => dispatch(clearErrorData());
