// @flow
import React, { Component, PropTypes } from 'react';
import { map, flatten, filter, last, initial } from 'lodash';
import InterpretationChooser from './InterpretationChooser';
import { type TextCandidate, type ShapeCandidate, type Point } from '../../typeDefinitions';
import { type SyntheticMouseEvent } from 'flow-bin';

export default Wrapped => class extends Component {

	static propTypes = {
		performAction: PropTypes.func,
		sketches: PropTypes.arrayOf(PropTypes.object),
	};

	static defaultProps = {
		performAction: () => {},
		sketches: [],
	};

	state: {
		interpretation: ?{
			candidate: {
				shape: ?ShapeCandidate,
				text: ? TextCandidate,
			}
		}
	}

	constructor() {
		super();
		this.onTextDetected = this.onTextDetected.bind(this);
		this.onShapeDetected = this.onShapeDetected.bind(this);
	}

	onTextDetected(candidates: Array<TextCandidate>) {
		const floatParsedCandidates = candidates.map((candidate) => {
			const float = parseFloat(candidate.label);
			if (isNaN(float)) {
				return candidate;
			}
			return Object.assign({}, candidate, {
				label: float,
			});
		});
		this.chooseAction(floatParsedCandidates[0], 'text');
	}

	findSketchesAtPoint(point: Point) {
		// initial removes the arrow itself
		const sketchesToMove = filter(initial(this.props.sketches), (sketch) => {
			const points = flatten(map(filter(sketch.strokes, stroke => !stroke.hidden), 'points'));
			const xs = map(points, 'x');
			const ys = map(points, 'y');
			const minX = Math.min(...xs);
			const maxX = Math.max(...xs);
			const minY = Math.min(...ys);
			const maxY = Math.max(...ys);
			return minX < point.x && maxX > point.x && minY < point.y && maxY > point.y;
		});
		return sketchesToMove;
	}

	chooseAction(candidate: TextCandidate | ShapeCandidate, type: string) {
		const interpretation = (this.state && this.state.interpretation) || {
			candidate: {
				text: null,
				shape: null,
			},
		};
		interpretation.candidate[type] = candidate;
		this.setState({ interpretation });
	}

	onShapeDetected(candidates: Array<ShapeCandidate>) {
		this.chooseAction(candidates[0], 'shape');
	}

	performAction(event: SyntheticMouseEvent, item: string, values: Array<number | string>) {
		this.props.performAction.apply(this, [item].concat(values));
		this.deactivateInterpretation();
	}

	deactivateInterpretation() {
		this.setState({
			interpretation: null,
		});
	}

	getSelectedStrokes() {
		return filter(flatten(map(this.props.sketches, 'strokes')), 'selected');
	}

	renderInterpretationChooser() {
		const actionChooserProps = {
			isOpen: !!(this.state && this.state.interpretation),
			onRequestClose: this.deactivateInterpretation.bind(this),
			onActionChoose: this.performAction.bind(this),
			selectedStrokes: this.getSelectedStrokes(),
		};
		const lastStrokesProps = {};
		if (this.props.sketches.length && last(this.props.sketches).strokes) {
			lastStrokesProps.lastStrokes = last(this.props.sketches).strokes;
		}
		const jsonTreeProps = {};
		if (this.state && this.state.interpretation && this.state.interpretation.candidate) {
			jsonTreeProps.jsonTree = this.state.interpretation.candidate;
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
				onTextDetected={this.onTextDetected}
				onShapeDetected={this.onShapeDetected}
			/>
			{this.renderInterpretationChooser()}
		</div>);
	}
};
