import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Modal } from 'semantic-ui-react';

class GameCollection extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadCollection();
    }

    render() {
        return this.props.items.collection == '' || this.props.items.collection == null ?
            <div className="ui header">
                <span>No games found. Start by adding your favorite games!</span>
            </div> : this.props.items.collection.map((item) => (
                <div className="four wide computer seven wide mobile five wide tablet column" key={item.id} id={item.id}>
                    <div className="ui card" draggable="false" unselectable="on">
                        <Link to={`/games/${item.id}/${item.slug}`}>
                            <div className="image">
                                <div className="ui placeholder">
                                    {item.image === null ? <i aria-hidden="true" className="ban huge icon" /> : <img src={item.image} alt={item.name} draggable="false" unselectable="on" />}
                                </div>
                            </div>
                        </Link>
                        <div className="content">
                            <div className="header">{item.name}</div>
                            <div className="meta">Release date - {item.release}</div>
                            <div className="description">
                                <button className="ui compact small basic primary button">
                                    <i className='ban icon red' onClick={(e) => this.props.deleteGame(e)}></i>Status: Completed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ));
    }
}

export default GameCollection
