import { JUMP_TO } from 'constants/actionTypes';
import { concat, slice, isEqual, cloneDeep, reduce, fill } from 'lodash';

const relevantStatesForScene = (states, sceneIndex) => {
	let length = 0;
	reduce(states, (previousState, state) => {
		if (state[sceneIndex] && !isEqual(state[sceneIndex], previousState[sceneIndex])){
			length += 1;
		}
		return state;
	}, fill(new Array(sceneIndex), undefined));
	return length;
};

function undoable (reducer) {

	const initialState = {
		past: [],
		present: reducer(undefined, {}),
		future: []
	};

	const nextState = (pointInTime, past, present, future, sceneIndex) => {
		let allStates = concat(past, [present], future);
		let relevantStatesCount = relevantStatesForScene(allStates, sceneIndex);
		let globalPointInTime = pointInTime + (allStates.length - relevantStatesCount);
		let normalizedPointInTime = Math.max(0, Math.min(allStates.length - 1, globalPointInTime));
		return {
			past: slice(allStates, 0, normalizedPointInTime),
			present: slice(allStates, normalizedPointInTime , normalizedPointInTime + 1)[0],
			future: slice(allStates, normalizedPointInTime + 1, allStates.length)
		};
	};

	const defaultNextState = (state, action) => {
		action.index = state.past.length;
		const newPresent = reducer(cloneDeep(state.present), action);
		if (isEqual(state.present, newPresent)) {
			return state;
		} else {
			return {
				past: concat( state.past, [state.present] ),
				present: newPresent,
				future: []
			};
		}
	};

	return (state = initialState, action) => {
		const { past, present, future } = state;

		switch (action.type) {
		case JUMP_TO: {
			return nextState(action.pointInTime, past, present, future, action.sceneIndex);
		}
		default:
			return defaultNextState(state, action);
		}
	};
}

export { undoable };