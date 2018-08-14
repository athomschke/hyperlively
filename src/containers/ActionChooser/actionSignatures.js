// @flow
import {
	forEach, map, flatten, filter, last,
} from 'lodash';

import type { ActionMapping, Functions } from 'src/types';
import * as actionCreators from 'src/actionCreators';

export const getArgs = (functionString: string): Array<string> => functionString.split('(')[1].split(')')[0].split(',');

export const getName = (functionString: string): string => last(functionString.split('(')[0].trim().split('function ')).trim();

const functionSignature = (name: string, params: Array<string>) => `${name} (${params.join(', ')})`;

export const allActions = (specificActions: Array<ActionMapping>) => {
	const jsonObject = {};
	let actionsCount = 0;
	forEach(Object.keys(actionCreators), (actionName) => {
		const functionString = actionCreators[actionName].toString();
		jsonObject[actionsCount] = functionSignature(getName(functionString), getArgs(functionString));
		actionsCount += 1;
	});

	forEach(specificActions, (specificAction) => {
		const parameters = filter(flatten(map(specificAction.actionNames, (originalActionName) => {
			let i = 0;
			while (jsonObject[i]) {
				if (getName(jsonObject[i]) === originalActionName) {
					return getArgs(jsonObject[i]);
				}
				i += 1;
			}
			return [];
		})), (action: any) => action);
		jsonObject[actionsCount] = functionSignature(specificAction.actionName, parameters);
		actionsCount += 1;
	});
	return jsonObject;
};

export const formattedSignatures = (
	signatures: Array<string>,
	recognizedLabel?: string,
)
	: Functions => signatures.map((signature: string) => ({
	recognizedLabel,
	name: getName(signature),
	parameters: getArgs(signature),
}));
