import { createStore } from 'redux';
import hyperlively from 'reducers/index';

export default function configureStore(initialState = {}) {
	const store = createStore(hyperlively, initialState, 
		window.devToolsExtension && window.devToolsExtension());
	return store;
}