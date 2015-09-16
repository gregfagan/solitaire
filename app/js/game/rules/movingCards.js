//
// Cards that can be moved:
//
// * Top card of waste stack
// * Top card of any foundation stack
// * Any uncovered card in the tableau, along with the cards above it on the stack
//
// Where they can go:
//
// * Foundation (one card at a time):
//    * If the card is an Ace, and the foundation slot is empty
//    * On top of another card, if the cards share a suit
// * Tableau (one or more cards, stacked by these same rules):
//    * If the card is a King, and the tableau column is empty
//    * On top of another card, if the cards are opposite in color and the card being
//      moved is exactly one less rank than the detination. Ranks are ordered ace-low,
//     [A, 2, 3, ..., J, Q, K].
//

import update from 'react/lib/update';
import { get, set, merge } from 'lodash/object';
import { initial, first, last, dropRight } from 'lodash/array';
import { contains } from 'lodash/collection';
import { deck, suit, rank, ranks, isRed } from '../card';
import { cardsAtPath } from '../inspect'

export function move(board, fromPath, toPath) {
  if (canMove(board, fromPath, toPath)) {
    // console.log(`moving ${fromPath} (${cards}) to ${toPath} (${get(board, toPath)})`);
    return doMove(board, fromPath, toPath);
  }

  return board;
}

export function doMove(board, fromPath, toPath) {
  const cards = cardsAtPath(board, fromPath);
  const cut = set({}, initial(fromPath), {$splice: [[last(fromPath), cards.length]]});
  const paste = set({}, initial(toPath), {$push: cards});
  return update(update(board, cut), paste); 
}

function canMove(board, fromPath, toPath) {
  if (!canMoveFromPath(board, fromPath)) return false;

  const fromCardId = get(board, fromPath);
  const toCardId = get(board, toPath);

  return (
    pathIsTopOfStack(board, toPath) &&
    ( // Foundation
      // toPath: [foundation, columnIndex, index]
      toPath[0] === 'foundation' &&
      pathIsTopOfStack(board, fromPath) &&
      (pathIsAce(board, fromPath) && destinationIsEmpty(board, toPath)) ||
      canStackInFoundation(fromCardId, toCardId)
    ) ||
    ( // Tableau
      // toPath: [tableau, columnIndex, uncovered, index]
      toPath[0] === 'tableau' &&
      toPath[2] === 'uncovered' &&
      (pathIsKing(board, fromPath) && destinationIsEmpty(board, toPath)) ||
      canStackInTableau(fromCardId, toCardId)
    )
  );
}

function canMoveFromPath(board, path) {
  return (
    // Top card of waste stack
    (contains(path, 'waste') && pathIsTopOfStack(board, path)) ||
    // Top card of a foundation stack
    (contains(path, 'foundation') && pathIsTopOfStack(board, path)) ||
    // Any uncovered tableau path
    contains(path, 'uncovered')
  );
}

function pathIsTopOfStack(board, path) {
  const card = get(board, path);
  const topOfStack = last(get(board, initial(path)));
  return card === topOfStack;
}

function destinationIsEmpty(board, toPath) {
  const columnIndex = toPath[1];
  const columnIsEmpty = (toPath[0] === 'tableau') ?
    board.tableau[columnIndex].covered.length === 0 :
    true;
  return (
    last(toPath) === 0 &&
    pathIsTopOfStack(board, toPath) &&
    columnIsEmpty
  );
}

function pathIsAce(board, path) {
  const card = deck[get(board, path)];
  return card && rank(card) === first(ranks);
}

function pathIsKing(board, path) {
  const card = deck[get(board, path)];
  return card && rank(card) === last(ranks);
}

function canStackInFoundation(fromCardId, toCardId) {
  if (!fromCardId || !toCardId) return false;

  const fromCard = deck[fromCardId];
  const toCard = deck[toCardId];

  var fromRankIdx = ranks.indexOf(rank(fromCard));
  var toRankIdx = ranks.indexOf(rank(toCard));
  var isNextRank = (fromRankIdx - 1) === toRankIdx;
  var isSameSuit = suit(fromCard) === suit(toCard);

  return isNextRank && isSameSuit;
}

function canStackInTableau(fromCardId, toCardId) {
  if (!fromCardId || !toCardId) return false;

  const fromCard = deck[fromCardId];
  const toCard = deck[toCardId];

  var fromRankIdx = ranks.indexOf(rank(fromCard));
  var toRankIdx = ranks.indexOf(rank(toCard));
  var isPreviousRank = (fromRankIdx + 1) === toRankIdx;
  var isOppositeColor = isRed(fromCard) !== isRed(toCard);

  return isPreviousRank && isOppositeColor;
}