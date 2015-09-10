import React from 'react';
import View from './view';
import Card, { Slot } from './card';
import { Stack } from './card-stacks';
import { DropPath } from './draggable-path';

export default class Foundation extends React.Component {
  render() {
    const { stacks, onMove, ...other } = this.props;

    return (
      <View direction='row'>
      { stacks.map((stack, i) =>
        <DropPath key={i} path={['foundation', i, Math.max(stack.length - 1, 0)]} onMove={onMove}>
          <Stack {...other}>
            <Slot/>
            { stack.map(card =>
              <Card key={card} id={card}/>
            )}
          </Stack>
        </DropPath>
      )}
      </View>
    );
  }
};
