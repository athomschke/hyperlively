import * as actionTypes from 'constants/actionTypes';
import { first, last, initial, tail, conca, drop, dropRight } from 'lodash';

const undoable = (reducer) => {

	const initialState = {
		past: [],
		present: reducer(undefined, {}),
		future: []
	}

	const nextState = (pointInTime, past, present, future) => {
		let allStates = [...past, present, ...future];
		let normalizedPointInTime = Math.max(0, Math.min(pointInTime, allStates.length - 1));
		return {
			past: dropRight(allStates, allStates.length - normalizedPointInTime),
			present: allStates[normalizedPointInTime],
			future: drop(allStates, normalizedPointInTime + 1)
		}
	}

	return (state = initialState, action) => {
		const { past, present, future } = state

		switch (action.type) {
			case actionTypes.JUMP_TO: {
				return nextState(action.pointInTime, past, present, future);
			}
			default:
				// Delegate handling the action to the passed reducer
				const newPresent = reducer(present, action)
				if (present === newPresent) {
				  return state
				} else {
					return {
					  past: [ ...past, present ],
					  present: newPresent,
					  future: []
					}
				}
		}
	}
}

export default undoable