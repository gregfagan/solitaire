import React, { Component } from 'react';
import { connect } from 'react-redux';
import findKey from 'lodash/object/findKey';

import * as actions from '../game/actions';
import { cardsAtPath } from '../game/inspect';
import { canMove } from '../game/rules/movingCards';
import { isTriviallySolvable, nextActionToSolve } from '../game/rules/end';

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
      solve: board => dispatch(nextActionToSolve(board)),
    },
  }
}))
export default class Klondike extends Component {
  componentDidMount() {
    this.props.actions.interface.shuffleAndDeal();
  }

  componentDidUpdate() {
    const { board, actions } = this.props;
    if (isTriviallySolvable(board)) {
      requestAnimationFrame(() => actions.game.solve(board));
    }
  }

  render() {
    const { board, options, actions } = this.props;

    const inspect = {
      cardsAtPath: cardsAtPath.bind(null, board),
      canMove: canMove.bind(null, board),
    };

    return (
      <View>
        <Menu
          actions={actions.interface}
          drawOptions={Object.keys(drawCountOptions)}
          currentDrawCountOption={findKey(drawCountOptions, option => option === options.drawCount)} />
        <Board
          {...board}
          actions={actions.game}
          inspect={inspect}
          visibleWasteCount={options.drawCount} />
      </View>
    );
  }
}
