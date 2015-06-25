import _ from "lodash";
import React from "react";
import { toId, images } from "game/card";
import classnames from 'classnames';

class FaceView extends React.Component {
  render() {
    const id = toId(this.props.card);
    return (
      <img width='100%' height='100%' key={`card_face_${id}`} src={images[id]} />
    );
  }
};
 
 export default class CardView extends React.Component {
  render() {
    const id = this.props.card ? "card_" + toId(this.props.card) : "";

    const classes = classnames({
      'card': true,
      'flipped': this.props.flipped,
      'cascade-down': this.props.cascade === "down",
      'cascade-none': this.props.cascade === "none"
    });

    const front = this.props.card ?
      <FaceView card={this.props.card} /> :
      <div className="side slot"></div>;

    let back;
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
};