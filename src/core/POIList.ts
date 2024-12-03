import {
    BillboardCollection,
    BlendOption,
    Cartesian3,
    Cartographic,
    Entity,
    Color,
    Math as CesiumMath,
    PrimitiveCollection,
    Scene,
    Primitive,
    CloudCollection
} from "cesium";
import { Feature, FeatureCollection, GeoJSON, GeoJsonGeometryTypes, Point } from "geojson";
import { allPOITypes, POIType, Site, EntityShowType } from "./common";
import { POI } from "./POI";

interface ConstructorOptions {
    site: Site;
    geoJson: GeoJSON | undefined;
    scene: Scene;
}

export class POIList {
    private _site: Site;
    private _POIs: POI[];
    private _siteCoordinate: number[];

    private _billboardCollection: BillboardCollection;
    private _primitiveCollection: PrimitiveCollection;
    private _particleCollection: PrimitiveCollection;
    private _chimneyCollection: Primitive[];
    private _cloudCollection: CloudCollection;
    private _siteLabelEntity: Entity | undefined;

    constructor(options: ConstructorOptions) {
        this._site = options.site;
        this._POIs = [];
        this._siteCoordinate = [];

        const featureCollection = options.geoJson as FeatureCollection;

        this._primitiveCollection = options.scene.primitives.add(new PrimitiveCollection());
        this._particleCollection = options.scene.primitives.add(new PrimitiveCollection());
        this._chimneyCollection = [];

        this._billboardCollection = new BillboardCollection({
            blendOption: BlendOption.OPAQUE_AND_TRANSLUCENT
        });
        this._cloudCollection = options.scene.primitives.add(
            new CloudCollection({
                noiseDetail: 16.0,
                // @ts-ignore
                noiseOffset: Cartesian3.ZERO
            })
        );
        options.scene.primitives.add(this._billboardCollection);

        if (featureCollection) {
            for (let i = 0; i < featureCollection.features.length; i++) {
                const feature = featureCollection.features[i];

                // if (feature.properties!.id === "P-902A") {
                this.addPOIFromFeature(feature);
                // }
            }
        }
    }

    addSiteLabel(site: Site) {
        const viewer = window.geoTech.viewer;

        for (let i = 0; i < viewer.entities.values.length; i++) {
            const entity = viewer.entities.values[i];

            if (entity.properties && entity.properties.name && entity.properties.name.getValue() === site.entity_name) {
                return;
            }
        }

        this._siteLabelEntity = viewer.entities.add({
            name: site.entity_name,
            position: Cartesian3.fromDegrees(this.siteCoordinate[0], this.siteCoordinate[1]),
            label: {
                // eslint-disable-next-line
                text: site.entity_name.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }),
                backgroundColor: Color.RED.withAlpha(0.5),
                font: "14px arial",
                showBackground: true
            },
            properties: {
                type: "site",
                name: site.entity_name
            }
        });
    }

    addPOIFromFeature(feature: Feature) {
        const point = feature.geometry as Point;

        const poi = new POI({
            point: point || { type: "Point", coordinates: [0, 0] },
            properties: feature.properties,
            primitiveCollection: this._primitiveCollection,
            particleCollection: this._particleCollection,
            billboardCollection: this._billboardCollection,
            chimneyCollection: this._chimneyCollection,
            cloudCollection: this._cloudCollection
        });

        this._POIs.push(poi);

        return poi;
    }

    addPOIFromPOI(npoi: POI) {
        const poi = new POI({
            point: { type: "Point", coordinates: [npoi.longitude, npoi.latitude, npoi.height] },
            properties: npoi.properties,
            primitiveCollection: this._primitiveCollection,
            particleCollection: this._particleCollection,
            billboardCollection: this._billboardCollection,
            chimneyCollection: this._chimneyCollection,
            cloudCollection: this._cloudCollection
        });

        this._POIs.push(poi);
    }

    addPOIFromProperties(id: string, height: number, marker: string, position: Cartesian3) {
        const carto = Cartographic.fromCartesian(position);

        const lng = CesiumMath.toDegrees(carto.longitude);
        const lat = CesiumMath.toDegrees(carto.latitude);
        const bottomHeight = carto.height;

        const point = {
            type: "Point" as GeoJsonGeometryTypes,
            coordinates: [lng, lat, Number(height)]
        };

        const poi = new POI({
            point: point as Point,
            properties: {
                ID: id,
                Marker: marker,
                bottomHeight: bottomHeight
            },
            primitiveCollection: this._primitiveCollection,
            particleCollection: this._particleCollection,
            billboardCollection: this._billboardCollection,
            chimneyCollection: this._chimneyCollection,
            cloudCollection: this._cloudCollection
        });

        this._POIs.unshift(poi);
    }

    get pois() {
        return this._POIs;
    }

    get site() {
        return this._site;
    }

    get siteCoordinate() {
        return this._siteCoordinate;
    }

    set siteCoordinate(val: number[]) {
        this._siteCoordinate = val;
    }

    setVisible(value: boolean) {
        this._billboardCollection.show = value;
        this._primitiveCollection.show = value;
        this._particleCollection.show = value;
        if (this._siteLabelEntity) {
            this._siteLabelEntity.show = value;
        }

        this._chimneyCollection.forEach((pri) => {
            pri.show = value;
        });

        this._cloudCollection.show = value;
    }

    clearPrimitives() {
        const viewer = window.geoTech.viewer;

        this._billboardCollection.removeAll();
        this._primitiveCollection.removeAll();
        this._particleCollection.removeAll();
        this._cloudCollection.removeAll();

        const primitives = window.geoTech.scene.primitives;
        this._chimneyCollection.forEach((pri) => {
            primitives.remove(pri);
        });

        if (this._siteLabelEntity) {
            viewer.entities.remove(this._siteLabelEntity);
        }
    }

    getPOIFromPrimitive(primitive: any) {
        for (let i = 0; i < this._POIs.length; i++) {
            if (this._POIs[i].contained(primitive)) {
                return this._POIs[i];
            }
        }

        return undefined;
    }

    exportAsGeoJSON() {
        const features = [];

        for (let i = 0; i < this._POIs.length; i++) {
            features.push(this._POIs[i].exportAsGeoJSON());
        }

        return {
            type: "FeatureCollection",
            features: features
        };
    }

    setFilter(types: POIType[]) {
        for (let i = 0; i < this._POIs.length; i++) {
            const type = this._POIs[i].getType();

            this._POIs[i].showHide(false);

            for (let j = 0; j < types.length; j++) {
                if (type === types[j]) {
                    this._POIs[i].showHide(true);
                    break;
                }
            }

            if (!allPOITypes.includes(type)) {
                if (types.includes(POIType.OTHER)) {
                    this._POIs[i].showHide(true);
                }
            }
        }
    }

    setFilterWithCondition(type: EntityShowType) {
        for (let i = 0; i < this._POIs.length; i++) {
            this._POIs[i].showHide(true);
        }

        const poiManager = window.geoTech.poiManager;

        if (type === EntityShowType.ALL) {
            this.setFilter(poiManager.getClonedFilters());
            return;
        }

        if (type === EntityShowType.ONLY_CURRENT_POI) {
            for (let i = 0; i < this._POIs.length; i++) {
                if (this._POIs[i].id !== poiManager.currentPOI?.id) {
                    this._POIs[i].showHide(false);
                }
            }
        }

        if (type === EntityShowType.ONLY_FAVORITES) {
            for (let i = 0; i < this._POIs.length; i++) {
                if (!poiManager.favoritePOIs?.isFavorite(this.site.entity_number, this._POIs[i].id)) {
                    this._POIs[i].showHide(false);
                }
            }
        }
    }
}
