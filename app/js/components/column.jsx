import React from 'react';
import Card, { Slot } from './card';
import { Stack, Cascade, MovableCascade } from './card-stacks';
import { DropPath, DragAndDropPath } from './draggable-path';

export default class Column extends React.Component {
  render() {
    const { path, covered, uncovered, onMove } = this.props;

    return (
      <Stack>
        <DropPath path={path.concat(['uncovered', 0])} onMove={onMove}>
          <Slot/>
        </DropPath>
        <Cascade>
          { covered.map(id => <Card key={id} id={id} faceUp={false} />) }
          <MovableCascade path={path.concat('uncovered')} onMove={onMove}>
            { uncovered.map((id, i) => (
              <Card key={id} id={id}/>
            ))}
          </MovableCascade>
        </Cascade>
      </Stack>
    );
  }
};