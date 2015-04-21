var suits   = ['♣', '♠', '♥', '♦'];
var suits_c = ['C', 'S', 'H', 'D'];
var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

suits_c.forEach((suit) => {
  return ranks.forEach((rank) => {
    var id = rank + suit;
    require("../../img/svgCards/" + id + ".svg");
  })
});

// This value was calculated by taking the measurements found here:
//      http://www.gripboard.com/index.php?showtopic=41080
// and the current pixel count of a card width (2.5em/inches/90 pixels)
// to find a ratio between inches and pixels.
// TODO: This should be calculated at runtime so that it can change with
// card size (which should scale with viewport)
var thickness = 0.430615385;

function isCard(card) {
  return card.suit && card.rank;
}

function areEqual(a, b) {
  return a.suit === b.suit && a.rank === b.rank;
}

function isRed(card) {
  return card.suit === '♥' || card.suit === '♦';
}

function toId(card) {
  return card.rank + card.suit;
}

function suit(card) {
  return card.suit;
}

function suit_c(card) {
  return suits_c[suits.indexOf(card.suit)];
}

function rank(card) {
  return card.rank;
}

function doesTableauStack(fromCard, toCard) {
  if (!fromCard || !toCard) return false;

  var fromRankIdx = ranks.indexOf(rank(fromCard));
  var toRankIdx = ranks.indexOf(rank(toCard));
  var isPreviousRank = (fromRankIdx + 1) === toRankIdx;
  var isOppositeColor = isRed(fromCard) !== isRed(toCard);

  return isPreviousRank && isOppositeColor;
}

function doesFoundationStack(fromCard, toCard) {
  if (!fromCard || !toCard) return false;

  var fromRankIdx = ranks.indexOf(rank(fromCard));
  var toRankIdx = ranks.indexOf(rank(toCard));
  var isNextRank = (fromRankIdx - 1) === toRankIdx;
  var isSameSuit = suit(fromCard) === suit(toCard);

  return isNextRank && isSameSuit;
}

function createDeck() {
  var deck = [];

  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({rank: rank, suit: suit});
    });
  });

  return deck;
}

module.exports = {
  isCard: isCard,
  areEqual: areEqual,
  isRed: isRed,
  toId: toId,
  suit: suit,
  suit_c: suit_c,
  rank: rank,
  thickness: thickness,
  doesTableauStack: doesTableauStack,
  doesFoundationStack: doesFoundationStack,
  createDeck: createDeck
};