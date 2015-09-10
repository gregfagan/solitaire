import React, { PropTypes } from 'react';
import { ViewStackedInZ } from './view';
import { default as BaseStack } from './stack';
import { thickness } from '../game/card';

export class Stack extends React.Component {
  render() {
    const { children, ...other } = this.props;

    return (
      <BaseStack container={ViewStackedInZ} thickness={thickness} {...other}>
        { children }
      </BaseStack>
    );
  }
}

export class Cascade extends React.Component {
  static propTypes = {
    cascadeBy: PropTypes.string,
    cascadeAtDepth: PropTypes.number,
  }

  static defaultProps = {
    cascadeBy: '15%',
    cascadeAtDepth: 0,
  }

  render() {
    return <Stack {...this.props}/>;
  }
}
