import React, { Component, createRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import GameList from './components/GameList';
import GamePage from './components/GamePage';
import SearchBar from './components/SearchBar.js';
import GameCollection from './components/GameCollection.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.scrollDivUp = createRef();
    this.scrollDivDown = createRef();
    this.state = {
      items: { games: [], collection: [] },
      currentDate: this.setDate(),
      currentPage: 2,
      gamesLength: '',
      loading: true
    }
  }

  componentDidMount() {
    this.getGames();
  }

  setDate() {
    let today = new Date();
    let formattedDate = today.getFullYear() + '-' + parseInt(today.getMonth() + 1) + '-' + parseInt(today.getDate());
    return new Date(formattedDate).toLocaleDateString([], { year: 'numeric', month: 'numeric', day: 'numeric' });
  }

  getGames() {
    try {
      axios.get(`https://api.rawg.io/api/games`)
        .then(res => {
          const amount = res.data.count;
          this.setState({
            gamesLength: amount,
            loading: false
          });
        })
      axios.get(`https://api.rawg.io/api/games?dates=${this.state.currentDate},${new Date(this.state.currentDate).toLocaleDateString('en-US', { year: 'numeric' })}-12-31&ordering=-added&page=1`)
        .then(res => {
          const getGames = res.data.results;
          this.setState({ items: { games: getGames, collection: JSON.parse(localStorage.getItem('Collection')) || [] } });
        })
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }
  }

  loadnewPage() {
    axios.get(`https://api.rawg.io/api/games?dates=${this.state.currentDate},${new Date(this.state.currentDate).toLocaleDateString('en-US', { year: 'numeric' })}-12-31&ordering=-added&page=${this.state.currentPage}`)
      .then(res => {
        const newGames = this.state.items.games.concat(res.data.results);
        this.setState(prevState => {
          return { currentPage: prevState.currentPage + 1, items: { games: newGames, collection: JSON.parse(localStorage.getItem('Collection')) || [] } }
        })
        console.log(this.state.currentPage);
      })
    if (this.state.currentPage === 3) {
      document.getElementById("show-icon").innerHTML = 'Loaded all pages';
      document.getElementById("show-icon").disabled = true;
    }
  }

  saveGame(event) {
    //event.target.children.textContent = 'Status: Completed';
    //event.target.children.className = 'ui compact small basic primary button animate__animated animate__fadeIn';
    let content = event.target.parentElement.parentElement.parentNode.children;
    let newGame = {
      name: event.target.parentElement.parentElement.parentNode.children[0].innerHTML,
      id: content[1].getAttribute('data-id'),
      slug: content[1].getAttribute('data-slug'),
      image: content[1].getAttribute('data-image'),
      release: content[1].firstChild.nextSibling.data,
      status: 'Completed'
    }
    let currentCollection = [...this.state.items.collection]
    currentCollection.push(newGame)
    this.setState({ items: { games: this.state.items.games, collection: currentCollection } })
    localStorage.setItem('Collection', JSON.stringify(currentCollection));
  }

  loadCollection() {
    const games = localStorage.getItem('Collection');
    const parsedGames = JSON.parse(games);
    this.setState({ items: { games: this.state.items.games, collection: parsedGames || [] } })
  }

  checkStatus(item) {
    if (this.state.items.collection != null) {
      return this.state.items.collection.some(game => game.id == item.id)
    } else {
      return;
    }
  }

  render() {
    const deleteGame = (event) => {
      // Tar bort filmen som användaren klickar på.
      let currentState = [...this.state.items.collection];
      let index = currentState.findIndex(
        item => item.name === event.target.parentElement.parentElement.previousSibling.previousSibling.innerHTML
      );
      console.log(event.target.parentElement.parentElement.previousSibling.previousSibling.innerHTML)
      const val = window.confirm(`Remove From Collection?`);
      if (val) {
        currentState.splice(index, 1);
        this.setState({ items: { games: this.state.items.games, collection: currentState || [] } });

        localStorage.setItem("Collection", JSON.stringify(currentState));
        console.log(currentState, index);
        this.loadCollection()
      }
    }
    return (
      <Router>
        <div id="App">
          <Switch>
            <Route path="/" exact component={GameList}>
              <div className="ui container">
                <div className="header" ref={this.scrollDivUp}>
                  <h1>GameFinder</h1>
                  <h3>Search for over {this.state.gamesLength} games across multiple platforms</h3>
                </div>
                <div className="ui large secondary menu">
                  <div className="Search">
                    <SearchBar items={this.state.items.games} />
                  </div>
                </div>
                <div className="divider-gamelist">
                  <div className="ui divider" />
                  <button className="ui circular icon button inverted orange" style={{ zIndex: "1", float: 'right' }}
                    onClick={() => {
                      this.scrollDivDown.current.scrollIntoView({ behavior: 'smooth' });
                    }}><i aria-hidden="false" className="arrow down icon"></i> Bottom
                  </button>
                </div>
                <div className="ui header">
                  <div className="ui large header">
                    <span>My Collection</span>
                  </div>
                </div>
                <div className="ui grid">
                  <GameCollection items={this.state.items} loadCollection={this.loadCollection.bind(this)} saveGame={this.saveGame.bind(this)} deleteGame={deleteGame} />
                </div>
                <div className="ui divider"></div>
                <div className="ui header">
                  <div className="ui large header">
                    <span>Trending games this month - {new Date(this.state.currentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                <div className="ui grid">
                  {this.state.loading ?
                    <div className="content" style={{ width: '100% !important', height: '300px' }}>
                      <div style={{ position: 'relative' }} className="ui active centered large text loader">Loading</div>
                    </div>
                    : <GameList items={this.state.items} saveGame={this.saveGame.bind(this)} checkStatus={this.checkStatus.bind(this)} />}
                </div>
                <div className="divider-gamelist">
                  <div className="showmore-icon">
                    <button id="show-icon" className="ui circular icon button inverted orange" onClick={() => this.loadnewPage()}>
                      <i aria-hidden="false" className="plus icon"></i> Show More
                    </button>
                  </div>
                  <div className="ui divider" />
                  <div className="bottom-icon">
                    <button className="ui circular icon button inverted orange" style={{ zIndex: "1" }} ref={this.scrollDivDown}
                      onClick={() => {
                        this.scrollDivUp.current.scrollIntoView({ behavior: 'smooth' });
                      }}><i aria-hidden="false" className="arrow up icon"></i> Top
                    </button>
                  </div>
                </div>
              </div>
            </Route>
            <Route path="/games/:id" render={(props) => <GamePage {...props} saveGame={this.saveGame.bind(this)} checkStatus={this.checkStatus.bind(this)} />} />
            <Route component={() => (<h1 style={{ textAlign: "center" }}>404 Not found </h1>)} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;