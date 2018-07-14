// @flow
import React from 'react';
import { Provider } from 'react-redux';

import Application from './Application';
import configureStore from './configureStore';

const store = configureStore();

export default () => (
	<Provider store={store}>
		<Application />
	</Provider>
);
