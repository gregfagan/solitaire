import React from 'react';
import transform from '../util/transform';
import classnames from 'classnames';

const dragHeight = 20;

export default class DragAndDrop extends React.Component {
  constructor() {
    super();
    this.state = { dragging: false };
    this.boundOnGlobalMouseMove = this.onGlobalMouseMove.bind(this);
    this.boundOnGlobalMouseUp = this.onGlobalMouseUp.bind(this);
  }

  onMouseDown(e) {
    const { draggable, interaction, children } = this.props;
    const { dragging } = this.state;

    if (draggable && !dragging) {
      document.addEventListener('mousemove', this.boundOnGlobalMouseMove);
      document.addEventListener('mouseup', this.boundOnGlobalMouseUp);

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
      document.removeEventListener('mousemove', this.boundOnGlobalMouseMove);
      document.removeEventListener('mouseup', this.boundOnGlobalMouseUp);

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
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
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