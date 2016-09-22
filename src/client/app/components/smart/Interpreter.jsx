import React, { Component, PropTypes } from 'react';
import { invokeMap, map, find, flatten, filter, last, initial } from 'lodash';

export default (Wrapped) => class extends Component {

	static propTypes =  {
		onBoundsUpdate: PropTypes.func,
		sketches: PropTypes.array
	};

	static defaultProps = {
		onBoundsUpdate: () => {},
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
			let points = flatten(map(sketch.strokes, 'points'));
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

	onShapeDetected(candidates) {
		let arrowCandidate = this.findArrowInCandidates(candidates);
		if ( arrowCandidate ) {
			let start = arrowCandidate.primitives[0].firstPoint;
			let end = arrowCandidate.primitives[0].lastPoint;
			let sketches = this.findSketchesAtPoint(start);
			if (sketches.length > 0) {
				let strokes = last(sketches).strokes;
				this.props.onBoundsUpdate(strokes, {
					x: end.x - start.x,
					y: end.y - start.y
				});
			}
		}
	}

	render() {
		return (<Wrapped {...this.props}
			onTextDetected={this.onTextDetected.bind(this)}
			onShapeDetected={this.onShapeDetected.bind(this)}
		></Wrapped>);
	}
};