// @flow
import Color from 'color';
import { without, last, head, tail, reduce, cloneDeep, first, isEqual } from 'lodash';

import lastPointInStrokes from 'src/client/app/helpers/lastPointInStrokes';
import { DEFAULT_PEN_COLOR, SELECTED_PEN_COLOR } from 'src/client/app/constants/drawing';
import type { Stroke, Point } from 'src/client/app/typeDefinitions';

import AbstractDrawer from './AbstractDrawer';

const secondToLastPointInStrokes = (strokes) => {
	const points = last(strokes).points;
	return points[points.length - 2];
};

export default class PlainDrawer extends AbstractDrawer<{}, {}> {
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
		this.startStrokeAt(lastPointInStrokes(strokes), first(strokes).color);
	}

	handleStrokesExtended(strokes: Array<Stroke>) {
		this.extendStrokeAt(lastPointInStrokes(strokes), secondToLastPointInStrokes(strokes));
	}

	handleStrokesEnded(strokes: Array<Stroke>) {
		this.endStrokeAt(lastPointInStrokes(strokes), secondToLastPointInStrokes(strokes));
	}

	startStrokeAt(point: Point, aColor: string) {
		const canvas = this.canvas;
		if (canvas) {
			canvas.getContext('2d').strokeStyle = `${(new Color(aColor || DEFAULT_PEN_COLOR)).hex()}`;
		}
	}

	extendStrokeAt(point: Point, optPointBefore: Point) {
		if (this.canvas && optPointBefore && point !== optPointBefore) {
			const context = this.canvas.getContext('2d');
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
		const canvas = this.canvas;
		if (canvas) {
			canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	redrawStroke(stroke: Stroke, shouldFinish: boolean) {
		const that = this;
		const points = stroke.points;
		if (points.length > 0 && !(points.length === 1 && stroke.finished)) {
			that.startStrokeAt(head(points), stroke.selected ? SELECTED_PEN_COLOR : stroke.color);
		}
		if (points.length > 1) {
			reduce(without(tail(points), last(points)), (pointBefore, point) => {
				that.extendStrokeAt(point, pointBefore);
				return point;
			}, tail(points)[0]);
			if (shouldFinish) {
				that.endStrokeAt(last(points), points[points.length - 2]);
			} else {
				that.extendStrokeAt(last(points), points[points.length - 2]);
			}
		}
	}
}
