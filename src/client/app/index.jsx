// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Application from './Application';
import configureStore from './configureStore';

const store = configureStore();

const appNode = document.getElementById('app');

if (appNode) {
	render(
		<Provider store={store}>
			<Application />
		</Provider>,
		appNode,
	);
} else {
	throw new Error('Cannot find a node with id "app"');
}
