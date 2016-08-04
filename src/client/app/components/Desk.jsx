import React, {Component, PropTypes} from 'react';
import Canvas from 'components/Canvas';
import SketchTransformer from 'components/smart/SketchTransformer';
import { OFFSET } from 'constants/canvas';
import { map, last, forEach } from 'lodash';

let TransformedCanvas = SketchTransformer(Canvas)
		
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
		sketches: PropTypes.array
	};

	static defaultProps = {
		sketches: []
	}

	getContentTransform(strokes) {
		let left = Infinity;
		let top = Infinity;
		let right = -Infinity;
		let bottom = -Infinity;
		forEach(strokes, (stroke) => {
			forEach(stroke.points, (point) => {
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
		return <TransformedCanvas {...this.props}
			strokes={strokes}
			finished={finished}
			offset={OFFSET}
			key={id}
		/>
	}

	renderSketchedCanvasses(dynamicallyCombinedSketches) {
		let that = this;
		return map(dynamicallyCombinedSketches, (sketch, id) => {
			return that.renderCanvas(sketch.strokes || [], id, true);
		})
	}

	renderPlaceholderCanvas(dynamicallyCombinedSketches) {
		let sketch = last(dynamicallyCombinedSketches);
		return (!sketch || sketch.finished) &&
			this.renderCanvas([], dynamicallyCombinedSketches.length, false);
	}

	render() {
		let dynamicallyCombinedSketches = this.props.sketches;
		return (<div>
			{this.renderSketchedCanvasses(dynamicallyCombinedSketches).concat(this.renderPlaceholderCanvas(dynamicallyCombinedSketches))}
		</div>)
	}

}