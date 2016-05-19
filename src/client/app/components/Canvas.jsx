import React, {Component, PropTypes} from 'react';
import { findDOMNode } from 'react-dom';

'use strict'

let Ploma = require("exports?Ploma!base/../libs/ploma");

let eventPosition = (evt) => {
	return {
		x: evt.pageX,
		y: evt.pageY
	}
}

export default class Canvas extends Component {

	static propTypes = {
		onAppendPoint: PropTypes.func,
		onCreateStroke: PropTypes.func,
		strokes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number))),
		usePloma: PropTypes.bool
	};

	static defaultProps = {
		onAppendPoint: () => {},
		onCreateStroke: () => {},
		strokes: [],
		usePloma: true
	};

	constructor(props) {
	    super(props);
	    this.state = {
	      isDrawing: false,
	    };
	    this.onMouseDown = this.onMouseDown.bind(this);
	    this.onMouseMove = this.onMouseMove.bind(this);
	    this.onMouseUp = this.onMouseUp.bind(this);
	  }

	onMouseDown(evt) {
		this.setState({
			isDrawing: true
		})
		this.props.onCreateStroke(eventPosition(evt));
	}

	onMouseUp() {
		this.setState({
			isDrawing: false
		})
	}

	onMouseMove(evt) {
		if (this.state.isDrawing) {
			this.props.onAppendPoint(eventPosition(evt));
		}
	}

	componentDidUpdate() {
		this.drawPoints();
	}

	drawPoints() {
		let canvas = findDOMNode(this);
		let context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		if (this.props.usePloma) {
			this.drawPointsWithPloma(canvas, context);
		} else {
			this.drawPointsWithCanvasDefault(canvas, context);
		}
	}

	drawPointsWithPloma(canvas, context) {
		var ploma = new Ploma(canvas);
		ploma.clear();
		_.forEach(this.props.strokes, (stroke) => {
			var head = _.head(stroke);
			if (stroke.length > 1) {
				var last = _.last(stroke);
				ploma.beginStroke(head.x, head.y, 1);
				_.forEach(_.tail(stroke), function (point) {
					ploma.extendStroke(point.x, point.y, 1);
				})
				ploma.endStroke(last.x, last.y, 1);
			}
		})
	} 

	drawPointsWithCanvasDefault(canvas, context) {
		context.save();
		_.forEach(this.props.strokes, (stroke) => {
			if (stroke.length >1) {			
			    context.beginPath();
				var head = _.head(stroke);
				context.moveTo(head.x, head.y);
				_.forEach(_.tail(stroke), function (point) {
			        context.lineTo(point.x, point.y);
			        context.moveTo(point.x, point.y);
			    })
			    context.closePath();
			    context.stroke();
			}
		})
	    context.restore();
	}

	render() {
		return <canvas 
			ref="canvas"
			width={1000}
			height={500}
			onMouseDown={this.onMouseDown}
			onMouseMove={this.onMouseMove}
			onMouseUp={this.onMouseUp}
		/>;
	}
}