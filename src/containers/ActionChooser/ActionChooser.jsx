// @flow
import React, { PureComponent } from 'react';
import {
	forEach, map, flatten, filter, last, without,
} from 'lodash';

import * as actionCreators from 'src/actionCreators';
import { PATH_DELIMITER } from 'src/constants/configuration';
import type { FunctionConfiguration, ActionMapping } from 'src/types';
import PrefixedJsonPropertyChooser from 'src/components/PrefixedJSONPropertyChooser';

const getArgs = functionString => functionString.split('(')[1].split(')')[0].split(',');

const getName = functionString => last(functionString.split('(')[0].trim().split('function ')).trim();

const formattedSignatures = (
	signatures: Array<string>,
)
	: Array<FunctionConfiguration> => map(signatures, signature => ({
	name: getName(signature),
	parameters: getArgs(signature).length,
}));

const functionSignature = (name: string, params: Array<string>) => `${name} (${params.join(', ')})`;

const allActions = (specificActions) => {
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

type Props = {
	onFunctionsChoose: (Array<FunctionConfiguration>) => void,
	specificActions: Array<ActionMapping>,
	checkedPaths: Array<string>,
	expandedPaths: Array<string>,
	onExpandedPathsChange: (_paths: Array<string>) => void,
	onCheckedPathsChange: (_paths: Array<string>) => void,
}

export default class ActionChooser extends PureComponent<Props> {
	onFunctionsChoose(signatures: Array<string>) {
		this.props.onFunctionsChoose(formattedSignatures(signatures));
	}

	props: Props

	render() {
		const actions = allActions(this.props.specificActions);
		const jsonTree = { actions };

		const prependActionsString = (paths: Array<string>) => paths.map(path => ['actions', ...without(path.split(PATH_DELIMITER), '')].join(PATH_DELIMITER));
		const removeActionsString = (paths: Array<string>) => paths.map(path => path.split(PATH_DELIMITER).slice(1).join(PATH_DELIMITER));

		const checkedPaths = prependActionsString(this.props.checkedPaths);
		const expandedPaths = prependActionsString(this.props.expandedPaths);

		return (
			<PrefixedJsonPropertyChooser
				prefixes={[]}
				onParameterChoose={(parameters: Array<string>) => {
					this.onFunctionsChoose(removeActionsString(parameters));
				}}
				onExpandedPathsChange={paths => this.props.onExpandedPathsChange(removeActionsString(paths))}
				onCheckedPathsChange={paths => this.props.onCheckedPathsChange(removeActionsString(paths))}
				checkedPaths={checkedPaths}
				expandedPaths={expandedPaths}
				jsonTree={jsonTree}
			/>);
	}
}
