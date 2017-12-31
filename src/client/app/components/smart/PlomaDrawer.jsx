// @flow
import Color from 'color';
import { BallpointPen } from 'ploma';
import { last, forEach, head, tail, first } from 'lodash';

import lastPointInStrokes from 'src/client/app/helpers/lastPointInStrokes';
import { PRESSURE, DEFAULT_PEN_COLOR, SELECTED_PEN_COLOR } from 'src/client/app/constants/drawing';
import type { Stroke, Point } from 'src/client/app/typeDefinitions';

import AbstractDrawer, { type AbstractDrawerProps } from './AbstractDrawer';

type State = {
	ballpointPen: Object,
	strokes: Array<Stroke>,
	width: number,
	height: number
}

type Props = AbstractDrawerProps & {
	uniqueCanvasFactor: number;
}

export default class PlomaDrawer extends AbstractDrawer<Props, State> {

	static defaultProps = Object.assign({}, AbstractDrawer.defaultProps, {
		uniqueCanvasFactor: 1,
	});

	state: State;

	componentDidMount() {
		const plomaConfig = {
			uniqueCanvasFactor: this.props.uniqueCanvasFactor,
			paperColor: 'rgba(0, 0, 0, 0)',
		};
		const ballpointPen = new BallpointPen(this.canvas, plomaConfig);
		ballpointPen.setSample(1);
		this.state = {
			ballpointPen,
		};
		super.componentDidMount();
	}

	onStrokeStarted(strokes: Array<Stroke>) {
		this.startStrokeAt(lastPointInStrokes(strokes), first(strokes).color);
	}

	onStrokesExtended(strokes: Array<Stroke>) {
		this.extendStrokeAt(lastPointInStrokes(strokes));
	}

	onStrokesEnded(strokes: Array<Stroke>) {
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
		if (points.length > 1) {
			that.startStrokeAt(head(points), stroke.selected ? SELECTED_PEN_COLOR : stroke.color);
			forEach(tail(points), (point) => {
				that.extendStrokeAt(point);
			});
			if (shouldFinish) {
				that.endStrokeAt(last(points));
			} else {
				that.extendStrokeAt(last(points));
			}
		}
	}
}
