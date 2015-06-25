import React from 'react';
import Stack from './stack';
import Card from './card';
import { thickness } from '../game/card';

export default class Column extends React.Component {
  render() {
    const { covered, uncovered, path, interaction } = this.props;

    return (
      <div className="card column">
        <Card
          path={path.concat("uncovered")}
          slot={true}
          cascade="none"
        />
        <Stack
          path={path.concat("covered")}
          cards={covered}
          interaction={interaction}
          flipped={true}
          cascade="down"
        />
        <Stack
          path={path.concat("uncovered")}
          cards={uncovered}
          interaction={interaction}
          cascade="down"
          z={covered.length * thickness}
        />
      </div>
    );
  }
};