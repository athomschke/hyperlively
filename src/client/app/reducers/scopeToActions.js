// @flow
import { type CommonAction } from 'src/client/app/typeDefinitions';

type CommonReducer<S, A> = (state: S, action: A) => S
const scopeToActions = (reducer: CommonReducer<any, *>, actions: *) =>
	(state: any, action: CommonAction) => {
		if (actions.indexOf(action.type) >= 0) {
			return reducer(state, ((action:any):(typeof actions)));
		}
		return state;
	};

export default scopeToActions;
