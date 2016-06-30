import React, {Component, PropTypes} from 'react';
import Canvas from 'components/Canvas';

let bounds = (x, y, width, height) => {
	return {
		x: x,
		y: y,
		width: width,
		height: height
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

	getContentBounds(strokes) {
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
		return bounds(x, y, width-x, height-y);
	}

	getCanvasBounds(strokes, finished) {
		return finished ?
			this.getContentBounds(strokes) :
			bounds(0, 0, window.innerWidth, window.innerHeight);
	}

	renderCanvas(strokes, id, finished) {
		let bounds = this.getCanvasBounds(strokes, finished);
		return <Canvas {...this.props} ref={'canvas-'+id}
			{...bounds}
			key = {id}
			strokes = {strokes}
		></Canvas>
	}

	getStrokes() {
		let scene = this.props.scene
		return scene.sketches.length > 0 ?
    		_.last(scene.sketches).strokes :
    		[];
	}

	renderSketchedCanvasses() {
		let that = this;
		let sketch = this.getSketch();
		return _.map(sketch.strokes, (stroke, id) => {
			return that.renderCanvas([stroke], id, sketch.finished);
		})
	}

	getSketch() {
		return _.last(this.props.scene.sketches) || { strokes: [] }
	}

	renderPlaceholderCanvas() {
		return this.renderCanvas([], this.getSketch().strokes.length, false);
	}

	render() {
		return (<div>
			{this.renderSketchedCanvasses().concat(this.renderPlaceholderCanvas())}
		</div>)
	}

}