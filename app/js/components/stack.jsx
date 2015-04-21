/**
 * @jsx React.DOM
 */

 var _ = require("lodash")
 var React = require("react/addons")
 var Card = require("game/card")
 var DragAndDrop = require("components/draganddrop")
 var CardView = require("components/card")

 var StackView = React.createClass({
  getDefaultProps: function() {
    return { cascade: "none" };
  },

  render: function() {
    var last = _.last(this.props.cards);
    var initial = _.initial(this.props.cards);
    var z = this.props.z || 0;

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
      interaction={this.props.interaction}
      z={Card.thickness} />;
    }

    return (
      <DragAndDrop
        className="stack"
        interaction={this.props.interaction}
        draggable={this.props.interaction.isCardDraggable(path)}
        dropTarget={this.props.interaction.isCardDropTarget(path)}
        z={z}
      >
        {last}{initial}
      </DragAndDrop>
    );
  }
});

module.exports = StackView;