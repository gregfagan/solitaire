import React from 'react';
import Column from './column';

export default class Tableau extends React.Component {
  render() {
    const { columns, path, interaction } = this.props;
    const p = path.concat("tableau");
    
    return (
      <div id="tableau">
      {
        columns.map((column, i) =>
          <Column
            key={i}
            path={p.concat(i)}
            covered={column.covered}
            uncovered={column.uncovered}
            interaction={interaction}
          />
        )
      }
      </div>
    );
  }
};
