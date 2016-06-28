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

	renderCanvas(strokes, id) {
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

	render() {
		let that = this;
		return (<div>
			{_.map(this.getStrokes(), (stroke, id) => {
				return that.renderCanvas([stroke], id)
			}).concat(that.renderCanvas([], that.getStrokes().length))}
		</div>)
	}

}