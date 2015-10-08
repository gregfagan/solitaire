import React from 'react';
import Card from './card';
import { Stack, Cascade } from './card-stacks';
import { DragPath } from './draggable-path'

export default class Waste extends React.Component {
  render() {
    const { cards, visibleCount=1 } = this.props;
    const stackedCards = cards.slice(0, -visibleCount);
    const cascadedCards = cards.slice(-visibleCount, -1);
    const topCard = cards[cards.length - 1];
    
    return cards.length > 0 && (
      <Stack>
        { stackedCards.map(id => <Card key={id} id={id}/>) }
        <Cascade cascadeDirection='right'>
          { cascadedCards.map(id => <Card key={id} id={id}/>) }
          <DragPath path={['waste', cards.length - 1]}>
            <Card key={topCard} id={topCard}/>
          </DragPath>
        </Cascade>
      </Stack>
    );
  }
};
