import React, {Component, PropTypes} from 'react';
import Canvas from 'components/Canvas';
import { OFFSET } from 'constants/canvas';
import { DEFAULT_THRESHOLD } from 'constants/drawing';
import { map, last } from 'lodash';
import sketches from 'components/clever/sketches'

let transform = (x, y, width, height, offsetX, offsetY) => {
	return {
		x: x,
		y: y,
		width: width,
		height: height
	}
}

export default class Desk extends Component {

	static propTypes = {
		scene: PropTypes.object,
		threshold: PropTypes.number
	};

	static defaultProps = {
		scene: {
			strokes: []
		},
		threshold: DEFAULT_THRESHOLD
	}

	constructor(props) {
		super(props);
	}

	getContentTransform(strokes) {
		let left = Infinity;
		let top = Infinity;
		let right = -Infinity;
		let bottom = -Infinity;
		strokes.forEach((stroke) => {
			stroke.points.forEach((point) => {
				left = Math.min(left, point.x)
				top = Math.min(top, point.y)
				right = Math.max(right, point.x)
				bottom = Math.max(bottom, point.y)
			})
		})
		let x = left === Infinity ? 0 : left;
		let y = top === Infinity ? 0 : top;
		let width = right === -Infinity ? 0 : right - x;
		let height = bottom === -Infinity ? 0 : bottom - y;
		return transform(x - OFFSET, y - OFFSET, width + (2*OFFSET), height + (2*OFFSET));
	}

	getCanvasTransform(strokes, finished) {
		return finished ?
			this.getContentTransform(strokes) :
			transform(0, 0, window.innerWidth, window.innerHeight);
	}

	renderCanvas(strokes, id, finished) {
		let transform = this.getCanvasTransform(strokes, finished);
		return <Canvas {...this.props} ref={'canvas-'+id}
			bounds = {transform}
			key = {id}
			strokes = {strokes}
			active = {finished}
		></Canvas>
	}

	renderSketchedCanvasses(dynamicallyCombinedSketches) {
		let that = this;
		return map(dynamicallyCombinedSketches, (sketch, id) => {
			return that.renderCanvas(sketch.strokes || [], id, true);
		})
	}

	getSketch(dynamicallyCombinedSketches) {
		return last(dynamicallyCombinedSketches)
	}

	renderPlaceholderCanvas(dynamicallyCombinedSketches) {
		let sketch = this.getSketch(dynamicallyCombinedSketches);
		return (!sketch || sketch.finished) &&
			this.renderCanvas([], dynamicallyCombinedSketches.length, false);
	}

	render() {
		let dynamicallyCombinedSketches = sketches(this.props.scene.strokes, this.props.threshold);
		return (<div>
			{this.renderSketchedCanvasses(dynamicallyCombinedSketches).concat(this.renderPlaceholderCanvas(dynamicallyCombinedSketches))}
		</div>)
	}

}