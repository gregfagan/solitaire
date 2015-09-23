import last from 'lodash/array/last';
import range from 'lodash/utility/range';
import { deck, ranks, toId } from '../card';
import { move } from '../actions';

export function isTriviallySolvable(board) {
  const allAcesInFoundation = board.foundation.reduce((result, stack) => result && stack.length > 0, true);
  const noCoveredCards = board.tableau.reduce((result, column) => result && column.covered.length === 0, true);
  const allCardsOnBoard = board.draw.length === 0 && board.waste.length === 0;

  return allAcesInFoundation && noCoveredCards && allCardsOnBoard && !isSolved(board);
}

export function isSolved(board) {
  return board.foundation.reduce((result, stack) => result && stack.length === ranks.length, true);
}

export function nextActionToSolve(board) {
  if (isTriviallySolvable(board)) {
    // Find the smallest foundation stack and grab the next card for it
    const foundationIndexes = range(4)
      .filter(i => board.foundation[i].length < ranks.length)
      .sort((a, b) => board.foundation[a].length - board.foundation[b].length);

    for (let i = 0; i < foundationIndexes.length; ++i) {
      const nextCard = nextFoundationCard(last(board.foundation[foundationIndexes[i]]));
      for (let j = 0; j < board.tableau.length; ++j) {
        if (last(board.tableau[j].uncovered) === nextCard) {
          const fromPath = ['tableau', j, 'uncovered', board.tableau[j].uncovered.length - 1];
          const toPath = ['foundation', foundationIndexes[i], board.foundation[foundationIndexes[i]].length - 1];
          return move(fromPath, toPath);
        }
      }
    }
  }
}

function nextFoundationCard(currentCard) {
  const card = deck[currentCard];
  const rankIndex = ranks.indexOf(card.rank);
  return toId({ suit: card.suit, rank: ranks[rankIndex + 1] });
}