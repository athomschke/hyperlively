// @flow
import React, { PureComponent } from 'react';
import { forEach, map, flatten } from 'lodash';
import actions from 'actions/actions';
import type { FunctionConfiguration, TreeParameter, ActionMapping } from 'typeDefinitions';
import JsonPropertyChooser from './JsonPropertyChooser';

const formattedSignatures = (
		signatures: Array<TreeParameter>)
		: Array<FunctionConfiguration> =>
	map(signatures, signature => ({
		name: signature.split('(')[0],
		parameters: signature.split('(')[1].split(')')[0].split(',').length,
	}));

const getSignatureFromFunction = aFunction =>
		aFunction.toString().split(' {')[0].split('function ')[1];

const allActions = (specificActions) => {
	const jsonObject = {};
	let actionsCount = 0;
	forEach(Object.keys(actions), (actionName) => {
		jsonObject[actionsCount] = getSignatureFromFunction(actions[actionName]);
		actionsCount += 1;
	});

	forEach(specificActions, (specificAction) => {
		const parameters = flatten(map(specificAction.actionNames, (originalActionName) => {
			let i = 0;
			while (jsonObject[i]) {
				if (jsonObject[i].split('(')[0] === originalActionName) {
					return jsonObject[i].split('(')[1].split(')')[0].split(', ');
				}
				i += 1;
			}
			return [];
		}));
		jsonObject[actionsCount] = `${specificAction.actionName} (${parameters.join(', ')})`;
		actionsCount += 1;
	});
	return jsonObject;
};

type Props = {
	onActionChoose: (Array<FunctionConfiguration>) => void,
	specificActions: Array<ActionMapping>,
}

export default class ActionChooser extends PureComponent<Props> {
	static defaultProps = {
		onActionChoose: (_actionSignatures: Array<FunctionConfiguration>) => {},
	}

	onActionChoose(signatures: Array<TreeParameter>) {
		this.props.onActionChoose(formattedSignatures(signatures));
	}

	props: Props

	render() {
		return (
			<JsonPropertyChooser
				{...this.props}
				onParameterChoose={(parameters: Array<TreeParameter>) => {
					this.onActionChoose(parameters);
				}}
				jsonTree={allActions(this.props.specificActions)}
			/>);
	}
}
