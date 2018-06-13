import React, {Component} from "react";
import axios from "axios";
import "./styles.css";
import _ from "lodash";
import Cookies from "universal-cookie";

export default class get_user extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.match.params.id);
        this.params = props.match.params;
        this.state = {table_data: []};
        this.all_disc = [];
        this.query_disc = {};
		this.cookies = new Cookies();

        this.db_asoc={
            artistName:"Artist",
            albumName:"Album",
            diameter: "Diameter (inch)",
            rotationaSpeed: "Rotational speed(rpm)",
            nrChanels:"Number of audio channels",
            weight:"Weight(G)",
            seniority:"Seniority",
            quality:"Quality",
            mbid:"Music brainz info",
            format:"Format",
            gender:"Gender",
            year:"Year",
            city:"City",
			Actions:"Actions"
        };
        this.change_params = this.change_params.bind(this);
    }

    change_params(query, e) {
        this.query_disc = query;
        this.params.type = query.type || undefined;
        this.params.subtype = query.subtype || undefined;
        let current_item = _.filter(this.all_disc, (disc) => {
            let ok = true;
            if (query.type && query.type !== undefined)
                if (disc.type !== query.type)
                    ok = false;
            if (query.subtype && query.subtype !== undefined)
                if (disc.subtype !== query.subtype)
                    ok = false;
            if (query.artist && query.artist !== undefined)
                if (disc['data']['artistName'].indexOf(query.artist) < 0)
                    ok = false;
            if (disc.type === "collections") {
                if (query.album && query.album !== undefined)
                    if (disc['data']['albumName'].indexOf(query.album) < 0)
                        ok = false;
            }
            else {
                if (query.album && query.album !== undefined)
                    if (disc['data']['format'].indexOf(query.album) < 0)
                        ok = false;
            }
            return ok;
        });
        this.generate_table(current_item);
    }
	
	delete_item(item_id, event) {
        event.preventDefault();
        let params = {
            token: this.cookies.get("token"),
            item_id: item_id
        };
        const data = {
            url: "http://127.0.0.1:1234/deleteitem/",
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

    generate_table(disc) {
        let logo_mb="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/MusicBrainz_Logo_2016.svg/1200px-MusicBrainz_Logo_2016.png";
        let delete_item_img="https://cdn2.iconfinder.com/data/icons/media-and-navigation-buttons-round/512/Button_12-512.png";
		let keys = [];
        if (disc && disc !== undefined && disc.length > 0) {
            keys = _.keys(disc[0].data);
            if(this.cookies.get("token") && this.cookies.get("token")!==undefined && disc[0]['user_uid']===this.cookies.get("user_uid"))
                keys.push("Actions");
        }
        else
            keys = [];
        let head_table = keys.map((item) =>
            <th>{this.db_asoc[item]}</th>
        );
		
        let listItems = disc.map((item) =>
            <tr>
                {
                    keys.map((atr) =>{
						if(atr==="Actions")
                            return (<td><img src={delete_item_img} alt="logo" onClick={(e) => this.delete_item(item['_id'], e)} /> </td>);
                        if (item['data'][atr]===undefined)
                            return (<td></td>);
                        if(atr!=="mbid")
                            return (<td>{item['data'][atr]}</td>);
                        else
                        {
                            let link="https://musicbrainz.org/release/"+item['data'][atr];
                            return (<td><a href={link} target="_blank"> <img src={logo_mb} alt="logo"/>  </a></td>);
                        }
                    })
                }
            </tr>
        );

        let box;

        if (disc[0] && disc[0]!== undefined)
            box = (<div className = "list-box">
                <ul>
                    <li><b>Type:</b>{disc[0].subtype}</li>
                </ul>
                </div> )
        this.setState({table_data: listItems, head_table: head_table, box: box})
    }

    componentDidMount() {
        let url = "http://127.0.0.1:1234/user/" + this.props.match.params.id;
        console.log(url);
        axios.get(url)
            .then((response) => {
                this.all_disc = response.data.data.disc;
                if (this.params.type)
                    this.change_params({type: this.params.type, subtype: this.params.subtype}, null);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    handleChange_subtype(event) {
        let query = this.query_disc;
        query.subtype = event.target.value;
        this.change_params(query, null);
    }

    handleChange_artist(event) {
        let query = this.query_disc;
        if (event.target.value === null || event.target.value === undefined || event.target.value === "") {
            delete this.params.artist;
            delete query.artist;
        } else {
            this.params.artist = event.target.value;
            query.artist = event.target.value;
        }
        this.change_params(query, null);
    }

    handleChange_album(event) {
        let query = this.query_disc;
        if (event.target.value === null || event.target.value === undefined || event.target.value === "") {
            delete this.params.album;
            delete query.album;
        } else {
            this.params.album = event.target.value;
            query.album = event.target.value;
        }
        this.change_params(query, null);
    }

    search_form(type, e) {
        let atr = {
            collections: (<div className="search-box">
                <select value={this.params.subtype} onChange={(e) => this.handleChange_subtype(e)}>
                    <option value="vinyl">Vinyls</option>
                    <option value="cassette">Cassettes</option>
                    <option value="tapes">Tapes</option>
                </select>
            </div>),
            concerts: (<div className="search-box">
                <select value={this.params.subtype} onChange={(e) => this.handleChange_subtype(e)}>
                    <option value="seen">Seen</option>
                    <option value="tickets">Tickets</option>
                    <option value="autographs">Autographs</option>
                </select>
            </div>)
        };

        let second = {
            "collections": "Album",
            "concerts": "Format"
        };

        return (<div><h2>Search in {type}</h2>

            <p className="search-p">Type</p>
            {atr[type]}

            <p className="search-p">Artist</p>
            <div className="search-box">
                <input type="text" value={this.params.artist} onChange={(e) => this.handleChange_artist(e)}/>
            </div>

            <p className="search-p">{second[type]}</p>
            <div className="search-box">
                <input type="text" value={this.params.album} onChange={(e) => this.handleChange_album(e)}/>
            </div>
        </div>);
    }

    render() {
        console.log(this.params);
        if (!this.params.type && !this.params.subtype) {
            return (<div>
                <div className="floating-box"><h2>Collections</h2>
                    <button onClick={(e) => this.change_params({type: "collections", subtype: "vinyl"}, e)}
                            className="button">
                        VinylRecords
                    </button>
                    <button onClick={(e) => this.change_params({type: "collections", subtype: "tapes"}, e)}
                            className="button">Magnetic
                        tapesfor reel-to-reel
                    </button>
                    <button onClick={(e) => this.change_params({type: "collections", subtype: "cassette"}, e)}
                            className="button">Compact
                        cassette
                    </button>
                    <form action="/addItem/collections">
                        <button className="button">Add to collections</button>
                    </form>
                </div>

                <div className="floating-box"><h2>Concerts</h2>
                    <button onClick={(e) => this.change_params({type: "concerts", subtype: "seen"}, e)}
                            className="button">Seen
                        concerts
                    </button>
                    <button onClick={(e) => this.change_params({type: "concerts", subtype: "tickets"}, e)}
                            className="button">Tickets
                    </button>
                    <button onClick={(e) => this.change_params({type: "concerts", subtype: "autographs"}, e)}
                            className="button">
                        Autographs
                    </button>
                    <form action="/addItem/concerts/">
                        <button className="button">Add to concerts</button>
                    </form>
                </div>

                <div className="floating-box"><h2>Groups</h2>
                    <form method="get" action="/getGroups/">
                        <button type="submit" className="button">My groups</button>
                    </form>
                    <form method="get" action="/createGroup/">
                        <button type="submit" className="button">Create group</button>
                    </form>
                </div>

                <div className="floating-box"><h2>Search</h2>
                    <form onSubmit ={(e) => this.change_params({type: "collections"}, e)}>
                        <button className="button">Search in collections</button>
                    </form>
                    <form onSubmit ={(e) => this.change_params({type: "concerts"}, e)}>
                        <button type="submit" className="button">Search in concerts</button>
                    </form>
                </div>
            </div>)
        }

        if (this.params.type && !this.params.subtype) {
            this.search_box = this.search_form(this.params.type);
        }
        let style100={
            width:"100%"
        };
        return (
            <div>
                {this.state.box}
                {this.search_box}
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
