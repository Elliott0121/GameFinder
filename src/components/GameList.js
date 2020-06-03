import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class GameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: document.title = ('GameFinder')
    };
    this.toggleVideo = this.toggleVideo.bind(this)
  }

  toggleVideo(event, status, game) {
    if (status == true && game.clip != null && event.target != null) {
      let video = document.createElement('video')
      video.src = game.clip.clips['320'],
        video.volume = 0.1
        video.loop = true,
        video.draggable = false,
        video.unselectable = false,
        video.autoplay = true,
        video.type = 'video/mp4',
        video.className = 'animate__animated animate__fadeIn',
        video.style.objectFit = 'cover'
      event.target.lastChild.style.display = 'none';
      event.target.insertBefore(video, event.target.firstChild)
    } else {
      event.target.children.length > 1 ? event.target.firstChild.remove() : ''
      event.target.lastChild.style.display = 'block';
    }
  }

  render() {
    return this.props.items.games.map((item) => (
      <div className="four wide computer seven wide mobile five wide tablet column animate__animated animate__fadeIn" key={item.id} id={item.id}>
        <div className="ui card" draggable="false" unselectable="on">
          <Link to={`/games/${item.id}/${item.slug}`}>
            <div className="image" onMouseOver={e => this.toggleVideo(e, true, item)} onMouseOut={e => this.toggleVideo(e, false, item)}>
              <div className="ui placeholder">
                {item.background_image === null ? <i aria-hidden="true" className="ban huge icon" /> :
                  <img src={item.background_image} alt={item.name} draggable="false" unselectable="on" />}
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