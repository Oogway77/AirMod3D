// q@ts-nocheck
/* eslint-disable */

const link = document.createElement("a");

function save(blob: any, filename: string) {
    link.href = URL.createObjectURL(blob);
    link.download = filename || "data.json";
    link.dispatchEvent(new MouseEvent("click"));

    // URL.revokeObjectURL( url ); breaks Firefox...
}

function saveStringAsTextFile(text: string, filename: string) {
    save(new Blob([text], { type: "text/plain" }), filename);
}

export { saveStringAsTextFile };
