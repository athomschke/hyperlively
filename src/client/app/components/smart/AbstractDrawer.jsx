import React, {Component, PropTypes} from 'react';
import { flatten, last, isEqual, cloneDeep, forEach, map } from 'lodash';
import { ERROR_OVERWRITE } from 'constants/errors';

'use strict';

let allPoints = (strokes) => {
	return flatten(map(strokes, (stroke) => {
		return stroke.points;
	}));
};

let pointCount = (strokes) => {
	return allPoints(strokes).length;
};

export default class AbstractDrawer extends Component {

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	onStrokeStarted() {
		throw(new Error(ERROR_OVERWRITE));
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	onStrokesExtended() {
		throw(new Error(ERROR_OVERWRITE));
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	onStrokesEnded() {
		throw(new Error(ERROR_OVERWRITE));
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	startStrokeAt() { }

	/**
	 * @overwrite
	 * @param {array} strokes
	 * @param {object} optPointBefore
	 */
	extendStrokeAt() {
		throw(new Error(ERROR_OVERWRITE));
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 * @param {object} optPointBefore
	 */
	endStrokeAt() {
		throw(new Error(ERROR_OVERWRITE));
	}

	/**
	 * @overwrite
	 */
	resetCanvas() {
		throw(new Error(ERROR_OVERWRITE));
	}

	/**
	 * @overwrite
	 */
	redrawStroke() {
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

	moveImageDataToNewPosition() {
		let oldFirstPoint = allPoints(this.state.strokes)[0];
		let newFirstPoint = allPoints(this.props.strokes)[0];
		let moveBy ={ 
			x: newFirstPoint.x - oldFirstPoint.x,
			y: newFirstPoint.y - oldFirstPoint.y
		};
		let context = this.state.tempCanvas.getContext('2d');
		let oldImageData = context.getImageData(this.props.bounds.x - moveBy.x, this.props.bounds.y - moveBy.y, this.props.bounds.width, this.props.bounds.height);
		context.putImageData(oldImageData, this.props.bounds.x, this.props.bounds.y);
	}

	onStrokesUpdated() {
		if (pointCount(this.props.strokes) === (pointCount(this.state.strokes) + 1)) {
			this.addPointPerformanceEnhanced();
		} else if (pointCount(this.props.strokes) === (pointCount(this.state.strokes))) {
			this.moveImageDataToNewPosition();
		} else {
			this.redrawEverything(this.props.strokes[0] && this.props.strokes[0].finished);
		}
		this.setState({
			strokes: cloneDeep(this.props.strokes)
		});
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
		});
	}

	redrawEverything(shouldFinish) {
		let that = this;
		this.resetCanvas();
		forEach(this.props.strokes, (stroke) => {
			that.redrawStroke(stroke, shouldFinish);
		});
		this.setState({
			tempCanvas: this.state.tempCanvas
		});
	}

	renderWrappedComponent(Wrapped) {
		let currentImageData = this.state.tempCanvas.getContext('2d').getImageData(this.props.bounds.x, this.props.bounds.y, this.props.bounds.width, this.props.bounds.height);
		return <Wrapped ref="canvas" {...this.props}
			imageData={currentImageData}
		/>;
	}
}