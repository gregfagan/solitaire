/**
 * @jsx React.DOM
 */

define([
    "underscore",
    "react-with-addons",
    "game/card"
],
function (_, React, Card) {

    var FaceView = React.createClass({
        render: function() {
            var symbol = Card.toId(this.props.card);
            var rotate = { WebkitTransform: "rotateZ(180deg)" };
            return (
                <div className={"side face " + (Card.isRed(this.props.card) ? "red" : "black")}>
                    <figure className="side corner">{symbol}</figure>
                    <figure className="side corner" style={rotate}>{symbol}</figure>
                    <figure className="side center">{Card.suit(this.props.card)}</figure>
                </div>
            );
        }
    });

    var CardView = React.createClass({
        render: function() {
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
                <div className={classes}>
                    { front }
                    { back }
                </div>
            );
        }
    });

    return CardView;
});