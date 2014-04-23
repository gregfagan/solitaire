define(["underscore"], function define_game (_){
    function createDeck() {
        var suits = ['♣', '♠', '♥', '♦'];
        var values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        var deck = [];

        suits.forEach(function (suit) {
            values.forEach(function (value) {
                deck.push({value: value, suit: suit});
            });
        });

        return deck;
    }

    function deal(deck) {
        deck = deck.slice(0);

        var i,j;
        var column;
        var tableau = [];
        for (i = 0; i < 7; i++) {
            column = { covered: [], uncovered: [] };
            for (j = 0; j < i; j++) {
                column.covered.push(deck.shift());
            }
            column.uncovered.push(deck.shift());
            tableau.push(column);
        }

        return {
            draw: deck,
            waste: [],
            foundation: [ [], [], [], [] ],
            tableau: tableau,
            hand: {
                cards: [],
                position: { x: 0, y: 0 }
            }
        };
    }

    function createBoard() {
        return deal(_.shuffle(createDeck()));
    }

    function pathFromCard(card, container, path) {
        path = path || [];

        var currentPath;
        var child;
        var result;

        for (var k in container) {
            currentPath = path.concat(k);
            if (container.hasOwnProperty(k)) {
                child = container[k];
                if (isCard(child)) {
                    if (toId(child) === toId(card)) {
                        return currentPath;
                    }
                }
                else {
                    result = pathFromCard(card, child, currentPath);
                    if (result) {
                        return result;
                    }
                }
            }
        }

        return false;
    }

    function get_in(container, path) {
        if (path.length === 0)
            return container;

        return get_in(container[_.first(path)], _.rest(path));
    }

    function build_op(container, path, op) {
        var result = {};
        var key = _.first(path);
        if (path.length === 1) {
            result[key] = op;   
        }
        else {
            result[key] = build_op(container[key], _.rest(path), op);
        }

        return result;
    }

    function isCard(card) {
        return card.suit && card.value;
    }

    function isRed(card) {
        return card.suit === '♥' || card.suit === '♦';
    }

    function toId(card) {
        return card.value + card.suit;
    }

    return {
        createBoard: createBoard,
        toId: toId,
        isRed: isRed
    };
});