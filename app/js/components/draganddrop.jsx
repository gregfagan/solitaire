/**
 * @jsx React.DOM
 */
define(["react-with-addons"], function define_DragAndDrop (React) {
    var DragAndDrop = React.createClass({
        getDefaultProps: function() {
            return { interaction: {} };
        },

        getInitialState: function() {
            return { dragging: false };
        },

        onMouseDown: function(e) {
            if (this.props.draggable && !this.state.dragging) {
                document.addEventListener('mousemove', this.onGlobalMouseMove);
                document.addEventListener('mouseup', this.onGlobalMouseUp);

                this.setState({
                    dragging: true,
                    initial: { x: e.pageX, y: e.pageY },
                    offset: { x:0, y:0 }
                });
                e.preventDefault();
                e.stopPropagation();

                if (this.props.interaction.onDragBegin)
                    this.props.interaction.onDragBegin(this.props.children);
            }
        },

        onMouseUp: function(e) {
            if(this.props.dropTarget && this.props.interaction.onDragEnd) {
                this.props.interaction.onDragEnd(this.props.children);
            }
        },

        onGlobalMouseUp: function(e) {
            if (this.state.dragging) {
                document.removeEventListener('mouseup', this.onGlobalMouseUp);
                document.removeEventListener('mousemove', this.onGlobalMouseMove);

                if (this.isMounted()) {
                    this.setState({
                        dragging: false,
                        offset: { x:0, y:0 }
                    });
                }

                if(this.props.interaction.onDragEnd) {
                    this.props.interaction.onDragEnd(this.props.children);
                }
            }
        },

        onGlobalMouseMove: function(e) {
            if (this.state.dragging) {
                this.setState({
                    offset: {
                        x: e.pageX - this.state.initial.x,
                        y: e.pageY - this.state.initial.y,
                    }
                })
            }
        },

        render: function() {
            var transform = {
                // TODO: use all vendor specific transform styles
                WebkitTransform:
                    this.state.dragging ?
                        'translateX(' + this.state.offset.x + 'px)' +
                        'translateY(' + this.state.offset.y + 'px)' +
                        'translateZ(15px)'
                    : ''
            };

            var classes = React.addons.classSet({
                'draggable': this.props.draggable,
                'dragging': this.state.dragging,
                'dropTarget': this.props.dropTarget,
                'card': this.props.dropTarget
            })

            return this.transferPropsTo(
                <div
                    className={classes}
                    style={transform}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}>
                    { this.props.children }
                </div>
            );
        }
    });

    return DragAndDrop;
});