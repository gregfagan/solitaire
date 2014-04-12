/**
 * @jsx React.DOM 
 */

function createDeck() {
    var suits = ['♧', '♤', '♡', '♢'];
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

function isRed(card) {
    return card.suit === '♡' || card.suit === '♢';
}

function isBlack(card) {
    return !isRed(card);
}

// Adapted from Jared Forsyth's code:
// http://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable
var Draggable = React.createClass({
    getInitialState: function () {
        return {
            dragging: false,
            offset: {x:0, y:0},
            position: {x:0, y:0}
        };
    },

    // calculate relative position to the mouse and set dragging=true
    onMouseDown: function (e) {
        this.setState({
            dragging: true,
            offset:{
                x: e.pageX,
                y: e.pageY,
            },
            position: {
                x: 0,
                y: 0
            }
        });

        e.stopPropagation();
        e.preventDefault();
    },

    onMouseUp: function (e) {
        this.setState({ dragging: false });
        e.stopPropagation();
        e.preventDefault();
    },

    onMouseMove: function (e) {
        if (!this.state.dragging) return

        this.setState({
            position: {
                x: e.pageX - this.state.offset.x,
                y: e.pageY - this.state.offset.y
            }
        });

        e.stopPropagation();
        e.preventDefault();
    },

    componentDidUpdate: function (props, state) {
        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this.onMouseMove)
            document.addEventListener('mouseup', this.onMouseUp)
        } else if (!this.state.dragging && state.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove)
            document.removeEventListener('mouseup', this.onMouseUp)
        }
    },

    render: function () {
        var transform = {};
        if (this.state.dragging) {
            transform = {
                // TODO: use all vendor specific transform styles
                WebkitTransform: 
                    'translateX(' + this.state.position.x + 'px) ' +
                    'translateY(' + this.state.position.y + 'px)' +
                    'translateZ(15px)'
            };
        }

        return (
            <div
                style={transform}
                onMouseDown={this.onMouseDown}
            >
                {this.props.children}
            </div>
        );
    }
});

var Card = React.createClass({
    onMouseDown: function(e) {
        var node = this.getDOMNode();
        var where = { x: node.offsetLeft, y: node.offsetTop };
        Board.events.broadcast('grabCard', this.props.card, where)();
    },

    render: function() {
        var classes = React.addons.classSet({
            'card': true,
            'flipped': this.props.flipped,
            'coverBottom': this.props.coverBottom
        });

        // TODO: cleaner. make 'red' and 'black' css classes to use stylesheet
        // defined colors.
        var face =  {
            className: this.props.slot ? "slot" : "face",
            text: this.props.card ? this.props.card.value + this.props.card.suit : "",
            style: this.props.card ? {
                color: isRed(this.props.card) ? "red" : "black"
            } : null
        }

        // Chrome will not show the back face of the card without a character
        // being rendered. I used '_' here, but it is the same color as the
        // background, so it doesn't appear to display.
        return (
            <div className={classes}>
                <figure
                    className={face.className}
                    style={face.style}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={Board.events.broadcast('dropCard', this.props.card)}
                >
                    {face.text}
                </figure>
                <figure className="back">_</figure>
            </div>
        );
    }
});

var Stack = React.createClass({
    render: function() {
        var last = _.last(this.props.cards);
        var initial = _.initial(this.props.cards);

        return (
            <div className="stack">
                { last && <Card card={last} flipped={this.props.flipped} coverBottom={true}/> }
                { initial.length > 0 && <Stack cards={initial} flipped={this.props.flipped} /> }
            </div>
        );
    }
});

var Column = React.createClass({
    render: function () {
        return (
            <div className="column">
                <Stack cards={this.props.covered} flipped={true} />
                <Stack cards={this.props.uncovered} />
            </div>
        );
    }
});

var Tableau = React.createClass({
    render: function () {
        var columns = this.props.columns.map(function (column, index) {
            return (
                <Column key={index} covered={column.covered} uncovered={column.uncovered} />
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
            <div id="drawPile" onClick={this.props.drawCard}>
                <Card flipped={!empty} slot={empty}/>
            </div>
        );
    }
});

var WastePile = React.createClass({
    render: function () {
        var first = _.first(this.props.cards);
        return (
            <div id="wastePile">
                { first && <Card card={first} /> }
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
                'translateX(' + position.x + 'px) ' +
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
    // TODO: don't do this. instead, build a game events object with the valid
    // event callback object for the state of the game (either grab or drop
    // depending on hand) and pass that to children.
    //
    // Children can inspect the object to see if they should take action on DOM
    // events.
    statics: {
        events: function () {
            var that = this;
            return {
                subscribe: function(o) {
                    that.handler = o;
                },
                broadcast: function(e /*, ... */) {
                    var args = _.rest(_.toArray(arguments));
                    return function() {
                        that.handler[e].apply(that.handler, args);    
                    }
                }
            }
        }()
    },

    getInitialState: function () {
        return deal(_.shuffle(createDeck()));
    },

    render: function() {
        return (
            <div id="board">
                <DrawPile cards={this.state.draw} drawCard={this.drawCard} />
                <WastePile cards={this.state.waste} />
                <Foundation />
                <Tableau columns={this.state.tableau} />
                <Hand hand={this.state.hand}/>
            </div>
        );
    },

    componentDidMount: function() {
        Board.events.subscribe(this);
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

    grabCard: function(card, location) {
        // Find the card
        if (_.first(this.state.waste) === card) {
            this.setState({
                waste: _.rest(this.state.waste),
                hand: {
                    cards: [ card ],
                    position: location
                },
                previous: this.state
            });
        }
        // TODO: look elsewhere :)
    },

    dropCard: function(target) {
        // Can the target receive the hand?
        var that = this;
        var successful = false;
        this.state.tableau.forEach(function(column, i) {
            if (_.first(column.uncovered) === target) {
                var newColumn = React.addons.update(column, {
                    uncovered: {$unshift: that.state.hand.cards}
                })

                that.setState(React.addons.update(that.state, {
                    hand: { cards: {$set: []} },
                    tableau: {$splice: [[i, 1, newColumn]]},
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