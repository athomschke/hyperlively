import AbstractDrawer from 'components/smart/AbstractDrawer';
import { without, last, head, tail, reduce, cloneDeep } from 'lodash';
import React from 'react';

'use strict';

export default class PlainDrawer extends AbstractDrawer {

	componentDidMount() {
		this.setState({
			strokes: cloneDeep(this.props.strokes),
			width: this.props.width,
			height: this.props.height
		});
		this.redrawEverything(last(this.props.strokes) && last(this.props.strokes).finished);
	}

	secondToLastPointInStrokes (strokes) {
		let points = last(strokes).points;
		return points[points.length - 2];
	}

	wasFirstPointEdited() {
		return this.props.strokes[0] && this.state.strokes[0] && (this.props.strokes[0].points[0].x !== this.state.strokes[0].points[0].x);
	}

	onStrokesUpdated() {
		if (this.wasFirstPointEdited()) {
			this.redrawEverything(this.props.strokes[0] && this.props.strokes[0].finished);
			this.setState({
				strokes: cloneDeep(this.props.strokes)
			});
		} else {
			return super.onStrokesUpdated();
		}
	}

	onStrokeStarted(strokes) {
		this.startStrokeAt(this.lastPointInStrokes(strokes));
	}

	onStrokesExtended(strokes) {
		this.extendStrokeAt(this.lastPointInStrokes(strokes), this.secondToLastPointInStrokes(strokes));
	}

	onStrokesEnded(strokes) {
		this.endStrokeAt(this.lastPointInStrokes(strokes), this.secondToLastPointInStrokes(strokes));
	}

	extendStrokeAt(point, optPointBefore) {
		if (optPointBefore && (point !== optPointBefore)) {
			let context = this.refs.canvas.getContext('2d');
			context.beginPath();
			context.moveTo(optPointBefore.x, optPointBefore.y);
			context.lineTo(point.x, point.y);
			context.stroke();
			context.closePath();
		}
	}

	endStrokeAt(point, optPointBefore) {
		this.extendStrokeAt(point, optPointBefore);
	}

	resetCanvas() {
		this.refs.canvas.getContext('2d').clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
	}

	redrawStroke(stroke, shouldFinish) {
		let that = this;
		let points = stroke.points;
		if (points.length > 1) {
			that.startStrokeAt(head(points));
			reduce(without(tail(points), last(points)), function (pointBefore, point) {
				that.extendStrokeAt(point, pointBefore);
				return point;
			}, tail(points)[0]);
			if (shouldFinish) {
				that.endStrokeAt(last(points), points[points.length-2]);
			} else {
				that.extendStrokeAt(last(points), points[points.length-2]);
			}
		}
	}
}