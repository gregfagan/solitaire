import React from 'react';

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
  render() {
    const { draw, waste, foundation, tableau, actions } = this.props;
    
    return (
      <View style={{ perspective: 400 }}>
        <View alignSelf='center' style={styles.board}>
          <View direction='row'>
            <Draw cards={draw} drawCard={actions.drawCard}/>
            <Waste cards={waste} onMove={actions.movePath}/>
            <View grow={1}/>
            <Foundation stacks={foundation} onMove={actions.movePath}/>
          </View>
          <View style={{ height: '1em' }}/>
          <Tableau columns={tableau} onMove={actions.movePath}/>
          <CardDragLayer/>
        </View>
      </View>
    );
  }
};

const styles = {
  board: {
    fontSize: 36,
    margin: '1em auto',
    transform: 'rotateX(5deg) translateZ(-1em)',
  }
}