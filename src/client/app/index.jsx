import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Application from './Application';
import configureStore from './configureStore';

const store = configureStore();

render(
	<Provider store={store}>
		<Application />
	</Provider>,
	document.getElementById('app'),
);
