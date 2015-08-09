import _ from 'lodash';

export const suits   = ['♣', '♠', '♥', '♦'];
export const suits_c = ['C', 'S', 'H', 'D'];
export const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const images = _(suits)
  .map((suit, i) => ranks.map(rank => ({ id: rank + suit, image_id: rank + suits_c[i] })))
  .flatten()
  .transform((result, card) => result[card.id] = require(`../../img/svgCards/${card.image_id}.svg`), {})
  .value();

// This value was calculated by taking the measurements found here:
//      http://www.gripboard.com/index.php?showtopic=41080
// and the current pixel count of a card width (2.5em/inches/90 pixels)
// to find a ratio between inches and pixels.
// TODO: This should be calculated at runtime so that it can change with
// card size (which should scale with viewport)
export const thickness = '0.430615385px';

export function isCard(card) {
  return card.suit && card.rank;
}

export function areEqual(a, b) {
  return a.suit === b.suit && a.rank === b.rank;
}

export function isRed(card) {
  return card.suit === '♥' || card.suit === '♦';
}

export function toId(card) {
  return card.rank + card.suit;
}

export function suit(card) {
  return card.suit;
}

export function suit_c(card) {
  return suits_c[suits.indexOf(card.suit)];
}

export function rank(card) {
  return card.rank;
}

export function doesTableauStack(fromCard, toCard) {
  if (!fromCard || !toCard) return false;

  var fromRankIdx = ranks.indexOf(rank(fromCard));
  var toRankIdx = ranks.indexOf(rank(toCard));
  var isPreviousRank = (fromRankIdx + 1) === toRankIdx;
  var isOppositeColor = isRed(fromCard) !== isRed(toCard);

  return isPreviousRank && isOppositeColor;
}

export function doesFoundationStack(fromCard, toCard) {
  if (!fromCard || !toCard) return false;

  var fromRankIdx = ranks.indexOf(rank(fromCard));
  var toRankIdx = ranks.indexOf(rank(toCard));
  var isNextRank = (fromRankIdx - 1) === toRankIdx;
  var isSameSuit = suit(fromCard) === suit(toCard);

  return isNextRank && isSameSuit;
}

export const deck = suits.map(
  suit => ranks.map(
    rank => ({
      suit, rank, id: toId({ rank, suit })
    })
  ))
  .reduce((deck, suitOfCards) => [...deck, ...suitOfCards]) // flatten
  .reduce((deck, card) => { //index
    const { id, ...suitAndRank } = card;
    deck[id] = suitAndRank;
    return deck;
  }, {});

export function createDeck() {
  const deck = [];

  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({rank: rank, suit: suit});
    });
  });

  return deck;
}