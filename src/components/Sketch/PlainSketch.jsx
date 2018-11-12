// @flow
import Color from 'color';
import {
	without, last, head, tail, reduce, cloneDeep,
} from 'lodash';

import { DEFAULT_PEN_COLOR, SELECTED_PEN_COLOR } from 'src/constants/drawing';
import type { Stroke, Point } from 'src/types';

import lastPointInStrokes from './lastPointInStrokes';
import AbstractSketch, { type AbstractSketchProps, transformPoint } from './AbstractSketch';

const secondToLastPointInStrokes = (strokes) => {
	const points = last(strokes).points;
	return points[points.length - 2];
};

type Props = {};

export type PlainSketchProps = AbstractSketchProps<Props>;

export default class PlainSketch extends AbstractSketch<Props, {}> {
	wasFirstPointEdited() {
		return this.props.strokes[0] && this.state.strokes[0]
			&& (this.props.strokes[0].points[0].x !== this.state.strokes[0].points[0].x);
	}

	handleStrokesUpdated() {
		if (this.wasFirstPointEdited()) {
			this.redrawEverything(this.props.strokes[0] && this.props.strokes[0].finished);
			this.setState({
				strokes: cloneDeep(this.props.strokes),
			});
		} else {
			super.handleStrokesUpdated();
		}
	}

	handleStrokeStarted(strokes: Array<Stroke>) {
		this.startStrokeAt(lastPointInStrokes(strokes), strokes[0].color || DEFAULT_PEN_COLOR);
	}

	handleStrokesExtended(strokes: Array<Stroke>) {
		this.extendStrokeAt(lastPointInStrokes(strokes), secondToLastPointInStrokes(strokes));
	}

	handleStrokesEnded(strokes: Array<Stroke>) {
		this.endStrokeAt(lastPointInStrokes(strokes), secondToLastPointInStrokes(strokes));
	}

	startStrokeAt(point: Point, aColor: string) {
		const canvas = this.state.canvas;
		if (canvas) {
			canvas.getContext('2d').strokeStyle = `${(new Color(aColor || DEFAULT_PEN_COLOR)).hex()}`;
		}
	}

	extendStrokeAt(point: Point, optPointBefore: Point) {
		const canvas = this.state.canvas;

		if (canvas && optPointBefore && point !== optPointBefore) {
			const context = canvas.getContext('2d');
			context.beginPath();
			context.moveTo(optPointBefore.x, optPointBefore.y);
			context.lineTo(point.x, point.y);
			context.stroke();
			context.closePath();
		}
	}

	endStrokeAt(point: Point, optPointBefore: Point) {
		this.extendStrokeAt(point, optPointBefore);
	}

	resetCanvas() {
		const canvas = this.state.canvas;
		if (canvas) {
			canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	redrawStroke(stroke: Stroke, shouldFinish: boolean) {
		const that = this;
		const points = stroke.points;
		if (points.length > 0 && !(points.length === 1 && stroke.finished)) {
			const strokeColor = stroke.color || DEFAULT_PEN_COLOR;
			const point = head(points);
			that.startStrokeAt(
				transformPoint(point, stroke.position, stroke.center, stroke.angle),
				stroke.selected ? SELECTED_PEN_COLOR : strokeColor,
			);
		}
		if (points.length > 1) {
			reduce(without(tail(points), last(points)), (pointBefore, point) => {
				that.extendStrokeAt(
					transformPoint(point, stroke.position, stroke.center, stroke.angle),
					transformPoint(pointBefore, stroke.position, stroke.center, stroke.angle),
				);
				return point;
			}, tail(points)[0]);
			if (shouldFinish) {
				const pointA = last(points);
				const pointB = points[points.length - 2];
				that.endStrokeAt(
					transformPoint(pointA, stroke.position, stroke.center, stroke.angle),
					transformPoint(pointB, stroke.position, stroke.center, stroke.angle),
				);
			} else {
				const pointA = last(points);
				const pointB = points[points.length - 2];
				that.extendStrokeAt(
					transformPoint(pointA, stroke.position, stroke.center, stroke.angle),
					transformPoint(pointB, stroke.position, stroke.center, stroke.angle),
				);
			}
		}
	}
}
