// @flow
import React, { PureComponent } from 'react';
import {
	forEach, map, flatten, filter, last,
} from 'lodash';

import * as actionCreators from 'src/actionCreators';
import type { FunctionConfiguration, TreeParameter, ActionMapping } from 'src/types';
import JsonPropertyChooser from 'src/components/JsonPropertyChooser';

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
	onExpandedPathsChange: () => void,
	onCheckedPathsChange: () => void,
}

export default class ActionChooser extends PureComponent<Props> {
	static defaultProps = {
		onFunctionsChoose: (_actionSignatures: Array<FunctionConfiguration>) => {},
		checkedPaths: [],
		expandedPaths: [],
		onExpandedPathsChange: () => {},
		onCheckedPathsChange: () => {},
	}

	onFunctionsChoose(signatures: Array<TreeParameter>) {
		this.props.onFunctionsChoose(formattedSignatures(signatures.map(ea => `${ea}`)));
	}

	props: Props

	render() {
		return (
			<JsonPropertyChooser
				onParameterChoose={(parameters: Array<TreeParameter>) => {
					this.onFunctionsChoose(parameters);
				}}
				onExpandedPathsChange={this.props.onExpandedPathsChange}
				onCheckedPathsChange={this.props.onCheckedPathsChange}
				checkedPaths={this.props.checkedPaths}
				expandedPaths={this.props.expandedPaths}
				position={undefined}
				jsonTree={allActions(this.props.specificActions)}
			/>);
	}
}
