import React from 'react';
import View from './view';
import { Stack } from './card';

export default class Foundation extends React.Component {
  render() {
    const { stacks } = this.props;

    return (
      <View direction='row'>
        { stacks.map((stack, i) => <Stack key={i} cards={stack}/>) }
      </View>
    );
  }
};
