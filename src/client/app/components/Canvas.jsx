import React, {Component, PropTypes} from 'react';
import { findDOMNode } from 'react-dom';
import { head, tail, forEach } from 'lodash';

'use strict'

export default class Canvas extends Component {

	static propTypes = {
		onAddPoint: PropTypes.func.isRequired,
		points: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number))
	};

	static defaultProps = {
		points: []
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

	onMouseDown() {
		this.setState({
			isDrawing: true
		})
	}

	onMouseUp() {
		this.setState({
			isDrawing: false
		})
	}

	onMouseMove(evt) {
		if (this.state.isDrawing) {
			this.props.onAddPoint({
				x: evt.pageX,
				y: evt.pageY
			})
		}
	}

	componentDidUpdate() {
		this.drawPoints();
	}

	drawPoints() {
		const points = this.props.points;
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