// q@ts-nocheck
/* qeslint-disable */
import { useEffect } from "react";
import { Redirect } from "react-router-dom";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSelector } from "react-redux";
import { useActions } from "../../../hooks/useActions";
import { getCurrentUser } from "../../../redux";

const Login = () => {
    const geoTech = window.geoTech;
    const supabase = geoTech.supabase;

    const currentUser = useSelector(getCurrentUser);
    const { setCurrentUser } = useActions();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                geoTech.currentUser = session.user;
                setCurrentUser(session.user);
            }
        });

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                geoTech.currentUser = session.user;
                setCurrentUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!currentUser) {
        return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
    } else {
        return <Redirect to="/" />;
    }
};

export default Login;
