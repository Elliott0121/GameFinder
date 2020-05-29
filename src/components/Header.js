import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar.js'

class Header extends Component {
    render() {
        return (
            <nav id="Header">
                <div className="ui large pointing secondary menu">
                    <div className="ui container">
                        <Link to="/">
                            <a href="/" className="ui header active item">GameFinder</a>
                        </Link>
                        <SearchBar />
                        <a href="/" className="ui header right item">About</a>
                        <a href="/" className="ui header item">Other</a>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header