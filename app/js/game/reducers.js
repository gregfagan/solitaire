import shuffle from 'lodash/collection/shuffle';
import range from 'lodash/utility/range';
import cloneDeep from 'lodash/lang/cloneDeep';

import { deck } from './card';
import { SHUFFLE_AND_DEAL, DRAW, SET_DRAW_COUNT, MOVE } from './actions';

const initialState = {
  options: {
    drawCount: 1,
  },
  board: {
    draw: [],
    waste: [],
    foundation: range(4).map(() => []),
    tableau: range(7).map(() => (
      { covered: [], uncovered: [] }
    ))
  },
};

export default function klondike(state=initialState, action) {
  switch(action.type) {
    case SHUFFLE_AND_DEAL:
      return { ...state, board: shuffleAndDeal() };
    case DRAW:
      return { ...state, board: draw(state.board, state.options.drawCount) };
    case SET_DRAW_COUNT:
      return { ...state, options: { ...state.options, drawCount: action.payload }};
    case MOVE:
      const { from, to } = action.payload;
      return { ...state, board: move(state.board, from, to) };
    
    default:
      return state;
  }
}

function shuffleAndDeal() {
  const board = cloneDeep(initialState.board);

  // shuffle
  const shuffledDeck = shuffle(Object.keys(deck));

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

function draw(board, count=1) {
  const { draw, waste } = board;
  
  const needToRecycle = draw.length < count;
  const source = needToRecycle ? waste.slice(0).reverse().concat(draw) : draw;
  const destination = needToRecycle ? [] : waste;

  const moved = source.slice(-count).reverse();

  return {
    ...board,
    draw: source.slice(0, -count),
    waste: destination.concat(moved),
  }
}

function move(board, from, to) {
  console.log(`moving ${from} to ${to}`);
  return board;
}