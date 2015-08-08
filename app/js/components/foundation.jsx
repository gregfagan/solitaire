import React from 'react';
import View from './view';
import { Stack } from './card';

export default class Foundation extends React.Component {
  render() {
    const { stacks, ...other } = this.props;

    return (
      <View direction='row' {...other}>
        { stacks.map((stack, i) => <Stack key={i} cards={stack}/>) }
      </View>
    );
  }
};
