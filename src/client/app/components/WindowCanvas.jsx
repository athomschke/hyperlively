import React, {Component, PropTypes} from 'react';
import Canvas from 'components/Canvas';

let pointFromEvent = (evt) => {
	return {
		x: evt.pageX,
		y: evt.pageY,
		timestamp: Date.now()
	}
}

const WindowCanvas = class WindowCanvas extends Component {

	static propTypes = {
		onAppendPoint: PropTypes.func,
		onCreateStroke: PropTypes.func,
		onFinishStroke: PropTypes.func,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		cmdPressed: PropTypes.bool.isRequired
	};

	static defaultProps = {
		onAppendPoint: () => {},
		onCreateStroke: () => {},
		onFinishStroke: () => {}
	}

	constructor(props) {
		super(props);
		this.state = {
			isDrawing: false
		}
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
			width: this.props.width,
			height: this.props.height
		}
		style.pointerEvents = this.props.cmdPressed ? 'none' : 'auto';
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

export default WindowCanvas;