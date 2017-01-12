import React, { Component, PropTypes } from 'react';
import { map, flatten, cloneDeep, forEach } from 'lodash';

export default (Wrapped) => class extends Component {

	static propTypes = {
		strokes: PropTypes.array,
		sliderWidth: PropTypes.number,
		previewHeight: PropTypes.number,
		max: PropTypes.number
	};

	static defaultProps = {
		strokes: [],
		sliderWidth: 0,
		previewHeight: 0,
		max: 0
	};

	getFittedWidth(strokes, sliderWidth, max) {
		if (max > 0) {
			return (sliderWidth * flatten(map(strokes, 'points')).length) / max;
		} else {
			return 0;
		}		
	}

	scaleToTime(strokes, width, height) {
		let points = flatten(map(strokes, 'points'));
		let maxX = Math.max.apply(this, map(points, 'x'));
		let minX = Math.min.apply(this, map(points, 'x'));
		let maxY = Math.max.apply(this, map(points, 'y'));
		let minY = Math.min.apply(this, map(points, 'y'));
		let scale = 1;
		scale = Math.min(scale, width/(maxX - minX));
		scale = Math.min(scale, height/(maxY - minY));
		if (scale < 1) {
			let clonedStrokes = cloneDeep(strokes);
			forEach(clonedStrokes, (clonedStroke) => {
				forEach(clonedStroke.points, (point) => {
					point.x = point.x * scale;
					point.y = point.y * scale;
				});
			});
			return clonedStrokes;
		} else {
			return strokes;
		}
	}

	render() {
		let fittedWidth = this.getFittedWidth(this.props.strokes, this.props.sliderWidth, this.props.max);
		let strokes = this.scaleToTime(this.props.strokes, fittedWidth, this.props.previewHeight);
		return (<Wrapped {...this.props}
			strokes={strokes}
			fittedWidth={fittedWidth}
			finished={true}
			showBorder={true}
		/>);
	}

};