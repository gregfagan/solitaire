import React from 'react';
import View from './view';
import Card from './card';
import { Cascade } from './card-stacks';

export default class Column extends React.Component {
  render() {
    const { covered, uncovered, ...other } = this.props;

    return (
      <Cascade {...other}>
        { covered.map(id => <Card key={id} id={id} faceUp={false} />) }
        { uncovered.map(id => <Card key={id} id={id} />) }
      </Cascade>
    );
  }
};