define(function() {
    return {
        isCard: function isCard(card) {
            return card.suit && card.rank;
        },

        isRed: function isRed(card) {
            return card.suit === '♥' || card.suit === '♦';
        },

        toId: function toId(card) {
            return card.rank + card.suit;
        },

        suit: function suit(card) {
            return card.suit;
        },

        rank: function rank(card) {
            return card.rank;
        },

        createDeck: function createDeck() {
            var suits = ['♣', '♠', '♥', '♦'];
            var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            var deck = [];

            suits.forEach(function (suit) {
                ranks.forEach(function (rank) {
                    deck.push({rank: rank, suit: suit});
                });
            });

            return deck;
        }
    };
});