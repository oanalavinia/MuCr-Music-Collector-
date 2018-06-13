import React, {Component} from "react";
import "./styles.css";
import Cookies from "universal-cookie";
import {Redirect} from "react-router-dom";

export default class logout extends React.Component {
    constructor(props) {
        super(props);
        this.cookies = new Cookies();
        this.cookies.remove("token",{path: '/'});
        this.cookies.remove("user_uid",{path: '/'});

    }
    render() {
        return (<Redirect to='/'/>);
    }
}
