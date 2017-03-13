// @flow
import React, { Component } from 'react';
import { SyntheticMouseEvent } from 'flow-bin';
import actions from 'actions/actions';
import HoverList from './HoverList';

const getFunctionNameFromSignature = signature => signature.split('(')[0];

const getSignatureFromFunction = aFunction =>
		aFunction.toString().split(' {')[0].split('function ')[1];

const getActions = () => Object.keys(actions).map(actionName =>
	getSignatureFromFunction(actions[actionName]));

type Props = {
	onActionChoose: (MouseEvent, string) => void,
}

export default class InterpretationChooser extends Component {

	static defaultProps = {
		onActionChoose: () => {},
	}

	onActionChoose(event: MouseEvent, signature: string) {
		this.props.onActionChoose(event, getFunctionNameFromSignature(signature));
	}

	props: Props

	render() {
		return (
			<HoverList
				{...this.props}
				onItemClick={(event: SyntheticMouseEvent, name: string) => {
					this.onActionChoose(event, name);
				}}
				items={getActions()}
			/>);
	}

}
