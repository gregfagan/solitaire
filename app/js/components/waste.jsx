import React from 'react';
import { Stack } from './card';

export default class Waste extends React.Component {
  render() {
    return <Stack withSlot={false} {...this.props}/>
  }
};
