// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { cloneDeep } from 'lodash';

import { type HyperlivelyState } from 'src/client/app/typeDefinitions';
import { storeState, load } from 'src/client/app/Storage';

import reducers, { initialHyperlivelyState } from './reducers';
import { myScriptJs } from './sagas/myScriptJs';

export default function configureStore(initialState: HyperlivelyState = initialHyperlivelyState()) {
	const sagaMiddleware = createSagaMiddleware();

	// eslint-disable-next-line no-underscore-dangle
	const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
		// eslint-disable-next-line no-underscore-dangle
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :
		compose;

	const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

	const manipulator = (state: HyperlivelyState): HyperlivelyState => {
		const stateToStore: HyperlivelyState = cloneDeep(state);
		stateToStore.data.undoableScenes.future = [];
		stateToStore.data.interpretation.interpretations = {
			shapes: [],
			texts: [],
		};
		return stateToStore;
	};

	const store = createStore(
		storeState('hyperlively', reducers, window.localStorage, manipulator),
		load(window.localStorage, 'hyperlively') || initialState,
		enhancer,
	);
	sagaMiddleware.run(myScriptJs);
	return store;
}
