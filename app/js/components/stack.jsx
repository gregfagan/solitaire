import React from 'react';

export default class Stack extends React.Component {
  render() {
    const { container:Container, depth=0, children, ...other } = this.props;

    let first;
    const rest = [];

    React.Children.forEach(children, (child, index) => {
      if (index === 0) {
        first = child;
      } else {
        rest.push(child);
      }
    });

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