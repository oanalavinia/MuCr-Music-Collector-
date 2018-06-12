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
        this.all_disc = [];
        this.query_disc = {};

        this.db_asoc={
            artistName:"Artist",
            albumName:"Album",
            diameter: "Diameter (inch)",
            rotationaSpeed: "Rotational speerd(rpm)",
            nrChanels:"Number of audio channels",
            weight:"Weight(G)",
            seniority:"Seniority",
            quality:"Quality",
            mbid:"Music brainz info"
        };
        ///this.componentDidMount=this.componentDidMount.bind(this);
        this.change_params = this.change_params.bind(this);


    }

    change_params(query, e) {
        // let query={};
        // if(type && type!==undefined)
        //     query.type=type;
        // if(subtype && subtype!==undefined)
        //     query.subtype=subtype;
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
                if (disc['data']['artist'].indexOf(query.artist) < 0)
                    ok = false;
            if (query.album && query.album !== undefined)
                if (disc['data']['album'].indexOf(query.album) < 0)
                    ok = false;

            return ok;


        });
        this.generate_table(current_item);
        //this.generate_table(this.all_disc);
        //this.forceUpdate();
    }

    generate_table(disc) {
        // console.log("Discurile sunt: ");
        // console.log(disc);
        let logo_mb="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/MusicBrainz_Logo_2016.svg/1200px-MusicBrainz_Logo_2016.png";
        let keys = [];
        if (disc && disc !== undefined && disc.length > 0)
            keys = _.keys(disc[0].data);
        else
            keys = [];
        let head_table = keys.map((item) =>
            <th>{this.db_asoc[item]}</th>
        );
        // let listItems = disc.map((item) =>
        //     <tr>
        //         <td>{item.type}</td>
        //         <td>{item.author}</td>
        //     </tr>
        // );
        let listItems = disc.map((item) =>
            <tr>
                {
                    keys.map((atr) =>{
                        if (item['data'][atr]===undefined)
                            return (<td></td>);
                        if(atr!=="mbid")
                            return (<td>{item['data'][atr]}</td>);
                        else
                        {
                            let link="https://musicbrainz.org/release/"+item['data'][atr];
                            return (<td><a href={link}> <img src={logo_mb} alt="logo"/>  </a></td>);
                        }
                    })
                }
            </tr>
        );
        //alert(JSON.stringify(listItems));
        this.setState({table_data: listItems, head_table: head_table})
    }

    componentDidMount() {
        let url = "http://127.0.0.1:1234/user/" + this.props.match.params.id;
        console.log(url);
        axios.get(url)
            .then((response) => {
                this.all_disc = response.data.data.disc;
                if (this.params.type)
                    this.change_params({type: this.params.type, subtype: this.params.subtype}, null);

                //this.generate_table(disc);
                //alert(this.state);

            })
            .catch((error) => {
                console.log(error);
                //alert(JSON.stringify(error));
            });

    }

    handleChange_subtype(event) {
        let query = this.query_disc;
        //query.type=this.params.type;
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

        return (<div><h2>Search in {type}</h2>

            <p className="search-p">Type</p>
            {atr[type]}

            <p className="search-p">Artist</p>
            <div className="search-box">
                <input type="text" value={this.params.artist} onChange={(e) => this.handleChange_artist(e)}/>
            </div>

            <p className="search-p">Album</p>
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
                    <form method="get" action="createGroup.html">
                        <button type="submit" className="button">Create group</button>
                    </form>
                </div>

                <div className="floating-box"><h2>Search</h2>
                    <form action="collections/">
                        <button className="button">Search in collections</button>
                    </form>
                    <form action="concerts/">
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
