import React, {Component} from "react";
import axios from "axios";
import "./styles.css";
import Cookies from "universal-cookie";

export default class get_groups extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.match.params.id);
        this.params = props.match.params;
        this.state = {table_data: []};
        this.all_disc = [];
        this.query_disc = {};
        this.cookies = new Cookies();
        this.role = [{
            first: false, message: "Groups you are the owner of:"
        }, {
            first: false,
            message: "Groups you are a member of:"
        }, {
            first: false,
            message: "Groups you can join:"
        }];
        ///this.componentDidMount=this.componentDidMount.bind(this);
        this.join_group = this.join_group.bind(this);
        this.create_element = this.create_element.bind(this);
        this.get_elements = this.get_elements.bind(this);


    }

    join_group(group_id, event) {
        event.preventDefault();
        console.log("join");
        let params = {
            token: this.cookies.get("token"),
            group_id: group_id
        };
        const data = {
            url: "http://127.0.0.1:1234/joingroup/",
            body: JSON.stringify(params)
        };

        axios.post(data.url, data.body)
            .then((response) => {
                if (response.data.code && response.data.code === 1000) {
                    this.componentDidMount();
                }
                else {
                    alert("Invalid data");
                }

            })
            .catch((error) => {
                console.log(error);
            });
    }

    create_element(item) {
        let first_message;
        let link_button = {
            collections: {
                vinyl: "/getGroupInfo/"+item.group_id + "/collections/vinyl",
                cassette: "/getGroupInfo/"+item.group_id + "/collections/cassette",
                tapes: "/getGroupInfo/"+item.group_id + "/collections/tapes"
            },
            concerts: {
                seen: "/getGroupInfo/"+item.group_id + "/concerts/seen",
                tickets: "/getGroupInfo/"+item.group_id + "/concerts/tickets",
                autographs: "/getGroupInfo/"+item.group_id + "/concerts/autographs"
            }
        };
        let join_button;

        if (this.role[item.role - 1].first === false) {
            this.role[item.role - 1].first = true;
            first_message = this.role[item.role - 1].message;
        }

        if (item.role === 3)
            join_button = (<div>
                <form onSubmit={(e) => this.join_group(item.group_id, e)}>
                    <input type="submit" value="Join Group"/>
                </form>
            </div>);

        return (
            <div>
                <p><b>{first_message}</b></p>
                <div className="list-box">
                    <ul>
                        <li><b>Name:</b>{item.name}</li>
                        <li><b>Description:</b>{item.description}</li>
                    </ul>
                    {join_button}
                    <div className="floating-button">
                        <form method="get" action={link_button.collections.vinyl}>
                            <button type="submit" className="button">Vinyl Records</button>
                        </form>
                    </div>

                    <div className="floating-button">
                        <form method="get" action={link_button.collections.tapes}>
                            <button type="submit" className="button">Magnetic tapes for reel-to-reel</button>
                        </form>
                    </div>
                    <div className="floating-button">
                        <form method="get" action={link_button.collections.cassette}>
                            <button type="submit" className="button">Compact cassette</button>
                        </form>
                    </div>

                    <div className="floating-button">
                        <form method="get" action={link_button.concerts.seen}>
                            <button type="submit" className="button">Seen concerts</button>
                        </form>
                    </div>

                    <div className="floating-button">
                        <form method="get" action={link_button.concerts.tickets}>
                            <button type="submit" className="button">Tickets</button>
                        </form>
                    </div>
                    <div className="floating-button">
                        <form method="get" action={link_button.concerts.autographs}>
                            <button type="submit" className="button">Autographs</button>
                        </form>
                    </div>


                </div>
            </div>);
    }

    get_elements(items) {
        let elements = items.map((item) => {
            return this.create_element(item);
        });
        this.setState({elements: elements});

    }

    componentDidMount() {
        let params = {
            token: this.cookies.get("token"),
            req_type: "general"
        };
        const data = {
            url: "http://127.0.0.1:1234/getgroups/",
            body: JSON.stringify(params)
        };

        axios.post(data.url, data.body)
            .then((response) => {
                if (response.data.code && response.data.code === 1000) {
                    this.role = [{
                        first: false, message: "Groups you are the owner of:"
                    }, {
                        first: false,
                        message: "Groups you are a member of:"
                    }, {
                        first: false,
                        message: "Groups you can join:"
                    }];
                    this.get_elements(response.data.data);
                }
                else {
                    alert("Invalid data");
                }

            })
            .catch((error) => {
                console.log(error);
            });

    }

    render() {
        return (<div>
            {this.state.elements}
        </div>)
    }
}
