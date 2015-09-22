import React from 'react';
import View from './view';
import Card, { Slot } from './card';
import { Stack, MovableStack } from './card-stacks';
import { DropPath } from './draggable-path';

export default class Foundation extends React.Component {
  render() {
    const { stacks, onMove, canMove } = this.props;

    return (
      <View direction='row'>
      { stacks.map((stack, i) =>
        <Stack key={i}>
          <DropPath key={i} path={['foundation', i, 0]} onMove={onMove} canMove={canMove}>
            <Slot/>
          </DropPath>
          <MovableStack path={['foundation', i]} onMove={onMove} canMove={canMove}>
            { stack.map(id => <Card key={id} id={id}/>) }
          </MovableStack>
        </Stack>
      )}
      </View>
    );
  }
};
