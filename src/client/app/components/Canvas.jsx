import React, {Component, PropTypes} from 'react';

'use strict'

let Ploma = require("exports?Ploma!base/../libs/ploma");

let pointCount = (strokes) => {
	return _.flatten(_.map(strokes, (stroke) => {
		return stroke.points;
	})).length
}

let lastPointInStrokes = (strokes) => {
	return _.last(_.last(strokes).points);
}

let clearCanvas = (aCanvas) => {
	let context = aCanvas.getContext('2d');
	context.clearRect(0, 0, aCanvas.width, aCanvas.height);
}

let getFullscreenCanvas = () => {
	let tempCanvas = document.createElement('canvas');
	tempCanvas.setAttribute('width', window.innerWidth);
	tempCanvas.setAttribute('height', window.innerHeight);
	return tempCanvas;
}

let copyContentFromToCanvasWithBounds = (tempCanvas, actualCanvas, bounds) => {
	clearCanvas(actualCanvas);
	let imageData = tempCanvas.getContext('2d').getImageData(bounds.x, bounds.y, bounds.width, bounds.height);
	actualCanvas.getContext('2d').putImageData(imageData, 0, 0);
}

export default class Canvas extends Component {

	static propTypes = {
		strokes: PropTypes.array,
		usePloma: PropTypes.bool,
		uniqueCanvasFactor: PropTypes.number,
		bounds: PropTypes.object.isRequired
	};

	static defaultProps = {
		uniqueCanvasFactor: Math.random(),
		strokes: [],
		usePloma: true
	};

	constructor(props) {
		super(props);
		this.state = {
			strokes: [],
			tempCanvas: getFullscreenCanvas(),
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

	onStrokesUpdated() {
		if (pointCount(this.props.strokes) === (pointCount(this.state.strokes) + 1)) {
			this.addPointPerformanceEnhanced();
		} else {
			this.redrawEverything();
		}
		this.setState({
			strokes: _.cloneDeep(this.props.strokes)
		})
	}

	setPlomaInstance(callback) {
		let plomaInstance = this.props.usePloma ? new Ploma(this.state.tempCanvas, this.props.uniqueCanvasFactor) : null;
		plomaInstance && plomaInstance.setSample(1);
		this.setState({
			plomaInstance: plomaInstance
		}, callback)
	}

	addPointPerformanceEnhanced() {
		let oldStrokes = this.state.strokes;
		let newStrokes = this.props.strokes;
		if (newStrokes.length > oldStrokes.length) {
			this.startStrokeAt(lastPointInStrokes(newStrokes));
		} else if (_.last(newStrokes).finished && !_.last(oldStrokes).finished) {
			this.endStrokeAt(lastPointInStrokes(newStrokes));
		} else {
			this.extendStrokeAt(lastPointInStrokes(newStrokes));
		}
		copyContentFromToCanvasWithBounds(this.state.tempCanvas, this.refs.canvas, this.props.bounds);
	}

	startStrokeAt(point) {
		if (this.props.usePloma) {
			this.state.plomaInstance.beginStroke(point.x, point.y, 1);
		} else {
			let context = this.state.tempCanvas.getContext('2d');
		    context.beginPath();
			context.moveTo(point.x, point.y);
		}
	}

	extendStrokeAt(point) {
		if (this.props.usePloma) {
			this.state.plomaInstance.extendStroke(point.x, point.y, 1);
		} else {
			let context = this.state.tempCanvas.getContext('2d');
	        context.lineTo(point.x, point.y);
	        context.moveTo(point.x, point.y);
	        context.stroke();
		}
	}

	endStrokeAt(point) {
		if (this.props.usePloma) {
			this.state.plomaInstance.endStroke(point.x, point.y, 1);
		} else {
			let context = this.state.tempCanvas.getContext('2d');
			context.closePath();
		}
	}

	resetCanvas() {
		if (this.props.usePloma) {
			this.state.plomaInstance.clear();
		} else {
			clearCanvas(this.refs.canvas);
			clearCanvas(this.state.tempCanvas);
		}
	}

	redrawEverything() {
		let that = this;
		this.resetCanvas();
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
		copyContentFromToCanvasWithBounds(this.state.tempCanvas, this.refs.canvas, this.props.bounds);
	}

	render() {
		return <canvas 
			ref="canvas"
			width={this.props.bounds.width}
			height={this.props.bounds.height}
			style={{
				position: 'absolute',
				top: this.props.bounds.y,
				left: this.props.bounds.x
			}}
		/>;
	}
}