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
                    <CardView
                        path={this.props.path.concat("uncovered")}
                        slot={true}
                        cascade="none" />
                    <StackView
                        path={this.props.path.concat("covered")}
                        cards={this.props.covered}
                        interaction={this.props.interaction}
                        flipped={true}
                        cascade="down" />
                    <StackView
                        path={this.props.path.concat("uncovered")}
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
            var p = this.props.path.concat("tableau");
            var columns = this.props.columns.map(function (column, index) {
                var path = p.concat(index);
                return (
                    <ColumnView
                        key={index}
                        path={path}
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
                        path={this.props.path.concat("waste")}
                        cards={this.props.cards}
                        interaction={this.props.interaction} />
                );
        }
    });

    var FoundationView = React.createClass({
        render: function () {
            var that = this;
            var p = this.props.path.concat("foundation");
            var stacks = this.props.cards.map(function(stack, index) {
                var path = p.concat(index);
                return (
                    <div key={index} className="card">
                        <CardView
                            path={path}
                            slot={true}
                            cascade="none" />
                        <StackView
                            path={path}
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
                board: this.props.createBoard(),
                draggingPath: null
            };
        },

        render: function() {
            var board = this.state.board;
            var draggingPath = this.state.draggingPath;
            var interaction = {
                draw: this.bindGameEvent(this.props.drawCard),

                containerForCard: function (path) {
                    if (path) {
                        if (draggingPath && !_.isEqual(draggingPath, path) && this.canReceive(draggingPath, path)) {
                            return DropTarget;
                        }
                        else if (this.canMove(path)) {
                            return Draggable;
                        }
                    }

                    return React.DOM.div;
                },

                canMove: this.bindCapability(this.props.canMoveCard),
                canReceive: this.bindCapability(this.props.canReceiveCard),

                onDragBegin: _.compose(this.onDragBegin, extractPathFromChildren),
                onDragEnd: _.compose(this.onDragEnd, extractPathFromChildren)
            }

            return (
                <div id="board">
                    <DrawView path={[]} cards={board.draw} interaction={interaction} />
                    <WasteView path={[]} cards={board.waste} interaction={interaction} />
                    <FoundationView path={[]} cards={board.foundation} interaction={interaction} />
                    <TableauView path={[]} columns={board.tableau} interaction={interaction} />
                </div>
            );
        },

        onDragBegin: function onDragBegin(path) {
            this.setState({draggingPath: path});
        },

        onDragEnd: function onDragEnd(targetPath) {
            if (this.state.draggingPath) {
                var newState = {
                    draggingPath: null
                }

                if (targetPath) {
                    newState.board = this.props.moveCard(
                        this.state.board,
                        this.state.draggingPath,
                        targetPath
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

    function extractPathFromChildren(children) {
        var path;
        React.Children.forEach(children, function(child) {
            if (!path && child) path = child.props.path;
        });
        return path;
    };

    return function view (game, containerId) {
        // The React dev tools need access to the React object on window
        window.React = React;

        React.renderComponent(
            BoardView(game),
            document.getElementById(containerId)
        );
    }
});
