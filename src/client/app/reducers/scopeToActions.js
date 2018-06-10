// @flow
/* eslint-disable */
import { type CommonAction } from 'src/client/app/typeDefinitions';

type CommonReducer<S, A> = (state: S, action: A) => S

type ScopeToActions<S, A> =
(reducer: CommonReducer<S, A>, scopedActions: { [key: string]: A }, initialState: S) =>
CommonReducer<S, CommonAction>

type Return_<R, Fn: () => R> = R;
type Return<T> = Return_<*, T>;

const scopeToActions: ScopeToActions<*, *> = (reducer, scopedActions, initialState) =>
(state? = initialState, action) => {
	if (scopedActions[action.type]) {
		const specificActionCreator = scopedActions[action.type];

		const specificAction: Return<typeof specificActionCreator> = action;

		return reducer(state, specificAction);
	}
	return state;
};

export default scopeToActions;
