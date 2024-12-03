/* qeslint-disable */
// q@ts-nocheck
import { Document, NodeIO, Primitive } from "@gltf-transform/core";

export const generateGLTF = async () => {
    const document = new Document();
    const buffer = document.createBuffer();
    const position = document
        .createAccessor()
        .setType("VEC3")
        .setBuffer(buffer)
        .setArray(
            new Float32Array([
                0,
                0,
                0, // ax,ay,az
                0,
                0,
                1, // bx,by,bz
                0,
                1,
                0, // ...
                1,
                0,
                0
            ])
        );
    const color = document
        .createAccessor()
        .setType("VEC4")
        .setBuffer(buffer)
        .setNormalized(true)
        .setArray(new Uint8Array([0, 0, 0, 255, 0, 0, 255, 255, 0, 255, 0, 255, 255, 0, 0, 255]));
    const prim = document
        .createPrimitive()
        .setMode(Primitive.Mode.POINTS)
        .setAttribute("POSITION", position)
        .setAttribute("COLOR_0", color);
    const mesh = document.createMesh().addPrimitive(prim);
    const node = document.createNode().setMesh(mesh);
    const scene = document.createScene().addChild(node);
    document.getRoot().setDefaultScene(scene);
    const io = new NodeIO();
    const res = await io.writeJSON(document);
    return res;
};
