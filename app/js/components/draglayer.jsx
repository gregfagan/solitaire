import React from 'react';
import View from 'components/view';
import Card from 'components/card';
import { Cascade } from 'components/card-stacks';
import { DragLayer } from 'react-dnd';
import getElementClientOffset from '../util/offset';
import clamp from '../util/clamp';

//
// Because the cards are taller than they are wide, I allow them to tilt
// more when moving left-right as opposed to up-down. This evens out the
// visual effect.
//
const degreesTiltX = 45;
const degreesTiltY = 35;
const maxTiltVelocity = 2200; // points per second

@DragLayer(monitor => ({
  item: monitor.getItem(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))
export default class CardDragLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layerOffset: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 }
    };
  }

  static defaultProps = {
    dragHeight: 100,
  }

  componentWillReceiveProps(props) {
    try {
      const node = React.findDOMNode(this);
      const offset = getElementClientOffset(node);
      this.setState({ layerOffset: offset });
    } catch(e) {}

    const lastUpdate = this.state.lastUpdate;
    const now = performance.now();
    this.setState({ lastUpdate: now });

    const { currentOffset:previousOffset } = this.props;

    if (props.currentOffset && previousOffset && lastUpdate) {
      const dt = ((now - lastUpdate) / 1000);
      const velocity = {
        x: (props.currentOffset.x - previousOffset.x)/dt, // points per second
        y: (props.currentOffset.y - previousOffset.y)/dt,
      }
      this.setState({ velocity });
    }
  }

  render() {
    const { item, isDragging, cardsAtPath } = this.props;

    return (
      <div style={layerStyles}>
      { isDragging &&
        <View style={getItemStyles(this.props, this.state)}>
          <Cascade>
            {cardsAtPath(item.path).map(card => (
              <Card key={card} id={card}/>
            ))}
          </Cascade>
        </View>
      }
      </div>
    );
  }
}

const layerStyles = {
  transformStyle: 'preserve-3d',
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
};

function getItemStyles(props, state) {
  const { initialOffset, currentOffset, isDragging, dragHeight } = props;
  const { layerOffset, velocity } = state;

  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }
  
  const { x, y } = currentOffset;
  const { x:x0, y:y0 } = layerOffset;

  // rx is rotation for motion in the x axis, which is rotated around the Y axis.
  // ry is rotation for motion in the y axis, which is rotated around the X axis.
  const rx = clamp((velocity.x / maxTiltVelocity) * degreesTiltX, -degreesTiltX, degreesTiltX);
  const ry = clamp((-velocity.y / maxTiltVelocity) * degreesTiltY, -degreesTiltY, degreesTiltY);
  
  const transform = `translate3d(${x - x0}px, ${y - y0}px, ${dragHeight}px) rotateY(${rx}deg) rotateX(${ry}deg)`;
  return { transform };
};