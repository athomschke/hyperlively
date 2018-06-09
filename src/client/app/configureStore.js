import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { type HyperlivelyState } from 'src/client/app/typeDefinitions';

import hyperlively, { initialHyperlivelyState } from './reducers/index';
import { myScriptJs } from './sagas/myScriptJs';

export default function configureStore(initialState: HyperlivelyState = initialHyperlivelyState) {
	const sagaMiddleware = createSagaMiddleware();

	// eslint-disable-next-line no-underscore-dangle
	const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
		// eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :
		compose;

	const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

	const store = createStore(
		hyperlively,
		initialState,
		enhancer,
	);
	sagaMiddleware.run(myScriptJs);
	return store;
}
