import { PropTypes } from 'react';
import AbstractDrawer from 'components/smart/AbstractDrawer';
import { last, forEach, head, tail, first } from 'lodash';
import React from 'react';
import { BallpointPen } from 'ploma';
import { PRESSURE, DEFAULT_PEN_COLOR, SELECTED_PEN_COLOR } from 'constants/drawing';
import Color from 'color';

'use strict';

export default class PlomaDrawer extends AbstractDrawer {

	static propTypes =  Object.assign({}, AbstractDrawer.propTypes, {
		uniqueCanvasFactor: PropTypes.number
	});

	static defaultProps = Object.assign({}, AbstractDrawer.defaultProps, {
		uniqueCanvasFactor: 1
	});

	componentDidMount() {
		let plomaConfig = {
			uniqueCanvasFactor: this.props.uniqueCanvasFactor,
			paperColor: 'rgba(0, 0, 0, 0)'
		};
		let ballpointPen = new BallpointPen(this.refs.canvas, plomaConfig);
		ballpointPen.setSample(1);
		this.setState({
			ballpointPen: ballpointPen,
		});
		super.componentDidMount();
	}

	onStrokeStarted(strokes) {
		this.startStrokeAt(this.lastPointInStrokes(strokes), first(strokes).color);
	}

	onStrokesExtended(strokes) {
		this.extendStrokeAt(this.lastPointInStrokes(strokes));
	}

	onStrokesEnded(strokes) {
		this.endStrokeAt(this.lastPointInStrokes(strokes));
	}

	startStrokeAt(point, aColor) {
		let parsedColor = Color(aColor || DEFAULT_PEN_COLOR).color;
		let plomaFormattedColor = {
			r: parsedColor[0],
			g: parsedColor[1],
			b: parsedColor[2]
		};
		this.state.ballpointPen.setPenColor(plomaFormattedColor);
		this.state.ballpointPen.beginStroke(point.x, point.y, PRESSURE);
	}

	extendStrokeAt(point) {
		this.state.ballpointPen.extendStroke(point.x, point.y, PRESSURE);
	}

	endStrokeAt(point) {
		this.state.ballpointPen.endStroke(point.x, point.y, PRESSURE);
	}

	resetCanvas() {
		this.state.ballpointPen.clear();
	}

	redrawStroke(stroke, shouldFinish) {
		let that = this;
		let points = stroke.points;
		if (points.length > 1) {
			that.startStrokeAt(head(points), stroke.selected ? SELECTED_PEN_COLOR : stroke.color);
			forEach(tail(points), function (point) {
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