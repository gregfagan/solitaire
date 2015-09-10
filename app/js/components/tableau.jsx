import React from 'react';
import View from './view';
import Column from './column';

export default class Tableau extends React.Component {
  render() {
    const { columns, ...other } = this.props;
    
    return (
      <View direction='row'>
      {
        columns.map((column, i) =>
          <Column
            key={i}
            path={['tableau', i]}
            {...column}
            {...other}
          />
        )
      }
      </View>
    );
  }
};
