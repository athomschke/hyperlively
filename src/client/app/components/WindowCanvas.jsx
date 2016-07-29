import React, {Component, PropTypes} from 'react';
import Canvas from 'components/Canvas';

let pointFromEvent = (evt) => {
	return {
		x: evt.pageX,
		y: evt.pageY,
		timestamp: Date.now()
	}
}

export default class WindowCanvas extends Component {

	static propTypes = {
		onAppendPoint: PropTypes.func,
		onCreateStroke: PropTypes.func,
		onFinishStroke: PropTypes.func
	};

	static defaultProps = {
		onAppendPoint: () => {},
		onCreateStroke: () => {},
		onFinishStroke: () => {}
	}

	handleResize(e) {
		this.setState({
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight
		})
	}

	handleKeyDown(e) {
		this.setState({
			cmdPressed: true
		})
	}

	handleKeyUp(e) {
		this.setState({
			cmdPressed: false
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
		document.body.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.body.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
		document.body.removeEventListener('keydown', this.handleKeyDown.bind(this));
		document.body.removeEventListener('keyup', this.handleKeyUp.bind(this));
	}

	onMouseDown(evt) {
		this.setState({
			isDrawing: true
		}, this.props.onCreateStroke.bind(this, pointFromEvent(evt)))
	}

	onMouseMove(evt) {
		if (this.state.isDrawing) {
			this.props.onAppendPoint(pointFromEvent(evt));
		}
	}

	onMouseUp(evt) {
		if (this.state.isDrawing) {
			this.props.onFinishStroke(pointFromEvent(evt));
			this.setState({
				isDrawing: false
			})
		}
	}

	getStyle() {
		let style = {
			position: 'absolute',
			top: 0,
			left: 0,
			width: this.state.windowWidth,
			height: this.state.windowHeight
		}
		style.pointerEvents = this.state.cmdPressed ? 'none' : 'auto';
		return style;
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
		></div>)
	}

}