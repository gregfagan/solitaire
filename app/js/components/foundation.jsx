import React from 'react';
import Stack from './stack';
import Card from './card';

export default class Foundation extends React.Component {
  render() {
    const { stacks, path, interaction } = this.props;
    const p = path.concat("foundation");

    return (
      <div id="foundation">
      {
        stacks.map((stack, i) => {
          const stackPath = p.concat(i);
          return (
            <div key={i} className="card">
              <Card
                path={stackPath}
                slot={true}
                cascade="none"
              />
              <Stack
                path={stackPath}
                cards={stack}
                interaction={interaction}
              />
            </div>
          );
        })
      }
      </div>
    );
  }
};
