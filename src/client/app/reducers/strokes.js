// @flow
import { camelCase } from 'lodash';

import type { Stroke } from 'src/client/app/typeDefinitions';
import type {
	APPEND_STROKE_ACTION, APPEND_POINT_ACTION, FINISH_STROKE_ACTION,
	UPDATE_POSITION_ACTION, HIDE_ACTION, SELECT_ACTION, SELECT_INSIDE_ACTION,
	ROTATE_BY_ACTION,
} from 'src/client/app/actionTypeDefinitions';

import * as creationCases from './caseReducers/strokeCreation';
import * as manipulationCases from './caseReducers/strokeManipulation';

function strokes(state: Array<Stroke> = [], action:
		APPEND_STROKE_ACTION | APPEND_POINT_ACTION | FINISH_STROKE_ACTION |
		UPDATE_POSITION_ACTION | HIDE_ACTION | SELECT_ACTION | SELECT_INSIDE_ACTION |
		ROTATE_BY_ACTION) {
	const functionName = camelCase(action.type);
	if (Object.prototype.hasOwnProperty.call(creationCases, functionName)) {
		return creationCases[functionName](state, action);
	} else if (Object.prototype.hasOwnProperty.call(manipulationCases, functionName)) {
		return manipulationCases[functionName](state, action);
	}
	return state;
}

export { strokes };
