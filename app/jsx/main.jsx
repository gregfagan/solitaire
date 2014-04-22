/**
 * @jsx React.DOM 
 */

function createDeck() {
    var suits = ['♣', '♠', '♥', '♦'];
    var values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    var deck = [];

    suits.forEach(function (suit) {
        values.forEach(function (value) {
            deck.push({value: value, suit: suit});
        })
    })

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
    }
}

function pathFromCard(card, container, path) {
    path = path || [];

    var currentPath;
    var child;
    var result;

    for (k in container) {
        currentPath = path.concat(k);
        if (container.hasOwnProperty(k)) {
            child = container[k];
            if (isCard(child)) {
                if (toId(child) === toId(card)) {
                    return currentPath;
                }
            }
            else {
                var result = pathFromCard(card, child, currentPath);
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

var Face = React.createClass({
    render: function() {
        var symbol = toId(this.props.card);
        var rotate = { WebkitTransform: "rotateZ(180deg)" };
        return (
            <div className={"side face " + (isRed(this.props.card) ? "red" : "black")}>
                <figure className="side corner">{symbol}</figure>
                <figure className="side corner" style={rotate}>{symbol}</figure>
                <figure className="side center">{this.props.card.suit}</figure>
            </div>
        );
    }
});

var Card = React.createClass({
    getDefaultProps: function() {
        return {
            events: {}
        }
    },

    onMouseDown: function(e) {
        if (this.props.events.grab) {
            var node = this.getDOMNode();
            var location = { x: node.offsetLeft, y: node.offsetTop };
            var drag = { x: e.pageX, y: e.pageY }
            this.props.events.grab(this.props.face, location, drag);
            e.preventDefault();
            e.stopPropagation();
        }
    },

    onMouseUp: function(e) {
        if (this.props.events.drop) {
            this.props.events.drop(this.props.face);
            e.preventDefault();
            e.stopPropagation();
        }
    },

    render: function() {
        var classes = React.addons.classSet({
            'card': true,
            'flipped': this.props.flipped,
            'coverBottom': this.props.coverBottom
        });

        var front = this.props.face ?
            <Face card={this.props.face} /> :
            <div className="side slot"></div>;

        var back;
        if (this.props.face) {
            back = <div className="side back"/>;
        }

        return (
            <div
                className={classes}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
            >
                { front }
                { back }
            </div>
        );
    }
});

var Stack = React.createClass({
    render: function() {
        var first = _.first(this.props.cards);
        var rest = _.rest(this.props.cards);

        if (first) {
            first = <Card
                face={first}
                flipped={this.props.flipped}
                coverBottom={true}
                events={this.props.events} />;
        }

        if (rest.length > 0) {
            rest = <Stack
                cards={rest}
                flipped={this.props.flipped}
                events={this.props.events} />;
        }

        return (
            <div className="stack">
                { rest }
                { first }
            </div>
        );
    }
});

var Column = React.createClass({
    render: function () {
        return (
            <div className="column">
                <Stack cards={this.props.covered}   flipped={true} />
                <Stack cards={this.props.uncovered} events={this.props.events} />
            </div>
        );
    }
});

var Tableau = React.createClass({
    render: function () {
        var that = this;
        var columns = this.props.columns.map(function (column, index) {
            return (
                <Column
                    key={index}
                    covered={column.covered}
                    uncovered={column.uncovered}
                    events={that.props.events} />
            );
        });
        return (
            <div id="tableau">
                {columns}
            </div>
        );
    }
});

var DrawPile = React.createClass({
    render: function() {
        var empty = this.props.cards.length <= 0;
        return (
            <div id="drawPile" onClick={this.props.events.draw}>
                <Card face={_.last(this.props.cards)} flipped={!empty}/>
            </div>
        );
    }
});

var WastePile = React.createClass({
    render: function () {
        var first = _.first(this.props.cards);

        if (first) {
            first = <Card face={first} events={this.props.events} />;
        }

        return (
            <div id="wastePile">
                { first }
            </div>
        );
    }
});

var Foundation = React.createClass({
    render: function () {
        return (
            <div id="foundation">
                <Card slot={true}/>
                <Card slot={true}/>
                <Card slot={true}/>
                <Card slot={true}/>
            </div>
        );
    }
});

var Hand = React.createClass({
    render: function() {
        var position = this.props.hand.position || { x: 0, y: 0 };
        transform = {
            // TODO: use all vendor specific transform styles
            WebkitTransform: 
                'translateX(' + position.x + 'px)' +
                'translateY(' + position.y + 'px)' +
                'translateZ(15px)'
        };

        return (
            <div id="hand" style={transform}>
                <Stack cards={this.props.hand.cards} />
            </div>
        );
    }
});

var Board = React.createClass({
    getInitialState: function () {
        return deal(_.shuffle(createDeck()));
    },

    render: function() {
        var events = {
            draw: this.drawCard
        };
        if (this.state.hand.cards.length > 0) {
            events.drop = this.dropCard;
        }
        else {
            events.grab = this.grabCard;
        }

        return (
            <div id="board">
                <DrawPile cards={this.state.draw} events={events} />
                <WastePile cards={this.state.waste} events={events} />
                <Foundation />
                <Tableau columns={this.state.tableau} events={events} />
                <Hand hand={this.state.hand} />
            </div>
        );
    },

    // DOM events
    componentDidMount: function() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    },

    componentWillUnmount: function() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    },

    onMouseUp: function(e) {
        if(this.state.hand.cards.length > 0)
            this.dropCard();
    },

    onMouseMove: function(e) {
        if(this.state.hand.cards.length > 0) {
            var newDrag = { x: e.pageX, y: e.pageY };
            var delta = {
                x: newDrag.x - this.state.drag.x,
                y: newDrag.y - this.state.drag.y
            };
            var previousPosition = this.state.hand.position;
            var newPosition = {
                x: previousPosition.x + delta.x,
                y: previousPosition.y + delta.y
            };

            this.setState(React.addons.update(this.state, {
                hand: {
                    position: {$set: newPosition}
                },
                drag: {$set: newDrag}
            }));
        }
    },

    // `from` and `to` are lists of keys that define a path inside the game state
    moveCardOp: function(from, to) {
        var count = _.last(from) + 1;
        var cards = get_in(this.state, _.initial(from)).slice(0, count);

        var cut = build_op(this.state, _.initial(from), {$splice: [[0, count]]});
        var paste = build_op(this.state, to, {$unshift: cards});

        return _.extend(cut, paste);
    },

    // state transformations
    drawCard: function() {
        // empty?
        if (this.state.draw.length <= 0) {
            this.setState({
                draw: this.state.waste.slice(0).reverse(),
                waste: []
            });
        }
        else {
            this.setState(React.addons.update(this.state, {
                draw: { $set: _.rest(this.state.draw) },
                waste: { $unshift: [ _.first(this.state.draw) ] }
            }));
        }
    },

    grabCard: function(card, location, dragStart) {
        // TODO: bind op better (don't assume hand?)
        // TODO: location busted from tableau?
        var moveOp = this.moveCardOp(pathFromCard(card, this.state), ["hand", "cards"]);
        var op = _.extend(moveOp, {
            hand: _.extend(moveOp.hand, {
                position: {$set: location}
            }),
            previous: {$set: this.state},
            drag: {$set: dragStart}
        });
        this.setState(React.addons.update(this.state, op));
    },

    dropCard: function(target) {
        // Can the target receive the hand?
        var that = this;
        var successful = false;
        this.state.tableau.forEach(function(column, i) {
            if (_.first(column.uncovered) === target) {
                var colUpdate = { uncovered: {$unshift: that.state.hand.cards}};
                var tabUpdate = {};
                tabUpdate[i] = colUpdate;

                that.setState(React.addons.update(that.state, {
                    hand: { cards: {$set: []} },
                    tableau: tabUpdate,
                    previous: {$set: null}
                }));

                successful = true;
            }
        });

        // Invalid target, drop hand by restoring previous state.
        if (!successful) {
            this.replaceState(this.state.previous);
        }
    }
});

React.renderComponent(
    <Board />,
    document.getElementById('screen')
);