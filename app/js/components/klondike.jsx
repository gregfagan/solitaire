import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../game/actions';

import View from './view';
import Menu from './menu';
import Board from './board';

const drawOptions = {
  'Draw One': 1,
  'Draw Three': 3,
};

@connect(state => state, dispatch => ({
  actions: {
    shuffleAndDeal: () => dispatch(actions.shuffleAndDeal()),
    drawCard: () => dispatch(actions.draw()),
    setDrawCount: (option) => dispatch(actions.setDrawCount(drawOptions[option])),
  }
}))
export default class Klondike extends Component {
  componentDidMount() {
    this.props.actions.shuffleAndDeal();
  }

  render() {
    const { board, options, actions } = this.props;

    return (
      <View>
        <Menu
          shuffleAndDeal={actions.shuffleAndDeal}
          drawOptions={Object.keys(drawOptions)}
          currentDrawOption={options.drawCount}
          changeDrawOption={actions.setDrawCount} />
        <Board drawCard={actions.drawCard} {...board}/>;
      </View>
    );
  }
}
