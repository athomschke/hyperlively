import React, {Component, PropTypes} from 'react';
import { flatten, last, isEqual, cloneDeep, forEach, map } from 'lodash';
import { ERROR_OVERWRITE } from 'constants/errors';

'use strict'

let pointCount = (strokes) => {
	return flatten(map(strokes, (stroke) => {
		return stroke.points;
	})).length
}

export default class AbstractDrawer extends Component {

	onStrokeStarted(strokes) {
		throw(new Error(ERROR_OVERWRITE));
	}

	onStrokesExtended(strokes) {
		throw(new Error(ERROR_OVERWRITE));
	}

	onStrokesEnded(strokes) {
		throw(new Error(ERROR_OVERWRITE));
	}

	startStrokeAt(point) { }

	extendStrokeAt(point, optPointBefore) {
		throw(new Error(ERROR_OVERWRITE));
	}

	endStrokeAt(point, optPointBefore) {
		throw(new Error(ERROR_OVERWRITE));
	}

	resetCanvas() {
		throw(new Error(ERROR_OVERWRITE));
	}

	redrawStroke(stroke, shouldFinish) {
		throw(new Error(ERROR_OVERWRITE));
	}

	static propTypes = {
		strokes: PropTypes.array,
		bounds: PropTypes.object.isRequired
	};

	static defaultProps = {
		strokes: []
	};

	constructor(props) {
		super(props);
		let tempCanvas = document.createElement('canvas');
		tempCanvas.setAttribute('width', window.innerWidth);
		tempCanvas.setAttribute('height', window.innerHeight);
		this.state = {
			strokes: cloneDeep(props.strokes),
			tempCanvas: tempCanvas
		};
	}

	componentDidUpdate() {
		if (!isEqual(this.props.strokes, this.state.strokes)) {
			this.onStrokesUpdated();
		}
	}

	lastPointInStrokes (strokes) {
		return last(last(strokes).points);
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

	addPointPerformanceEnhanced() {
		let oldStrokes = this.state.strokes;
		let newStrokes = this.props.strokes;
		if (newStrokes.length > oldStrokes.length) {
			this.onStrokeStarted(newStrokes);
		} else if (last(newStrokes).finished && !last(oldStrokes).finished) {
			this.onStrokesEnded(newStrokes);
		} else {
			this.onStrokesExtended(newStrokes);
		}
		this.setState({
			tempCanvas: this.state.tempCanvas
		})
	}

	redrawEverything(shouldFinish) {
		let that = this;
		this.resetCanvas();
		forEach(this.props.strokes, (stroke) => {
			that.redrawStroke(stroke, shouldFinish);
		})
		this.setState({
			tempCanvas: this.state.tempCanvas
		})
	}

	renderWrappedComponent(Wrapped) {
		let currentImageData = this.state.tempCanvas.getContext('2d').getImageData(this.props.bounds.x, this.props.bounds.y, this.props.bounds.width, this.props.bounds.height);
		return <Wrapped ref="canvas" {...this.props}
			imageData={currentImageData}
		/>;
	}
}