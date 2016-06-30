import React, {Component, PropTypes} from 'react';

'use strict'

let Ploma = require("exports?Ploma!base/../libs/ploma");

let pointsFromStrokes = (strokes) => {
	return _.flatten(_.map(strokes, (stroke) => {
		return stroke.points;
	}))
}

let lastPointInStrokes = (strokes) => {
	return _.last(_.last(strokes).points);
}

export default class Canvas extends Component {

	static propTypes = {
		strokes: PropTypes.array,
		usePloma: PropTypes.bool,
		uniqueCanvasFactor: PropTypes.number,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		x: PropTypes.number,
		y: PropTypes.number,
		originX: PropTypes.number,
		originY: PropTypes.number
	};

	static defaultProps = {
		uniqueCanvasFactor: Math.random(),
		strokes: [],
		usePloma: true,
		x: 0,
		y: 0,
		originX: 0,
		originY: 0
	};

	constructor(props) {
		super(props);
		this.state = {
			strokes: [],
			x: props.x,
			y: props.y,
			width: props.width,
			height: props.height,
			originX: props.originX,
			originY: props.originY
		};
	}

	componentDidMount() {
		this.setPlomaInstance(this.redrawEverything);
	}

	componentDidUpdate() {
		if (this.hasStrokeEnded()) {
			this.onStrokeFinished();
		}
		if (!_.isEqual(this.props.strokes, this.state.strokes)) {
			this.onStrokesUpdated();
		}
		if (!_.isEqual(this.props.usePloma, !!this.state.plomaInstance)) {
			this.onPlomaUpdated();
		}
		if (!_.isEqual(this.props.width, this.state.width) || !_.isEqual(this.props.width, this.state.width)) {
			this.onSizeUpdated();
		}
	}

	setPlomaInstance(callback) {
		let plomaInstance = this.props.usePloma ? new Ploma(this.refs.canvas, this.props.uniqueCanvasFactor) : null
		plomaInstance && plomaInstance.setSample(1);
		this.setState({
			plomaInstance: plomaInstance
		}, callback)
	}

	onSizeUpdated() {
		let canvasNode = this.refs.canvas;
		let imageData = canvasNode.getContext('2d').getImageData(this.props.x + this.props.originX, this.props.y + this.props.originY, this.props.width, this.props.height);
		this.whitenCanvas();
		this.setState({
			x: this.props.x,
			y: this.props.y,
			width: this.props.width,
			height: this.props.height,
			originX: this.props.originX,
			originY: this.props.originY
		}, () => {
			canvasNode.getContext('2d').putImageData(imageData, 0, 0);
		})
	}

	onStrokesUpdated() {
		let newPointCount = pointsFromStrokes(this.props.strokes).length;
		let oldPointCount = pointsFromStrokes(this.state.strokes).length;
		if (this.props.usePloma && newPointCount === (oldPointCount + 1)) {
			this.onPointAdded(); 
		} else if (newPointCount > oldPointCount) {
			this.onPointsAdded();
		} else if (newPointCount < oldPointCount) {
			this.onPointRemoved();
		}
		this.setState({
			strokes: _.cloneDeep(this.props.strokes)
		})
	}

	hasStrokeEnded() {
		return (_.last(this.props.strokes) && _.last(this.props.strokes).finished) &&
			(_.last(this.state.strokes) && !_.last(this.state.strokes).finished)
	}

	onStrokeFinished() {
		if (!this.isEmpty() && this.props.usePloma) {
			this.endStrokeAt(this.transformPoint(lastPointInStrokes(this.state.strokes)))
		}
	}

	onPlomaUpdated() {
		this.setPlomaInstance(this.redrawEverything);
	}

	runOnPlomaInstance(routineName, point) {
		switch(routineName) {
			case 'clear': {
				this.state.plomaInstance[routineName]();
				break;
			}
			default: {
				this.state.plomaInstance[routineName](point.x, point.y, 1);
				break;
			}
		}
	}

	hasNewStrokeStarted() {
		return this.props.strokes.length > this.state.strokes.length;
	}

	isEmpty() {
		return this.state.strokes.length === 0;
	}

	onPointsAdded() {
		this.redrawEverything();
	}

	onPointRemoved() {
		this.redrawEverything();
	}

	onPointAdded() {
		if (this.hasNewStrokeStarted()) {
			this.startStrokeAt(this.transformPoint(lastPointInStrokes(this.props.strokes)));
		} else {
			this.extendStrokeAt(this.transformPoint(lastPointInStrokes(this.props.strokes)));	
		}
	}

	whitenCanvas() {
		let canvas = this.refs.canvas;
		let context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	clearCanvas() {
		if (this.props.usePloma) {
			this.runOnPlomaInstance('clear');
		} else {
			this.whitenCanvas();
		}
	}

	transformPoint(point) {
		return {
			x: point.x - this.state.x,
			y: point.y - this.state.y
		}
	}

	startStrokeAt(point) {
		if (this.props.usePloma) {
			this.runOnPlomaInstance('beginStroke', point);
		} else {
			let context = this.refs.canvas.getContext('2d');
		    context.beginPath();
			context.moveTo(point.x, point.y);
		}
	}


	extendStrokeAt(point) {
		if (this.props.usePloma) {
			this.runOnPlomaInstance('extendStroke', point);
		} else {
			let context = this.refs.canvas.getContext('2d');
	        context.lineTo(point.x, point.y);
	        context.moveTo(point.x, point.y);
		}
	}

	endStrokeAt(point) {
		if (this.props.usePloma) {
			this.runOnPlomaInstance('endStroke', point);
		} else {
			let context = this.refs.canvas.getContext('2d');
			context.stroke();
			context.closePath();
		}
	}

	redrawEverything() {
		let that = this;
		this.clearCanvas();
		_.forEach(this.props.strokes, (stroke) => {
			let points = stroke.points;
			if (points.length > 1) {
				that.startStrokeAt(that.transformPoint(_.head(points)));
				_.forEach(_.tail(points), function (point) {
					that.extendStrokeAt(that.transformPoint(point));
				})
				that.endStrokeAt(that.transformPoint(_.last(points)));
			}
		})
	}

	getStyle() {
		return {
			position: 'absolute',
			top: this.state.y,
			left: this.state.x
		}
	}

	render() {
		return <canvas 
			ref="canvas"
			width={this.state.width}
			height={this.state.height}
			style={this.getStyle()}
		/>;
	}
}