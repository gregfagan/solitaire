import React, { PropTypes } from 'react';
import { StackableView } from './view';
import { default as BaseStack } from './stack';
import { DragAndDropPath } from './draggable-path';

export class Stack extends React.Component {
  static defaultProps = {
    container: StackableView,  // for stack
  }

  render() {
    return (
      <BaseStack {...this.props}/>
    );
  }
}

export class Cascade extends React.Component {
  static defaultProps = {
    cascadeBy: '18%',          // for stack container
  }

  render() {
    return <Stack {...this.props}/>;
  }
}

export class MovableStack extends React.Component {
  render() {
    return <Stack container={DraggableStackableView} {...this.props}/>
  }
}

export class MovableCascade extends React.Component {
  render() {
    return <Cascade container={DraggableStackableView} {...this.props}/>
  }
}

class DraggableStackableView extends React.Component {
  render() {
    const { path, depth, onMove, canMove, ...other } = this.props;
    return (
      <DragAndDropPath path={path.concat(depth)} onMove={onMove} canMove={canMove}>
        <StackableView depth={depth} {...other}/>
      </DragAndDropPath>
    );
  }
}