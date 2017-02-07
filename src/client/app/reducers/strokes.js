import * as cases from './caseReducers/strokes';
import { camelCase } from 'lodash';

function strokes (state = [], action) {
	let functionName = camelCase(action.type);
	if (cases.hasOwnProperty(functionName)) {
		return cases[functionName](state, action);
	} else {
		return state;
	}
}

export { strokes };