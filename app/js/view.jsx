/**
 * @jsx React.DOM 
 */

define([
    "underscore",
    "react-with-addons",
    "draggable",
    "card"
    ], function define_view (_, React, Draggable, Card) {

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
        render: function() {
            var classes = React.addons.classSet({
                'card': true,
                'flipped': this.props.flipped,
                'cascade-down': this.props.cascade === "down",
                'cascade-none': this.props.cascade === "none"
            });

            var front = this.props.face ?
                <FaceView card={this.props.face} /> :
                <div className="side slot"></div>;

            var back;
            if (this.props.face) {
                back = <div className="side back"/>;
            }

            return (
                <div className={classes}>
                    { front }
                    { back }
                </div>
            );
        }
    });

    var StackView = React.createClass({
        getDefaultProps: function() {
            return { cascade: "none" };
        },

        render: function() {
            var last = _.last(this.props.cards);
            var initial = _.initial(this.props.cards);
            var container = React.DOM.div;

            if (last) {
                if (this.props.interaction.canMove(last))
                    container = Draggable;

                last = <CardView
                    face={last}
                    flipped={this.props.flipped}
                    cascade={this.props.cascade}
                    interaction={this.props.interaction} />;
            }

            if (initial.length > 0) {
                initial = <StackView
                    cards={initial}
                    flipped={this.props.flipped}
                    cascade={this.props.cascade}
                    interaction={this.props.interaction} />;
            }

            return this.transferPropsTo(container({className: "stack"}, last, initial));
        }
    });

    var ColumnView = React.createClass({
        render: function () {
            return (
                <div className="column">
                    <StackView
                        cards={this.props.covered}
                        interaction={this.props.interaction}
                        flipped={true}
                        cascade="down" />
                    <StackView
                        cards={this.props.uncovered}
                        interaction={this.props.interaction}
                        cascade="down" />
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
                        interaction={that.props.interaction} />
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
                <div id="drawPile" onClick={this.props.interaction.draw}>
                    <CardView face={_.last(this.props.cards)} flipped={!empty}/>
                </div>
            );
        }
    });

    var WasteView = React.createClass({
        render: function () {
            if (this.props.cards.length <= 0)
                return <div id="wastePile"/>
            else
                return (
                    <StackView
                        id="wastePile"
                        cards={this.props.cards}
                        interaction={this.props.interaction} />
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

    var BoardView = React.createClass({
        getInitialState: function() {
            return {
                board: this.props.createBoard(),
                cardInHand: null
            };
        },

        render: function() {
            var board = this.state.board;
            var interaction = {
                draw: this.bindGameEvent(this.props.drawCard),

                canMove: this.bindCapability(this.props.canMoveCard),
                canReceive: this.bindCapability(this.props.canReceiveCard, this.state.cardInHand)
            }

            return (
                <div id="board">
                    <DrawView cards={board.draw} interaction={interaction} />
                    <WasteView cards={board.waste} interaction={interaction} />
                    <FoundationView />
                    <TableauView columns={board.tableau} interaction={interaction} />
                </div>
            );
        },

        bindGameEvent: function bindGameEvent(gameEvent) {
            function wrapResult(newBoard) {
                return { board: newBoard };
            };

            return _.compose(
                this.setState,
                wrapResult,
                _.partial(gameEvent, this.state.board)
            ).bind(this);
        },

        bindCapability: function bindCapability(gameCapability) {
            return _.partial(gameCapability, this.state.board);
        }
    });

    return function view (game, containerId) {
        React.renderComponent(
            BoardView(game),
            document.getElementById(containerId)
        );
    }
});