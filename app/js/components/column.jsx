import React from 'react';
import View from './view';
import { Cascade, renderCards } from './card';

export default class Column extends React.Component {
  render() {
    const { covered, uncovered, moveCard, ...other } = this.props;

    return (
      <Cascade {...other}>
        { renderCards(covered, true, false) }
        { renderCards(uncovered, false, true, moveCard) }
      </Cascade>
    );
  }
};