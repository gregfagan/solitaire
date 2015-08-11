import React, { Component } from 'react';
import View from './view';

export default class Menu extends Component {
  render() {
    const { shuffleAndDeal, drawOptions, currentDrawOption, changeDrawOption } = this.props;
    return (
      <View direction='row'>
        <button onClick={shuffleAndDeal}>New Game</button>
        <Toggle value={currentDrawOption} onToggle={changeDrawOption}>
          { drawOptions }
        </Toggle>
      </View>
    );
  }
}

class Toggle extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(option) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.props.onToggle(option);
    }
  }

  render() {
    const { value, onToggle, children:options } = this.props;
    return (
      <View direction='row'>
        {
          options.map(option => (
            <button key={option} onClick={this.handleClick(option)}>{option}</button>
          ))
        }
      </View>
    )
  }
}