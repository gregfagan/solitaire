import React from 'react';
import { firstAndRest } from 'util/react-children';

export default class Stack extends React.Component {
  render() {
    const { container, depth=0, children, ...other } = this.props;

    const [ first, rest ] = firstAndRest(children);

    const stackedChildren = [
      first,
      rest.length > 0 &&
      <Stack key='rest' depth={depth + 1} container={container} {...other}>
        { rest }
      </Stack>
    ];

    return React.cloneElement(container, { depth, ...other }, stackedChildren);
  }
}