import { Site, CapturedCameraProps } from "./common";
import { POI } from "./POI";

interface FavoriteCPOI {
    poi: POI;
    changedId: string;
    cameraProps: CapturedCameraProps;
}

interface FavoriteEntity {
    fpois: FavoriteCPOI[];
    site: Site;
}

interface ConstructorOptions {
    entities: FavoriteEntity[];
}

export class FavoritePOIs {
    private _entities: FavoriteEntity[];

    constructor(options: ConstructorOptions) {
        this._entities = options.entities;
    }

    get entities() {
        return this._entities;
    }

    addFavoritePOI(site: Site, poi: POI, changedId: string, cameraProps: CapturedCameraProps) {
        const siteExist = this._entities.filter((entity) => entity.site.entity_number === site.entity_number);

        if (siteExist.length > 0) {
            const poiExist = siteExist[0].fpois.filter((fpoi) => fpoi.poi.id === poi.id);

            if (poiExist.length < 1) {
                siteExist[0].fpois.push({ poi, changedId, cameraProps });
            }
        } else {
            const tpoilist: FavoriteCPOI[] = [];
            tpoilist.push({ poi, changedId, cameraProps });
            this._entities.push({
                site: site,
                fpois: tpoilist
            });
        }
    }

    removeFavoritePOI(siteNumber: string, poiId: string) {
        const selectedEntity = this._entities.filter((entity) => entity.site.entity_number === siteNumber);

        if (selectedEntity.length > 0) {
            if (selectedEntity[0].fpois.length === 1) {
                this._entities = this._entities.filter(
                    (entity) => entity.site.entity_number !== selectedEntity[0].site.entity_number
                );
            } else if (selectedEntity[0].fpois.length > 1) {
                selectedEntity[0].fpois = selectedEntity[0].fpois.filter((fpoi) => fpoi.poi.id !== poiId);
            }
        }
    }

    updateFavoritePOI(siteNumber: string, poiId: string, changedId: string, cameraProps: CapturedCameraProps) {
        const selectedEntity = this._entities.filter((entity) => entity.site.entity_number === siteNumber);

        if (selectedEntity.length > 0) {
            selectedEntity[0].fpois.forEach((fpoi) => {
                if (fpoi.poi.id === poiId) {
                    fpoi.changedId = changedId;
                    fpoi.cameraProps = cameraProps;
                }
            });
        }
    }

    isFavorite(siteNumber: string, poiId: string) {
        const res = this._entities.filter(
            (entity) =>
                entity.site.entity_number === siteNumber &&
                entity.fpois.filter((fpoi) => fpoi.poi.id === poiId).length > 0
        );

        if (res.length > 0) return true;

        return false;
    }
}
