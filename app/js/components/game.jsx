/**
 * @jsx React.DOM
 */

define([
    "underscore",
    "react-with-addons",
    "game/card",
    "components/draggable",
    "components/droptarget",
    "components/stack",
    "components/card"
],
function (_, React, Card, Draggable, DropTarget, StackView, CardView) {

    var ColumnView = React.createClass({
        render: function () {
            return (
                <div className="column">
                    <CardView slot={true} cascade="none"/>
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
                    <CardView card={_.last(this.props.cards)} flipped={!empty}/>
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
            var that = this;
            var stacks = this.props.cards.map(function(stack, index) {
                return (
                    <div key={index} className="card">
                        <CardView slot={true} cascade="none"/>
                        <StackView
                            cards={stack}
                            interaction={that.props.interaction} />
                    </div>
                );
            });
            return (
                <div id="foundation">
                    { stacks }
                </div>
            );
        }
    });

    var BoardView = React.createClass({
        getInitialState: function() {
            return {
                board: this.props.createBoard()
            };
        },

        render: function() {
            var board = this.state.board;
            var draggingCard = this.state.draggingCard;
            var interaction = {
                draw: this.bindGameEvent(this.props.drawCard),

                containerForCard: function (card) {
                    if (card) {
                        if (draggingCard && !Card.areEqual(draggingCard, card) && this.canReceive(draggingCard, card)) {
                            return DropTarget;
                        }
                        else if (this.canMove(card)) {
                            return Draggable;
                        }
                    }

                    return React.DOM.div;
                },

                canMove: this.bindCapability(this.props.canMoveCard),
                canReceive: this.bindCapability(this.props.canReceiveCard),

                onDragBegin: _.compose(this.onDragBegin, extractCardFromChildren),
                onDragEnd: _.compose(this.onDragEnd, extractCardFromChildren)
            }

            return (
                <div id="board">
                    <DrawView cards={board.draw} interaction={interaction} />
                    <WasteView cards={board.waste} interaction={interaction} />
                    <FoundationView cards={board.foundation} interaction={interaction} />
                    <TableauView columns={board.tableau} interaction={interaction} />
                </div>
            );
        },

        onDragBegin: function onDragBegin(card) {
            this.setState({draggingCard: card});
        },

        onDragEnd: function onDragEnd(targetCard) {
            if (this.state.draggingCard) {
                var newState = {
                    draggingCard: null
                }

                if (targetCard) {
                    newState.board = this.props.moveCard(
                        this.state.board,
                        this.state.draggingCard,
                        targetCard
                    );
                }

                this.setState(newState);
            }
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

    function extractCardFromChildren(children) {
        var card;
        React.Children.forEach(children, function(child) {
            if (!card) card = child.props.card;
        });
        return card;
    };

    return function view (game, containerId) {
        React.renderComponent(
            BoardView(game),
            document.getElementById(containerId)
        );
    }
});
