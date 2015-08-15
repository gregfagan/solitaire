import React from 'react';
import View, { ViewStackedInZ } from './view';
import { default as BaseStack } from './stack';
import { toId, images, thickness } from '../game/card';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd/modules/backends/HTML5';

export default class Card extends React.Component {
  render() {
    const { id, style, flipped=false } = this.props;

    return (
      <View style={{...styles.card, ...style}}>
        { 
          flipped ? 
            <View style={styles.back} /> :
            <img style={styles.face} src={images[id]} />
        }
        
      </View>
    );
  }
};

export function renderCards(cards, flipped=false, draggable=true, moveCard) {
  return cards.map((child, index) => {
    const ThisCard = draggable ? DraggableCard : Card;
    return <ThisCard key={child} id={child} flipped={flipped} moveCard={moveCard}/>
  })
}

export class Slot extends React.Component {
  render() {
    return (
      <View style={styles.card}>
        <View style={styles.slot}/>
      </View>
    );
  }
};

export class Stack extends React.Component {
  render() {
    const { cards, flipped=false, withSlot=true, draggable=true, moveCard, children, ...other } = this.props;
    return (
      <BaseStack container={ViewStackedInZ} thickness={thickness} {...other}>
        { withSlot && <Slot/> }
        { cards && renderCards(cards, flipped, draggable, moveCard) }
        { children }
      </BaseStack>
    );
  }
}

export class Cascade extends React.Component {
  render() {
    const { withSlot=true } = this.props;
    return <Stack cascadeBy='15%' cascadeAtDepth={withSlot ? 1 : 0} {...this.props}/>;
  }
}

@DragSource('Card', {
  beginDrag: props => props
}, (connect, monitor) => ({
  connectDragPreview: connect.dragPreview(),
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
@DropTarget('Card', {
  drop: (props, monitor) => {
    props.moveCard(monitor.getItem().id, props.id);
  }
}, connect => ({
  connectDropTarget: connect.dropTarget()
}))
class DraggableCard extends React.Component {
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
    const { isDragging, connectDragSource, connectDragPreview, connectDropTarget, ...other } = this.props;
    return connectDragSource(connectDropTarget(<Card style={{ opacity: isDragging ? 0 : 1 }} {...other}/>));
  }
}

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