//
// To begin a game, shuffleAndDeal a new board.
//

import shuffle from 'lodash/collection/shuffle';
import range from 'lodash/utility/range';
import cloneDeep from 'lodash/lang/cloneDeep';

import { deck } from  '../card';

//
// Board stores card IDs.
//
const allCards = Object.keys(deck);

export const initialBoard = {
  draw: [],
  waste: [],
  foundation: range(4).map(() => []),
  tableau: range(7).map(() => (
    { covered: [], uncovered: [] }
  ))
} 

export function shuffleAndDeal() {
  const board = cloneDeep(initialBoard);

  // shuffle
  const shuffledDeck = shuffle(allCards);

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