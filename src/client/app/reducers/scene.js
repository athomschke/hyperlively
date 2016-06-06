import sketches from 'reducers/sketches'
import undoable, { distinctState } from 'redux-undo';
import * as actionTypes from 'constants/actionTypes';

let initialState = { sketches: [] };

// let initialState = {
// 	sketches: [{
// 		strokes: [{
// 			points: [{ x: 10, y: 10 }, { x: 11, y: 15 }, { x: 13, y: 14 }, { x: 13, y: 16 }, { x: 12, y: 19 }, { x: 11, y: 21 }],
// 			finished: true
// 		}, {
// 			points: [{ x: 30, y: 10 }, { x: 31, y: 15 }, { x: 33, y: 14 }, { x: 33, y: 16 }, { x: 32, y: 19 }, { x: 31, y: 21 }],
// 			finished: true
// 		}]
// 	}]
// }

const scene = (state = initialState, action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
		case actionTypes.CREATE_STROKE:
		case actionTypes.FINISH_STROKE:
			return {
				sketches: sketches(state.sketches, action)
			};
		default:
			return state;
	}
}

const undoableScene = undoable(scene, {})

export default undoableScene;