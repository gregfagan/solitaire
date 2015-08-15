// action types
export const SHUFFLE_AND_DEAL = 'SHUFFLE_AND_DEAL';
export const DRAW = 'DRAW';
export const SET_DRAW_COUNT = 'SET_DRAW_COUNT';
export const MOVE = 'MOVE';

// action creators
function shuffleAndDeal() {
  return { type: SHUFFLE_AND_DEAL };
}

function draw() {
  return { type: DRAW };
}

function setDrawCount(count) {
  return { type: SET_DRAW_COUNT, payload: count };
}

function move(from, to) {
  return { type: MOVE, payload: { from, to } };
}

export default { shuffleAndDeal, draw, setDrawCount, move };
