import { PropTypes } from 'react';
import AbstractDrawer from 'components/smart/AbstractDrawer';
import { last, forEach, head, tail, cloneDeep } from 'lodash';
import { PRESSURE } from 'constants/drawing';
import React from 'react';
import { BallpointPen } from 'ploma';

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
			strokes: cloneDeep(this.props.strokes),
			width: this.props.width,
			height: this.props.height
		}, this.redrawEverything.bind(this, last(this.props.strokes) && last(this.props.strokes).finished));
	}

	onStrokeStarted(strokes) {
		this.startStrokeAt(this.lastPointInStrokes(strokes));
	}

	onStrokesExtended(strokes) {
		this.extendStrokeAt(this.lastPointInStrokes(strokes));
	}

	onStrokesEnded(strokes) {
		this.endStrokeAt(this.lastPointInStrokes(strokes));
	}

	startStrokeAt(point) {
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
			that.startStrokeAt(head(points));
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