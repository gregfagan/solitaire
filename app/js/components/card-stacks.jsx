import React, { PropTypes } from 'react';
import { ViewStackedInZ } from './view';
import { default as BaseStack } from './stack';
import { thickness } from '../game/card';
import { DragAndDropPath } from './draggable-path';

export class Stack extends React.Component {
  static defaultProps = {
    container: ViewStackedInZ,
    thickness: thickness,
  }

  render() {
    return (
      <BaseStack {...this.props}/>
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

export class MoveableCascade extends React.Component {
  render() {
    return <Cascade container={StackableDraggableView} {...this.props}/>
  }
}

class StackableDraggableView extends React.Component {
  render() {
    const { path, depth, onMove, ...other } = this.props;
    return (
      <DragAndDropPath path={path.concat(depth)} onMove={onMove}>
        <ViewStackedInZ depth={depth} {...other}/>
      </DragAndDropPath>
    );
  }
}