/**
 * @jsx React.DOM
 */
define(["react-with-addons"], function define_draggable (React) {
    var Draggable = React.createClass({
        getDefaultProps: function() {
            return { interaction: {} };
        },

        getInitialState: function() {
            return { dragging: false };
        },

        onMouseDown: function(e) {
            if (!this.state.dragging) {
                document.addEventListener('mousemove', this.onMouseMove);
                document.addEventListener('mouseup', this.onMouseUp);

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
            if (this.state.dragging) {
                document.removeEventListener('mouseup', this.onMouseUp);
                document.removeEventListener('mousemove', this.onMouseMove);

                this.setState({
                    dragging: false,
                    offset: { x:0, y:0 }
                });

                if (this.props.interaction.onDragEnd)
                    this.props.interaction.onDragEnd();
            }
        },

        onMouseMove: function(e) {
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

            return this.transferPropsTo(
                <div
                    className={this.state.dragging ? "dragging" : ""}
                    style={transform}
                    onMouseDown={this.onMouseDown}>
                    { this.props.children }
                </div>
            );
        }
    });

    return Draggable;
});