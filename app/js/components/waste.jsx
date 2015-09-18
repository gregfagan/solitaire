import React from 'react';
import Card from './card';
import { MovableStack } from './card-stacks';

export default class Waste extends React.Component {
  render() {
    const { cards } = this.props;
    return (
      <MovableStack path={['waste']}>
        { cards.map(id => <Card key={id} id={id}/>) }
      </MovableStack>
    );
  }
};
