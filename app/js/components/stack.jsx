import React, { PropTypes } from 'react';
import { firstAndRest } from 'util/react-children';

export default class Stack extends React.Component {
  render() {
    const { container:Container, depth=0, children, ...other } = this.props;

    const [ first, rest ] = firstAndRest(children);

    const stackedChildren = [
      first,
      rest.length > 0 &&
      <Stack key='rest' container={Container} depth={depth + 1} {...other}>
        { rest }
      </Stack>
    ];

    return <Container depth={depth} {...other}>{stackedChildren}</Container>;
  }
}