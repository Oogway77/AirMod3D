import {
    Billboard,
    BillboardCollection,
    Cartesian2,
    Cartesian3,
    Cartographic,
    CloudCollection,
    Color,
    Math as CesiumMath,
    Primitive,
    Transforms,
    CumulusCloud,
    Model,
    HeadingPitchRoll,
    PrimitiveCollection,
    Event,
    Matrix4,
    ParticleSystem,
    Ellipsoid
} from "cesium";
import { Point, GeoJsonProperties } from "geojson";
import { PolylinePrimitive } from "./PolylinePrimitive";
import { POIType } from "./common";
import markerPurple from "../assets/marker_purple.png";
import markerBlue from "../assets/marker_blue.png";
import markerGold from "../assets/marker_gold.png";
import markerRed from "../assets/marker_red.png";

interface ParticleCloudSimulationProps {
    windDirection: number;
    windSpeed: number;
    emissionSize: number;
}

interface POIConstructorOptions {
    point: Point;
    properties: GeoJsonProperties;
    primitiveCollection: PrimitiveCollection;
    particleCollection: PrimitiveCollection;
    billboardCollection: BillboardCollection;
    cloudCollection: CloudCollection;
    chimneyCollection: Primitive[];
}

const scratchScale = new Cartesian2();

export const defaultTopHeight = 100;
export class POI {
    private _longitude: number; // in degree
    private _latitude: number;
    private _bottomHeight: number; // not clamped when app is started
    private _height: number;
    private _chimneyHeight: number;
    private _favorite: boolean;
    private _options: POIConstructorOptions;
    private _particleCloudSimulationProps: ParticleCloudSimulationProps;

    private readonly _billboard: Billboard;
    private readonly _polylinePrimitive: PolylinePrimitive;
    private _chimneyPrimitive: Primitive | undefined;
    private _cloudPrimitive: CumulusCloud | undefined;
    private _particlePrimitive: ParticleSystem | undefined;
    private _removeEvent: Event.RemoveCallback | undefined;
    private readonly _properties: GeoJsonProperties;
    private readonly _color: Color;

    constructor(options: POIConstructorOptions) {
        this._options = options;
        const point = options.point;

        const longitude = point.coordinates[0];
        const latitude = point.coordinates[1];
        const height = point.coordinates[2];

        this._favorite = false;

        this._longitude = longitude;
        this._latitude = latitude;

        if (height) {
            this._height = height;
        } else {
            this._height = defaultTopHeight;
        }

        if (options.properties?.Height) {
            this._height = Number(options.properties?.Height);
        }

        if (options.properties.bottomHeight) {
            this._bottomHeight = options.properties.bottomHeight;
        } else {
            this._bottomHeight = -25;
        }

        const positions = [];

        positions.push(Cartesian3.fromDegrees(longitude, latitude, this._bottomHeight));
        positions.push(Cartesian3.fromDegrees(longitude, latitude, this._height + this._bottomHeight));

        this._color = Color.BLACK;

        this._polylinePrimitive = new PolylinePrimitive({
            positions: positions,
            color: this._color,
            width: 1.5,
            show: true,
            allowPicking: true
        });

        options.primitiveCollection.add(this._polylinePrimitive);

        this._chimneyHeight = 40;
        this._particleCloudSimulationProps = {
            windDirection: 0,
            windSpeed: 5,
            emissionSize: 9
        };
        this._addFlareStakes();
        // this._addSmokeCloud();
        this._addParticleCloud();

        const type = options.properties?.Marker;

        let marker = markerPurple;

        if (type === POIType.STACK) {
            marker = markerRed;
        }

        if (type === POIType.FLARE) {
            marker = markerGold;
        }

        if (type === POIType.FUGITIVE) {
            marker = markerBlue;
        }

        this._billboard = options.billboardCollection.add({
            position: Cartesian3.fromDegrees(longitude, latitude, this._height + this._bottomHeight),
            image: marker,
            pixelOffset: new Cartesian2(0, -20),
            width: 50,
            height: 50,
            scale: 0.8
        });

        this._properties = options.properties;
    }

    get properties() {
        return this._properties;
    }

    get favorite() {
        return this._favorite;
    }

    get longitude() {
        return this._longitude;
    }

    get latitude() {
        return this._latitude;
    }

    get height() {
        return this._height;
    }

    set favorite(val: boolean) {
        this._favorite = val;
    }

    set height(h: number) {
        this._height = h;

        this._update();
    }

    get bottomHeight() {
        return this._bottomHeight;
    }

    set bottomHeight(h: number) {
        this._bottomHeight = h;

        const positions = [];

        positions.push(Cartesian3.fromDegrees(this._longitude, this._latitude, this._bottomHeight));
        positions.push(Cartesian3.fromDegrees(this._longitude, this._latitude, this._height + this._bottomHeight));

        this._polylinePrimitive.positions = positions;
    }

    get billboard() {
        return this._billboard;
    }

    get polyline() {
        return this._polylinePrimitive;
    }

    async _addFlareStakes() {
        const primitives = window.geoTech.scene.primitives;
        const pos = Cartesian3.fromDegrees(this.longitude, this.latitude, this._bottomHeight);
        const poiHeight = this._height;
        const modelScale = poiHeight / this._chimneyHeight;

        const modelMatrix = Transforms.headingPitchRollToFixedFrame(pos, new HeadingPitchRoll(CesiumMath.toRadians(0)));

        const res = await Model.fromGltfAsync({
            id: "flare_stake",
            modelMatrix: modelMatrix,
            url: "/resources/flare.gltf",
            scale: modelScale
        });

        this._chimneyPrimitive = primitives.add(res);

        this._chimneyHeight = this._height;

        if (this._chimneyPrimitive) {
            this._options.chimneyCollection.push(this._chimneyPrimitive);
        }
    }

    async _addSmokeCloud() {
        const scene = window.geoTech.scene;
        const cloudParameters = {
            scaleWithMaximumSize: true,
            scaleX: 40,
            scaleY: 20,
            maximumSizeX: 50,
            maximumSizeY: 25,
            maximumSizeZ: 25,
            renderSlice: true, // if false, renders the entire surface of the ellipsoid
            slice: 0.36,
            brightness: 1.0
        };

        const cloundPosition = Cartesian3.fromDegrees(
            this.longitude,
            this.latitude,
            this._height + this._bottomHeight + 3
        );

        this._cloudPrimitive = this._options.cloudCollection.add({
            position: cloundPosition,
            scale: new Cartesian2(cloudParameters.scaleX, cloudParameters.scaleY),
            maximumSize: new Cartesian3(
                cloudParameters.maximumSizeX,
                cloudParameters.maximumSizeY,
                cloudParameters.maximumSizeZ
            ),
            color: Color.WHITE,
            slice: cloudParameters.renderSlice ? cloudParameters.slice : -1.0,
            brightness: cloudParameters.brightness
        });

        this._removeEvent = scene.preUpdate.addEventListener(() => {
            if (!this._cloudPrimitive) {
                return;
            }

            Cartesian2.clone(this._cloudPrimitive.scale, scratchScale);

            const delta = 0.1;

            scratchScale.x += delta;
            scratchScale.y += delta;

            if (scratchScale.x > 80 || scratchScale.y > 40) {
                scratchScale.x = 0;
                scratchScale.y = 0;
            }

            this._cloudPrimitive.scale = scratchScale;
        });
    }

    async _addParticleCloud() {
        const position = Cartesian3.fromDegrees(this.longitude, this.latitude, this._height + this._bottomHeight + 0.5);
        const modelMatrix = Transforms.headingPitchRollToFixedFrame(
            position,
            new HeadingPitchRoll(CesiumMath.toRadians(0))
        );

        const ParticleImageURL = "/resources/images/smoke.png";

        const particleSystemParameters = {
            emissionRate: 10.0,
            gravity: 1,
            minimumParticleLife: 1.2,
            maximumParticleLife: 1.2,
            minimumSpeed: 1.0,
            maximumSpeed: 4.0,
            startScale: 1.0,
            endScale: 5.0,
            particleSize: 10.0,
            speed: 0.0,
            particleLife: 5.0,
            length: 30
        };

        const applyGravityAndWind = (particles: any, windSpeed: number, windDirection: number, dt: number) => {
            const length = particleSystemParameters.length * dt;
            // Calculate the displacement based on wind speed and direction
            const ellipsoid = Ellipsoid.WGS84;
            const ENU = new Matrix4();
            Transforms.eastNorthUpToFixedFrame(particles.position, ellipsoid, ENU);

            const windDirectionRad = CesiumMath.toRadians(windDirection);
            const displacement = new Cartesian3();

            const phi = Math.atan(windSpeed / length);
            displacement.x = length * Math.sin(phi) * Math.sin(windDirectionRad); // Adjust x-axis based on wind direction
            displacement.y = length * Math.sin(phi) * Math.cos(windDirectionRad); // Adjust y-axis based on wind direction
            displacement.z = length * Math.cos(phi);

            // Update position2 of the polyline
            particles.position = Matrix4.multiplyByPoint(ENU, displacement, new Cartesian3());
        };

        this._particlePrimitive = this._options.particleCollection.add(
            new ParticleSystem({
                image: ParticleImageURL,
                startColor: Color.WHITE.withAlpha(0.7),
                endColor: Color.WHITE.withAlpha(0.1),
                startScale: 1.0,
                endScale: 5.0,
                particleLife: particleSystemParameters.particleLife,
                speed: particleSystemParameters.speed,
                lifetime: particleSystemParameters.particleLife,
                sizeInMeters: true,
                imageSize: new Cartesian2(particleSystemParameters.particleSize, particleSystemParameters.particleSize),
                updateCallback: (particles, dt) => {
                    const { windSpeed, windDirection } = this._particleCloudSimulationProps;
                    applyGravityAndWind(particles, windSpeed, windDirection, dt);
                }
            })
        );

        if (this._particlePrimitive) {
            this._particlePrimitive.modelMatrix = modelMatrix;
            const visibleEmissionCloud = window.geoTech.poiManager.visibleEmissionCloud;
            this._particlePrimitive.show = visibleEmissionCloud;
        }
    }

    _update() {
        const positions = [];

        positions.push(Cartesian3.fromDegrees(this._longitude, this._latitude, this._bottomHeight));
        positions.push(Cartesian3.fromDegrees(this._longitude, this._latitude, this._height + this._bottomHeight));

        this._polylinePrimitive.positions = positions;

        this._billboard.position = Cartesian3.fromDegrees(
            this._longitude,
            this._latitude,
            this._height + this._bottomHeight
        );

        // const primitives = window.geoTech.scene.primitives;
        // const pos = Cartesian3.fromDegrees(this.longitude, this.latitude, this._bottomHeight);
        let poiHeight = this._height;
        let modelHeight = this._chimneyHeight;
        let modelScale = 1;

        if (modelHeight === 0) {
            modelHeight = 0.1;
        }

        if (poiHeight === 0) {
            poiHeight = 0.1;
        }

        modelScale = poiHeight / modelHeight;

        const newScale = new Cartesian3(modelScale, modelScale, modelScale);

        if (this._chimneyPrimitive) {
            Matrix4.multiplyByScale(this._chimneyPrimitive.modelMatrix, newScale, this._chimneyPrimitive.modelMatrix);
        }

        if (this._cloudPrimitive) {
            const cloundPosition = Cartesian3.fromDegrees(
                this.longitude,
                this.latitude,
                this._height + this._bottomHeight + 6
            );
            this._cloudPrimitive.position = cloundPosition;
        }

        this._chimneyHeight = poiHeight;

        const particlePosition = Cartesian3.fromDegrees(
            this.longitude,
            this.latitude,
            this._height + this._bottomHeight + 0.5
        );
        const modelMatrix = Transforms.headingPitchRollToFixedFrame(
            particlePosition,
            new HeadingPitchRoll(CesiumMath.toRadians(0))
        );

        if (this._particlePrimitive) {
            this._particlePrimitive.modelMatrix = modelMatrix;
        }
    }

    contained(primitive: any) {
        if (Object.is(primitive, this._polylinePrimitive.primitive)) {
            return true;
        }

        if (Object.is(primitive, this._billboard)) {
            return true;
        }

        return false;
    }

    highlight() {
        this._polylinePrimitive.color = Color.YELLOW;
        this._polylinePrimitive.width = 3;
        this._billboard.scale = 1;
    }

    dehighlight() {
        this._polylinePrimitive.color = this._color;
        this._polylinePrimitive.width = 1.5;
        this._billboard.scale = 0.8;
    }

    async changePosition(position: Cartesian3) {
        const carto = Cartographic.fromCartesian(position);
        const longitude = CesiumMath.toDegrees(carto.longitude);
        const latitude = CesiumMath.toDegrees(carto.latitude);

        this._longitude = longitude;
        this._latitude = latitude;
        this._bottomHeight = carto.height;

        const positions = [];

        positions.push(Cartesian3.fromDegrees(longitude, latitude, carto.height));
        positions.push(Cartesian3.fromDegrees(longitude, latitude, this._height + this._bottomHeight));

        this._polylinePrimitive.positions = positions;

        this._billboard.position = Cartesian3.fromDegrees(longitude, latitude, this._height + this._bottomHeight);

        const primitives = window.geoTech.scene.primitives;
        const pos = Cartesian3.fromDegrees(this.longitude, this.latitude, this._bottomHeight);
        const poiHeight = this._height;
        this._chimneyHeight = 40;
        const modelScale = poiHeight / this._chimneyHeight;

        const modelMatrix = Transforms.headingPitchRollToFixedFrame(pos, new HeadingPitchRoll(CesiumMath.toRadians(0)));

        if (this._chimneyPrimitive) {
            primitives.remove(this._chimneyPrimitive);
        }

        this._chimneyPrimitive = primitives.add(
            await Model.fromGltfAsync({
                id: "flare_stake",
                modelMatrix: modelMatrix,
                url: "/resources/flare.gltf",
                scale: modelScale
            })
        );

        if (this._chimneyPrimitive) {
            this._options.chimneyCollection.push(this._chimneyPrimitive);
        }

        this._chimneyHeight = this._height;

        if (this._cloudPrimitive) {
            const cloundPosition = Cartesian3.fromDegrees(
                this.longitude,
                this.latitude,
                this._height + this._bottomHeight + 6
            );
            this._cloudPrimitive.position = cloundPosition;
        }

        const particlePosition = Cartesian3.fromDegrees(
            this.longitude,
            this.latitude,
            this._height + this._bottomHeight + 0.5
        );
        const modelMatrix1 = Transforms.headingPitchRollToFixedFrame(
            particlePosition,
            new HeadingPitchRoll(CesiumMath.toRadians(0))
        );

        if (this._particlePrimitive) {
            this._particlePrimitive.modelMatrix = modelMatrix1;
        }
    }

    setVisibleEmissionCloud(val: boolean) {
        if (this._particlePrimitive) {
            this._particlePrimitive.show = val;
        }
    }

    changePrticleCloudSimulationProps(props: ParticleCloudSimulationProps) {
        this._particleCloudSimulationProps = props;

        if (this._particlePrimitive) {
            // if (props.emissionSize === 0) {
            //     this.setVisibleEmissionCloud(false);
            // } else {
            //     this.setVisibleEmissionCloud(true);
            // }
            const particleSystemParameters = {
                emissionRate: 10.0,
                gravity: 1,
                minimumParticleLife: 1.2,
                maximumParticleLife: 1.2,
                minimumSpeed: 1.0,
                maximumSpeed: 4.0,
                startScale: 1.0,
                endScale: 5.0,
                particleSize: 10.0,
                speed: 0.0,
                particleLife: 5.0,
                length: 30
            };
            this._particlePrimitive.maximumImageSize = new Cartesian2(
                particleSystemParameters.particleSize * (props.emissionSize / 9),
                particleSystemParameters.particleSize * (props.emissionSize / 9)
            );
            this._particlePrimitive.lifetime = particleSystemParameters.particleLife * (props.emissionSize / 9);
        }
    }

    exportAsGeoJSON() {
        if (this._height < 0) {
            console.warn("invalid height detected.", this._properties);
        }

        this._properties.bottomHeight = this._bottomHeight;

        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [this._longitude, this._latitude, this._height]
            },
            properties: this.properties
        };
    }

    get id() {
        return this._properties!.ID;
    }

    getPosition(result: Cartesian3) {
        Cartesian3.clone(this._billboard.position, result);

        return result;
    }

    getEmissionPosition() {
        const pos = Cartesian3.fromDegrees(this.longitude, this.latitude, this._height + this._bottomHeight + 3);
        return pos;
    }

    getEmissionPosition1() {
        const pos = Cartesian3.fromDegrees(this.longitude, this.latitude, this._height + this._bottomHeight + 20);
        return pos;
    }

    getPropertiesForUI() {
        const properties = {
            ID: this.id,
            longitude: this.longitude,
            latitude: this.latitude,
            Height: this.height
        };

        // eslint-disable-next-line array-callback-return
        Object.entries(this.properties || {}).map(([key, value]) => {
            if (key === "id") {
                return;
            }

            if (key === "Height") {
                return;
            }

            if (key === "bottomHeight") {
                return;
            }

            properties[key] = value;
        });

        if (this.properties!.details) {
            // @ts-ignore
            properties.details = this.properties.details;
        }

        return properties;
    }

    getType() {
        return this._properties!.Marker!;
    }

    showHide(show: boolean) {
        this._billboard.show = show;
        this._polylinePrimitive.show = show;
        if (this._particlePrimitive) {
            if (window.geoTech.poiManager.visibleEmissionCloud) {
                this._particlePrimitive.show = show;
            }
        }

        if (this._chimneyPrimitive) {
            this._chimneyPrimitive.show = show;
        }

        if (this._cloudPrimitive) {
            this._cloudPrimitive.show = show;
        }
    }

    getShow() {
        return this._billboard.show;
    }

    getVerticalLength() {
        return this._height;
    }

    setVerticalLength(l: number) {
        this._height = l;

        this._update();
    }
}
