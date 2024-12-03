import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { GeoTech } from "@core/GeoTech";
import App from "./App";
import store from "./redux/store";

export default function render(geoTech: GeoTech) {
    const root = ReactDOM.createRoot(document.getElementById(geoTech.rootElementId) as HTMLElement);

    root.render(
        <Provider store={store}>
            <App geoTech={geoTech} />
        </Provider>
    );
}
