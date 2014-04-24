/**
 * @jsx React.DOM 
 */

define([
    "underscore",
    "react-with-addons",
    "game",
    "card"
    ], function define_view (_, React, Game, Card) {

    var FaceView = React.createClass({
        render: function() {
            var symbol = Card.toId(this.props.card);
            var rotate = { WebkitTransform: "rotateZ(180deg)" };
            return (
                <div className={"side face " + (Card.isRed(this.props.card) ? "red" : "black")}>
                    <figure className="side corner">{symbol}</figure>
                    <figure className="side corner" style={rotate}>{symbol}</figure>
                    <figure className="side center">{Card.suit(this.props.card)}</figure>
                </div>
            );
        }
    });

    var CardView = React.createClass({
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
                <FaceView card={this.props.face} /> :
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

    var StackView = React.createClass({
        render: function() {
            var first = _.first(this.props.cards);
            var rest = _.rest(this.props.cards);

            if (first) {
                first = <CardView
                    face={first}
                    flipped={this.props.flipped}
                    coverBottom={true}
                    events={this.props.events} />;
            }

            if (rest.length > 0) {
                rest = <StackView
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

    var ColumnView = React.createClass({
        render: function () {
            return (
                <div className="column">
                    <StackView cards={this.props.covered}   flipped={true} />
                    <StackView cards={this.props.uncovered} events={this.props.events} />
                </div>
            );
        }
    });

    var TableauView = React.createClass({
        render: function () {
            var that = this;
            var columns = this.props.columns.map(function (column, index) {
                return (
                    <ColumnView
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

    var DrawView = React.createClass({
        render: function() {
            var empty = this.props.cards.length <= 0;
            return (
                <div id="drawPile" onClick={this.props.events.draw}>
                    <CardView face={_.last(this.props.cards)} flipped={!empty}/>
                </div>
            );
        }
    });

    var WasteView = React.createClass({
        render: function () {
            var first = _.first(this.props.cards);

            if (first) {
                first = <CardView face={first} events={this.props.events} />;
            }

            return (
                <div id="wastePile">
                    { first }
                </div>
            );
        }
    });

    var FoundationView = React.createClass({
        render: function () {
            return (
                <div id="foundation">
                    <CardView slot={true}/>
                    <CardView slot={true}/>
                    <CardView slot={true}/>
                    <CardView slot={true}/>
                </div>
            );
        }
    });

    var HandView = React.createClass({
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
                    <StackView cards={this.props.hand.cards} />
                </div>
            );
        }
    });

    var BoardView = React.createClass({
        getInitialState: function() {
            return Game.createBoard();
        },

        bindEvent: function(gameEvent) {
            return function() {
                var newBoard = gameEvent.apply(null, [].concat(this.state, _.toArray(arguments)));
                this.setState(newBoard);
            }.bind(this);
        },

        render: function() {
            var events = {
                draw: this.bindEvent(Game.drawCard)
            };

            return (
                <div id="board">
                    <DrawView cards={this.state.draw} events={events} />
                    <WasteView cards={this.state.waste} events={events} />
                    <FoundationView />
                    <TableauView columns={this.state.tableau} events={events} />
                    <HandView hand={this.state.hand} />
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
            BoardView(),
            document.getElementById(containerId)
        );
    }
});