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
		width: PropTypes.number,
		height: PropTypes.number
	};

	static defaultProps = {
		uniqueCanvasFactor: Math.random(),
		strokes: [],
		usePloma: true,
		width: 1000,
		height: 500
	};

	constructor(props) {
		super(props);
		this.state = {
			strokes: [],
			width: props.width,
			height: props.height
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
		if (!_.isEqual(this.props.width, this.state.width) || !_.isEqual(this.props.height, this.state.height)) {
			this.onDimensionsUpdated();
		}
	}

	setPlomaInstance(callback) {
		let plomaInstance = this.props.usePloma ? new Ploma(this.refs.canvas, this.props.uniqueCanvasFactor) : null
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

	hasStrokeEnded() {
		return (_.last(this.props.strokes) && _.last(this.props.strokes).finished) &&
			(_.last(this.state.strokes) && !_.last(this.state.strokes).finished)
	}

	onStrokeFinished() {
		if (!this.isEmpty() && this.props.usePloma) {
			this.endStrokeAt(lastPointInStrokes(this.state.strokes))
		}
	}

	onPlomaUpdated() {
		this.setPlomaInstance(this.redrawEverything);
	}

	onDimensionsUpdated() {
		this.setState({
			width: this.props.width,
			height: this.props.height
		})
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
			width={this.props.width}
			height={this.props.height}
		/>;
	}
}