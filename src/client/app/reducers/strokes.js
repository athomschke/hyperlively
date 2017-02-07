import * as creationCases from './caseReducers/strokeCreation';
import * as manipulationCases from './caseReducers/strokeManipulation';
import { camelCase } from 'lodash';

function strokes (state = [], action) {
	let functionName = camelCase(action.type);
	if (creationCases.hasOwnProperty(functionName)) {
		return creationCases[functionName](state, action);
	} else if (manipulationCases.hasOwnProperty(functionName)) {
		return manipulationCases[functionName](state, action);
	} else {
		return state;
	}
}

export { strokes };