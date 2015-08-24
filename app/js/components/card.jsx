import React, { PropTypes } from 'react';
import View from './view';
import { toId, images } from '../game/card';

export default class Card extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    faceUp: PropTypes.bool,
  }

  static defaultProps = {
    faceUp: true,
  }

  render() {
    const { id, faceUp, style } = this.props;

    return (
      <View style={{...styles.card, ...style}}>
        {
          faceUp ? 
            <img style={styles.face} src={images[id]} /> :
            <View style={styles.back} />
        }
      </View>
    );
  }
};

export class Slot extends React.Component {
  render() {
    return (
      <View style={styles.card}>
        <View style={styles.slot}/>
      </View>
    );
  }
};

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
    WebkitUserSelect: 'none',
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