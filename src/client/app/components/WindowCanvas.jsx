import React, {Component, PropTypes} from 'react';
import Canvas from 'components/Canvas';

let eventPosition = (evt) => {
	return {
		x: evt.pageX,
		y: evt.pageY
	}
}

export default class WindowCanvas extends Component {

	static propTypes = {
		onAppendPoint: PropTypes.func,
		onCreateStroke: PropTypes.func,
		onFinishStroke: PropTypes.func,
		scene: PropTypes.object
	};

	static defaultProps = {
		onAppendPoint: () => {},
		onCreateStroke: () => {},
		onFinishStroke: () => {},
		scene: {
			sketches: []
		}
	}

	handleResize(e) {
		this.setState({
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight
		})
	}

	constructor(props) {
		super(props);
		this.state = {
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,
			isDrawing: false
		}
		this.handleResize = this.handleResize.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	onMouseDown(evt) {
		this.setState({
			isDrawing: true
		}, this.props.onCreateStroke.bind(this, eventPosition(evt)))
	}

	onMouseMove(evt) {
		if (this.state.isDrawing) {
			let position = eventPosition(evt);
			this.props.onAppendPoint({
				x: position.x,
				y: position.y
			});
		}
	}

	onMouseUp(evt) {
		if (this.state.isDrawing) {
			let position = eventPosition(evt)
			this.props.onFinishStroke({
				x: position.x,
				y: position.y
			});
			this.setState({
				isDrawing: false
			})
		}
	}

	getStyle() {
		return {
			position: 'absolute',
			top: 0,
			left: 0,
			width: this.state.windowWidth,
			height: this.state.windowHeight
		}
	}

	renderCanvas(strokes, id) {
		return <Canvas {...this.props}
			key = {id}
			width={this.state.windowWidth}
			height={this.state.windowHeight}
			strokes = {strokes}
		></Canvas>
	}

	getStrokes() {
		debugger
		let scene = this.props.scene
		return scene.sketches.length > 0 ?
    		_.last(scene.sketches).strokes :
    		[];
	}

	renderScene() {
		let that = this;
		return _.map(this.getStrokes(), (stroke, id) => {
			return that.renderCanvas([stroke], id)
		})
	}

	render() {
		return (
		<div
			ref="window"
			className={'window'}
			onMouseUp={this.onMouseUp.bind(this)}
			onMouseMove={this.onMouseMove.bind(this)}
			onMouseDown={this.onMouseDown.bind(this)}
			style= {this.getStyle()}
		>
			{this.renderScene()}
		</div>)
	}

}