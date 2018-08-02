// @flow
import * as React from 'react';

import type { Functions, Parameters } from 'src/types';

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
		const functionParameters = parameters.slice(globalParameterIndex, globalParameterIndex + aFunction.parameters);
		const functionCall = (
			<div
				key={aFunction.name}
			>
				{functionIndex === 0 ? '' : ' then '}
				<button
					onClick={() => onActionClick(functionIndex)}
				>
					{aFunction.name}
				</button>
				{'('}
				{functionParameters.map((parameter, localParameterIndex) => {
					const parameterIndex = globalParameterIndex + localParameterIndex;
					return (
						<div key={`${parameter}`}>
							<button
								onClick={() => onParameterClick(parameterIndex)}
							>
								{`${parameter}`}
							</button>
							{localParameterIndex < aFunction.parameters - 1 ? ', ' : ''}
						</div>
					);
				})}
				{')'}
			</div>
		);
		globalParameterIndex += aFunction.parameters;
		return functionCall;
	});

	return (
		<div>
			{renderCall()}
		</div>
	);
};

export default InterpretationDisplay;
