import { strokes } from 'reducers/strokes';
import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, UPDATE_BOUNDS, HIDE } from 'constants/actionTypes';
import { last } from 'lodash';

let defaultScene = () => {
	return {
		strokes: []
	};
};

function scenes (state = [], action) {
	switch(action.type) {
	case APPEND_POINT:
	case CREATE_STROKE:
	case FINISH_STROKE:
	case HIDE:
	case UPDATE_BOUNDS:
		return [{
			strokes: strokes((last(state) || defaultScene()).strokes, action)
		}];
	default:
		return state;
	}
}

export { scenes };