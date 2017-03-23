// @flow
import React, { PureComponent } from 'react';
import { forEach, map } from 'lodash';
import actions from 'actions/actions';
import JsonPropertyChooser from './JsonPropertyChooser';
import type { FunctionConfiguration, TreeParameter } from '../../typeDefinitions';

const formattedSignatures = (
		signatures: Array<TreeParameter>)
		: Array<FunctionConfiguration> =>
	map(signatures, signature => ({
		name: signature.split('(')[0],
		parameters: signature.split('(')[1].split(')')[0].split(',').length,
	}));

const getSignatureFromFunction = aFunction =>
		aFunction.toString().split(' {')[0].split('function ')[1];

const getActions = () => {
	const jsonObject = {};
	forEach(Object.keys(actions), (actionName, index) => {
		jsonObject[index] = getSignatureFromFunction(actions[actionName]);
	});
	return jsonObject;
};

Object.keys(actions).map(actionName =>
	getSignatureFromFunction(actions[actionName]));

type Props = {
	onActionChoose: (Array<FunctionConfiguration>) => void,
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
				jsonTree={getActions()}
			/>);
	}

}
