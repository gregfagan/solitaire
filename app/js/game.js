define([
    "underscore",
    "update",
    "card"
    ], function define_game (_, update, Card){

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
        return deal(_.shuffle(Card.createDeck()));
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
                if (Card.isCard(child)) {
                    if (toId(child) === Card.toId(card)) {
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

    function getIn(container, path) {
        if (path.length === 0)
            return container;

        return getIn(container[_.first(path)], _.rest(path));
    }

    function buildOp(container, path, op) {
        var result = {};
        var key = _.first(path);
        if (path.length === 1) {
            result[key] = op;   
        }
        else {
            result[key] = buildOp(container[key], _.rest(path), op);
        }

        return result;
    }

    function moveCard(board, from, to) {
        if (!_.isNumber(_.last(from)))
            from.push("0");

        var count = _.last(from) + 1;
        var cards = getIn(board, _.initial(from)).slice(0, count);

        var cut = buildOp(board, _.initial(from), {$splice: [[0, count]]});
        var paste = buildOp(board, to, {$unshift: cards});

        var fullOp = _.extend(cut, paste);

        return update(board, fullOp);
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
        createBoard: createBoard,
        drawCard: drawCard,
        moveCard: moveCard
    };
});