import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class GameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: document.title = ('GameFinder')
    };
  }

  render() {
    return this.props.items.games.map((item) => (
      <div className="four wide computer seven wide mobile five wide tablet column" key={item.id} id={item.id}>
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
            <div className="meta" data-id={item.id} data-image={item.background_image} data-slug={item.slug}>
              Release date - {item.tba === true ? "To Be Announced" : item.released}</div>
            <div className="description">
              <div id="Status">
                {this.props.checkStatus(item) == false ? <button className="ui small compact basic button" onClick={(e) => this.props.saveGame(e)}>
                  <i aria-hidden="true" class="star outline icon"></i>Add game to collection</button> :
                  <button className="ui small compact basic primary button animate__animated animate__fadeIn">Status: Completed</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  }
}

GameList.propTypes = {
  items: PropTypes.object.isRequired
}

export default GameList;