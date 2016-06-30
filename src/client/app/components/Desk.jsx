import React, {Component, PropTypes} from 'react';
import Canvas from 'components/Canvas';

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

	renderCanvas(strokes, id, finished) {
		return <Canvas {...this.props} ref={'canvas-'+id}
			key = {id}
			width={window.innerWidth}
			height={window.innerHeight}
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