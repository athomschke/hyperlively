import React, {Component, PropTypes} from 'react';
import { without, flatten, strokes, last, isEqual, cloneDeep, forEach, head, tail, map, reduce } from 'lodash';
import { PRESSURE } from 'constants/drawing'
import Canvas from 'components/dumb/Canvas'

'use strict'

let Ploma = require("exports?Ploma!base/../libs/ploma");

let pointCount = (strokes) => {
	return flatten(map(strokes, (stroke) => {
		return stroke.points;
	})).length
}

let lastPointInStrokes = (strokes) => {
	return last(last(strokes).points);
}

let secondToLastPointInStrokes = (strokes) => {
	let points = last(strokes).points;
	return points[points.length - 2];
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

export default class StrokeDrawer extends Component {

	static propTypes = {
		strokes: PropTypes.array,
		usePloma: PropTypes.bool,
		uniqueCanvasFactor: PropTypes.number,
		bounds: PropTypes.object.isRequired
	};

	static defaultProps = {
		strokes: [],
		uniqueCanvasFactor: 1,
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
		this.setPlomaInstance(this.redrawEverything.bind(this, this.props.strokes.length > 0 && this.props.strokes[0].finished));
	}

	componentDidUpdate() {
		if (!isEqual(this.props.usePloma, !!this.state.plomaInstance)) {
			this.setPlomaInstance(() => {
				this.setState({
					strokes: cloneDeep(this.props.strokes)
				}, this.redrawEverything)
			});
		} else if (!isEqual(this.props.strokes, this.state.strokes)) {
			this.onStrokesUpdated();
		}
	}

	onStrokesUpdated() {
		if (pointCount(this.props.strokes) === (pointCount(this.state.strokes) + 1)) {
			this.addPointPerformanceEnhanced();
		} else {
			this.redrawEverything(this.props.strokes[0] && this.props.strokes[0].finished);
		}
		this.setState({
			strokes: cloneDeep(this.props.strokes)
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
		} else if (last(newStrokes).finished && !last(oldStrokes).finished) {
			this.endStrokeAt(lastPointInStrokes(newStrokes), secondToLastPointInStrokes(newStrokes));
		} else {
			this.extendStrokeAt(lastPointInStrokes(newStrokes), secondToLastPointInStrokes(newStrokes));
		}
		this.setState({
			tempCanvas: this.state.tempCanvas
		})
	}

	startStrokeAt(point) {
		if (this.props.usePloma) {
			this.state.plomaInstance.beginStroke(point.x, point.y, PRESSURE);
		}
	}

	extendStrokeAt(point, optPointBefore) {
		if (this.props.usePloma) {
			this.state.plomaInstance.extendStroke(point.x, point.y, PRESSURE);
		} else if (optPointBefore && (point !== optPointBefore)) {
			let context = this.state.tempCanvas.getContext('2d');
			context.beginPath();
			context.moveTo(optPointBefore.x, optPointBefore.y);
	        context.lineTo(point.x, point.y);
	        context.stroke();
	        context.closePath();
		}
	}

	endStrokeAt(point, optPointBefore) {
		if (this.props.usePloma) {
			this.state.plomaInstance.endStroke(point.x, point.y, PRESSURE);
		} else {
			this.extendStrokeAt(point, optPointBefore);
		}
	}

	resetCanvas() {
		if (this.props.usePloma) {
			this.state.plomaInstance.clear();
		} else {
			clearCanvas(this.refs.canvas.refs.node);
			clearCanvas(this.state.tempCanvas);
		}
	}

	redrawEverything(shouldFinish) {
		let that = this;
		this.resetCanvas();
		forEach(this.props.strokes, (stroke) => {
			let points = stroke.points;
			if (points.length > 1) {
				that.startStrokeAt(head(points));
				reduce(without(tail(points), last(points)), function (pointBefore, point) {
					that.extendStrokeAt(point, pointBefore);
					return point;
				}, tail(points)[0])
				if (shouldFinish) {
					that.endStrokeAt(last(points), points[points.length-2]);
				} else {
					that.extendStrokeAt(last(points), points[points.length-2]);
				}
			}
		})
		this.setState({
			tempCanvas: this.state.tempCanvas
		})
	}

	render() {
		let currentImageData = this.state.tempCanvas.getContext('2d').getImageData(this.props.bounds.x, this.props.bounds.y, this.props.bounds.width, this.props.bounds.height);
		return <Canvas ref="canvas" {...this.props}
			imageData={currentImageData}
		/>;
	}
}