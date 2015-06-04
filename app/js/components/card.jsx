/**
 * @jsx React.DOM
 */

 var _ = require("lodash")
 var React = require("react/addons");
 var Card = require("game/card");

 var FaceView = React.createClass({
  render: function() {
    var id = Card.toId(this.props.card);
    return (
      <img width='100%' height='100%' key={`card_face_${id}`} src={Card.images[id]} />
      );
  }
});
 
 var CardView = React.createClass({
  render: function() {
    var id = this.props.card ? "card_" + Card.toId(this.props.card) : "";

    var classes = React.addons.classSet({
      'card': true,
      'flipped': this.props.flipped,
      'cascade-down': this.props.cascade === "down",
      'cascade-none': this.props.cascade === "none"
    });

    var front = this.props.card ?
      <FaceView card={this.props.card} /> :
      <div className="side slot"></div>;

    var back;
    if (this.props.card) {
      back = <div className="side back"/>;
    }

    return (
      <div key={id} className={classes}>
        { front }
        { back }
      </div>
      );
  }
});

 module.exports = CardView;