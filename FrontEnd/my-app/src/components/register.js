import React, {Component} from "react";
import axios from "axios";
import "./styles.css";
import {Redirect} from "react-router-dom"

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: '',
            city: "",
            pass: '',
            raspRegister: 0
        };
		
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handleCity = this.handleCity.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeEmail(event) {
        this.setState({
            email: event.target.value,
            pass: this.state.pass,
            raspRegister: this.state.raspRegister,
            username: this.state.username,
            city: this.state.city
        });
    }

    handleUsername(event) {
        this.setState({
            username: event.target.value,
            email: this.state.email,
            pass: this.state.pass,
            city: this.state.city,
            raspRegister: this.state.raspRegister
        });
    }

    handleCity(event) {
        this.setState({
            username: this.state.username,
            email: this.state.email,
            pass: this.state.pass,
            city: event.target.value,
            raspRegister: this.state.raspRegister
        });
    }

    handleChangePass(event) {
        this.setState({
            email: this.state.email,
            pass: event.target.value,
            raspRegister: this.state.raspRegister,
            username: this.state.username,
            city: this.state.city
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let user_register = this.state;
        delete user_register.raspRegister;
        const data = {
            url: "http://127.0.0.1:1234/registeruser",
            body: JSON.stringify(user_register)
        };
        axios.post(data.url, data.body)
            .then((response) => {
                if (response.data.code && response.data.code === 1000) {
                    this.setState({
                        email: this.state.email,
                        pass: this.state.pass,
                        raspRegister: 1,
                        username: this.state.username,
                        city: this.state.city
                    });
                }
                else {
                    alert(response.data.message);
                }

            })
            .catch((error) => {
                console.log(error);
                alert(JSON.stringify(error));
            });

    }


    render() {
        if (this.state.raspRegister === 1)
            return <Redirect to='/' />;
        else
            return (
                <div>
                    <h2>Create account</h2>
                    <div className="container">
                        <form onSubmit={this.handleSubmit}>
                            <label>Username</label>
                            <input type="text" value={this.state.username} onChange={this.handleUsername}
                                   placeholder="Your username.."/>

                            <label>Email adress</label>
                            <input type="text" value={this.state.email} onChange={this.handleChangeEmail}
                                   placeholder="Your email adress.."/>

                            <label >City</label>
                            <input type="text" value={this.state.city} onChange={this.handleCity}
                                   placeholder="Your city.."/>

                            <label>Password
                                <input type="password" value={this.state.pass} onChange={this.handleChangePass}
                                       placeholder="Introduce a valid password.."/> </label>
                            <input type="submit" value="Submit"/>
                        </form>
                    </div>
                    <p>*the password should contain at least 8 characters</p>
                </div>
            );
    }
}

