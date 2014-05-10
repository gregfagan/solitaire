/**
 * @jsx React.DOM
 */

define([
    "underscore",
    "react-with-addons",
    "components/card"
],
function (_, React, CardView) {
    
    var StackView = React.createClass({
        getDefaultProps: function() {
            return { cascade: "none" };
        },

        render: function() {
            var last = _.last(this.props.cards);
            var initial = _.initial(this.props.cards);
            var container = this.props.interaction.containerForCard(last);

            if (last) {
                last = <CardView
                    card={last}
                    flipped={this.props.flipped}
                    cascade={this.props.cascade}
                    interaction={this.props.interaction} />;
            }

            if (initial.length > 0) {
                initial = <StackView
                    cards={initial}
                    flipped={this.props.flipped}
                    cascade={this.props.cascade}
                    interaction={this.props.interaction} />;
            }

            return this.transferPropsTo(container({
                className: "stack",
                interaction: this.props.interaction
            },
            last, initial));
        }
    });

    return StackView;
});