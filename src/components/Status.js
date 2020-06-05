import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react';

export class Status extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="Status">
                {this.props.checkStatus == false ?
                    <Dropdown upward text='Add Game to Collection' className='className="ui small compact basic button'
                        onChange={(e) => this.props.saveGame(e)} options={[
                            { key: 1, text: 'Completed', className: 'ui small basic primary button' },
                            { key: 2, text: 'Played', className: 'ui small basic green button' },
                            { key: 3, text: '100%', className: 'ui small basic orange button' }
                        ]} />
                    :
                    this.props.status.collection.map((game => game.id == this.props.item.id ?
                        <button key={game.id} className={`ui small compact basic ${this.props.setColor(game.status)} button animate__animated animate__fadeIn`}>
                            Status: {this.props.status.collection.map((game => game.id == this.props.item.id ? game.status : ''))}
                        </button>
                        : ''))
                }
            </div>
        )
    }
}

export default Status