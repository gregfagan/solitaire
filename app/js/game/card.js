import _ from 'lodash';

export const suits   = ['♣', '♠', '♥', '♦'];
export const suits_c = ['C', 'S', 'H', 'D'];
export const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const images = _(suits)
  .map((suit, i) => ranks.map(rank => ({ id: rank + suit, image_id: rank + suits_c[i] })))
  .flatten()
  .transform((result, card) => result[card.id] = require(`../../img/svgCards/${card.image_id}.svg`), {})
  .value();

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

// Complete map of id => card
export const deck = suits.map(
  suit => ranks.map(
    rank => ({ suit, rank, id: toId({ rank, suit }) })
  ))
  .reduce((deck, suitOfCards) => [...deck, ...suitOfCards]) // flatten
  .reduce((deck, card) => { //index
    const { id, ...suitAndRank } = card;
    deck[id] = suitAndRank;
    return deck;
  }, 
  {}
);
