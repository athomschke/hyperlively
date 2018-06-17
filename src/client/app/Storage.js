// @flow
import type { Reducer, Manipulator } from 'src/client/app/typeDefinitions';

export const storeState = (
	name: string,
	reducer: Reducer,
	localStorage: Storage,
	manipulator: Manipulator<any>,
) => (state: any, action: any) => {
	const nextState = reducer(state, action);
	localStorage.setItem(name, JSON.stringify(manipulator(nextState)));
	return nextState;
};

export const load = (localStorage: Storage, name: string) => {
	const stringState = localStorage.getItem(name);
	if (stringState) {
		return JSON.parse(stringState);
	}
	return null;
};
