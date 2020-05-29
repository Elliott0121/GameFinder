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
      items: [],
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
          this.setState({ items: getGames });
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
        const newGames = this.state.items.concat(res.data.results);
        this.setState(prevState => {
          return { currentPage: prevState.currentPage + 1, items: newGames }
        })
        console.log(this.state.currentPage);
      })
    if (this.state.currentPage === 3) {
      document.getElementById("show-icon").innerHTML = 'Loaded all pages';
      document.getElementById("show-icon").disabled = true;
    }
  }

  saveGame(event) {
    //localStorage.setItem('collection', JSON.stringify(this.state.))
    event.target.textContent = 'Status: Completed';
    event.target.className = 'ui compact small basic primary button animate__animated animate__fadeIn';
  }

  render() {
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
                    <SearchBar items={this.state.items} />
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
                  <GameCollection items={this.state.items} />
                </div>
                <div className="ui divider"></div>
                <div className="ui header">
                  <div className="ui large header">
                    <span>Trending games this month - {new Date(this.state.currentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                <div className="ui divider" />
                <div className="ui grid">
                  {this.state.loading ?
                    <div className="content" style={{ width: '100% !important', height: '300px' }}>
                      <div style={{ position: 'relative' }} className="ui active centered large text loader">Loading</div>
                    </div>
                    : <GameList items={this.state.items} saveGame={this.saveGame.bind(this)} />}
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
            <Route path="/games/:id" render={(props) => <GamePage {...props} saveGame={this.saveGame.bind(this)}/>} />
            <Route component={() => (<h1 style={{ textAlign: "center" }}>404 Not found </h1>)} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;