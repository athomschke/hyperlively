// @flow
import { camelCase } from 'lodash';
import * as creationCases from './caseReducers/strokeCreation';
import * as manipulationCases from './caseReducers/strokeManipulation';
import { type Stroke } from '../typeDefinitions';

function strokes(state: Array<Stroke> = [], action) {
	const functionName = camelCase(action.type);
	if (Object.prototype.hasOwnProperty.call(creationCases, functionName)) {
		return creationCases[functionName](state, action);
	} else if (Object.prototype.hasOwnProperty.call(manipulationCases, functionName)) {
		return manipulationCases[functionName](state, action);
	}
	return state;
}

export { strokes };
