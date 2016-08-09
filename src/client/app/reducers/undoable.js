import { JUMP_TO } from 'constants/actionTypes';
import { drop, dropRight, concat } from 'lodash';

function undoable (reducer) {

	const initialState = {
		past: [],
		present: reducer(undefined, {}),
		future: []
	};

	const nextState = (pointInTime, past, present, future) => {
		let allStates = concat(past, [present], future);
		let normalizedPointInTime = Math.max(0, Math.min(pointInTime, allStates.length - 1));
		return {
			past: dropRight(allStates, allStates.length - normalizedPointInTime),
			present: allStates[normalizedPointInTime],
			future: drop(allStates, normalizedPointInTime + 1)
		};
	};

	const defaultNextState = (state, action) => {
		const newPresent = reducer(state.present, action);
		if (state.present === newPresent) {
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
			return nextState(action.pointInTime, past, present, future);
		}
		default:
			return defaultNextState(state, action);
		}
	};
}

export { undoable };