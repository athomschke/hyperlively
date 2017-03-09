import React, { Component, PropTypes } from 'react';
import { map, flatten, filter, last, initial } from 'lodash';
import ActionChooser from './ActionChooser';

export default Wrapped => class extends Component {

	static propTypes = {
		performAction: PropTypes.func,
		sketches: PropTypes.arrayOf(PropTypes.object),
	};

	static defaultProps = {
		performAction: () => {},
		sketches: [],
	};

	onTextDetected(candidates) {
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

	findSketchesAtPoint(point) {
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

	chooseAction(candidate, type) {
		const interpretation = (this.state && this.state.interpretation) || {
			candidate: {},
		};
		interpretation.candidate[type] = candidate;
		this.setState({ interpretation });
	}

	onShapeDetected(candidates) {
		this.chooseAction(candidates[0], 'shape');
	}

	performAction(event, item, values) {
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

	renderActionChooser() {
		const actionChooserProps = {
			isOpen: !!(this.state && this.state.interpretation),
			onRequestClose: this.deactivateInterpretation.bind(this),
			onActionChoose: this.performAction.bind(this),
			selectedStrokes: this.getSelectedStrokes(),
		};
		if (this.props.sketches.length && last(this.props.sketches).strokes) {
			actionChooserProps.lastStrokes = last(this.props.sketches).strokes;
		}
		if (this.state && this.state.interpretation && this.state.interpretation.candidate) {
			actionChooserProps.jsonTree = this.state.interpretation.candidate;
		}
		return <ActionChooser ref="actionChooser" {...this.props} {...actionChooserProps} />;
	}

	render() {
		return (<div>
			<Wrapped
				{...this.props}
				onTextDetected={this.onTextDetected.bind(this)}
				onShapeDetected={this.onShapeDetected.bind(this)}
			/>
			{this.renderActionChooser()}
		</div>);
	}
};
