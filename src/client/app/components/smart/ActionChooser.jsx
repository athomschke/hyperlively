// @flow
import React, { PureComponent } from 'react';
import { forEach, map } from 'lodash';
import actions from 'actions/actions';
import JsonPropertyChooser from './JsonPropertyChooser';

const formattedSignaturs = signatures => map(signatures, signature => ({
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
	onActionChoose: (string) => void,
}

export default class ActionChooser extends PureComponent {

	static defaultProps = {
		onActionChoose: () => {},
	}

	onActionChoose(signatures: Array<string>) {
		this.props.onActionChoose(formattedSignaturs(signatures));
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
