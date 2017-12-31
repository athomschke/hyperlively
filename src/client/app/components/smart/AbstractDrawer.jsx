// @flow
import React, { PureComponent } from 'react';
import { flatten, last, isEqual, cloneDeep, forEach, map, find } from 'lodash';

import { ERROR_DIRECT_ABSTRACT_CALL, ERROR_CALL_SUPER_TO_ABSTRACT } from 'src/client/app/constants/errors';
import { OFFSET } from 'src/client/app/constants/canvas';
import type { Stroke, Point } from 'src/client/app/typeDefinitions';

const allPoints = strokes => flatten(map(strokes, stroke => stroke.points));

const pointCount = strokes => allPoints(strokes).length;

const strokeWhereColorChanged = (strokes1, strokes2) =>
	find(strokes1, (stroke, index) =>
		!isEqual(stroke.color, strokes2[index].color));

const strokeWhereSelectStatusChanged = (strokes1, strokes2) =>
	find(strokes1, (stroke, index) =>
		!isEqual(stroke.selected, strokes2[index].selected));

export type AbstractDrawerProps = {
	strokes: Array<Stroke>,
	bounds: {
		x: number,
		y: number,
		width: number,
		height: number
	},
	active: boolean,
	width: number,
	height: number,
	showBorder: boolean,
	finished: boolean,
}

type State = {
	strokes: Array<Stroke>,
	width: number,
	height: number
}

export default class AbstractDrawer extends PureComponent<AbstractDrawerProps, State> {

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
		this.state = Object.assign({}, this.state || {}, {
			strokes: cloneDeep(this.props.strokes),
			width: this.props.width,
			height: this.props.height,
		});
		this.redrawEverything(isFinished);
	}

	componentDidUpdate() {
		if (!isEqual(this.props.strokes, this.state.strokes)) {
			this.onStrokesUpdated();
		}
		if (!isEqual(this.props.width, this.state.width)) {
			this.state = Object.assign({}, this.state, {
				width: this.props.width,
			});
			this.redrawEverything(false);
		}
		if (!isEqual(this.props.height, this.state.height)) {
			this.state = Object.assign({}, this.state, {
				height: this.props.height,
			});
			this.redrawEverything(false);
		}
	}

	onAbstractMethodCalled() {
		if (this === AbstractDrawer) {
			throw new Error(ERROR_DIRECT_ABSTRACT_CALL);
		} else {
			throw new Error(ERROR_CALL_SUPER_TO_ABSTRACT);
		}
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	onStrokeStarted(_strokes: Array<Stroke>) {
		this.onAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	onStrokesExtended(_strokes: Array<Stroke>) {
		this.onAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	onStrokesEnded(_strokes: Array<Stroke>) {
		this.onAbstractMethodCalled();
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

	props: AbstractDrawerProps;

	node: HTMLDivElement | null;

	canvas: HTMLCanvasElement | null;

	/**
	 * @overwrite
	 * @param {array} strokes
	 * @param {object} optPointBefore
	 */
	extendStrokeAt(_point: Point, _optPointBefore: Point) {
		this.onAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 * @param {object} optPointBefore
	 */
	endStrokeAt(_point: Point, _optPointBefore: Point) {
		this.onAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 */
	resetCanvas() {
		this.onAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 * @param {object} point
	 * @param {object} color (optional)
	 */
	startStrokeAt(_aPoint: Point, _aColor: string) {
		this.onAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 */
	redrawStroke(_stroke: Stroke, _shouldFinish: boolean) {
		this.onAbstractMethodCalled();
	}

	moveImageDataToNewPosition() {
		const canvas = this.canvas;
		if (canvas) {
			const oldFirstPoint = allPoints(this.state.strokes)[0];
			const newFirstPoint = allPoints(this.props.strokes)[0];
			const moveBy = {
				x: newFirstPoint.x - oldFirstPoint.x,
				y: newFirstPoint.y - oldFirstPoint.y,
			};
			const context = canvas.getContext('2d');
			if (context) {
				const oldImageData = context.getImageData(
					this.props.bounds.x - moveBy.x,
					this.props.bounds.y - moveBy.y,
					this.props.bounds.width,
					this.props.bounds.height);
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.putImageData(oldImageData, this.props.bounds.x, this.props.bounds.y);
			}
		}
	}

	colorRemainedEqual() {
		return !strokeWhereColorChanged(this.props.strokes, this.state.strokes) &&
			!strokeWhereSelectStatusChanged(this.props.strokes, this.state.strokes);
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

	redrawEverything(shouldFinish: boolean) {
		const that = this;
		this.resetCanvas();
		forEach(this.props.strokes, (stroke) => {
			that.redrawStroke(stroke, shouldFinish);
		});
	}

	render() {
		return (<div
			ref={(divNode) => { this.node = divNode; }}
			style={this.getPassepartoutStyle()}
		>
			<canvas
				ref={(canvas) => { this.canvas = canvas; }}
				width={this.props.width}
				height={this.props.height}
				style={this.getCanvasStyle()}
			/>
		</div>);
	}
}
