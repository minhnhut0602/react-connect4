import React from 'react';
import Connect4 from './connect-4/connect4';
import {deepstream as ds} from '../../vendor/deepstream';

export default class App extends React.Component {
  constructor() {
    super();
    /**
     * Ref this
     */
    const app = this;

    app.ds = ds('localhost:6020');

    app.player = {
      id: app.ds.getUid(),
      color: ''
    };

    app.ds.login({}, success => {
      app.ds.rpc.make('get-player-color', {}, (error, chosenColor) => {
        if (error) {
          throw error
        } else {
          app.player.color = chosenColor
        }
      })
    })
  }
  
  render() {
    const app = this
    return (
      <div>
        <h1>Connect Four</h1>
        {
          app.player.color.length > 0 
          ? <Connect4 dsclient={this.ds} player={this.player}/>
          : <p>Loading...</p>
        }
      </div>
    );
  }
}
