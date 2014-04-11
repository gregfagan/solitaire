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

function isRed(card) {
    return card.suit === '♡' || card.suit === '♢';
}

function isBlack(card) {
    return !isRed(card);
}

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

    render: function () {
        var transform
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
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
            >
                {this.props.children}
            </div>
        );
    }
});

// Card
var Card = React.createClass({
    render: function() {
        var classes = React.addons.classSet({
            'card': true,
            'flipped': this.props.flipped,
            'coverBottom': this.props.coverBottom
        });

        // TODO: cleaner. make 'red' and 'black' css classes to use stylesheet
        // defined colors.
        var front =  {
            className: this.props.slot ? "slot" : "front",
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
                <figure className={front.className} style={front.style}>{front.text}</figure>
                <figure className="back">_</figure>
            </div>
        );
    }
});

var Stack = React.createClass({
    render: function() {
        var first = _.first(this.props.cards);
        var rest = _.rest(this.props.cards);

        return (
            <div className="stack">
                { first && <Card card={first} flipped={this.props.flipped} coverBottom={true}/> }
                { rest.length > 0 && <Stack cards={rest} flipped={this.props.flipped} /> }
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
                { first && <Draggable><Card card={first} /></Draggable> }
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

var Board = React.createClass({
    getInitialState: function () {
        var deck = _.shuffle(createDeck());

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
            tableau: tableau
        };
    },

    render: function() {
        return (
            <div id="board">
                <DrawPile cards={this.state.draw} drawCard={this.drawCard} />
                <WastePile cards={this.state.waste} />
                <Foundation />
                <Tableau columns={this.state.tableau} />
            </div>
        );
    },

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
    }
});

React.renderComponent(
    <Board />,
    document.getElementById('screen')
);