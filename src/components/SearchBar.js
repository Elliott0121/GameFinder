import React, { Component } from 'react'
import axios from 'axios';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            query: '',
            isLoading: false,
            show_search: false
        }
    }

    getInfo() {
        axios.get(`https://rawg.io/api/games?search=${this.state.query}`)
            .then((data) => {
                this.setState({
                    results: data.data.results,
                })
            })
    }

    handleChange() {
        this.setState({
            query: this.search.value
        }, () => {
            if (this.state.query && this.state.query.length > 1) {
                this.setState({ show_search: true })
                if (this.state.query.length % 2 === 0) {
                    this.getInfo()
                }
                else if (!this.state.query) {
                    this.setState({ show_search: false })
                }
            }
            else {
                this.setState({ show_search: false })
            }
        });
        console.log(this.state.query)
    }

    render() {
        return (
            <div className="ui search right item">
                <div className="ui icon input" >
                    <input type="text"
                        placeholder="Search for Games..."
                        autocomplete="off"
                        ref={input => this.search = input}
                        onChange={() => this.handleChange()} />
                    <i aria-hidden="true" class="search icon orange"></i>
                </div>
                <div className="results transition" style={{ display: this.state.show_search ? 'block' : 'none' }}>
                    <div className="message">
                        <div className="ui items">
                            {this.state.results.map(r => (
                                <div className="item" id={r.slug}>
                                    <div className="ui tiny image">{r.background_image === null ? <i aria-hidden="true" className="ban huge icon" /> : <img src={r.background_image} alt={r.name} draggable="false" unselectable="on" />}</div> 
                                    <div className="header" style={{ marginLeft: "5px" }}>
                                        <ul>
                                            <a href={`/games/${r.id}/${r.slug}`}>
                                                <li li key={r.id}>{r.name}</li>
                                            </a>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchBar
