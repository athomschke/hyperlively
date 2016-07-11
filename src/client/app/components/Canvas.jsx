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

let whitenCanvas = (aCanvas) => {
	let context = aCanvas.getContext('2d');
	context.clearRect(0, 0, aCanvas.width, aCanvas.height);
}

let getLargeCanvas = () => {
	let tempCanvas = document.createElement('canvas');
	tempCanvas.setAttribute('width', window.innerWidth);
	tempCanvas.setAttribute('height', window.innerHeight);
	return tempCanvas;
}

let copyImageDataFromTempToActualCanvas = (tempCanvas, actualCanvas, x, y, width, height) => {
	whitenCanvas(actualCanvas);
	let imageData = tempCanvas.getContext('2d').getImageData(x, y, width, height);
	actualCanvas.getContext('2d').putImageData(imageData, 0, 0);
}

export default class Canvas extends Component {

	static propTypes = {
		strokes: PropTypes.array,
		usePloma: PropTypes.bool,
		uniqueCanvasFactor: PropTypes.number,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		x: PropTypes.number,
		y: PropTypes.number
	};

	static defaultProps = {
		uniqueCanvasFactor: Math.random(),
		strokes: [],
		usePloma: true,
		x: 0,
		y: 0
	};

	constructor(props) {
		super(props);
		this.state = {
			strokes: [],
			tempCanvas: getLargeCanvas(),
			plomaInstance: null
		};
	}

	componentDidMount() {
		this.setPlomaInstance(this.redrawEverything);
	}

	componentDidUpdate() {
		if (!_.isEqual(this.props.strokes, this.state.strokes)) {
			this.onStrokesUpdated();
		}
		if (!_.isEqual(this.props.usePloma, !!this.state.plomaInstance)) {
			this.setPlomaInstance(this.redrawEverything);
		}
	}

	setPlomaInstance(callback) {
		let plomaInstance = this.props.usePloma ? new Ploma(this.state.tempCanvas, this.props.uniqueCanvasFactor) : null;
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
		} else {
			this.redrawEverything();
		}
		this.setState({
			strokes: _.cloneDeep(this.props.strokes)
		})
	}
	
	onPointAdded() {
		let hasNewStrokeStarted = this.props.strokes.length > this.state.strokes.length;
		let hasStrokeEnded = (_.last(this.props.strokes) && _.last(this.props.strokes).finished) &&
			(_.last(this.state.strokes) && !_.last(this.state.strokes).finished)
		if (hasNewStrokeStarted) {
			this.startStrokeAt(lastPointInStrokes(this.props.strokes));
		} else if (hasStrokeEnded) {
			this.onStrokeFinished();
		} else {
			this.extendStrokeAt(lastPointInStrokes(this.props.strokes));
		}

		
	}

	startStrokeAt(point) {
		if (this.props.usePloma) {
			this.state.plomaInstance.beginStroke(point.x, point.y, 1);
		} else {
			let context = this.state.tempCanvas.getContext('2d');
		    context.beginPath();
			context.moveTo(point.x, point.y);
		}
		this.copyImageDataFromTempToActualCanvas();
	}

	onStrokeFinished() {
		let isEmpty = this.state.strokes.length === 0;
		if (!isEmpty && this.props.usePloma) {
			this.endStrokeAt(lastPointInStrokes(this.state.strokes))
		}
	}

	extendStrokeAt(point) {
		if (this.props.usePloma) {
			this.state.plomaInstance.extendStroke(point.x, point.y, 1);
		} else {
			let context = this.state.tempCanvas.getContext('2d');
	        context.lineTo(point.x, point.y);
	        context.moveTo(point.x, point.y);
		}
		this.copyImageDataFromTempToActualCanvas();
	}

	clearCanvas() {
		if (this.props.usePloma) {
			this.state.plomaInstance.clear();
		} else {
			whitenCanvas(this.refs.canvas);
			whitenCanvas(this.state.tempCanvas);
		}
	}

	endStrokeAt(point) {
		if (this.props.usePloma) {
			this.state.plomaInstance.endStroke(point.x, point.y, 1);
		} else {
			let context = this.state.tempCanvas.getContext('2d');
			context.stroke();
			context.closePath();
		}
		this.copyImageDataFromTempToActualCanvas();
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
		this.copyImageDataFromTempToActualCanvas();
	}

	copyImageDataFromTempToActualCanvas() {
		copyImageDataFromTempToActualCanvas(this.state.tempCanvas, this.refs.canvas,
			this.props.x, this.props.y, this.props.width, this.props.height);
	}

	render() {
		return <canvas 
			ref="canvas"
			width={this.props.width}
			height={this.props.height}
			style={{
				position: 'absolute',
				top: this.props.y,
				left: this.props.x
			}}
		/>;
	}
}