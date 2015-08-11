import 'babel/polyfill';
import React from 'react';
import View from './components/view';
import { Style } from 'radium';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import klondike from './game/reducers';
import Klondike from './components/klondike';

const store = createStore(klondike);

const styles = {
  'body': {
    backgroundColor: '#0F2A42'
  }
}

const app = (
  <View>
    <Style rules={styles}/>
    <Provider store={store}>
      { () => <Klondike /> }
    </Provider>
  </View>
);

React.initializeTouchEvents(true);
React.render(app, document.getElementById('app'));