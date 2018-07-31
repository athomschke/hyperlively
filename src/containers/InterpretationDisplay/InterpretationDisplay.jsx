// @flow
import * as React from 'react';

import type { Functions, Parameters } from 'src/types';

export type InterpretationDisplayProps = {
	functions: Functions,
	parameters: Parameters,
}

const InterpretationDisplay = (props: InterpretationDisplayProps) => {
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

export default InterpretationDisplay;
