// @flow
import Color from 'color';
import { BallpointPen } from 'ploma';
import { last, forEach, head, tail } from 'lodash';

import { PRESSURE, DEFAULT_PEN_COLOR, SELECTED_PEN_COLOR } from 'src/client/app/constants/drawing';
import type { Stroke, Point } from 'src/client/app/typeDefinitions';

import lastPointInStrokes from './lastPointInStrokes';
import AbstractDrawer, { defaultProps, type AbstractDrawerProps, transformPoint } from './AbstractDrawer';

type State = {
	ballpointPen: Object;
}

type Props = {
	uniqueCanvasFactor: number;
}

export type PlomaDrawerProps = AbstractDrawerProps<Props>

export default class PlomaDrawer extends AbstractDrawer<Props, State> {
	static defaultProps = Object.assign({}, defaultProps, {
		uniqueCanvasFactor: 1,
	})

	componentDidMount() {
		const plomaConfig = {
			uniqueCanvasFactor: this.props.uniqueCanvasFactor,
			paperColor: 'rgba(0, 0, 0, 0)',
		};
		const ballpointPen = new BallpointPen(this.state.canvas, plomaConfig);
		this.state = Object.assign({}, this.state, {
			ballpointPen,
		});
		ballpointPen.setSample(1);
		super.componentDidMount();
	}

	handleStrokeStarted(strokes: Array<Stroke>) {
		this.startStrokeAt(lastPointInStrokes(strokes), strokes[0].color || DEFAULT_PEN_COLOR);
	}

	handleStrokesExtended(strokes: Array<Stroke>) {
		this.extendStrokeAt(lastPointInStrokes(strokes));
	}

	handleStrokesEnded(strokes: Array<Stroke>) {
		this.endStrokeAt(lastPointInStrokes(strokes));
	}

	startStrokeAt(point: Point, aColor: string) {
		const parsedColor = Color(aColor || DEFAULT_PEN_COLOR).color;
		const plomaFormattedColor = {
			r: parsedColor[0],
			g: parsedColor[1],
			b: parsedColor[2],
		};
		this.state.ballpointPen.setPenColor(plomaFormattedColor);
		this.state.ballpointPen.beginStroke(point.x, point.y, PRESSURE);
	}

	extendStrokeAt(point: Point) {
		this.state.ballpointPen.extendStroke(point.x, point.y, PRESSURE);
	}

	endStrokeAt(point: Point) {
		this.state.ballpointPen.endStroke(point.x, point.y, PRESSURE);
	}

	resetCanvas() {
		this.state.ballpointPen.clear();
	}

	redrawStroke(stroke: Stroke, shouldFinish: boolean) {
		const that = this;
		const points = stroke.points;
		const strokeColor = stroke.color || DEFAULT_PEN_COLOR;
		if (points.length > 1) {
			const point = head(points);
			that.startStrokeAt(
				transformPoint(point, stroke.position, stroke.center, stroke.angle),
				stroke.selected ? SELECTED_PEN_COLOR : strokeColor,
			);
			forEach(tail(points), (aPoint) => {
				that.extendStrokeAt(transformPoint(aPoint, stroke.position, stroke.center, stroke.angle));
			});
			if (shouldFinish) {
				const aPoint = last(points);
				that.endStrokeAt(transformPoint(aPoint, stroke.position, stroke.center, stroke.angle));
			} else {
				const aPoint = last(points);
				that.extendStrokeAt(transformPoint(aPoint, stroke.position, stroke.center, stroke.angle));
			}
		} else if (points.length > 0) {
			const aPoint = head(points);
			that.startStrokeAt(
				transformPoint(aPoint, stroke.position, stroke.center, stroke.angle),
				stroke.selected ? SELECTED_PEN_COLOR : strokeColor,
			);
		}
	}
}
