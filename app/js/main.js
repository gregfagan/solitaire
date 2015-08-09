import 'babel/polyfill';
import React from 'react';
import View from './components/view';
import { Style } from 'radium';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { default as game } from './game/klondike';
import Klondike from './components/klondike';

const store = createStore(game);

const app = (
  <View>
    <Style rules={{
      'body': {
        backgroundColor: '#0F2A42'
      }
    }}/>
    <Provider store={store}>
      { () => <Klondike/> }
    </Provider>
  </View>
);

React.initializeTouchEvents(true);
React.render(app, document.getElementById('app'));