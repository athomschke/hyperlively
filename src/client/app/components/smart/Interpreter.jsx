import React, { Component, PropTypes } from 'react';
import { invokeMap, map, find, flatten, filter, last, initial, upperFirst } from 'lodash';
import actions from 'actions/actions';
import List from 'react-simple-list';
import Modal from 'react-modal';

export default (Wrapped) => class extends Component {

	static propTypes =  {
		onUpdatePosition: PropTypes.func,
		onHide: PropTypes.func,
		onNextScene: PropTypes.func,
		onPreviousScene: PropTypes.func,
		sketches: PropTypes.array
	};

	static defaultProps = {
		onUpdatePosition: () => {},
		onHide: () => {},
		onNextScene: () => {},
		onPreviousScene: () => {},
		sketches: []
	};

	onTextDetected(candidates) {
		if(invokeMap(map(candidates, 'label'), 'toLowerCase').indexOf('o') >= 0) {
			return 'circle';
		}
	}

	findArrowInCandidates(candidates) {
		return find(candidates, (candidate) => {
			return candidate.label && candidate.label.indexOf('arrow') >= 0;
		});
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

	chooseActionForStrokesWithArrow(strokes, start, end) {
		this.setState({
			interpretation: {
				strokes: strokes,
				x: start,
				y: end
			}
		});
	}

	onShapeDetected(candidates) {
		let arrowCandidate = this.findArrowInCandidates(candidates);
		if ( arrowCandidate ) {
			let start = arrowCandidate.primitives[0].firstPoint;
			let end = arrowCandidate.primitives[0].lastPoint;
			let sketchesAtArrowStart = this.findSketchesAtPoint(start);
			if (sketchesAtArrowStart.length > 0) {
				let strokes = last(sketchesAtArrowStart).strokes;
				this.chooseActionForStrokesWithArrow(strokes, end.x - start.x, end.y - start.y);
			}
		}
	}

	performAction(event, item) {
		this.props['on' + upperFirst(item)].apply(this, [this.state.interpretation.strokes, this.state.interpretation.x, this.state.interpretation.y]);
		this.props.sketches.length > 0 && this.props.onHide(last(this.props.sketches).strokes);
		this.deactivateInterpretation();
	}

	deactivateInterpretation() {
		this.setState({
			interpretation: null
		});
	}

	render() {
		return (<div>
			<Wrapped {...this.props}
				onTextDetected={this.onTextDetected.bind(this)}
				onShapeDetected={this.onShapeDetected.bind(this)}
			></Wrapped>
			<Modal ref='modal'
				isOpen={!!(this.state && this.state.interpretation)}
				onRequestClose={this.deactivateInterpretation.bind(this)}
			>
				<List ref='list'
					onItemClick={this.performAction.bind(this)}
					items={Object.keys(actions).map((actionName) => actionName)}
				/>
			</Modal>
		</div>);
	}
};