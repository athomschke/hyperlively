import React, { Component, PropTypes } from 'react';
import { invokeMap, map, find, flatten, filter, last, initial } from 'lodash';
import actions from 'actions/actions';
import HoverList from 'components/smart/HoverList';
import Modal from 'react-modal';

export default (Wrapped) => class extends Component {

	static propTypes =  {
		performAction: PropTypes.func,
		onHide: PropTypes.func,
		sketches: PropTypes.array
	};

	static defaultProps = {
		performAction: () => {},
		onHide: () => {},
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

	chooseActionForArrow(start, end) {
		this.setState({
			interpretation: {
				x: start,
				y: end
			}
		});
	}

	chooseAction(candidate) {
		this.setState({
			interpretation: {
				candidate: candidate
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
			} else {
				this.chooseActionForArrow(end.x - start.x, end.y - start.y);
			}
		} else {
			this.chooseAction(candidates[0]);
		}
	}

	performAction(event, item) {
		this.props.sketches.length > 0 && this.props.onHide(last(this.props.sketches).strokes);
		this.props.performAction.apply(this, [item, this.state.interpretation.strokes, this.state.interpretation.x, this.state.interpretation.y]);
		this.deactivateInterpretation();
	}

	deactivateInterpretation() {
		this.setState({
			interpretation: null
		});
	}

	getModalStyle() {
		return {
			overlay : {
				top               : 0,
				left              : 0,
				right             : 0,
				bottom            : 0
			}
		};
	}

	render() {
		return (<div>
			<Wrapped {...this.props}
				onTextDetected={this.onTextDetected.bind(this)}
				onShapeDetected={this.onShapeDetected.bind(this)}
			></Wrapped>
			<Modal ref='modal'
				isOpen={!!(this.state && this.state.interpretation)}
				contentLabel="I am required by a11y"
				onRequestClose={this.deactivateInterpretation.bind(this)}
			>
				<HoverList ref='list'  {...this.props}
					onItemClick={this.performAction.bind(this)}
					items={Object.keys(actions).map((actionName) => actionName)}
				/>
			</Modal>
		</div>);
	}
};