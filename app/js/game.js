define(["underscore", "update"], function define_game (_, update){
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

    function moveCard(board, from, to) {
        if (!_.isNumber(_.last(from)))
            from.push("0");

        var count = _.last(from) + 1;
        var cards = get_in(board, _.initial(from)).slice(0, count);

        var cut = build_op(board, _.initial(from), {$splice: [[0, count]]});
        var paste = build_op(board, to, {$unshift: cards});

        var full_op = _.extend(cut, paste);

        return update(board, full_op);
    }

    function recycleWaste(board) {
        return update(board, {
            draw: {$set: board.waste.slice(0).reverse()},
            waste: {$set: []}
        });
    }
    
    function drawCard(board) {
        if (board.draw.length > 0)
            return moveCard(board, ["draw"], ["waste"]);
        else
            return recycleWaste(board);
    }

    return {
        // Game events
        createBoard: createBoard,
        drawCard: drawCard,

        // Card utilities
        toId: toId,
        isRed: isRed
    };
});