// @flow
import React, { PureComponent } from 'react';
import { map, flatten, filter, last, forEach } from 'lodash';

import type { FunctionConfiguration, Sketch, RecognitionResult, Functions, Parameters, ActionMapping } from 'src/client/app/types';
import InterpretationChooser from 'src/client/app/containers/InterpretationChooser';

export type InterpreterProps = {
	performAction: () => void,
	sketches: Array<Sketch>,
	showInterpreter: boolean,
	interpretations: RecognitionResult,
	specificActions: Array<ActionMapping>,
	setInterval: (() => void, number) => number,
	clearInterval: (interval: number) => void,
	onInterpretationDone: (boolean) => void,
}

export default class extends PureComponent<InterpreterProps> {
	static defaultProps = {
		performAction: () => undefined,
		sketches: [],
		showInterpreter: false,
		interpretations: {
			text: null,
			shape: null,
		},
		onInterpretationDone: () => undefined,
	};

	constructor() {
		super();
		(this:any).deactivateInterpretation = this.deactivateInterpretation.bind(this);
		(this:any).performAction = this.performAction.bind(this);
		(this:any).tickActions = this.tickActions.bind(this);
	}

	getSelectedStrokes() {
		return filter(flatten(map(this.props.sketches, 'strokes')), 'selected');
	}

	deactivateInterpretation() {
		this.props.onInterpretationDone(false);
	}

	tickActions(items: Functions, values: Parameters, interval: number, endAfter?: number) {
		let counter = endAfter || 0;
		const tickInterval = this.props.setInterval(() => {
			this.performAction(items, values);
			counter -= 1;
			if (counter === 0) {
				this.props.clearInterval(tickInterval);
			}
		}, interval);
	}

	performAction(items: Array<FunctionConfiguration>, values: Array<number | string>) {
		let valueIndex = 0;
		forEach(items, (item) => {
			const functionName = item.name;
			const functionParameters = values.slice(valueIndex, valueIndex + item.parameters);
			valueIndex += item.parameters;
			this.props.performAction.apply(this, [functionName].concat(functionParameters));
		});
		this.deactivateInterpretation();
	}

	props: InterpreterProps

	render() {
		const actionChooserProps = {
			isOpen: this.props.showInterpreter,
			onRequestClose: this.deactivateInterpretation,
			onInterpretationChoose: this.performAction,
			onInterpretationTick: this.tickActions,
			selectedStrokes: this.getSelectedStrokes(),
		};
		const lastStrokesProps = {};
		if (this.props.sketches.length && last(this.props.sketches).strokes) {
			lastStrokesProps.lastStrokes = last(this.props.sketches).strokes;
		}
		const jsonTreeProps = {};
		if (this.props.interpretations) {
			jsonTreeProps.jsonTree = this.props.interpretations;
		}
		return (<InterpretationChooser
			specificActions={this.props.specificActions}
			interpretations={this.props.interpretations}
			{...this.props}
			{...actionChooserProps}
			{...lastStrokesProps}
			{...jsonTreeProps}
		/>);
	}
}
