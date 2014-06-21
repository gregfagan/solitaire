/**
 * @jsx React.DOM
 */

define([
    "underscore",
    "react-with-addons",
    "components/draganddrop",
    "components/card"
],
function (_, React, DragAndDrop, CardView) {

    var StackView = React.createClass({
        getDefaultProps: function() {
            return { cascade: "none" };
        },

        render: function() {
            var last = _.last(this.props.cards);
            var initial = _.initial(this.props.cards);

            var path;
            if (this.props.path) {
                path = this.props.path.concat(initial.length);
            }

            if (last) {
                last = <CardView
                    path={path}
                    card={last}
                    flipped={this.props.flipped}
                    cascade={this.props.cascade}
                    interaction={this.props.interaction} />;
            } else {
                last = <div path={path} />;
            }

            if (initial.length > 0) {
                initial = <StackView
                    cards={initial}
                    path={this.props.path}
                    flipped={this.props.flipped}
                    cascade={this.props.cascade}
                    interaction={this.props.interaction} />;
            }

            return this.transferPropsTo(DragAndDrop({
                className: "stack",
                interaction: this.props.interaction,
                draggable: this.props.interaction.isCardDraggable(path),
                dropTarget: this.props.interaction.isCardDropTarget(path)
            },
            last, initial));
        }
    });

    return StackView;
});