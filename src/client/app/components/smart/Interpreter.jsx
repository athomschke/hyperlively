import React, { Component, PropTypes } from 'react';
import { map, flatten, filter, last, initial } from 'lodash';
import ActionChooser from 'components/smart/ActionChooser';


export default (Wrapped) => class extends Component {

	static propTypes =  {
		performAction: PropTypes.func,
		sketches: PropTypes.array
	};

	static defaultProps = {
		performAction: () => {},
		sketches: []
	};

	onTextDetected(candidates) {
		candidates.forEach((candidate) => {
			let float = parseFloat(candidate.label);
			if (!isNaN(float)) {
				candidate.label = float;
			}
		});
		this.chooseAction(candidates[0], 'text');
	}

	findSketchesAtPoint(point) {
		// initial removes the arrow itself
		let sketchesToMove = filter(initial(this.props.sketches), (sketch) => {
			let points = flatten(map(filter(sketch.strokes, (stroke) => !stroke.hidden), 'points'));
			let xs = map(points, 'x');
			let ys = map(points, 'y');
			let minX = Math.min.apply(Math, xs);
			let maxX = Math.max.apply(Math, xs);
			let minY = Math.min.apply(Math, ys);
			let maxY = Math.max.apply(Math, ys);
			return minX < point.x && maxX > point.x && minY < point.y && maxY > point.y;
		});
		return sketchesToMove;
	}

	chooseAction(candidate, type) {
		let interpretation = this.state && this.state.interpretation || {
			candidate: {}
		};
		interpretation.candidate[type] = candidate;
		this.setState({
			interpretation: interpretation
		});
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
			interpretation: null
		});
	}

	getSelectedStrokes() {
		return filter(flatten(map(this.props.sketches, 'strokes')), 'selected');
	}

	renderActionChooser() {
		let actionChooserProps = {
			isOpen: !!(this.state && this.state.interpretation),
			onRequestClose: this.deactivateInterpretation.bind(this),
			onActionChoose: this.performAction.bind(this),
			selectedStrokes: this.getSelectedStrokes()
		};
		if (this.props.sketches.length && last(this.props.sketches).strokes) {
			actionChooserProps.lastStrokes = last(this.props.sketches).strokes;
		}
		if (this.state && this.state.interpretation && this.state.interpretation.candidate) {
			actionChooserProps.jsonTree = this.state.interpretation.candidate;
		}
		return <ActionChooser {...this.props} {...actionChooserProps} ref='actionChooser' />;
	}

	render() {

		return (<div>
			<Wrapped {...this.props}
				onTextDetected={this.onTextDetected.bind(this)}
				onShapeDetected={this.onShapeDetected.bind(this)}
			></Wrapped>
			{this.renderActionChooser()}
		</div>);
	}
};