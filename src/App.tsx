// q@ts-nocheck
/* qeslint-disable */
import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { GeoTech } from "@core/GeoTech";
import { getCurrentUser } from "./redux";
import Login from "./components/author/login/Login";
import Main from "./Main";

interface AppProps {
    geoTech: GeoTech;
}

const App = ({ geoTech }: AppProps) => {
    const currentUser = useSelector(getCurrentUser);

    useEffect(() => {
        if (currentUser) {
            if (!geoTech.mainViewer.geoTechMapViewer) {
                geoTech.mainViewer.createGeoTechMapViewer();
            }
        }
    }, [currentUser]);

    return (
        <Router>
            <Switch>
                <Route exact path="/signin" render={() => <Login />} />
                {
                    <Route exact path="/">
                        {!currentUser && <Redirect to="/signin" />}
                        <Main geoTech={geoTech} />
                    </Route>
                }
                <Route path="*" render={() => <Redirect to="/" />} />
            </Switch>
        </Router>
    );
};

export default App;
