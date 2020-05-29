import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class GameCollection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: []
        }
    }

    render() {
        return this.state.collection == '' ?
            <div className="ui header">
                <span>No games found. Start by adding your favorite games!</span>
            </div> : this.state.collection.map((item) => (
                <div className="four wide computer seven wide mobile five wide tablet column" key={item.id} id={item.slug}>
                    <div className="ui card" draggable="false" unselectable="on">
                        <Link to={`/games/${item.id}/${item.slug}`}>
                            <div className="image">
                                <div className="ui placeholder">
                                    {item.background_image === null ? <i aria-hidden="true" className="ban huge icon" /> : <img src={item.background_image} alt={item.name} draggable="false" unselectable="on" />}
                                </div>
                            </div>
                        </Link>
                        <div className="content">
                            <div className="header">{item.name}</div>
                            <div className="meta">Release date - {item.tba === true ? "To Be Announced" : item.released}</div>
                        </div>
                    </div>
                </div>
            ));
    }
}

export default GameCollection
