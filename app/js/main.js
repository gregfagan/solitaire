import 'babel/polyfill';
import React from 'react';
import View from './components/view';
import Board from './components/board';
import { Style } from 'radium';

const app = (
  <View>
    <Style rules={{
      'body': {
        backgroundColor: '#0F2A42'
      }
    }}/>
    <Board/>
  </View>
);

React.initializeTouchEvents(true);
React.render(app, document.getElementById('app'));