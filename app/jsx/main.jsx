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
        var cx = React.addons.classSet;
        var classes = cx({
            'card': true,
            'flipped': this.props.flipped
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

var Board = React.createClass({
    getInitialState: function () {
        return {
            deck: _.shuffle(createDeck()),
            flipped: false
        };
    },

    onMouseDown: function (e) {
        this.setState({
            flipped: !this.state.flipped
        });
    },

    render: function() {
        var that = this;
        var cards = this.state.deck.map(function (card) {
            return (
                <Card
                    key={card}
                    id={card}
                    flipped={that.state.flipped}
                />
                );
        });

        return (
            <div className="board" onMouseDown={this.onMouseDown}>
                {cards}
            </div>
        );
    }
});

React.renderComponent(
    <Board />,
    document.getElementById('screen')
);