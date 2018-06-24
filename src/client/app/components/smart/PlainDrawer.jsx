// @flow
import Color from 'color';
import { without, last, head, tail, reduce, cloneDeep } from 'lodash';

import lastPointInStrokes from 'src/client/app/helpers/lastPointInStrokes';
import { DEFAULT_PEN_COLOR, SELECTED_PEN_COLOR } from 'src/client/app/constants/drawing';
import type { Stroke, Point } from 'src/client/app/typeDefinitions';

import AbstractDrawer, { type AbstractDrawerProps } from './AbstractDrawer';

const secondToLastPointInStrokes = (strokes) => {
	const points = last(strokes).points;
	return points[points.length - 2];
};

type Props = {};

export type PlainDrawerProps = AbstractDrawerProps<Props>;

export default class PlainDrawer extends AbstractDrawer<Props, {}> {
	wasFirstPointEdited() {
		return this.props.strokes[0] && this.state.strokes[0] &&
			(this.props.strokes[0].points[0].x !== this.state.strokes[0].points[0].x);
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
			that.startStrokeAt({
				...point,
				x: point.x + stroke.position.x,
				y: point.y + stroke.position.y,
			}, stroke.selected ? SELECTED_PEN_COLOR : strokeColor);
		}
		if (points.length > 1) {
			reduce(without(tail(points), last(points)), (pointBefore, point) => {
				that.extendStrokeAt({
					...point,
					x: point.x + stroke.position.x,
					y: point.y + stroke.position.y,
				}, {
					...pointBefore,
					x: pointBefore.x + stroke.position.x,
					y: pointBefore.y + stroke.position.y,
				});
				return point;
			}, tail(points)[0]);
			if (shouldFinish) {
				const pointA = last(points);
				const pointB = points[points.length - 2];
				that.endStrokeAt({
					...pointA,
					x: pointA.x + stroke.position.x,
					y: pointA.y + stroke.position.y,
				}, {
					...pointB,
					x: pointB.x + stroke.position.x,
					y: pointB.y + stroke.position.y,
				});
			} else {
				const pointA = last(points);
				const pointB = points[points.length - 2];
				that.extendStrokeAt({
					...pointA,
					x: pointA.x + stroke.position.x,
					y: pointA.y + stroke.position.y,
				}, {
					...pointB,
					x: pointB.x + stroke.position.x,
					y: pointB.y + stroke.position.y,
				});
			}
		}
	}
}
