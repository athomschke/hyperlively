// @flow
import * as React from 'react';
import {
	map, forEach, concat, find,
} from 'lodash';

import type {
	FunctionConfiguration, Functions, Parameters, ActionMapping,
} from 'src/types';

export type InterpretationTriggerProps = {
	specificActions: Array<ActionMapping>,
	parameters: Parameters,
	functions: Functions,
	performAction: () => void,
	setInterval: (() => void, number) => number,
	clearInterval: (interval: number) => void,
	onInterpretationDone: (boolean) => void,
}

const InterpretationTrigger = (props: InterpretationTriggerProps) => {
	const {
		onInterpretationDone, setInterval, clearInterval, performAction,
		specificActions, functions, parameters,
	} = props;

	const doPerformAction = (items: Array<FunctionConfiguration>, values: Array<number | string>) => {
		let valueIndex = 0;
		forEach(items, (item) => {
			const functionName = item.name;
			const functionParameters = values.slice(valueIndex, valueIndex + item.parameters);
			valueIndex += item.parameters;
			performAction.apply(this, [functionName].concat(functionParameters));
		});
		onInterpretationDone(false);
	};

	const onAcceptInterpretationClick = () => {
		let allFunctions = [];
		forEach(functions, (aFunction) => {
			const specificAction = find(specificActions,
				action => action.actionName === aFunction.name);
			if (specificAction) {
				const primitiveActions = map(specificAction.actionNames,
					actionName => ({ name: actionName, parameters: 1 }));
				allFunctions = concat(functions, primitiveActions);
			} else {
				allFunctions.push(aFunction);
			}
		});
		doPerformAction(allFunctions, parameters);
	};

	const onInterpretationTick = () => {
		let counter = 0;
		const tickInterval = setInterval(() => {
			doPerformAction(functions, parameters);
			counter -= 1;
			if (counter === 0) {
				clearInterval(tickInterval);
			}
		}, 1000);
	};

	return (
		<div>
			<div>
				<button onClick={onAcceptInterpretationClick}>
					{'Accept Interpretation'}
				</button>
				<button onClick={onInterpretationTick}>
					{'Tick'}
				</button>
			</div>
		</div>
	);
};

export default InterpretationTrigger;
