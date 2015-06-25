import React from 'react';
import Stack from './stack';

export default class Waste extends React.Component {
  render() {
    const { cards, path, interaction } = this.props;

    if (cards.length <= 0)
      return <div id="wastePile"/>
    else
      return (
        <Stack
          id="wastePile"
          path={path.concat("waste")}
          cards={cards}
          interaction={interaction}
        />
      );
  }
};
