import React, { PropTypes, cloneElement } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import View from './view';

//
// This component tracks a `path` (array of keys, similar to the argument for
// lodash's `get`) which is passed to callbacks `canMove` and `onMove`.
//
@DragSource('Path', {
  beginDrag: props => ({ path: props.path }),
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export class DragPath extends React.Component {
  static propTypes = {
    path: PropTypes.array,   // array of keys indicating a path in the top level object
  }

  static defaultProps = {
    path: [],
  }

  render() {
    const { path, isDragging, connectDragSource, style, children, ...other } = this.props;
    const hideWhileDraggingStyle = {
      opacity: isDragging ? 0 : 1,
      cursor: 'grab; cursor: -webkit-grab',
      ...style
    };
    const childProps = { style: hideWhileDraggingStyle, ...other};
    return connectDragSource(cloneElement(children, childProps));
  }
}

@DropTarget('Path', {
  canDrop: (props, monitor) => {
    const { canMove, path:toPath } = props;
    const fromPath = monitor.getItem().path;
    return canMove && canMove(fromPath, toPath);
  },
  drop: (props, monitor) => {
    const { onMove, path:toPath } = props;
    const fromPath = monitor.getItem().path;
    onMove(fromPath, toPath);
  },
}, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
export class DropPath extends React.Component {
  static defaultProps = {
    path: [],
    onMove: (fromPath, toPath) => {},
  }

  render() {
    const { children, connectDropTarget, onMove, path, ...other } = this.props;
    return connectDropTarget(cloneElement(children, other));
  }
}

export class DragAndDropPath extends React.Component {
  render() {
    const { path, ...other } = this.props;
    return (
      <DragPath path={path}>
        <DropPath path={path} {...other}/>
      </DragPath>
    );
  }
}