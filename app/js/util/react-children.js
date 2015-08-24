import React from 'react';

export function firstAndRest(children) {
  let first;
  const rest = [];

  React.Children.forEach(children, (child, index) => {
    if (index === 0) {
      first = child;
    } else {
      rest.push(child);
    }
  });

  return [ first, rest ];
}