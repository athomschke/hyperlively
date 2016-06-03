import React, {Component, PropTypes} from 'react';

'use strict'

let Ploma = require("exports?Ploma!base/../libs/ploma");

let eventPosition = (evt) => {
	return {
		x: evt.pageX,
		y: evt.pageY
	}
}

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
		onAppendPoint: PropTypes.func,
		onCreateStroke: PropTypes.func,
		strokes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)))),
		usePloma: PropTypes.bool,
		width: PropTypes.number,
		height: PropTypes.number
	};

	static defaultProps = {
		onAppendPoint: () => {},
		onCreateStroke: () => {},
		strokes: [],
		usePloma: true,
		width: 1000,
		height: 500
	};

	constructor(props) {
		super(props);
		this.state = {
			isDrawing: false,
			strokes: [],
			width: props.width,
			height: props.height
		};
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
	}

	onMouseDown(evt) {
		this.setState({
			isDrawing: true
		}, this.props.onCreateStroke.bind(this, eventPosition(evt)))
	}

	onMouseUp() {
		this.setState({
			isDrawing: false
		})
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

	componentDidMount() {
		this.setPlomaInstance();
	}

	componentDidUpdate() {
		if (!_.isEqual(this.props.strokes, this.state.strokes)) {
			this.onStrokesUpdated();
		}
		if (!_.isEqual(this.props.usePloma, !!this.state.plomaInstance)) {
			this.onPlomaUpdated();
		}
		
	}

	setPlomaInstance(callback) {
		let plomaInstance = this.props.usePloma ? new Ploma(this.refs.canvas) : null
		plomaInstance && plomaInstance.setSample(1);
		this.setState({
			plomaInstance: plomaInstance
		}, callback)
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
			if (!this.isEmpty()) {
				this.endStrokeAt(lastPointInStrokes(this.state.strokes))
			}
			this.startStrokeAt(lastPointInStrokes(this.props.strokes));
		} else {
			this.extendStrokeAt(lastPointInStrokes(this.props.strokes));	
		}
	}

	clearCanvas() {
		if (this.props.usePloma) {
			this.runOnPlomaInstance('clear');
		} else {
			let canvas = this.refs.canvas;
			let context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
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
			this.runOnPlomaInstance('extendStroke', point);
			this.runOnPlomaInstance('endStroke', point);
		} else {
			let context = this.refs.canvas.getContext('2d');
			context.closePath();
			context.stroke();
		}
	}

	redrawEverything() {
		let that = this;
		this.clearCanvas();
		_.forEach(this.props.strokes, (stroke) => {
			let points = stroke.points;
			if (points.length > 1) {
				that.startStrokeAt(_.head(points));
				_.forEach(_.tail(points), function (point) {
					that.extendStrokeAt(point);
				})
				that.endStrokeAt(_.last(points));
			}
		})
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