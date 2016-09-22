import React, {Component, PropTypes} from 'react';
import { flatten, last, isEqual, cloneDeep, forEach, map } from 'lodash';
import { ERROR_OVERWRITE } from 'constants/errors';
import { OFFSET } from 'constants/canvas';

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
		bounds: PropTypes.object,
		active: PropTypes.bool,
		width: PropTypes.number,
		height: PropTypes.number
	};

	static defaultProps = {
		strokes: [],
		bounds: {
			x: 0,
			y: 0,
			width: 2*OFFSET,
			height: 2*OFFSET
		},
		active: false,
		width: window.innerWidth,
		height: window.innerHeight
	};

	constructor(props) {
		super(props);
		this.state = {
			strokes: cloneDeep(props.strokes),
			width: props.width,
			height: props.height,
		};
	}

	componentDidUpdate() {
		if (!isEqual(this.props.strokes, this.state.strokes)) {
			this.onStrokesUpdated();
		}
		if (!isEqual(this.props.width, this.state.width)) {
			this.setState({
				width: this.props.width
			}, this.redrawEverything);
		}
		if (!isEqual(this.props.height, this.state.height)) {
			this.setState({
				height: this.props.height
			}, this.redrawEverything);
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
		let context = this.refs.canvas.getContext('2d');
		let oldImageData = context.getImageData(this.props.bounds.x - moveBy.x, this.props.bounds.y - moveBy.y, this.props.bounds.width, this.props.bounds.height);
		context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
		context.putImageData(oldImageData, this.props.bounds.x, this.props.bounds.y);
	}

	onStrokesUpdated() {
		if (pointCount(this.props.strokes) === (pointCount(this.state.strokes) + 1)) {
			this.addPointPerformanceEnhanced();
		} else if (this.props.strokes.length === (this.state.strokes.length) &&
				(pointCount(this.props.strokes) === (pointCount(this.state.strokes)))) {
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
	}

	redrawEverything(shouldFinish) {
		let that = this;
		this.resetCanvas();
		forEach(this.props.strokes, (stroke) => {
			that.redrawStroke(stroke, shouldFinish);
		});
	}

	render() {
		return <div
				ref='node'
				style={{
					position: 'absolute',
					top: this.props.bounds.y,
					left: this.props.bounds.x,
					pointerEvents: this.props.active ? 'auto' : 'none',
					width: this.props.bounds.width,
					height: this.props.bounds.height
				}}
			>
				<canvas 
					ref='canvas'
					width={this.props.width}
					height={this.props.height}
					style={{
						position: 'absolute',
						top: -this.props.bounds.y,
						left: -this.props.bounds.x,
						pointerEvents: 'none'
					}}
				/>
			</div>;
	}
}