import range from 'lodash/utility/range';
import _shuffle from 'lodash/collection/shuffle';
import cloneDeep from 'lodash/lang/cloneDeep';

import { deck } from './card';

const initialState = {
  board: {
    draw: [],
    waste: [],
    foundation: range(4).map(() => []),
    tableau: range(7).map(() => (
      { covered: [], uncovered: [] }
    ))
  }
}

// action types
const SHUFFLE_AND_DEAL = 'SHUFFLE_AND_DEAL';
// const DRAW = 'DRAW';
// const MOVE = 'MOVE';

// action creators
function shuffleAndDeal() {
  return { type: SHUFFLE_AND_DEAL };
}

export const actions = { shuffleAndDeal };

// reducers
export default function klondike(state=initialState, action) {
  switch(action.type) {
    case SHUFFLE_AND_DEAL:
      return { ...state, board: dealNewBoard() };
    default:
      return state;
  }
}

// helpers
function dealNewBoard() {
  const board = cloneDeep(initialState.board);

  // shuffle
  const shuffledDeck = _shuffle(Object.keys(deck));

  // deal
  board.tableau.forEach((column, i) => {
    for (let j = 0; j < i; j++) {
      column.covered.push(shuffledDeck.pop());
    }
    column.uncovered.push(shuffledDeck.pop());
  })

  board.draw = shuffledDeck;

  return board;
}