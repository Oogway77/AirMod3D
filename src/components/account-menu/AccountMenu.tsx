import { useEffect, useState } from "react";

import { AccountMenuContainer } from "./account-menu.style";

const AccountMenu = () => {
    const [show, setShow] = useState(false);
    const [top, setTop] = useState(0);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const geoTech = window.geoTech;
        const user = geoTech.currentUser;

        setUserName(user.email);
        setUserId(user.email);

        setTop(geoTech.uiManager.getNavigationHeight());

        const onUserClicked = () => {
            setShow((prevShow) => !prevShow);
        };

        document.querySelector("calcite-navigation-user").addEventListener("click", onUserClicked);

        return () => {
            const navigationUser = document.querySelector("calcite-navigation-user");

            if (navigationUser) {
                navigationUser.removeEventListener("click", onUserClicked);
            }
        };
    });

    const doRender = () => {
        return (
            <AccountMenuContainer id="account-menu-conainer" top={top}>
                <div className="esri-header-account-content-info">
                    <span>
                        <span className="">
                            <img alt="" src="./img/no-user-thumb.jpg" className="esri-header-account-content-image" />
                        </span>
                    </span>
                    <span className="esri-header-account-content-name">{userName}</span>
                    <span className="esri-header-account-content-id">{userId}</span>
                    <span className="esri-header-account-content-group"> </span>
                </div>
                <ul className="esri-header-account-content-menu">
                    <li className="esri-header-account-content-item">
                        <a className="esri-header-account-content-link"> My Profile </a>
                    </li>
                    <li className="esri-header-account-content-item">
                        <a className="esri-header-account-content-link"> My Settings </a>
                    </li>
                    <li className="esri-header-account-content-item">
                        <a className="esri-header-account-content-link"> My Esri </a>
                    </li>
                    <li className="esri-header-account-content-item">
                        <a className="esri-header-account-content-link"> Training </a>
                    </li>
                    <li className="esri-header-account-content-item">
                        <a className="esri-header-account-content-link"> Community and Forums </a>
                    </li>
                    <li className="esri-header-account-content-item">
                        <a className="esri-header-account-content-link"> Help</a>
                    </li>
                </ul>
                <ul className="esri-header-account-signin-menu">
                    <li className="esri-header-account-signin-item">
                        <button className="esri-header-account-signin-control -switch">Switch Account</button>
                    </li>

                    <li className="esri-header-account-signin-item">
                        <button className="esri-header-account-signin-control -logout">Sign Out</button>
                    </li>
                </ul>
            </AccountMenuContainer>
        );
    };

    return <>{show && doRender()}</>;
};

export default AccountMenu;
