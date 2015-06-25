import React from 'react';
import Card from './card';
import Stack from './stack';

export default class Draw extends React.Component {
  render() {
    const { cards, path, interaction } = this.props;
    const empty = cards.length <= 0;

    return (
      <div id="drawPile" onClick={interaction.draw}>
        <Card
          path={path.concat("uncovered")}
          slot={true}
          cascade="none"
        />
        <Stack
          className="card"
          path={path.concat("draw")}
          interaction={interaction}
          cards={cards}
          flipped={!empty}
        />
      </div>
    );
  }
};