import React from 'react';
import Card from './card';
import { Stack } from './card-stacks';
import { DragPath } from './draggable-path';

export default class Waste extends React.Component {
  render() {
    const { cards } = this.props;
    return (
      <Stack>
        { cards.map((id, i) => {
          const card = <Card key={id} id={id}/>
          return (i === cards.length - 1) ?
            <DragPath key={id} path={['waste', i]}>{card}</DragPath> :
            card;
        })}
      </Stack>
    );
  }
};
