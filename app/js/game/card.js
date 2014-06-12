define(function() {
    var suits = ['♣', '♠', '♥', '♦'];
    var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

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

    return {
        isCard: isCard,
        areEqual: areEqual,
        isRed: isRed,
        toId: toId,
        suit: suit,
        rank: rank,
        doesTableauStack: doesTableauStack,
        doesFoundationStack: doesFoundationStack,
        createDeck: createDeck
    };
});