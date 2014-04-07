/**
 * @jsx React.DOM 
 */

// Unicode suit characters
// ♧♤♡♢

// Card
var Card = React.createClass({
    getInitialState: function () {
        return {
            dragging: false,
            offset: {x:0, y:0},
            pos: {x:0, y:0}
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
            pos: {
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
            pos: {
                x: e.pageX - this.state.offset.x,
                y: e.pageY - this.state.offset.y
            }
        });

        e.stopPropagation();
        e.preventDefault();
    },

    render: function() {
        var classes = "card";
        var style = {};
        if (this.state.dragging) {
            classes += " active";
            style['-webkit-transform'] =
                'translateX(' + this.state.pos.x + 'px) ' +
                'translateY(' + this.state.pos.y + 'px)';
        }

        return (
            <div className={classes} style={style}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}>
                <h1>{this.props.id}</h1>
            </div>
        );
    }
});

var Board = React.createClass({
    getInitialState: function () {
        return({
            cards: [
                "A♧",
                "2♤"
            ]
        });
    },

    render: function() {
        var that = this;
        var cards = this.state.cards.map(function (card) {
            return (
                <Card
                    key={card}
                    id={card}
                />
                );
        });

        return (
            <div className="board">
                {cards}
            </div>    
        );
    }
});

React.renderComponent(
    <Board />,
    document.getElementById('example')
);