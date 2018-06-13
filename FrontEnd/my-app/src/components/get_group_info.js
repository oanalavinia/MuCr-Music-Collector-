import React, {Component} from "react";
import axios from "axios";
import "./styles.css";
import _ from "lodash";
import Cookies from "universal-cookie";

export default class get_group_info extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.match.params.id);
        this.params = props.match.params;
        this.state = {table_data: []};
        this.all_disc = [];
        this.cookies = new Cookies();
        this.query_disc = {};
        this.db_asoc = {
            artistName: "Artist",
            albumName: "Album",
            diameter: "Diameter (inch)",
            rotationaSpeed: "Rotational speed(rpm)",
            nrChanels: "Number of audio channels",
            weight: "Weight(G)",
            seniority: "Seniority",
            quality: "Quality",
            mbid: "Music brainz info",
            format:"Format",
            gender:"Gender",
            artists:"Artists",
            year:"Year",
            city:"City",
            owner_name: "Owner"
        };
        this.change_params = this.change_params.bind(this);
    }

    change_params(query, e) {
        this.query_disc = query;
        this.params.type = query.type || undefined;
        this.params.subtype = query.subtype || undefined;
        let current_item = _.filter(this.all_disc, {type: this.params.type, subtype: this.params.subtype});
        this.generate_table(current_item);
    }

    generate_table(disc) {
        let keys = [];
        let logo_mb = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/MusicBrainz_Logo_2016.svg/1200px-MusicBrainz_Logo_2016.png";

        if (disc && disc !== undefined && disc.length > 0)
            keys = _.keys(disc[0].data);
        else
            keys = [];
        let head_table = keys.map((item) =>
            <th>{this.db_asoc[item]}</th>
        );
      
        let listItems = disc.map((item) =>
            <tr>
                {
                    keys.map((atr) => {
                        if (item['data'][atr] === undefined)
                            return (<td></td>);

                        if (atr === "mbid") {
                            let link = "https://musicbrainz.org/release/" + item['data'][atr];
                            return (<td><a href={link}> <img src={logo_mb} alt="logo"/> </a></td>);
                        }
                        if (atr === "owner_name") {
                            let link = "/getUser/" + item.user_uid;
                            return (<td><a href={link}>{item['data'][atr]} </a></td>)
                        }
                        else
                            return (
                                <td>{item['data'][atr]}</td>);
                    })
                }
            </tr>
        );
        this.setState({table_data: listItems, head_table: head_table})
    }

    componentDidMount() {
        let params = {
            token: this.cookies.get("token"),
            group_id: this.params.id
        };
        const data = {
            url: "http://127.0.0.1:1234/getgroupinfo/",
            body: JSON.stringify(params)
        };

        axios.post(data.url, data.body)
            .then((response) => {
                if (response.data.code && response.data.code === 1000) {
                    this.all_disc = response.data.disc;
                    this.name = response.data.name;
                    this.description = response.data.description;
                    this.change_params({type: this.params.type, subtype: this.params.subtype}, null);
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }
	
    render() {
        let style100 = {
            width: "100%"
        };

        return (
            <div>
                <div className="list-box">
                    <ul>
                        <li><b>Name: </b>{this.name}</li>
                        <li><b>Description: </b>{this.description}</li>
                        <li><b>Category: </b>{this.params.type} {this.params.subtype}</li>
                    </ul>
                </div>
                <table style={style100}>
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
