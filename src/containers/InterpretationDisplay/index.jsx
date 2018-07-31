// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import type { HyperlivelyState, Functions, Parameters } from 'src/types';

export type InterpretationDisplayProps = {
	functions: Functions,
	parameters: Parameters,
}

export const InterpretationDisplay = (props: InterpretationDisplayProps) => {
	const { functions, parameters } = props;
	let i = 0;
	const renderCall = () => functions.map((aFunction) => {
		const functionParameters = parameters.slice(i, i + aFunction.parameters);
		i += aFunction.parameters;
		return `${aFunction.name}(${functionParameters.join(', ')})`;
	}).join(' then ');

	return (
		<div>
			{renderCall()}
		</div>
	);
};

const mapStateToProps = (state: HyperlivelyState) => ({
	functions: state.ui.interpretations.functions,
	parameters: state.ui.interpretations.parameters,
});

export default connect(mapStateToProps, () => ({}))(InterpretationDisplay);
