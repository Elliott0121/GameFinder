import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header.js';
import axios from 'axios';
import { Popup } from 'semantic-ui-react';
import Status from './Status.js';

class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game_details: '',
            game_platforms: '',
            game_stores: '',
            game_developer: '',
            game_clip: '',
            game_publisher: '',
            game_tags: '',
            ratingStyle: { bgColor: '' },
            title: '',
            game_creators: '',
            game_genres: '',
            game_ratings: '',
            game_esrb: '',
            desc_height: 0
        };
    }

    componentDidMount() {
        setTimeout(() => { this.setState({ desc_height: document.getElementById('Desc').clientHeight }) }, 500);
        this.loadGamePage();
    }

    loadGamePage() {
        const { match: { params } } = this.props;
        axios.get(`https://api.rawg.io/api/games/${params.id}`)
            .then(res => {
                const game_details = res.data;
                this.setState({
                    game_details,
                    game_platforms: game_details.platforms,
                    game_stores: game_details.stores,
                    game_developer: game_details.developers,
                    game_publisher: game_details.publishers,
                    game_tags: game_details.tags,
                    game_clip: game_details.clip === null ? "Couldn't find any videos" : game_details.clip.clips,
                    title: document.title = ("GameFinder | " + game_details.name),
                    game_genres: game_details.genres,
                    game_ratings: game_details.ratings,
                    game_esrb: game_details.esrb_rating
                })
            })
        axios.get(`https://api.rawg.io/api/games/${params.id}/development-team`)
            .then(res => {
                const game_creators = res.data;
                this.setState({
                    game_creators: game_creators.results,
                })
            })
    }

    toggleDesc() {
        let element = document.getElementsByClassName('game-description')[0];
        let btn = document.getElementById('Btn-Desc')
        element.style.maxHeight = `${element.firstChild.clientHeight}px`
        if (btn.innerHTML == 'Show More') {
            btn.innerHTML = 'Show Less'
        } else {
            element.style.maxHeight = '182.8px'
            btn.innerHTML = 'Show More'
        }
        element.className = 'game-description animate__animated animate__fadeIn'
        setTimeout(() => { element.className = 'game-description' }, 500);
    }

    render() {
        const game = this.state.game_details;
        const gamePf = Object.keys(this.state.game_platforms).map((val, i) =>
            <span key={i} style={{ margin: '5px 5px 0px 0px' }} title={this.state.game_platforms[val].platform.name} className="ui small basic compact button">
                <i aria-hidden="true" id={`icon-${this.state.game_platforms[val].platform.name.split(' ').join('')}`} style={{ float: 'left' }}></i>
                <p style={{ display: 'flex', padding: '3px 0px 0px 5px' }}>{this.state.game_platforms[val].platform.name}</p>
            </span>)
        const gameUrl = Object.keys(this.state.game_stores).map((val, i) => { return this.state.game_stores[val].url })
        const gameSt = Object.keys(this.state.game_stores).map((val, i) =>
            <a href={gameUrl[i]} key={i}>
                <li>{this.state.game_stores[val].store.name}</li>
            </a>)
        const gameDev = Object.keys(this.state.game_developer).map((val, i) =>
            <li key={i}>{this.state.game_developer[val].name}</li>)
        const gamePublisher = Object.keys(this.state.game_publisher).map((val, i) =>
            <li key={i}>{this.state.game_publisher[val].name}</li>)
        const gameTags = Object.keys(this.state.game_tags).map((val, i) =>
            <span key={i} className="ui basic button">{this.state.game_tags[val].name}</span>)
        const gameGenres = Object.keys(this.state.game_genres).map((val, i) =>
            <span key={i} style={{ marginRight: '5px', display: 'inline-flex' }}>{this.state.game_genres[val].name}</span>)
        const gameCreators = Object.keys(this.state.game_creators).map((val, i) =>
            <div className="ui column four wide computer four wide mobile" key={i}>
                <div className="ui card" id="Developers">
                    <div className="ui image">
                        {this.state.game_creators[val].image === null ? <i className="ui icon huge user outline"></i> : <img src={this.state.game_creators[val].image} alt={this.state.game_creators[val].name} />}
                    </div>
                    <div className="content">
                        <div className="header">{this.state.game_creators[val].name}</div>
                        {/*<div className="meta">{this.state.game_creators[val].name}</div>*/}
                    </div>
                </div>
            </div>)
        const gameRatings = Object.keys(this.state.game_ratings).map((val, i) =>
            <Popup key={i} content={this.state.game_ratings[val].title + ":" + this.state.game_ratings[val].count} trigger={
                <div className={"bar " + this.state.game_ratings[val].title} style={{ width: this.state.game_ratings[val].percent + '%', backgroundColor: this.props.setColor(this.state.game_ratings[val].title), boxShadow: 'rgba(0, 0, 0, 0.1) 10px 10px 10px inset' }}>
                </div>} style={{ fontSize: "16px", textTransform: "capitalize" }} />)
        return (
            <div className="ui container">
                <Header />
                <div id="Game-Page">
                    <div className="background-gradient">
                        <div className="game-background">
                            <video autoPlay muted loop draggable="false" unselectable="on" src=
                                {this.state.game_clip.full} type="video/mp4" poster={game.background_image} />
                        </div>
                    </div>
                    <div className="ui stackable two column grid">
                        <div className="column eight wide computer mobile sixteen wide">
                            <div className="ui text container">
                                <div className="ui header">
                                    <div className="ui header">{game.name}</div>
                                    <div className="meta" style={{ display: 'flex' }} data-id={game.id} data-image={game.background_image} data-slug={game.slug}>
                                        <span style={{marginRight: '10px'}} >Release date - {game.tba === true ? "To Be Announced" : game.released}</span>
                                        <Status
                                            status={this.props.items}
                                            item={game}
                                            checkStatus={this.props.checkStatus(game)}
                                            saveGame={this.props.saveGame.bind(this)}
                                            setColor={this.props.setColor}
                                        />
                                    </div>
                                    <div id="platforms" className="ui list">
                                        <div className="ui grid">
                                            <div className="column">{gamePf}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ui segment">
                                    <div className="game-description">
                                        <p id="Desc">{game.description_raw === "" ? "No description available" : game.description_raw}</p>
                                    </div>
                                    {this.state.desc_height <= 185 ? '' : <button id='Btn-Desc' className="ui basic compact button animate__animated animate__fadeInDown" onClick={() => this.toggleDesc()}>Show More</button>}
                                </div>
                                <div role="list" className="ui list">
                                    <div className="ui stackable two column grid">
                                        <div className="column">
                                            <div className="ui small header">Developers</div>
                                            <div role="listitem" className="item">
                                                {gameDev.length === 0 ? "Couldn't find any developers" : gameDev}
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="ui small header">Publishers</div>
                                            <div role="listitem" className="item">
                                                {gamePublisher.length === 0 ? "Couldn't find any publishers" : gamePublisher}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui stackable two column grid">
                                        <div className="column">
                                            <div className="ui small header">Available at</div>
                                            <div role="listitem" className="item">
                                                {gameSt.length === 0 ? "Couldn't find any stores" : gameSt}
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="ui small header">Genres</div>
                                            <div role="listitem" className="item">
                                                {gameGenres.length === 0 ? "Couldn't find any Genres" : gameGenres}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui stackable two column grid">
                                        <div className="column">
                                            <div className="game-rating">
                                                <div className="ui small header">Rating</div>
                                                <a href={'https://www.metacritic.com/search/game/' + game.slug + '/results'}>
                                                    <div role="listitem" className="item">Metacritic</div>
                                                </a>
                                                <div role="listitem" className="item" >Ratings: {this.state.game_details.ratings_count}</div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="ui small header">ESRB</div>
                                            <div role="listitem" className="item">
                                                {this.state.game_esrb === null ? "Rating Pending" : this.state.game_esrb.name}
                                            </div>
                                        </div>
                                        <div className="bar-container">{gameRatings}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column eight wide computer mobile sixteen wide">
                            <div className="ui text container">
                                <div className="ui segment">
                                    <div role="list" className="ui list">
                                        <div className="ui small header">Tags</div>
                                        <div className="ui celled grid">
                                            <div className="column">
                                                {gameTags.length === 0 ? "Couldn't find any tags" : gameTags}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ui small header">Artwork</div>
                                <div className="ui celled grid">
                                    <img src={game.background_image} className="ui bordered image" />
                                </div>
                                <div className="ui small header">Key Staff Members</div>
                                <div className="ui grid">
                                    {gameCreators.length === 0 ? "Couldn't find any developers" : gameCreators}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

GamePage.propTypes = {
    items: PropTypes.object.isRequired
}

export default GamePage;