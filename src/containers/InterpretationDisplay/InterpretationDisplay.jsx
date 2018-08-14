// @flow
import * as React from 'react';

import type { Functions, Parameters, Parameter } from 'src/types';

export type InterpretationDisplayProps = {
	functions: Functions,
	parameters: Parameters,
	onActionClick: (_newActions: Functions) => void,
	onParameterClick: (_newParameters: Parameters) => void,
}

const InterpretationDisplay = (props: InterpretationDisplayProps) => {
	const { functions, parameters } = props;
	let globalParameterIndex = 0;

	const onActionClick = index => props.onActionClick([...functions.slice(0, index), ...functions.slice(index + 1)]);
	const onParameterClick = index => props.onParameterClick([...parameters.slice(0, index), ...parameters.slice(index + 1)]);

	const renderCall = () => functions.map((aFunction, functionIndex) => {
		const selectedParameters = parameters.slice(globalParameterIndex, globalParameterIndex + aFunction.parameters.length);
		const requiredParameters = aFunction.parameters;
		const actionKey = aFunction.name;
		const functionCall = (
			<div
				key={actionKey}
			>
				{functionIndex === 0 ? '' : ' then '}
				<button
					key={actionKey}
					onClick={() => onActionClick(functionIndex)}
				>
					{aFunction.name}
				</button>
				{'('}
				{requiredParameters.map((requiredParameter, localParameterIndex) => {
					const elements = [];
					const parameter: Parameter = selectedParameters[localParameterIndex];
					if (parameter) {
						const parameterIndex = globalParameterIndex + localParameterIndex;
						const parameterKey = `${requiredParameter}: ${parameter.value}`;
						elements.push((
							<button
								key={parameterKey}
								onClick={() => onParameterClick(parameterIndex)}
							>
								{`${parameter.value}`}
							</button>
						));
					} else {
						elements.push(requiredParameter);
					}
					if (localParameterIndex < aFunction.parameters.length - 1) {
						elements.push(', ');
					}
					return (
						<div key={requiredParameter}>
							{elements}
						</div>
					);
				})}
				{')'}
			</div>
		);
		globalParameterIndex += aFunction.parameters.length;
		return functionCall;
	});

	return (
		<div>
			{renderCall()}
		</div>
	);
};

export default InterpretationDisplay;
