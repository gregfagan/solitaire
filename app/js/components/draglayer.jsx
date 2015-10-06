import React from 'react';
import View from 'components/view';
import Card from 'components/card';
import { Cascade } from 'components/card-stacks';
import { DragLayer } from 'react-dnd';
import getElementClientOffset from '../util/offset';

@DragLayer(monitor => ({
  item: monitor.getItem(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))
export default class CardDragLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { layerOffset: { x: 0, y: 0 } };
  }

  static defaultProps = {
    dragHeight: 20,
  }

  componentWillReceiveProps(props) {
    try {
      const node = React.findDOMNode(this);
      const offset = getElementClientOffset(node);
      this.setState({ layerOffset: offset });
    } catch(e) {}
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
  width: '100%',
  height: '100%',
};

function getItemStyles(props, state) {
  const { initialOffset, currentOffset, isDragging, dragHeight } = props;
  const { layerOffset } = state;

  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset;
  const { x:x0, y:y0 } = layerOffset;

  const transform = `translate3d(${x - x0}px, ${y - y0}px, ${dragHeight}px)`;
  return {
    transform: transform,
    WebkitTransform: transform,
  };
};