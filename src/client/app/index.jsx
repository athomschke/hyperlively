import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Application from './Application';
import { createStore } from 'redux';
import hyperlively from './reducers/index';

'use strict'

let store = createStore(hyperlively);

render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.getElementById('app')
)