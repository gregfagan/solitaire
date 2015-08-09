import React from 'react';
import View, { ViewStackedInZ } from './view';
import { default as BaseStack } from './stack';
import { toId, images, thickness } from '../game/card';
 
export default class Card extends React.Component {
  render() {
    const { id, flipped=false } = this.props;

    return (
      <View style={styles.card}>
        { 
          flipped ? 
            <View style={styles.back} /> :
            <img style={styles.face} src={images[id]} />
        }
        
      </View>
    );
  }
};

export function renderCards(cards, flipped) {
  // TODO: reverse game logic so reverse() not needed here
  //
  //    ...I accidentally reversed my Stack logic when rewriting it
  //    and I think first -> last stacking is better than last -> first
  return cards.reverse().map((child, index) => (
    <Card key={index} id={child} flipped={flipped}/>
  ))
}

export class Slot extends React.Component {
  render() {
    return (
      <View style={styles.card}>
        <View style={styles.slot}/>
      </View>
    );
  }
};

export class Stack extends React.Component {
  render() {
    const { cards, flipped, withSlot=true, children, ...other } = this.props;
    return (
      <BaseStack container={ViewStackedInZ} thickness={thickness} {...other}>
        { withSlot && <Slot/> }
        { cards && renderCards(cards, flipped) }
        { children }
      </BaseStack>
    );
  }
}

export class Cascade extends React.Component {
  render() {
    const { withSlot=true } = this.props;
    return <Stack cascadeBy='15%' cascadeAtDepth={withSlot ? 1 : 0} {...this.props}/>;
  }
}

const side = {
  display: 'block',
  position:'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  borderRadius: '0.15em',
};

const styles = {
  card: {
    margin: '0.125em',
    width: '2.5em',
    height: '3.5em',
  },
  face: {
    ...side,
  },
  back: {
    ...side,
    backgroundColor: '#F58156',
    border: '0.18em solid white',
  },
  slot: {
    ...side,
    border: '0.1em dashed #999'
  }
}