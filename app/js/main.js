import 'babel/polyfill';
import '../css/stylesheet.styl';
import React from 'react';
import Board from './components/board';

React.initializeTouchEvents(true);
React.render(<Board/>, document.getElementById('app'));