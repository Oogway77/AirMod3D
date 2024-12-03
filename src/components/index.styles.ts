// q@ts-nocheck
/* qeslint-disable */
import { createGlobalStyle } from "styled-components";
import { lmColorWhiteOne, dmColorGreyTen } from "./gui-variables.styles";

interface GlobalStylesProps {
    light?: boolean;
}

export const GlobalStyles = createGlobalStyle<GlobalStylesProps>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-size: 62.5% !important;
    font-family: "Montserrat", sans-serif !important;
    overflow: hidden;
  }


  input {
    font-family: inherit;
  }

  button {
    font-family: inherit;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${(props) => (props.light ? "#dae7f7" : "#343c44")};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${(props) => (props.light ? "#99acc2" : "rgb(103, 111, 128)")} ;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => (props.light ? "#b8cde6" : "#555")};
  }


  .cesium-viewer-toolbar {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 55px;
    top: 120px;
    opacity: 0;

    .cesium-baseLayerPicker-dropDown {
      right: 45px;
      z-index: 1000;
    }
  }

  .cesium-navigation-help {
    width: 250px!important;
    height: 219px!important;
    top: -100px!important;
  }

  .toolbar-container {
    opacity: 0;
  }


  .cesium-viewer-bottom {
    display: none;
  }

  .cesium-viewer {
    overflow: hidden;
  }

  .box-container {
    margin-left: 6rem;
    ${"" /* display: flex; */}
  }

  .box-1 {
    background-color: tomato;
    height: 200px;
    width: 200px;
  }

  .box-2 {
    background-color: green;
    height: 200px;
    width: 200px;
  }

  .box-3 {
    background-color: blue;
    height: 200px;
    width: 200px;
  }

  .pdf-to-print {
    max-width: 800px;
    height: 1050px;
    margin: 0 auto;

  }

  /* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
`;
