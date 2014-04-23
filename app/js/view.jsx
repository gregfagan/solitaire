/**
 * @jsx React.DOM 
 */

define([
    "underscore",
    "react-with-addons",
    "game"
    ], function define_view (_, React, game) {

    var Face = React.createClass({
        render: function() {
            var symbol = game.toId(this.props.card);
            var rotate = { WebkitTransform: "rotateZ(180deg)" };
            return (
                <div className={"side face " + (game.isRed(this.props.card) ? "red" : "black")}>
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
        getInitialState: function() {
            return game.createBoard();
        },

        render: function() {
            var events = {
                draw: function() {
                    this.setState(game.drawCard(this.state));
                }.bind(this)
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

// TODO: reintegrate interaction

        // // DOM events
        // componentDidMount: function() {
        //     document.addEventListener('mousemove', this.onMouseMove);
        //     document.addEventListener('mouseup', this.onMouseUp);
        // },

        // componentWillUnmount: function() {
        //     document.removeEventListener('mouseup', this.onMouseUp);
        //     document.removeEventListener('mousemove', this.onMouseMove);
        // },

        // onMouseUp: function(e) {
        //     if(this.state.hand.cards.length > 0)
        //         this.dropCard();
        // },

        // onMouseMove: function(e) {
        //     if(this.state.hand.cards.length > 0) {
        //         var newDrag = { x: e.pageX, y: e.pageY };
        //         var delta = {
        //             x: newDrag.x - this.state.drag.x,
        //             y: newDrag.y - this.state.drag.y
        //         };
        //         var previousPosition = this.state.hand.position;
        //         var newPosition = {
        //             x: previousPosition.x + delta.x,
        //             y: previousPosition.y + delta.y
        //         };

        //         this.setState(React.addons.update(this.state, {
        //             hand: {
        //                 position: {$set: newPosition}
        //             },
        //             drag: {$set: newDrag}
        //         }));
        //     }
        // },

        // // state transformations
        // grabCard: function(card, location, dragStart) {
        //     // TODO: bind op better (don't assume hand?)
        //     // TODO: location busted from tableau?
        //     var moveOp = this.moveCardOp(pathFromCard(card, this.state), ["hand", "cards"]);
        //     var op = _.extend(moveOp, {
        //         hand: _.extend(moveOp.hand, {
        //             position: {$set: location}
        //         }),
        //         previous: {$set: this.state},
        //         drag: {$set: dragStart}
        //     });
        //     this.setState(React.addons.update(this.state, op));
        // },

        // dropCard: function(target) {
        //     // Can the target receive the hand?
        //     var that = this;
        //     var successful = false;
        //     this.state.tableau.forEach(function(column, i) {
        //         if (_.first(column.uncovered) === target) {
        //             var colUpdate = { uncovered: {$unshift: that.state.hand.cards}};
        //             var tabUpdate = {};
        //             tabUpdate[i] = colUpdate;

        //             that.setState(React.addons.update(that.state, {
        //                 hand: { cards: {$set: []} },
        //                 tableau: tabUpdate,
        //                 previous: {$set: null}
        //             }));

        //             successful = true;
        //         }
        //     });

        //     // Invalid target, drop hand by restoring previous state.
        //     if (!successful) {
        //         this.replaceState(this.state.previous);
        //     }
        // }
    });

    return function view (containerId) {
        React.renderComponent(
            Board(),
            document.getElementById(containerId)
        );
    }
});