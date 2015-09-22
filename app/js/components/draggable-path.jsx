import React, { PropTypes, cloneElement } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd/modules/backends/HTML5';
import View from './view';

//
// This component tracks a `path` (array of keys, similar to the argument for
// lodash's `get`) which is passed to callbacks `canMove` and `onMove`.
//
@DragSource('Path', {
  beginDrag: props => ({ path: props.path }),
}, (connect, monitor) => ({
  connectDragPreview: connect.dragPreview(),
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

  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true
    })
  }

  render() {
    const { path, isDragging, connectDragSource, connectDragPreview, style, children, ...other } = this.props;
    const hideWhileDraggingStyle = { opacity: isDragging ? 0 : 1, ...style };
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