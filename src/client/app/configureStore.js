import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import hyperlively from './reducers/index';
import { myScriptJs } from './sagas/myScriptJs';

export default function configureStore(initialState = {}) {
	const sagaMiddleware = createSagaMiddleware();
	const store = createStore(
		hyperlively,
		initialState,
		applyMiddleware(sagaMiddleware),
		window.devToolsExtension && window.devToolsExtension(),
	);
	sagaMiddleware.run(myScriptJs);
	return store;
}
