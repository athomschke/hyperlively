import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import hyperlively from './reducers/index';

export default function configureStore(initialState = {}) {
	const store = createStore(
		hyperlively,
		initialState,
		applyMiddleware(thunkMiddleware),
		window.devToolsExtension && window.devToolsExtension(),
	);
	return store;
}
