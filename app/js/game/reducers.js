import { SET_DRAW_COUNT, SHUFFLE_AND_DEAL, DRAW, MOVE } from './actions';

import { initialBoard, shuffleAndDeal } from './rules/begin';
import { draw } from './rules/drawingCards';
import { move } from './rules/movingCards';

const initialState = {
  options: {
    drawCount: 1,
  },
  board: initialBoard,
};

export default function klondike(state=initialState, action) {
  switch(action.type) {
    case SET_DRAW_COUNT:
      return { ...state, options: { ...state.options, drawCount: action.payload }};
    case SHUFFLE_AND_DEAL:
      return { ...state, board: shuffleAndDeal() };
    case DRAW:
      return { ...state, board: draw(state.board, state.options.drawCount) };
    case MOVE:
      const { from, to } = action.payload;
      return { ...state, board: move(state.board, from, to) };
    default:
      return state;
  }
}
