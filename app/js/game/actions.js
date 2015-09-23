// action types
export const SHUFFLE_AND_DEAL = 'SHUFFLE_AND_DEAL';
export const DRAW = 'DRAW';
export const SET_DRAW_COUNT = 'SET_DRAW_COUNT';
export const MOVE = 'MOVE';

// action creators
export function shuffleAndDeal() {
  return { type: SHUFFLE_AND_DEAL };
}

export function draw() {
  return { type: DRAW };
}

export function setDrawCount(count) {
  return { type: SET_DRAW_COUNT, payload: count };
}

export function move(from, to) {
  return { type: MOVE, payload: { from, to } };
}
