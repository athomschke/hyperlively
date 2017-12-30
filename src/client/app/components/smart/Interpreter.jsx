// @flow
import React, { PureComponent } from 'react';
import { map, flatten, filter, last, forEach } from 'lodash';
import InterpretationChooser from './InterpretationChooser';
import type { FunctionConfiguration, Sketch, RecognitionResult, Functions, Parameters, ActionMapping } from 'typeDefinitions';

type Props = {
	performAction: () => {},
	sketches: Array<Sketch>,
	showInterpreter: boolean,
	interpretations: {
		candidate: RecognitionResult
	},
	specificActions: Array<ActionMapping>,
	onInterpretationDone: (boolean) => {},
}

export default class extends PureComponent<Props> {

	static defaultProps = {
		performAction: () => {},
		sketches: [],
		showInterpreter: false,
		interpretations: {
			candidate: {
				text: null,
				shape: null,
			},
		},
		onInterpretationDone: () => {},
	};

	constructor(props: any) {
		super(props);
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
		const tickInterval = setInterval(() => {
			this.performAction(items, values);
			counter -= 1;
			if (counter === 0) {
				clearInterval(tickInterval);
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

	props: Props

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
		if (this.props.interpretations && this.props.interpretations.candidate) {
			jsonTreeProps.jsonTree = this.props.interpretations.candidate;
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
