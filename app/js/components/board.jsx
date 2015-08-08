import _ from 'lodash';
import React from 'react';

import Game from '../game/game';

import View from './view';
import Draw from './draw';
import Waste from './waste';
import Foundation from './foundation';
import Tableau from './tableau';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import CardDragLayer from './draglayer';

@DragDropContext(HTML5Backend)
export default class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      board: Game.createBoard(),
    };
  }

  render() {
    var board = this.state.board;
    
    return (
      <View style={{ perspective: 400 }}>
        <View alignSelf='center' style={styles.board}>
          <View direction='row'>
            <Draw cards={board.draw} drawCard={this.bindGameEvent(Game.drawCard)} />
            <Waste cards={board.waste}/>
            <Foundation grow={1} justifyContent='end' stacks={board.foundation}/>
          </View>
          <Tableau columns={board.tableau} style={{ marginTop: '1em'}}/>
          <CardDragLayer/>
        </View>
      </View>
    );
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
};

const styles = {
  board: {
    marginTop: 100,
    fontSize: 36,
    margin: 'auto',
    transform: 'rotateX(5deg) translateZ(-1em)',
  }
}