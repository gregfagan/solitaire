import React, { Component } from 'react';
import Radium from 'radium';
import View from './view';

export default class Menu extends Component {
  render() {
    const { actions, drawOptions, currentDrawCountOption } = this.props;
    const { shuffleAndDeal, setDrawCount } = actions;
    return (
      <View style={styles.menu} direction='row'>
        <Button onTouchTap={shuffleAndDeal}>New Game</Button>
        <Toggle value={currentDrawCountOption} onToggle={setDrawCount}>
          { drawOptions }
        </Toggle>
      </View>
    );
  }
}

class Toggle extends Component {
  constructor() {
    super();
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress(option) {
    return e => {
      e.preventDefault();
      e.stopPropagation();

      this.props.onToggle(option);
    }
  }

  render() {
    const { value, onToggle, children:options } = this.props;
    return (
      <View direction='row' style={{...styles.button, padding: 0}}>
        {
          options.map(option => (
            <Button key={option} active={value === option} onTouchTap={this.handlePress(option)} style={styles.toggleButton}>{option}</Button>
          ))
        }
      </View>
    );
  }
}

@Radium
class Button extends Component {
  render() {
    const { active, style, ...other } = this.props;
    return (
      <button style={{
        ...styles.button,
        ...(active && styles.activeButton),
        ':active': styles.activeButton,
        ...style,
      }}
      {...other} />
    );
  }
}

const styles = {
  menu: {
    fontSize: 14,
  },
  button: {
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 'inherit',
    margin: '0.25em',
    padding: '1em',
    color: '#0E3F80',
    background: '#18212C',
    border: '0.2em solid #121B26',
    borderRadius: '0.25em',
    outline: 'none',
    overflow: 'hidden',
  },
  activeButton: {
    color: '#18212C',
    background: '#0E3F80',
  },
  toggleButton: {
    margin: 0,
    border: 'none',
    borderRadius: 0,
  },
}