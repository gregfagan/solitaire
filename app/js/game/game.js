define([
    "underscore",
    "update",
    "game/card"
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
            tableau: tableau
        };
    }

    function createBoard() {
        return deal(_.shuffle(Card.createDeck()));
    }

    function pathFromCard(container, card, path) {
        path = path || [];

        var currentPath;
        var child;
        var result;

        for (var k in container) {
            currentPath = path.concat(k);
            if (container.hasOwnProperty(k)) {
                child = container[k];
                if (Card.isCard(child)) {
                    if (Card.toId(child) === Card.toId(card)) {
                        return currentPath;
                    }
                }
                else {
                    result = pathFromCard(child, card, currentPath);
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

    function moveCardPaths(board, from, to) {
        var fromIdx = parseInt(_.last(from), 10);
        if (_.isNaN(fromIdx)) {
            from.push("0");
            fromIdx = 0;
        }

        if (_.isNaN(parseInt(_.last(to), 10)))
            to.push("0");

        var count = fromIdx + 1;
        var cards = getIn(board, _.initial(from)).slice(0, count).reverse();

        var cut = buildOp(board, _.initial(from), {$splice: [[0, count]]});
        var paste = buildOp(board, _.initial(to), {$unshift: cards});

        var postCut = update(board, cut);
        var postPaste = update(postCut, paste);

        return postPaste;
    }

    function canMoveCard(board, path) {
        if (_.contains(path, "tableau") && !_.contains(path, "uncovered"))
            return false;
        if ((_.contains(path, "waste") || _.contains(path, "foundation")) && _.last(path) !== 0)
            return false;
        if (_.contains(path, "draw"))
            return false;

        return true;
    }

    function moveCard(board, from, to) {
        if (Card.isCard(from)) from = pathFromCard(board, from);
        if (Card.isCard(to)) to = pathFromCard(board, to);
        return moveCardPaths(board, from, to);
    }

    function canReceiveCard(board, from, to) {
        if (_.last(to) !== 0)
            return false;

        var fromCard = getIn(board, from);
        var toCard = getIn(board, to);

        if (_.contains(to, "foundation"))
            return true;
        else if (_.contains(to, "uncovered") &&
            fromCard && toCard && 
            Card.isRed(fromCard) !== Card.isRed(toCard)) {
            return true;
        }

        return false;
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
        // check state        
        canMoveCard: canMoveCard,
        canReceiveCard: canReceiveCard,

        // update state
        createBoard: createBoard,
        drawCard: drawCard,
        moveCard: moveCard
    };
});