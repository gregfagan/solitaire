import React from 'react';

import View from './view';
import Draw from './draw';
import Waste from './waste';
import Foundation from './foundation';
import Tableau from './tableau';

import { DragDropContext } from 'react-dnd';
import ImmediateDragBackend from '../util/immediate-drag-backend';
import CardDragLayer from './draglayer';

@DragDropContext(ImmediateDragBackend)
export default class Board extends React.Component {
  render() {
    const { draw, waste, foundation, tableau, actions, inspect } = this.props;
    
    return (
      <View style={styles.container}>
        <View alignSelf='center' style={styles.board}>
          <View direction='row'>
            <Draw cards={draw} drawCard={actions.drawCard}/>
            <Waste cards={waste} onMove={actions.movePath}/>
            <View grow={1}/>
            <Foundation stacks={foundation} onMove={actions.movePath} canMove={inspect.canMove}/>
          </View>
          <View style={{ height: '1em' }}/>
          <Tableau columns={tableau} onMove={actions.movePath} canMove={inspect.canMove}/>
          <CardDragLayer cardsAtPath={inspect.cardsAtPath}/>
        </View>
      </View>
    );
  }
};

const styles = {
  container: {
    perspective: 1500,
  },
  board: {
    fontSize: 36,
    margin: '1em auto',
    transform: 'rotateX(15deg) translateZ(-1em)',
  },
}