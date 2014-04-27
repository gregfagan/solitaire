/**
 * @jsx React.DOM
 */
define(["react-with-addons"], function define_dropTarget (React) {
    var DropTarget = React.createClass({
        onMouseUp: function(e) {
            if(this.props.interaction.onDragEnd) {
                this.props.interaction.onDragEnd(this.props.children);
            }
        },

        render: function() {
            return this.transferPropsTo(
                <div onMouseUp={this.onMouseUp}>
                    { this.props.children }
                </div>
            );
        }
    });

    return DropTarget;
});