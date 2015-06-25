import _ from 'lodash';
import React from 'react';
import Draw from './draw';
import Waste from './waste';
import Foundation from './foundation';
import Tableau from './tableau';
import Game from '../game/game';
import GameCard from '../game/card';

export default class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      board: Game.createBoard(),
      draggingPath: null,
    };
  }

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
        let result = false;
        
        if (path && draggingPath && !_.isEqual(draggingPath, path))
          result = this.canReceive(draggingPath, path);

        return result;
      },

      canMove: this.bindCapability(Game.canMoveCard),
      canReceive: this.bindCapability(Game.canReceiveCard),

      onDragBegin: _.compose(this.onDragBegin.bind(this), extractPathFromChildren),
      onDragEnd: _.compose(this.onDragEnd.bind(this), extractPathFromChildren)
    }

    return (
      <div id="board">
        <Draw path={[]} cards={board.draw} interaction={interaction} />
        <Waste path={[]} cards={board.waste} interaction={interaction} />
        <Foundation path={[]} stacks={board.foundation} interaction={interaction} />
        <Tableau path={[]} columns={board.tableau} interaction={interaction} />
      </div>
    );
  }

  onDragBegin(path) {
    this.setState({draggingPath: path});
  }

  onDragEnd(targetPath) {
    if (this.state.draggingPath) {
      var newState = {
        draggingPath: null
      }

      if (targetPath) {
        newState.board = Game.moveCard(
          this.state.board,
          this.state.draggingPath,
          targetPath
        );
      }

      this.setState(newState);
    }
  }

  bindGameEvent(gameEvent) {
    function wrapResult(newBoard) {
      return { board: newBoard };
    };

    return _.compose(
      this.setState,
      wrapResult,
      _.partial(gameEvent, this.state.board)
      ).bind(this);
  }

  bindCapability(gameCapability) {
    return _.partial(gameCapability, this.state.board);
  }
};

function extractPathFromChildren(children) {
  var path;
  React.Children.forEach(children, function(child) {
    if (!path && child) path = child.props.path;
  });
  return path;
};