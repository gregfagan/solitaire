import React from 'react';
import Card, { Slot } from './card';
import { Cascade, MoveableCascade } from './card-stacks';
import { DropPath, DragAndDropPath } from './draggable-path';

export default class Column extends React.Component {
  render() {
    const { path, covered, uncovered, onMove, ...other } = this.props;

    return (
      <DropPath path={path.concat(['uncovered', Math.max(uncovered.length - 1, 0)])} onMove={onMove}>
        <Cascade cascadeAtDepth={1} {...other}>
          <Slot/>
          { covered.map(id => <Card key={id} id={id} faceUp={false} />) }
          <MoveableCascade path={path.concat('uncovered')} onMove={onMove}>
            { uncovered.map((id, i) => (
              <Card key={id} id={id}/>
            ))}
          </MoveableCascade>
        </Cascade>
      </DropPath>
    );
  }
};