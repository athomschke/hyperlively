// @flow
import React, { PureComponent } from 'react';
import {
	flatten, last, isEqual, cloneDeep, forEach, map,
} from 'lodash';

import { ERROR_DIRECT_ABSTRACT_CALL, ERROR_CALL_SUPER_TO_ABSTRACT } from 'src/constants/errors';
import { OFFSET } from 'src/constants/canvas';
import type {
	Stroke, Point, OnNodeChangedFunction, Coordinate,
} from 'src/types';

import Passpartout from './Passpartout';

const allPoints = strokes => flatten(map(strokes, stroke => stroke.points));

const pointCount = strokes => allPoints(strokes).length;

const strokeWhereColorChanged = (strokes1: Array<Stroke>, strokes2: Array<Stroke>) => strokes1.find((stroke, index) => !stroke.color === strokes2[index].color);

const strokeWhereSelectStatusChanged = (strokes1, strokes2) => strokes1.find((stroke, index) => !stroke.selected === strokes2[index].selected);

export const transformPoint = (
	point: Point,
	offset: Coordinate,
	center: Coordinate,
	angle: number,
) => {
	const radians = angle * (Math.PI / 180);
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);
	const dX = point.x - center.x;
	const dY = point.y - center.y;
	return {
		...point,
		x: ((cos * dX) - (sin * dY)) + center.x + offset.x,
		y: ((sin * dX) + (cos * dY)) + center.y + offset.y,
	};
};

export type AbstractDrawerProps<P> = P & {
	strokes: Array<Stroke>,
	bounds: {
		x: number,
		y: number,
		width: number,
		height: number
	},
	onNodeChanged?: OnNodeChangedFunction,
	active?: boolean,
	width: number,
	height: number,
	showBorder: boolean,
	finished?: boolean,
}

export type AbstractDrawerState<S> = S & {
	strokes: Array<Stroke>,
	width: number,
	height: number,
	canvas: HTMLCanvasElement | null,
}

export const defaultProps = {
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

export default class AbstractDrawer<P, S> extends
	PureComponent<AbstractDrawerProps<P>, AbstractDrawerState<S>> {
	static defaultProps = defaultProps;

	constructor() {
		super();
		const defaultState: AbstractDrawerState<any> = {
			width: 0,
			height: 0,
			canvas: null,
			strokes: [],
		};

		this.state = this.state || defaultState;
	}

	state: AbstractDrawerState<S>;

	componentDidMount() {
		const isFinished = last(this.props.strokes) && last(this.props.strokes).finished;
		this.state.width = this.props.width;
		this.state.height = this.props.height;
		this.state.strokes = cloneDeep(this.props.strokes);
		this.redrawEverything(isFinished);
	}

	componentDidUpdate() {
		if (!isEqual(this.props.strokes, this.state.strokes)) {
			this.handleStrokesUpdated();
		}
		if (!isEqual(this.props.width, this.state.width)) {
			this.state.width = this.props.width;
			this.redrawEverything(false);
		}
		if (!isEqual(this.props.height, this.state.height)) {
			this.state.height = this.props.height;
			this.redrawEverything(false);
		}
	}

	props: AbstractDrawerProps<P>;

	handleAbstractMethodCalled() {
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
	handleStrokeStarted(_strokes: Array<Stroke>) {
		this.handleAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	handleStrokesExtended(_strokes: Array<Stroke>) {
		this.handleAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 */
	handleStrokesEnded(_strokes: Array<Stroke>) {
		this.handleAbstractMethodCalled();
	}

	handleStrokesUpdated() {
		if (pointCount(this.props.strokes) === (pointCount(this.state.strokes) + 1)) {
			this.addPointPerformanceEnhanced();
		} else {
			this.redrawEverything(this.props.strokes[0] && this.props.strokes[0].finished);
		}
		this.setState({
			strokes: cloneDeep(this.props.strokes),
		});
	}

	calculateCanvasStyle() {
		return {
			position: 'absolute',
			top: -this.props.bounds.y,
			left: -this.props.bounds.x,
			pointerEvents: 'none',
		};
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 * @param {object} optPointBefore
	 */
	extendStrokeAt(_point: Point, _optPointBefore: Point) {
		this.handleAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 * @param {array} strokes
	 * @param {object} optPointBefore
	 */
	endStrokeAt(_point: Point, _optPointBefore: Point) {
		this.handleAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 */
	resetCanvas() {
		this.handleAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 * @param {object} point
	 * @param {object} color (optional)
	 */
	startStrokeAt(_aPoint: Point, _aColor: string) {
		this.handleAbstractMethodCalled();
	}

	/**
	 * @overwrite
	 */
	redrawStroke(_stroke: Stroke, _shouldFinish: boolean) {
		this.handleAbstractMethodCalled();
	}

	moveImageDataToNewPosition() {
		const canvas = this.state.canvas;

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
					this.props.bounds.height,
				);
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.putImageData(oldImageData, this.props.bounds.x, this.props.bounds.y);
			}
		}
	}

	colorRemainedEqual() {
		return !strokeWhereColorChanged(this.props.strokes, this.state.strokes)
			&& !strokeWhereSelectStatusChanged(this.props.strokes, this.state.strokes);
	}

	addPointPerformanceEnhanced() {
		const oldStrokes = this.state.strokes;
		const newStrokes = this.props.strokes;
		if (newStrokes.length > oldStrokes.length) {
			this.handleStrokeStarted(newStrokes);
		} else if (last(newStrokes).finished && !last(oldStrokes).finished) {
			this.handleStrokesEnded(newStrokes);
		} else {
			this.handleStrokesExtended(newStrokes);
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
		const {
			active, finished, bounds, showBorder,
		} = this.props;

		const onNodeChanged = this.props.onNodeChanged || (() => undefined);

		return (
			<Passpartout
				onNodeChanged={onNodeChanged}
				active={active}
				finished={finished}
				bounds={bounds}
				showBorder={showBorder}
			>
				<canvas
					ref={(canvas) => {
						this.state.canvas = canvas;
					}}
					width={this.props.width}
					height={this.props.height}
					style={this.calculateCanvasStyle()}
				/>
			</Passpartout>
		);
	}
}
