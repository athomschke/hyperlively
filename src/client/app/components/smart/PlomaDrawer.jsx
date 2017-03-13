// @flow
import React from 'react';
import Color from 'color';
import { BallpointPen } from 'ploma';
import { last, forEach, head, tail, first } from 'lodash';
import lastPointInStrokes from 'helpers/lastPointInStrokes';
import { PRESSURE, DEFAULT_PEN_COLOR, SELECTED_PEN_COLOR } from 'constants/drawing';
import AbstractDrawer from './AbstractDrawer';
import { type Stroke, type Point } from '../../typeDefinitions';

export default class PlomaDrawer extends AbstractDrawer {

	static propTypes = Object.assign({}, AbstractDrawer.propTypes, {
		uniqueCanvasFactor: React.PropTypes.number,
	});

	static defaultProps = Object.assign({}, AbstractDrawer.defaultProps, {
		uniqueCanvasFactor: 1,
	});

	state: {
		ballpointPen: Object,
		strokes: Array<Stroke>,
		width: number,
		height: number
	}

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
