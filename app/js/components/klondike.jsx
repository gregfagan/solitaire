import React, { Component } from 'react';
import { connect } from 'react-redux';
import findKey from 'lodash/object/findKey';

import actions from '../game/actions';
import { cardsAtPath } from '../game/inspect';

import View from './view';
import Menu from './menu';
import Board from './board';

const drawCountOptions = {
  'Draw One': 1,
  'Draw Three': 3,
};

@connect(state => state, dispatch => ({
  actions: {
    interface: {
      shuffleAndDeal: () => dispatch(actions.shuffleAndDeal()),
      setDrawCount: option => dispatch(actions.setDrawCount(drawCountOptions[option])),
    },
    game: {
      drawCard: () => dispatch(actions.draw()),
      movePath: (from, to) => dispatch(actions.move(from, to)),
    },
  }
}))
export default class Klondike extends Component {
  componentDidMount() {
    this.props.actions.interface.shuffleAndDeal();
  }

  render() {
    const { board, options, actions } = this.props;

    return (
      <View>
        <Menu
          actions={actions.interface}
          drawOptions={Object.keys(drawCountOptions)}
          currentDrawCountOption={findKey(drawCountOptions, option => option === options.drawCount)} />
        <Board {...board} actions={actions.game} cardsAtPath={cardsAtPath.bind(null, board)}/>
      </View>
    );
  }
}
