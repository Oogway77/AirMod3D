// q@ts-nocheck
/* qeslint-disable */
import { POI } from "@core";
import { User } from "@supabase/supabase-js";

export interface AppState {
    loading: boolean;
    user: User | undefined;
    error: string | null;
}

export interface POIState {
    activePOI: POI | undefined;
}

export interface SettingsState {
    visibleCloud: boolean;
}
