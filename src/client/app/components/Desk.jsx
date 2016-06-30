import React, {Component, PropTypes} from 'react';
import Canvas from 'components/Canvas';

let transform = (x, y, width, height, originX, originY) => {
	return {
		x: x - 5,
		y: y - 5,
		width: width + 10,
		height: height + 10,
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
		let x = Infinity;
		let y = Infinity;
		let width = -Infinity;
		let height = -Infinity;
		strokes.forEach((stroke) => {
			stroke.points.forEach((point) => {
				x = Math.min(x, point.x)
				y = Math.min(y, point.y)
				width = Math.max(width, point.x)
				height = Math.max(height, point.y)
			})
		})
		return transform(x, y, width-x, height-y, 5, 5);
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