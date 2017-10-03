// @flow
import React, { PureComponent } from 'react';
import { forEach, map } from 'lodash';
import actions from 'actions/actions';
import JsonPropertyChooser from './JsonPropertyChooser';
import type { FunctionConfiguration, TreeParameter, ActionMapping } from '../../typeDefinitions';

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
		jsonObject[actionsCount] = specificAction.actionName + '()';
		actionsCount += 1;
	});
	return jsonObject;
};

type Props = {
	onActionChoose: (Array<FunctionConfiguration>) => void,
	specificActions: Array<ActionMapping>,
}

export default class ActionChooser extends PureComponent {

	static defaultProps = {
		onActionChoose: (actionSignatures: Array<FunctionConfiguration>) => {},
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
