import React, { Component, PropTypes } from 'react';
import { flatten, last, isEqual, cloneDeep, forEach, map, find } from 'lodash';
import { ERROR_OVERWRITE } from 'constants/errors';
import { OFFSET } from 'constants/canvas';

const allPoints = strokes => flatten(map(strokes, stroke => stroke.points));

const pointCount = strokes => allPoints(strokes).length;

const strokeWhereColorChanged = (strokes1, strokes2) =>
	find(strokes1, (stroke, index) =>
		!isEqual(stroke.color, strokes2[index].color));

const strokeWhereSelectStatusChanged = (strokes1, strokes2) =>
	find(strokes1, (stroke, index) =>
		!isEqual(stroke.selected, strokes2[index].selected));

export default class AbstractDrawer extends Component {

	static propTypes = {
		strokes: PropTypes.arrayOf(PropTypes.object),
		bounds: PropTypes.objectOf(React.PropTypes.number),
		active: PropTypes.bool,
		width: PropTypes.number,
		height: PropTypes.number,
		showBorder: PropTypes.bool,
		finished: PropTypes.bool,
	};

	static defaultProps = {
		strokes: [],
		bounds: {
			x: 0,
			y: 0,
			width: 2 * OFFSET,
			height: 2 * OFFSET,
		},
		active: false,
		width: window.innerWidth,
		height: window.innerHeight,
		showBorder: false,
		finished: false,
	};

	componentDidMount() {
		const isFinished = last(this.props.strokes) && last(this.props.strokes).finished;
		this.setState({
			strokes: cloneDeep(this.props.strokes),
			width: this.props.width,
			height: this.props.height,
		}, this.redrawEverything.bind(this, isFinished));
	}

	componentDidUpdate() {
		if (!isEqual(this.props.strokes, this.state.strokes)) {
			this.onStrokesUpdated();
		}
		if (!isEqual(this.props.width, this.state.width)) {
			this.setState({
				width: this.props.width,
			}, this.redrawEverything);
		}
		if (!isEqual(this.props.height, this.state.height)) {
			this.setState({
				height: this.props.height,
			}, this.redrawEverything);
		}
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	onStrokeStarted() {
		throw new Error(ERROR_OVERWRITE);
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	onStrokesExtended() {
		throw new Error(ERROR_OVERWRITE);
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	onStrokesEnded() {
		throw new Error(ERROR_OVERWRITE);
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 * @param {object} optPointBefore
	 */
	extendStrokeAt() {
		throw new Error(ERROR_OVERWRITE);
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 * @param {object} optPointBefore
	 */
	endStrokeAt() {
		throw new Error(ERROR_OVERWRITE);
	}

	/**
	 * @overwrite
	 */
	resetCanvas() {
		throw new Error(ERROR_OVERWRITE);
	}

	/**
	 * @overwrite
	 * @param {object} point
	 * @param {object} color (optional)
	 */
	startStrokeAt() {}

	/**
	 * @overwrite
	 */
	redrawStroke() {
		throw new Error(ERROR_OVERWRITE);
	}

	moveImageDataToNewPosition() {
		const oldFirstPoint = allPoints(this.state.strokes)[0];
		const newFirstPoint = allPoints(this.props.strokes)[0];
		const moveBy = {
			x: newFirstPoint.x - oldFirstPoint.x,
			y: newFirstPoint.y - oldFirstPoint.y,
		};
		const context = this.refs.canvas.getContext('2d');
		const oldImageData = context.getImageData(
				this.props.bounds.x - moveBy.x,
				this.props.bounds.y - moveBy.y,
				this.props.bounds.width,
				this.props.bounds.height);
		context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
		context.putImageData(oldImageData, this.props.bounds.x, this.props.bounds.y);
	}

	colorRemainedEqual() {
		return !strokeWhereColorChanged(this.props.strokes, this.state.strokes) &&
			!strokeWhereSelectStatusChanged(this.props.strokes, this.state.strokes);
	}

	onStrokesUpdated() {
		if (pointCount(this.props.strokes) === (pointCount(this.state.strokes) + 1)) {
			this.addPointPerformanceEnhanced();
		} else if (this.props.strokes.length === (this.state.strokes.length) &&
				(pointCount(this.props.strokes) === (pointCount(this.state.strokes))) &&
				this.colorRemainedEqual()) {
			this.moveImageDataToNewPosition();
		} else {
			this.redrawEverything(this.props.strokes[0] && this.props.strokes[0].finished);
		}
		this.setState({
			strokes: cloneDeep(this.props.strokes),
		});
	}

	addPointPerformanceEnhanced() {
		const oldStrokes = this.state.strokes;
		const newStrokes = this.props.strokes;
		if (newStrokes.length > oldStrokes.length) {
			this.onStrokeStarted(newStrokes);
		} else if (last(newStrokes).finished && !last(oldStrokes).finished) {
			this.onStrokesEnded(newStrokes);
		} else {
			this.onStrokesExtended(newStrokes);
		}
	}

	redrawEverything(shouldFinish) {
		const that = this;
		this.resetCanvas();
		forEach(this.props.strokes, (stroke) => {
			that.redrawStroke(stroke, shouldFinish);
		});
	}

	getPassepartoutStyle() {
		return {
			position: 'absolute',
			top: this.props.bounds.y,
			left: this.props.bounds.x,
			pointerEvents: this.props.active && this.props.finished ? 'auto' : 'none',
			width: this.props.bounds.width,
			height: this.props.bounds.height,
			borderLeft: `${this.props.showBorder ? '1' : '0'}px solid black`,
		};
	}

	getCanvasStyle() {
		return {
			position: 'absolute',
			top: -this.props.bounds.y,
			left: -this.props.bounds.x,
			pointerEvents: 'none',
		};
	}

	render() {
		return (<div
			ref="node"
			style={this.getPassepartoutStyle()}
		>
			<canvas
				ref="canvas"
				width={this.props.width}
				height={this.props.height}
				style={this.getCanvasStyle()}
			/>
		</div>);
	}
}
