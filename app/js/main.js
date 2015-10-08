import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEvents from 'react-tap-event-plugin';
import View from './components/view';
import { Style } from 'radium';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import klondike from './game/reducers';
import Klondike from './components/klondike';

const store = createStore(klondike);

const styles = {
  'body': {
    '-webkit-user-select': 'none',
    '-ms-user-select': 'none',
    backgroundColor: '#0F2A42',
  }
}

const app = (
  <View>
    <Style rules={styles}/>
    <Provider store={store}>
      <Klondike />
    </Provider>
  </View>
);

injectTapEvents();
ReactDOM.render(app, document.getElementById('app'));