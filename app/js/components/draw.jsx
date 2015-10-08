import React from 'react';
import View from './view';
import Card, { Slot } from './card'
import { Stack } from './card-stacks';
import recycle from '../../img/recycle.svg';

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
      <Stack onTouchTap={this.handleClick} style={styles.stack}>
        <Slot>
          <View grow={1} alignItems='center' justifyContent='center'>
            <img style={styles.image} src={recycle}/>
          </View>
        </Slot>
        { cards.map((card, i) => 
          <Card key={card} id={card} faceUp={false}/>
        )}
      </Stack>
    );
  }
};

const styles = {
  stack: {
    cursor: 'pointer',
  },
  image: {
    width: '1.5em',
    height: '1.5em',
  },
};