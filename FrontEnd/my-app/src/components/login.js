import React, {Component} from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "./styles.css";
import {Redirect} from "react-router-dom"

export default class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', pass: '', raspLogin: 0};


        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value, pass: this.state.pass, raspLogin: this.state.raspLogin});
    }

    handleChangePass(event) {
        this.setState({email: this.state.email, pass: event.target.value, raspLogin: this.state.raspLogin});
    }

    handleSubmit(event) {
        event.preventDefault();
        var user_auth = {
            email: this.state.email,
            pass: this.state.pass
        };
        var data = {
            url: "http://127.0.0.1:1234/loginuser",
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "Content-Length": Buffer.byteLength(JSON.stringify(user_auth))
            },
            body: JSON.stringify(user_auth)
        };
        axios.post(data.url, data.body)
            .then((response) => {
                console.log(response);
                alert(JSON.stringify(response.data));
                if (response.data.token && response.data.token !== undefined) {
                    this.setState({email: this.state.email, pass: this.state.value, raspLogin: 1});
                    alert("Login cu succes");
                    const cookies = new Cookies();
                    cookies.set('token', response.data.token, {path: '/'});
                    //this.props.history.push("/getUser/a005b9cbc2f9d53d4db23b77715e11e1");
                    //return <Redirect to='/getUser/a005b9cbc2f9d53d4db23b77715e11e1'  />
                }
                else {
                    alert("Invalid login");
                }

            })
            .catch((error) => {
                console.log(error);
                alert(JSON.stringify(error));
            });

    }


    render() {
        if (this.state.raspLogin === 1)
            return <Redirect to='/getUser/a005b9cbc2f9d53d4db23b77715e11e1'/>;
        else
            return (
                <div className="row">
                    <div className="column">
                        <h2>Welcome!</h2>
                        <p>Another music lover! Welcome to the awesome club of having all of your beloved music in one
                            place
                            with
                            integration from MusicBrainz!</p>
                    </div>

                    <div className="column">
                        <div className="container">
                            <h2>Login</h2>

                            <div>

                                <form onSubmit={this.handleSubmit}>
                                    <label>
                                        Email:
                                        <input type="text" value={this.state.email} onChange={this.handleChangeEmail}/>
                                    </label>
                                    <label>
                                        Password:
                                        <input type="password" value={this.state.pass}
                                               onChange={this.handleChangePass}/>
                                    </label>
                                    <input type="submit" value="Submit"/>
                                </form>
                            </div>


                            <p styles="font-family:Antic;"> You don't have a user account?</p>

                            <form method="get" action="createAccount.html">
                                <button type="submit" className="button">Create user account</button>
                            </form>

                        </div>
                    </div>

                </div>

            );
    }
}

