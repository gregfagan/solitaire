import _ from "lodash";
import React from "react/addons";
import { thickness } from "game/card";
import DragAndDrop from "components/draganddrop";
import Card from "components/card"
import transform from '../util/transform';

 export default class Stack extends React.Component {
  static defaultProps = {
    cascade: "none",
    z: 0,
  }

  render() {
    const { 
      interaction,
      cards,
      flipped,
      cascade,
      z,
      path,
      connectDragSource,
      connectDropTarget,
      isDragging,
      ...other
    } = this.props;
    
    var last = _.last(cards);
    var initial = _.initial(cards);
    var lastPath = path && path.concat(initial.length);

    if (last) {
      last = <Card
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
      initial = <Stack
        cards={initial}
        path={path}
        flipped={flipped}
        cascade={cascade}
        interaction={interaction}
        z={thickness}
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
};