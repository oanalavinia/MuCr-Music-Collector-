import React, {Component} from "react";
import Cookies from "universal-cookie";
import "./styles.css";
import {Redirect} from "react-router-dom";
import axios from "axios";

export default class add_item extends React.Component {
    constructor(props) {
        super(props);
        this.add_collections = this.add_collections.bind(this);
        this.add_concerts = this.add_concerts.bind(this);
        this.manage_input = this.manage_input.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {};
        this.cookies = new Cookies();
        const component_links = {
            collections: this.add_collections,
            concerts: this.add_concerts
        };
        const default_subtype = {
            collections: "vinyl",
            concerts: "seen"
        };
        if (props.match.params.type && (props.match.params.type === "collections" || props.match.params.type === "concerts")) {
            this.type = props.match.params.type;
            this.state = {type: this.type, subtype: default_subtype[this.type]};
            console.log(this.state);
            this.component = component_links[this.type]();
        }
        else
            this.component = add_item.error_components("invalid");

        if (this.cookies.get("token") === undefined)
            this.component = add_item.error_components("unauthorized");
    }

    manage_input(event) {
        let inputs = this.state;
        inputs[event.target.name] = event.target.value;
        this.setState(inputs);
        console.log(this.state);
    }

    static error_components(reason) {
        let atr = {
            "invalid": (<div><p>Invalid type</p></div>),
            "unauthorized": (<Redirect to='/'/>)
        };
        return atr[reason];
    }

    add_collections() {
        return (<div>
            <h2>Add to collections</h2>

            <form onSubmit={this.handleSubmit}>

                <p className="search-p">Type</p>
                <div className="search-box">
                    <select name="subtype" onChange={(e) => this.manage_input(e)}>
                        <option value="vinyl">Vinyls</option>
                        <option value="cassette">Cassettes</option>
                        <option value="tapes">Tapes</option>
                    </select>
                </div>

                <p className="insert-p">Artist</p>
                <input type="text" id="artistName" name="artistName" onChange={(e) => this.manage_input(e)}
                       placeholder="Artist name.."/>

                <p className="insert-p">Album</p>
                <input type="text" id="albumName" name="albumName" onChange={(e) => this.manage_input(e)}
                       placeholder="Album name.."/>

                <p className="insert-p">Diameter(inch)</p>
                <input type="text" id="diameter" name="diameter" onChange={(e) => this.manage_input(e)}
                       placeholder="Diameter.."/>

                <p className="insert-p">Rotational speed(rpm)</p>
                <input type="text" id="rotationaSpeed" onChange={(e) => this.manage_input(e)} name="rotationaSpeed"
                       placeholder="Rotational speed.."/>

                <p className="insert-p">Number of audio chanels</p>
                <input type="text" id="nrChanels" name="nrChanels" onChange={(e) => this.manage_input(e)}
                       placeholder="Number of chanels.."/>

                <p className="insert-p">Weight(g)</p>
                <input type="text" id="weight" name="weight" onChange={(e) => this.manage_input(e)}
                       placeholder="Weight.."/>

                <p className="insert-p">Seniority</p>
                <input type="text" id="seniority" name="seniority" onChange={(e) => this.manage_input(e)}
                       placeholder="Seniority.."/>

                <p className="insert-p">Quality</p>
                <input type="text" id="quality" name="quality" onChange={(e) => this.manage_input(e)}
                       placeholder="Quality.."/>
                <input type="submit" value="Submit"/>
            </form>
        </div>)
    }

    add_concerts() {
        return (<div><h2>Add to concerts</h2>

            <form onSubmit={this.handleSubmit}>

                <p className="search-p">Type</p>
                <div className="search-box">
                    <select name="subtype" onChange={(e) => this.manage_input(e)}>
                        <option value="seen">Seen concerts</option>
                        <option value="tickets">Tickets</option>
                        <option value="autographs">Autographs</option>
                    </select>
                </div>

                <p className="insert-p">Format</p>
                <input type="text" id="format" name="format" onChange={(e) => this.manage_input(e)}
                       placeholder="Format.."/>

                <p className="insert-p">Gender</p>
                <input type="text" id="gender" name="gender" onChange={(e) => this.manage_input(e)}
                       placeholder="Gender.."/>

                <p className="insert-p">Artists</p>
                <input type="text" id="artists" name="artists" onChange={(e) => this.manage_input(e)}
                       placeholder="Artists.."/>

                <p className="insert-p">Year</p>
                <input type="text" id="year" name="year" onChange={(e) => this.manage_input(e)} placeholder="Year.."/>

                <p className="insert-p">City</p>
                <input type="text" id="city" name="city" onChange={(e) => this.manage_input(e)} placeholder="City.."/>
                <input type="submit" value="Submit"/>
            </form>
        </div>)
    }

    handleSubmit(event) {
        event.preventDefault();
        let params = this.state;


        let insert_data = {
            token: this.cookies.get("token"),
            type: this.state.type,
            subtype: this.state.subtype,
            data: params
        };

        delete insert_data.data.type;
        delete insert_data.data.subtype;

        const data = {
            url: "http://127.0.0.1:1234/addisc",
            body: JSON.stringify(insert_data)
        };

        axios.post(data.url, data.body)
            .then((response) => {
                console.log(response);
                if (response.data.code && response.data.code === 1000) {
                    let current_state={type:insert_data.type, subtype:insert_data.subtype,add_item_id:this.cookies.get("user_uid")};
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
            let redirect_url = "/getUser/" + this.state.add_item_id + "/";
            return <Redirect to={redirect_url}/>;
        }

        return (<div>{this.component}</div>)
    }
}

