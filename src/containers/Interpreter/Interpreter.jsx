// @flow
/* eslint-disable react/prop-types */
import * as React from 'react';
import { map, forEach, concat, find } from 'lodash';

import type { FunctionConfiguration, RecognitionResult, Functions, Parameters, ActionMapping } from 'src/types';
import { relativeDividerPosition } from 'src/constants/configuration';

import style from './Interpreter.scss';

type InterpretationChooserAdditionalProps = {
	specificActions: Array<ActionMapping>,
	parameters: Parameters,
	functions: Functions,
	children: React.Node,
}

export type InterpreterProps = InterpretationChooserAdditionalProps & {
	performAction: () => void,
	showInterpreter: boolean,
	interpretations: RecognitionResult,
	setInterval: (() => void, number) => number,
	clearInterval: (interval: number) => void,
	onInterpretationDone: (boolean) => void,
}

const defaultProps = (): InterpreterProps => ({
	performAction: () => undefined,
	showInterpreter: false,
	children: null,
	interpretations: {
		texts: [],
		shapes: [],
	},
	specificActions: [],
	functions: [],
	parameters: [],
	onInterpretationDone: () => undefined,
	setInterval: () => 0,
	clearInterval: () => {},
});

export default (props: InterpreterProps = defaultProps()) => {
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

	return (<div
		className={style.interpretationChooser}
		style={{ width: `${(1 - relativeDividerPosition) * 100}%` }}
	>
		<button onClick={onAcceptInterpretationClick} >
			Accept Interpretation
		</button>
		<button onClick={onInterpretationTick}>
			Tick
		</button>
		<div>
			{props.children}
		</div>
	</div>);
};
