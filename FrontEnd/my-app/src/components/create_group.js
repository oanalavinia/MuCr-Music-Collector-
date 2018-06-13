import React, {Component} from "react";
import Cookies from "universal-cookie";
import "./styles.css";
import {Redirect} from "react-router-dom";
import axios from "axios";


export default class create_group extends React.Component {
    constructor(props) {
        super(props);
        this.manage_input = this.manage_input.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {};
        this.cookies = new Cookies();
    }

    manage_input(event) {
        let inputs = this.state;
        inputs[event.target.name] = event.target.value;
        this.setState(inputs);
        console.log(this.state);
    }

    handleSubmit(event) {
        event.preventDefault();
        let params = this.state;


        let insert_data = {
            token: this.cookies.get("token"),
            name: params.name,
            description: params.description
        };


        const data = {
            url: "http://127.0.0.1:1234/registergroup",
            body: JSON.stringify(insert_data)
        };

        axios.post(data.url, data.body)
            .then((response) => {
                console.log(response);
                if (response.data.code && response.data.code === 1000) {
                    let current_state = this.state;
                    current_state.add_item_id=this.cookies.get("user_uid");
                    this.setState(current_state);
                }
                else {
                    alert("Invalid data");
                }

            })
            .catch((error) => {
                console.log(error);
                alert(JSON.stringify(error));
            });

    }

    render() {
        if (this.state.add_item_id && this.state.add_item_id !== undefined) {
            let redirect_url = "/getGroups/";
            return <Redirect to={redirect_url}/>;
        } else
        return (<div><h2>Create Group</h2>

            <form onSubmit={this.handleSubmit}>

                <p className="insert-p">Group name</p>
                <input type="text" id="name" name="name" onChange={(e) => this.manage_input(e)}
                       placeholder="Group name.."/>

                <p className="insert-p">Description</p>
                <textarea id="description" name="description" onChange={(e) => this.manage_input(e)}
                       placeholder="Description.."/>
                <input type="submit" value="Submit"/>
            </form>
        </div>)
    }
}

