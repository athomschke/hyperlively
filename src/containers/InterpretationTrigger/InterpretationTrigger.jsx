// @flow
import * as React from 'react';
import {
	map, forEach, concat, find, values,
} from 'lodash';

import { allActions, formattedSignatures } from 'src/containers/ActionChooser/actionSignatures';
import type { Functions, Parameters, ActionMapping } from 'src/types';

export type InterpretationTriggerProps = {
	specificActions: Array<ActionMapping>,
	parameters: Parameters,
	functions: Functions,
	performAction: () => void,
	setInterval: (() => void, number) => number,
	clearInterval: (interval: number) => void,
	onInterpretationDone: (boolean, label?: string, actionNames?: string[]) => void,
}

const InterpretationTrigger = (props: InterpretationTriggerProps) => {
	const {
		onInterpretationDone, setInterval, clearInterval, performAction,
		specificActions, functions, parameters,
	} = props;

	const doPerformAction = (items: Functions, valuesToUse: Parameters, isTicking: ?boolean) => {
		let valueIndex = 0;
		const performableItems: Functions = items.filter(
			item => props.specificActions.map(specificAction => specificAction.actionName).indexOf(item.name) < 0,
		);
		forEach(performableItems, (item) => {
			const functionName = item.name;
			const functionParameters = valuesToUse.slice(valueIndex, valueIndex + item.parameters.length);
			valueIndex += item.parameters.length;
			performAction.apply(this, [functionName].concat(functionParameters));
		});
		onInterpretationDone(
			!isTicking,
			(performableItems.find(performableItem => performableItem.recognizedLabel) || {}).recognizedLabel,
			performableItems.map(performableItem => performableItem.name),
		);
	};

	const onAcceptInterpretationClick = () => {
		let allFunctions = [];
		const allPrimitiveActions = formattedSignatures(values(allActions([])));
		forEach(functions, (aFunction) => {
			const specificAction = find(specificActions,
				action => action.actionName === aFunction.name);
			if (specificAction) {
				const primitiveActions = map(
					specificAction.actionNames,
					actionName => ({
						name: actionName,
						parameters: (allPrimitiveActions.find(action => action.name === actionName) || {}).parameters,
					}),
				);
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
			doPerformAction(functions, parameters, true);
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
