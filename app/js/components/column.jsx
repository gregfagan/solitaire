import React from 'react';
import View from './view';
import { Cascade, renderCards } from './card';

export default class Column extends React.Component {
  render() {
    const { covered, uncovered } = this.props;

    return (
      <Cascade>
        { renderCards(covered, true) }
        { renderCards(uncovered, false) }
      </Cascade>
    );
  }
};