/* eslint-disable camelcase */
import { Cartesian3 } from "cesium";

export interface Site {
    city: string;
    entity_name: string;
    entity_number: string;
    state: string;
    zip_code: string;
}

export interface CapturedCameraProps {
    position: Cartesian3;
    heading: number;
    pitch: number;
    roll: number;
}

export enum POIType {
    STACK = "STACK",
    FLARE = "FLARE",
    FUGITIVE = "FUGITIVE",
    OTHER = "OTHER"
}

export enum POIEntityType {
    ENTITY = "ENTITY",
    EPN = "EPN"
}

export enum EntitySearchType {
    EPNS = "Has EPNs",
    ALL = "All"
}

export enum EntityShowType {
    ALL = "All POIs",
    ONLY_CURRENT_POI = "Show Only Current POI",
    ONLY_FAVORITES = "Show Only Favorite POIs"
}

export const allPOITypes = [POIType.STACK, POIType.FLARE, POIType.FUGITIVE, POIType.OTHER];

export const allPOIEntityTypes = [POIEntityType.ENTITY, POIEntityType.EPN];

// errHeightOfGoogle3DTiles = (actual height) - (height of google 3d tiles)
export const errHeightOfGoogle3DTiles = 0;
