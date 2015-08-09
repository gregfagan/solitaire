import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../game/klondike';

import View from './view';
import Board from './board';

@connect(state => state)
export default class Klondike extends Component {
  render() {
    const { board, dispatch } = this.props;

    return (
      <View>
        <Menu onShuffleAndDeal={() => dispatch(actions.shuffleAndDeal())}/>
        <Board {...board}/>;
      </View>
    );
  }
}

class Menu extends Component {
  render() {
    const { onShuffleAndDeal } = this.props;
    return (
      <View direction='row'>
        <button onClick={onShuffleAndDeal}>New Game</button>
      </View>
    );
  }
}