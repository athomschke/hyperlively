import React, {Component, PropTypes} from 'react';
import Canvas from 'components/Canvas';

let transform = (x, y, width, height, originX, originY) => {
	return {
		x: x,
		y: y,
		width: width,
		height: height,
		originX: originX,
		originY: originY
	}
}

export default class Desk extends Component {

	static propTypes = {
		scene: PropTypes.object
	};

	static defaultProps = {
		scene: {
			sketches: []
		}
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
		return transform(left - 5, top - 5, right-left+10, bottom-top+10, 5, 5);
	}

	getCanvasTransform(strokes, finished) {
		return finished ?
			this.getContentTransform(strokes) :
			transform(0, 0, window.innerWidth, window.innerHeight, 0, 0);
	}

	renderCanvas(strokes, id, finished) {
		let transform = this.getCanvasTransform(strokes, finished);
		return <Canvas {...this.props} ref={'canvas-'+id}
			{...transform}
			key = {id}
			strokes = {strokes}
		></Canvas>
	}

	renderSketchedCanvasses() {
		let that = this;
		let sketches = this.props.scene.sketches || [];
		return _.map(sketches, (sketch, id) => {
			return that.renderCanvas(sketch.strokes || [], id, sketch.finished);
		})
	}

	getSketch() {
		return _.last(this.props.scene.sketches) || { strokes: [] }
	}

	renderPlaceholderCanvas() {
		return this.renderCanvas([], this.props.scene.sketches.length, false);
	}

	render() {
		return (<div>
			{this.renderSketchedCanvasses().concat(this.renderPlaceholderCanvas())}
		</div>)
	}

}