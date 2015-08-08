import React from 'react';
import { Stack } from './card';

export default class Draw extends React.Component {
  render() {
    const { cards, drawCard } = this.props;

    return (
      <Stack onClick={drawCard} flipped={true} cards={cards} style={style}/>
    );
  }
};

const style = {
  cursor: 'pointer',
};