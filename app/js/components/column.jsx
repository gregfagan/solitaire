import React from 'react';
import Card, { Slot } from './card';
import { Cascade } from './card-stacks';
import { DropPath, DragAndDropPath } from './draggable-path';

export default class Column extends React.Component {
  render() {
    const { path, covered, uncovered, onMove, ...other } = this.props;

    return (
      <DropPath path={path.concat(['uncovered', Math.max(uncovered.length - 1, 0)])}>
        <Cascade cascadeAtDepth={1} {...other}>
          <Slot/>
          { covered.map(id => <Card key={id} id={id} faceUp={false} />) }
          { uncovered.map((id, i) => (
            <DragAndDropPath key={id} path={path.concat(['uncovered', i])} onMove={onMove}>
              <Card id={id}/>
            </DragAndDropPath>
          ))}
        </Cascade>
      </DropPath>
    );
  }
};