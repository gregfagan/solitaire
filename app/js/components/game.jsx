var _ = require("lodash");
var React = require("react/addons");
var Card = require("../game/card");
var StackView = require("./stack")
var CardView = require("./card");
var Game = require("../game/game");

var ColumnView = React.createClass({
  render: function () {
    return (
      <div className="card column">
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
      cascade="down"
      z={(this.props.covered.length) * Card.thickness} />
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
      <CardView
      path={this.props.path.concat("uncovered")}
      slot={true}
      cascade="none" />
      <StackView
      className="card"
      path={this.props.path.concat("draw")}
      interaction={this.props.interaction}
      cards={this.props.cards}
      flipped={!empty} />
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
  getInitialState() {
    return {
      board: Game.createBoard(),
      draggingPath: null
    };
  },

  render() {
    var board = this.state.board;
    var draggingPath = this.state.draggingPath;
    var interaction = {
      draw: this.bindGameEvent(Game.drawCard),

      isCardDraggable: function (path) {
        if (!path)
          return false;
        if (draggingPath && !_.isEqual(draggingPath, path))
          return false;
        return this.canMove(path);
      },

      isCardDropTarget: function(path) {
        if (!path)
          return false;
        if (draggingPath && !_.isEqual(draggingPath, path))
          return this.canReceive(draggingPath, path);

        return false;
      },

      canMove: this.bindCapability(Game.canMoveCard),
      canReceive: this.bindCapability(Game.canReceiveCard),

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

  onDragBegin(path) {
    this.setState({draggingPath: path});
  },

  onDragEnd(targetPath) {
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

  bindGameEvent(gameEvent) {
    function wrapResult(newBoard) {
      return { board: newBoard };
    };

    return _.compose(
      this.setState,
      wrapResult,
      _.partial(gameEvent, this.state.board)
      ).bind(this);
  },

  bindCapability(gameCapability) {
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

module.exports = function view (containerId) {
  React.render(
    <BoardView/>,
    document.getElementById(containerId)
  );
}