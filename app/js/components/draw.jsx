import React from 'react';
import { Stack } from './card-stacks';

export default class Draw extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.props.drawCard();
  }

  render() {
    const { cards } = this.props;

    return (
      <Stack onClick={this.handleClick} faceUp={false} cards={cards} style={style} />
    );
  }
};

const style = {
  cursor: 'pointer',
};