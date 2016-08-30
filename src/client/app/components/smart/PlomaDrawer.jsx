import { PropTypes } from 'react';
import AbstractDrawer from 'components/smart/AbstractDrawer';
import { last, forEach, head, tail } from 'lodash';
import { PRESSURE } from 'constants/drawing';
import React from 'react';

'use strict';

const Ploma = require('exports?Ploma!base/../libs/ploma');

export default class PlomaDrawer extends AbstractDrawer {

	static propTypes =  Object.assign({}, AbstractDrawer.propTypes, {
		uniqueCanvasFactor: PropTypes.number
	});

	static defaultProps = Object.assign({}, AbstractDrawer.defaultProps, {
		uniqueCanvasFactor: 1
	});

	componentDidMount() {
		let plomaInstance = new Ploma(this.refs.canvas, this.props.uniqueCanvasFactor);
		plomaInstance.setSample(1);
		this.setState({
			plomaInstance: plomaInstance
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
		this.state.plomaInstance.beginStroke(point.x, point.y, PRESSURE);
	}

	extendStrokeAt(point) {
		this.state.plomaInstance.extendStroke(point.x, point.y, PRESSURE);
	}

	endStrokeAt(point) {
		this.state.plomaInstance.endStroke(point.x, point.y, PRESSURE);
	}

	resetCanvas() {
		this.state.plomaInstance.clear();
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