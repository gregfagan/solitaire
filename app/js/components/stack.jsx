import React from 'react';
import { firstAndRest } from 'util/react-children';

export default class Stack extends React.Component {
  render() {
    const { container:Container, depth=0, children, ...other } = this.props;

    const [ first, rest ] = firstAndRest(children);


    return (
      <Container depth={depth} {...other}>
        { first }
        { 
          rest.length > 0 &&
          <Stack depth={depth + 1} container={Container} {...other}>
            { rest }
          </Stack>
        }
      </Container>
    );
  }
}