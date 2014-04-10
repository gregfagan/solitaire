/**
 * @jsx React.DOM 
 */

function createDeck() {
    var suits = ['♧', '♤', '♡', '♢'];
    var values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    var deck = [];

    suits.forEach(function (suit) {
        values.forEach(function (value) {
            deck.push(value + suit);
        })
    })

    return deck;
}

var Draggable = {
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
    }


    // onMouseDown={this.onMouseDown}
    // onMouseMove={this.onMouseMove}
    // onMouseUp={this.onMouseUp}

    // var style = {};
    // if (this.state.dragging) {
    //     classes += " active";
    //     style['-webkit-transform'] =
    //         'translateX(' + this.state.position.x + 'px) ' +
    //         'translateY(' + this.state.position.y + 'px)';
    // }
};

// Card
var Card = React.createClass({
    render: function() {
        var classes = React.addons.classSet({
            'card': true,
            'flipped': this.props.flipped,
            'coverBottom': this.props.coverBottom
        });

        // Chrome will not show the back face of the card without a character
        // being rendered. I used '_' here, but it is the same color as the
        // background, so it doesn't appear to display.
        return (
            <div className={classes}>
                <figure className="front">{this.props.id}</figure>
                <figure className="back">_</figure>
            </div>
        );
    }
});

var Stack = React.createClass({
    render: function() {
        var first = _.first(this.props.cards);
        var rest = this.props.cards.slice(1);

        return (
            <div className="stack">
                { first && <Card key={first} id={first} flipped={this.props.flipped} coverBottom={true}/> }
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
        var card;
        if (this.props.cards.length > 0) {
            card = (
                <Card flipped={true}/>
            );
        }
        else {
            // TODO: move to Card
            card = (
                <div className="card">
                    <figure className="empty"></figure>
                </div>
            );
        }

        return (
            <div id="drawPile" onClick={this.props.drawCard}>
                { card }
            </div>
        );
    }
});

var WastePile = React.createClass({
    render: function () {
        var first = _.first(this.props.cards);
        return (
            <div id="wastePile">
                { first && <Card key={first} id={first} /> }
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
                <Tableau columns={this.state.tableau} />
            </div>
        );
    },

    drawCard: function() {
        // TODO: reset to draw pile when empty

        var first = _.first(this.state.draw);
        var rest = this.state.draw.slice(1);

        this.setState({
            draw: rest,
            waste: [].concat(first, this.state.waste)
        })
    }
});

React.renderComponent(
    <Board />,
    document.getElementById('screen')
);