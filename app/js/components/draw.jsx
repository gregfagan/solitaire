import React from 'react';
import Card, { Slot } from './card'
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
      <Stack onTouchTap={this.handleClick} style={style}>
        <Slot/>
        { cards.map((card, i) => 
          <Card key={card} id={card} faceUp={false}/>
        )}
      </Stack>
    );
  }
};

const style = {
  cursor: 'pointer',
};