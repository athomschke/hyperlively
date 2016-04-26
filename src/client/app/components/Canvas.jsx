import React, {Component, PropTypes} from 'react';
import { findDOMNode } from 'react-dom';

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
		const canvas = findDOMNode(this)
		const context = canvas.getContext('2d');
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