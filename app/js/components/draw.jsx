import React from 'react';
import { Stack } from './card';

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
      <Stack onClick={this.handleClick} flipped={true} cards={cards} style={style}/>
    );
  }
};

const style = {
  cursor: 'pointer',
};