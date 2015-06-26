import _ from "lodash";
import React from "react/addons";
import { thickness } from "game/card";
import Card from "components/card"
import transform from '../util/transform';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd/modules/backends/HTML5';

const dragSpec = {
  beginDrag(props) { 
    console.log('drag');
    return { card: _.last(props.cards), path: props.path }; 
  }
}

const dropSpec = {
  drop(props, monitor, component) {
    console.log('drop', props, monitor, monitor.getItem());
  }
}

@DragSource('Stack', dragSpec, (connect, monitor) => ({ 
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
@DropTarget('Stack', dropSpec, connect => ({ 
  connectDropTarget: connect.dropTarget() 
}))
 export default class Stack extends React.Component {
  static defaultProps = {
    cascade: "none",
    z: 0,
  }

  render() {
    const { 
      interaction,
      cards,
      flipped,
      cascade,
      z,
      path,
      connectDragSource,
      connectDropTarget,
      isDragging,
      ...other
    } = this.props;
    
    var last = _.last(cards);
    var initial = _.initial(cards);
    var lastPath = path && path.concat(initial.length);

    if (last) {
      last = <Card
        path={lastPath}
        card={last}
        flipped={flipped}
        cascade={cascade}
        interaction={interaction}
      />;
    } else {
      last = <div path={lastPath} />;
    }

    if (initial.length > 0) {
      initial = <Stack
        cards={initial}
        path={path}
        flipped={flipped}
        cascade={cascade}
        interaction={interaction}
        z={thickness}
      />;
    }

    return connectDropTarget(connectDragSource(
      <div
        className="stack"
        interaction={interaction}
        draggable={interaction.isCardDraggable(lastPath)}
        dropTarget={interaction.isCardDropTarget(lastPath)}
        style={{
          ...transform(0, 0, z),
          opacity: isDragging ? 0 : 1,
        }}
        {...other}
      >
        {last}{initial}
      </div>
    ));
  }

  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true
    });
  }
};