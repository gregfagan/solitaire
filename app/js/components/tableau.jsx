import React from 'react';
import View from './view';
import Column from './column';

export default class Tableau extends React.Component {
  render() {
    const { columns } = this.props;
    
    return (
      <View direction='row'>
      {
        columns.map((column, i) =>
          <Column
            key={i}
            {...column}
          />
        )
      }
      </View>
    );
  }
};
