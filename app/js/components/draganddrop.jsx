import React from 'react';
import transform from '../util/transform';
import classnames from 'classnames';

const dragHeight = 20;

export default class DragAndDrop extends React.Component {
  constructor() {
    super();
    
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this); 
    this.onGlobalMouseMove = this.onGlobalMouseMove.bind(this);
    this.onGlobalMouseUp = this.onGlobalMouseUp.bind(this);

    this.state = { dragging: false };
  }

  onMouseDown(e) {
    const { draggable, interaction, children } = this.props;
    const { dragging } = this.state;

    if (draggable && !dragging) {
      document.addEventListener('mousemove', this.onGlobalMouseMove);
      document.addEventListener('mouseup', this.onGlobalMouseUp);

      this.setState({
        dragging: true,
        initial: { x: e.pageX, y: e.pageY },
        offset: { x:0, y:0 }
      });
      e.preventDefault();
      e.stopPropagation();

      if (interaction.onDragBegin)
        interaction.onDragBegin(children);
    }
  }

  onMouseUp(e) {
    const { dropTarget, interaction, children } = this.props;

    if(dropTarget && interaction.onDragEnd) {
      interaction.onDragEnd(children);
    }
  }

  onGlobalMouseUp(e) {
    const { interaction, children } = this.props;
    const { dragging } = this.state;

    if (dragging) {
      document.removeEventListener('mousemove', this.onGlobalMouseMove);
      document.removeEventListener('mouseup', this.onGlobalMouseUp);

      if (isMounted(this)) {
        this.setState({
          dragging: false,
          offset: { x:0, y:0 }
        });
      }

      if(interaction.onDragEnd) {
        interaction.onDragEnd(children);
      }
    }
  }

  onGlobalMouseMove(e) {
    if (this.state.dragging) {
      this.setState({
        offset: {
          x: e.pageX - this.state.initial.x,
          y: e.pageY - this.state.initial.y,
        }
      })
    }
  }

  render() {
    const { 
      style,
      className,
      z,
      draggable,
      dropTarget,
      ...other
    } = this.props;

    const { 
      dragging, 
      offset 
    } = this.state;
    
    const t =  dragging ?
      transform(offset.x, offset.y, dragHeight) :
      transform(0, 0, z);

    const classes = classnames({
      'draggable': draggable,
      'dragging': dragging,
      'dropTarget': dropTarget,
      'card': dropTarget
    }, className)

    return (
      <div
        className={classes}
        style={Object.assign({}, t, style)}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        {...other}
      />
    );
  }
};

DragAndDrop.defaultProps = { interaction: {} };

//
// this.isMounted was removed for ES6 classed React Components. React.findDOMNode
// throws if the component isn't mounted. This function reimplements the isMounted
// function using try/catch.
//
// see http://jaketrent.com/post/set-state-in-callbacks-in-react/
//
function isMounted(component) {
  try {
    React.findDOMNode(component);
    return true;
  }
  catch (e) {
    return false;
  }
}