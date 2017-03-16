// @flow
import React, { PureComponent, PropTypes } from 'react';
import { map, flatten, filter, last, initial, forEach } from 'lodash';
import InterpretationChooser from './InterpretationChooser';
import { type Point, type FunctionConfiguration } from '../../typeDefinitions';

export default Wrapped => class extends PureComponent {

	static propTypes = {
		performAction: PropTypes.func,
		sketches: PropTypes.arrayOf(PropTypes.object),
		showInterpreter: PropTypes.bool,
		interpretations: PropTypes.object,
		onInterpretationDone: PropTypes.func,
	};

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

	tickActions(items: Array<FunctionConfiguration>, values: Array<number | string>,
			interval: number, endAfter: number) {
		let counter = endAfter || 0;
		const tickInterval = setInterval(() => {
			this.performAction(items, values);
			counter -= 1;
			if (counter === 0) {
				clearInterval(tickInterval);
			}
		}, interval);
	}

	deactivateInterpretation() {
		this.props.onInterpretationDone(false);
	}

	getSelectedStrokes() {
		return filter(flatten(map(this.props.sketches, 'strokes')), 'selected');
	}

	renderInterpretationChooser() {
		const actionChooserProps = {
			isOpen: this.props.showInterpreter,
			onRequestClose: this.deactivateInterpretation.bind(this),
			onInterpretationChoose: this.performAction.bind(this),
			onInterpretationTick: this.tickActions.bind(this),
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
			{...this.props}
			{...actionChooserProps}
			{...lastStrokesProps}
			{...jsonTreeProps}
		/>);
	}

	render() {
		return (<div>
			<Wrapped
				{...this.props}
			/>
			{this.renderInterpretationChooser()}
		</div>);
	}
};
