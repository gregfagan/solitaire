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
            var suit = Card.suit_c(this.props.card);
            var rank = Card.rank(this.props.card);
            var file = "img/svgCards/" + rank + suit + ".svg";
            var id = "card_face_" + Card.toId(this.props.card);
            return (
                <img key={id} src={file} />
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

    return CardView;
});