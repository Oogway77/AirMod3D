import "./index.scss";
import { GeoTech } from "@core/GeoTech";
import render from "./render";

import { setAssetPath } from "@esri/calcite-components/dist/components";

import "@esri/calcite-components/dist/calcite/calcite.css";
setAssetPath("https://js.arcgis.com/calcite-components/1.2.0/assets");

const geoTech = new GeoTech();
window.geoTech = geoTech;

geoTech.start();

render(geoTech);
