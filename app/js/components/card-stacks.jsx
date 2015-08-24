import React, { PropTypes } from 'react';
import { ViewStackedInZ } from './view';
import { default as BaseStack } from './stack';
import Card, { Slot } from './card';
import { thickness } from '../game/card';

export class Stack extends React.Component {
  static propTypes = {
    cards: PropTypes.array,
    withSlot: PropTypes.bool,
    container: PropTypes.element,
  }

  static defaultProps = {
    cards: [],
    withSlot: true,
    container: <ViewStackedInZ thickness={thickness} />,
  }

  render() {
    const { cards, withSlot, container, children, ...other } = this.props;

    const cardProps = Object.keys(Card.propTypes).reduce((cardProps, cardProp) => {
      cardProps[cardProp] = other[cardProp];
      return cardProps;
    }, {});

    return (
      <BaseStack container={container} {...other}>
        { withSlot && <Slot/> }
        { cards.map(id => <Card {...cardProps} key={id} id={id} />) }
        { children }
      </BaseStack>
    );
  }
}

export class Cascade extends React.Component {
  render() {
    const { withSlot=true } = this.props;
    const container = <ViewStackedInZ thickness={thickness} cascadeBy='15%' cascadeAtDepth={withSlot ? 1 : 0} />;
    return <Stack container={container} {...this.props}/>;
  }
}
