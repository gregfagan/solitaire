import { get } from 'lodash/object';
import { initial, last } from 'lodash/array';
export function cardsAtPath(board, path) {
  const stack = initial(path);
  const index = last(path);
  return get(board, stack).slice(index);
}