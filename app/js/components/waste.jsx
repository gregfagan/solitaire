import React from 'react';
import { Stack } from './card';

export default class Waste extends React.Component {
  render() {
    const { cards } = this.props;
    return <Stack withSlot={false} cards={cards}/>
  }
};
