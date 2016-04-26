import React, {Component, PropTypes} from 'react';
import { findDOMNode } from 'react-dom';
import { head, tail, forEach, last } from 'lodash';

'use strict'

let eventPosition = (evt) => {
	return {
		x: evt.pageX,
		y: evt.pageY
	}
}

export default class Canvas extends Component {

	static propTypes = {
		onAppendPoint: PropTypes.func.isRequired,
		onCreateStroke: PropTypes.func.isRequired,
		strokes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)))
	};

	static defaultProps = {
		strokes: []
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
		// this.props.onFinishStroke();
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
		const points = last(this.props.strokes) || [];
		const context = findDOMNode(this).getContext('2d');
		if (points.length > 1) {
		    context.save();
		    context.beginPath();
		    context.moveTo(head(points).x, head(points).y);
		    forEach(tail(points), function (point) {
		    	context.lineTo(point.x, point.y);
		    	context.moveTo(point.x, point.y);
		    })
		    context.closePath();
		    context.stroke();
		    context.restore();
		}
	}

	render() {
		return <canvas 
			width={1000}
			height={500}
			onMouseDown={this.onMouseDown}
			onMouseMove={this.onMouseMove}
			onMouseUp={this.onMouseUp}
		/>;
	}
}