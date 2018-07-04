// @flow
/* eslint-disable react/prop-types */
import React from 'react';
import { map, flatten, filter, last, forEach, concat, find } from 'lodash';

import type { FunctionConfiguration, Sketch, RecognitionResult, Functions, Parameters, ActionMapping } from 'src/client/app/types';
import { relativeDividerPosition } from 'src/client/app/constants/configuration';
import ActionChooser from 'src/client/app/containers/ActionChooser';
import ParameterChooser from 'src/client/app/containers/ParameterChooser';

import style from './Interpreter.scss';

type InterpretationChooserAdditionalProps = {
	specificActions: Array<ActionMapping>,
	parameters: Parameters,
	functions: Functions,
}

export type InterpreterProps = InterpretationChooserAdditionalProps & {
	performAction: () => void,
	sketches: Array<Sketch>,
	showInterpreter: boolean,
	interpretations: RecognitionResult,
	setInterval: (() => void, number) => number,
	clearInterval: (interval: number) => void,
	onInterpretationDone: (boolean) => void,
}

const defaultProps = (): InterpreterProps => ({
	performAction: () => undefined,
	sketches: [],
	showInterpreter: false,
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

export const getSelectedStrokes = (sketches: Array<Sketch>) => filter(flatten(map(sketches, 'strokes')), 'selected');

export default (props: InterpreterProps = defaultProps()) => {
	const {
		sketches, onInterpretationDone, setInterval, clearInterval, performAction,
		specificActions, functions, parameters,
	} = props;
	const selectedStrokes = getSelectedStrokes(sketches);
	const lastSketch = last(sketches);
	const lastStrokes = lastSketch ? lastSketch.strokes : [];

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
		<button
			onClick={onAcceptInterpretationClick}
		>{'Accept Interpretation'}</button>
		<button
			onClick={onInterpretationTick}
		>{'Tick'}</button>
		<div>
			<ActionChooser
				specificActions={specificActions}
			/>
			<ParameterChooser
				lastStrokes={lastStrokes}
				selectedStrokes={selectedStrokes}
				interpretations={props.interpretations}
			/>
		</div>
	</div>);
};
