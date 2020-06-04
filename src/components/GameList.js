import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Status from './Status.js';

class GameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: document.title = ('GameFinder')
    };
    this.toggleVideo = this.toggleVideo.bind(this)
  }

  toggleVideo(event, status, game) {
    if (status == true && game.clip != null) {
      let video = document.createElement('video')
      video.src = game.clip.clips['320'],
        video.muted = true,
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
              <span>Release date - {item.tba === true ? "To Be Announced" : item.released}</span>
            </div>
            <div className="description">
              <Status
                status={this.props.items}
                item={item}
                checkStatus={this.props.checkStatus(item)}
                saveGame={this.props.saveGame.bind(this)}
                setColor={this.props.setColor}
              />
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