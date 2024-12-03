// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

interface Props {
    top: number; // px
}

const gap = 3;

export const AccountMenuContainer = styled.div<Props>`
    position: absolute;
    top: ${(props) => props.top + gap}px;
    right: 0;
    z-index: 10000;

    @media (min-width: 768px) {
        min-width: 410px;
        max-width: 410px;
        padding-top: 48px;
        display: flex;
        flex-wrap: wrap;
    }

    background-color: #f8f8f8;

    @media (min-width: 768px) {
        [dir="ltr"] .esri-header-account-content-menu {
            padding-left: 10px;
        }
    }

    @media (min-width: 768px) {
        .esri-header-account-content-menu {
            width: 50%;
        }
    }

    @media (min-width: 768px) {
        .esri-header-account-content-info {
            width: 50%;
        }
    }

    .esri-header-account-content-image {
        border-radius: 50%;
        box-shadow:
            0 0 0 2px #fff,
            0 0 0 6px #0079c1;
        margin-bottom: 20px;
        margin-left: auto;
        margin-right: auto;
        width: 122px;
        height: 122px;
    }

    .esri-header-account-content-info {
        display: flex;
        flex-direction: column;
        margin-bottom: 40px;
        text-align: center;
    }

    .esri-header-account-content-menu {
        list-style-type: none;
        margin-top: 0;
        margin-bottom: 0;
        padding-right: 0;
        padding-left: 0;
    }

    .esri-header-account-content-name {
        color: #000;
        font-size: 18px;
        line-height: 25px;
        font-weight: 500;
        margin-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        word-wrap: break-word;
    }

    .esri-header-account-content-id {
        margin-bottom: 5px;
        padding-left: 10px;
        padding-right: 10px;
        word-wrap: break-word;
    }

    .esri-header-account-content-link {
        color: #0079c1;
        display: inline-block;
        font-size: 16px;
        line-height: 20px;
        padding: 5px 0;
        position: relative;
        max-width: calc(100% - 24px);
    }

    .esri-header-account-signin-menu {
        display: flex;
    }

    .esri-header-account-signin-menu {
        list-style-type: none;
        margin-top: 0;
        margin-bottom: 0;
        padding-right: 0;
        padding-left: 0;
        width: 100%;
    }

    @media (min-width: 768px) {
        .esri-header-account-signin-item {
            width: 50%;
        }
    }

    @media (min-width: 768px) {
        .esri-header-account-signin-control {
            width: 100%;
        }
    }

    .esri-header-account-signin-control {
        background-color: transparent;
        border-width: 0;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        padding: 0;
        box-shadow: inset 0 0 0 1px #0079c1;
        display: block;
        cursor: pointer;
        font-size: 17px;
        line-height: 20px;
        padding: 15px;
        transition:
            background-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        height: 100%;
    }

    .esri-header-account-signin-control.-logout {
        color: #0079c1;
    }

    .esri-header-account-signin-control.-switch {
        color: #fff;
        background-color: #0079c1;
    }
`;
