import React, {Component} from "react";
import axios from "axios";
import "./styles.css";
import _ from "lodash";

export default class get_user extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.match.params.id);
        this.params = props.match.params;
        this.state = {table_data: []};
        this.all_disc=[];
        ///this.componentDidMount=this.componentDidMount.bind(this);
        this.change_params = this.change_params.bind(this);


    }

    change_params(type, subtype, e) {
        console.log(this.params);
        this.params.type = type;
        this.params.subtype = subtype;
        console.log(this.all_disc);
       // let current_item=_.filter(this.all_disc,{type:type,subtype:subtype});
        //this.generate_table(current_item);
        this.generate_table(this.all_disc);
        //this.forceUpdate();
    }

    generate_table(disc){
        let keys=_.keys(disc[0]);
        let head_table=keys.map((item)=>
            <th>{item}</th>
        );
        let listItems = disc.map((item) =>
            <tr>
                <td>{item.type}</td>
                <td>{item.author}</td>
            </tr>
        );
        //alert(JSON.stringify(listItems));
        this.setState({table_data: listItems,head_table:head_table})
    }

    componentDidMount() {
        let url = "http://127.0.0.1:1234/user/" + this.props.match.params.id;
        console.log(url);
        axios.get(url)
            .then((response) => {
                this.all_disc=response.data.data.disc;
                //this.generate_table(disc);
                //alert(this.state);

            })
            .catch((error) => {
                console.log(error);
                //alert(JSON.stringify(error));
            });

    }

    render() {
        console.log(this.params);
        if (!this.params.type || !this.params.subtype || this.params.type === undefined || this.params.subtype === undefined) {
            return (<div>
                <div className="floating-box"><h2>Collections</h2>
                    <button onClick={(e) => this.change_params("collections", "vinyl", e)} className="button">VinylRecords</button>
                    <button onClick={(e) => this.change_params("collections", "tapes", e)} className="button">Magnetic tapesfor reel-to-reel</button>
                    <button onClick={(e) => this.change_params("collections", "cassette", e)} className="button">Compact cassette </button>
                </div>

                <div className="floating-box"><h2>Concerts</h2>
                    <button onClick={(e) => this.change_params("concerts", "concerts", e)} className="button">Seen concerts</button>
                    <button onClick={(e) => this.change_params("concerts", "tickets", e)} className="button">Tickets </button>
                    <button onClick={(e) => this.change_params("concerts", "autographs", e)} className="button">Autographs </button>
                </div>

                <div className="floating-box"><h2>Groups</h2>
                    <form method="get" action="myGroups.html">
                        <button type="submit" className="button">My groups</button>
                    </form>
                    <form method="get" action="createGroup.html">
                        <button type="submit" className="button">Create group</button>
                    </form>
                </div>

                <div className="floating-box"><h2>Search</h2>
                    <form method="get" action="searchCollections.html">
                        <button type="submit" className="button">Search in collections</button>
                    </form>
                    <form method="get" action="searchConcerts.html">
                        <button type="submit" className="button">Search in concerts</button>
                    </form>
                </div>
            </div>)
        }
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        {this.state.head_table}
                    </tr>
                    {this.state.table_data}
                    </tbody>
                </table>
            </div>
        );
    }
}
