// @flow
import React, { Component } from 'react';
import { forEach, map } from 'lodash';
import actions from 'actions/actions';
import JsonPropertyChooser from './JsonPropertyChooser';

const getFunctionNameFromSignatures = signatures => map(signatures, signature => signature.split('(')[0]);

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
	onActionChoose: (string) => void,
}

export default class InterpretationChooser extends Component {

	static defaultProps = {
		onActionChoose: () => {},
	}

	onActionChoose(signatures: Array<string>) {
		this.props.onActionChoose(getFunctionNameFromSignatures(signatures));
	}

	props: Props

	render() {
		return (
			<JsonPropertyChooser
				{...this.props}
				onParameterChoose={(parameters) => {
					this.onActionChoose(parameters);
				}}
				jsonTree={getActions()}
			/>);
	}

}
