import { Site, CapturedCameraProps } from "@core/common";

export interface SelectInputDataItem {
    value: string | number;
    label: string;
}

interface FavoritePOIwithCameraView {
    poiID: string;
    changedID: string;
    cameraProps: CapturedCameraProps;
}

export interface FavoritePOIsData {
    site: Site;
    poiIDs: FavoritePOIwithCameraView[];
}
