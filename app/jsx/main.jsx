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

// Card
var Card = React.createClass({
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

    render: function() {
        // var classes = "card";
        // var style = {};
        // if (this.state.dragging) {
        //     classes += " active";
        //     style['-webkit-transform'] =
        //         'translateX(' + this.state.position.x + 'px) ' +
        //         'translateY(' + this.state.position.y + 'px)';
        // }
        // className={classes} style={style}
        var classes = React.addons.classSet({
            'card': true,
            'flipped': this.props.flipped,
            'coverBottom': this.props.coverBottom
        });

        // onMouseDown={this.onMouseDown}
        // onMouseMove={this.onMouseMove}
        // onMouseUp={this.onMouseUp}

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
            <div className="tableau">
                {columns}
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
            tableau: tableau
        };
    },

    render: function() {
        return (
            <div className="board">
                <Tableau columns={this.state.tableau} />
            </div>
        );
    }
});

React.renderComponent(
    <Board />,
    document.getElementById('screen')
);