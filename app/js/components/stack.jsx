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
    const { 
      interaction,
      cards,
      flipped,
      cascade,
      z=0,
      path,
      ...other
    } = this.props;
    
    var last = _.last(cards);
    var initial = _.initial(cards);
    var lastPath = path && path.concat(initial.length);

    if (last) {
      last = <CardView
        path={lastPath}
        card={last}
        flipped={flipped}
        cascade={cascade}
        interaction={interaction}
      />;
    } else {
      last = <div path={lastPath} />;
    }

    if (initial.length > 0) {
      initial = <StackView
        cards={initial}
        path={path}
        flipped={flipped}
        cascade={cascade}
        interaction={interaction}
        z={Card.thickness}
      />;
    }

    return (
      <DragAndDrop
        className="stack"
        interaction={interaction}
        draggable={interaction.isCardDraggable(lastPath)}
        dropTarget={interaction.isCardDropTarget(lastPath)}
        z={z}
        {...other}
      >
        {last}{initial}
      </DragAndDrop>
    );
  }
});

module.exports = StackView;