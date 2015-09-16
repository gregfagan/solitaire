import { doMove } from './movingCards';

export function uncover(board) {
  const tableau = board.tableau;
  for (let index = 0; index < tableau.length; ++index) {
    const column = tableau[index];
    if (column.uncovered.length === 0 && column.covered.length > 0) {
      return doMove(
        board,
        ['tableau', index, 'covered', column.covered.length - 1],
        ['tableau', index, 'uncovered', 0]
      )
    }
  }

  return board;
}