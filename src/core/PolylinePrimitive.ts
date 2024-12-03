// q@ts-nocheck
/* qeslint-disable */
import {
    ArcType,
    BoundingSphere,
    Cartesian3,
    Color,
    ColorGeometryInstanceAttribute,
    createGuid,
    defaultValue,
    defined,
    destroyObject,
    DeveloperError,
    Ellipsoid,
    // @ts-ignore
    FrameState,
    GeometryInstance,
    GroundPolylineGeometry,
    GroundPolylinePrimitive,
    Material,
    Math as CesiumMath,
    Matrix4,
    PolylineColorAppearance,
    PolylineGeometry,
    PolylineMaterialAppearance,
    Primitive
} from "cesium";

declare type PolylinePrimitiveConstructorOptions = {
    show?: boolean;
    ellipsoid?: Ellipsoid;
    width?: number;
    color?: Color;
    dashed?: boolean;
    positions?: Cartesian3[];
    loop?: boolean;
    depthTest?: boolean;
    clampToGround?: boolean;
    arrow?: boolean;
    allowPicking?: boolean;
};

export class PolylinePrimitive {
    private _id: string;
    private _color: Color;
    private _positions: Cartesian3[];
    private _boundingSphere: BoundingSphere;
    private _transformedBoundingSphere: BoundingSphere;
    private _primitive: Primitive | GroundPolylinePrimitive | undefined;
    private _update: boolean;
    private _dashed: boolean;
    private _depthTest: boolean;
    private _loop: boolean;
    private _width: number;
    private _ellipsoid: Ellipsoid;
    private _show: boolean;
    private _clampToGround: boolean;
    private readonly _modelMatrix: Matrix4;
    private _isArrow: boolean;
    private readonly _allowPicking: boolean;

    constructor(options: PolylinePrimitiveConstructorOptions) {
        this._show = defaultValue(options.show, true);

        this._ellipsoid = defaultValue(options.ellipsoid, Ellipsoid.WGS84);
        const isArrow = defaultValue(options.arrow, false);

        if (options.width) {
            this._width = options.width;
        } else {
            this._width = isArrow ? 5 : 3;
        }

        this._isArrow = isArrow;

        this._color = Color.clone(defaultValue(options.color, Color.WHITE));
        this._id = createGuid();

        this._primitive = undefined;

        this._dashed = defaultValue(options.dashed, false);
        this._loop = defaultValue(options.loop, false);

        const positions = defaultValue(options.positions, []);

        this._positions = positions;

        if (positions.length > 0) {
            this._boundingSphere = BoundingSphere.fromPoints(this._positions);
        } else {
            this._boundingSphere = new BoundingSphere();
        }

        this._transformedBoundingSphere = BoundingSphere.clone(this._boundingSphere);

        this._depthTest = defaultValue(options.depthTest, false);
        this._clampToGround = defaultValue(options.clampToGround, false);
        this._update = true;
        this._allowPicking = defaultValue(options.allowPicking, false);
        this._modelMatrix = Matrix4.clone(Matrix4.IDENTITY);
    }

    get positions() {
        return this._positions;
    }

    set positions(positions) {
        this._positions = positions;
        this._update = true;
    }

    get color() {
        return this._color;
    }

    set color(color: Color) {
        this._color = color;
        this._update = true;
    }

    get boundingVolume() {
        return this._transformedBoundingSphere;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this._update = true;
    }

    get ellipsoid() {
        return this._ellipsoid;
    }

    get dashed() {
        return this._dashed;
    }

    get loop() {
        return this._loop;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get show() {
        return this._show;
    }

    set show(show) {
        this._show = show;
    }

    get clampToGround() {
        return this._clampToGround;
    }

    set clampToGround(val: boolean) {
        this._clampToGround = val;
        this._update = true;
    }

    get modelMatrix() {
        return this._modelMatrix;
    }

    set modelMatrix(value: Matrix4) {
        if (Matrix4.equalsEpsilon(value, this._modelMatrix, CesiumMath.EPSILON10)) {
            return;
        }

        Matrix4.clone(value, this._modelMatrix);
        this._update = true;
    }

    insertPosition(index: number, position: Cartesian3) {
        this._positions.splice(index, 0, position);

        this._update = true;
    }

    updatePosition(index: number, position: Cartesian3) {
        if (index >= this._positions.length) {
            throw new DeveloperError("invalid point index");
        }

        position.clone(this._positions[index]);
        this._update = true;
    }

    forceUpdate() {
        this._update = true;
    }

    update(frameState: FrameState) {
        if (!this._show) {
            return;
        }

        let positions = this._positions;

        if (!defined(positions) || positions.length < 2) {
            if (this._primitive) {
                this._primitive.destroy();
                this._primitive = undefined;
            }

            return;
        }

        if (this._update) {
            this._update = false;
            this._id = this.id;

            if (this._primitive) this._primitive.destroy();

            if (this._loop) {
                positions = positions.slice();
                positions.push(positions[0]);
            }

            let geometry;

            if (this._clampToGround) {
                geometry = new GroundPolylineGeometry({
                    positions: positions,
                    width: this.width,
                    // @ts-ignore
                    vertexFormat: PolylineMaterialAppearance.VERTEX_FORMAT,
                    ellipsoid: this._ellipsoid,
                    arcType: ArcType.GEODESIC
                });
            } else {
                geometry = new PolylineGeometry({
                    positions: positions,
                    width: this.width,
                    vertexFormat: PolylineMaterialAppearance.VERTEX_FORMAT,
                    ellipsoid: this._ellipsoid,
                    arcType: ArcType.NONE
                });
            }

            let appearance;
            if (this._dashed) {
                appearance = new PolylineMaterialAppearance({
                    material: Material.fromType(Material.PolylineDashType, {
                        color: this._color
                    })
                });
            } else if (this._isArrow) {
                appearance = new PolylineMaterialAppearance({
                    material: Material.fromType(Material.PolylineArrowType, {
                        color: this._color
                    })
                });
            } else {
                appearance = new PolylineColorAppearance();
            }

            const modelMatrix = this._modelMatrix;

            if (this._clampToGround) {
                this._primitive = new GroundPolylinePrimitive({
                    geometryInstances: new GeometryInstance({
                        geometry: geometry,
                        attributes: {
                            color: ColorGeometryInstanceAttribute.fromColor(this._color),
                            depthFailColor: ColorGeometryInstanceAttribute.fromColor(this._color)
                        },
                        id: this._id
                    }),
                    appearance: appearance,
                    // @ts-ignore
                    depthFailAppearance: this._depthTest ? undefined : appearance,
                    asynchronous: false,
                    allowPicking: this._allowPicking,
                    debugShowBoundingVolume: false,
                    debugShowShadowVolume: false,
                    modelMatrix: modelMatrix
                });
            } else {
                this._primitive = new Primitive({
                    geometryInstances: new GeometryInstance({
                        geometry: geometry,
                        attributes: {
                            color: ColorGeometryInstanceAttribute.fromColor(this._color),
                            depthFailColor: ColorGeometryInstanceAttribute.fromColor(this._color)
                        },
                        id: this.id
                    }),
                    appearance: appearance,
                    depthFailAppearance: this._depthTest ? undefined : appearance,
                    asynchronous: false,
                    allowPicking: this._allowPicking,
                    modelMatrix: modelMatrix
                });
            }

            this._boundingSphere = BoundingSphere.fromPoints(positions, this._boundingSphere);
            this._transformedBoundingSphere = BoundingSphere.transform(
                this._boundingSphere,
                modelMatrix,
                this._transformedBoundingSphere
            );
        }

        // @ts-ignore
        this._primitive!.update(frameState);
    }

    // eslint-disable-next-line class-methods-use-this
    isDestroyed() {
        return false;
    }

    destroy() {
        if (this._primitive) this._primitive.destroy();

        return destroyObject(this);
    }

    get primitive() {
        return this._primitive;
    }
}
