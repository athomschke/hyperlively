// @flow
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { cloneDeep } from 'lodash';

import { type HyperlivelyState } from 'src/client/app/types';
import { storeState, load } from 'src/client/app/Storage';

import reducers, { initialHyperlivelyState } from './reducers';
import { myScriptJs } from './sagas/myScriptJs';

export default function configureStore(emptyState: HyperlivelyState = initialHyperlivelyState()) {
	const sagaMiddleware = createSagaMiddleware();

	const manipulator = (state: HyperlivelyState): HyperlivelyState => {
		const stateToStore: HyperlivelyState = cloneDeep(state);
		stateToStore.data.scenes.future = [];
		stateToStore.data.interpretation = {
			shapes: [],
			texts: [],
		};
		return stateToStore;
	};

	const composeEnhancers = composeWithDevTools({});

	const reducer = storeState('hyperlively', reducers, window.localStorage, manipulator);
	const initialState = load(window.localStorage, 'hyperlively') || emptyState;
	const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

	const store = createStore(reducer, initialState, enhancer);
	sagaMiddleware.run(myScriptJs);
	return store;
}
