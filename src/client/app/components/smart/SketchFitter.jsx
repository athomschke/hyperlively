import React, { Component, PropTypes } from 'react';
import { cloneDeep, flatten, map, reduce } from 'lodash';

export default (Wrapped) => class extends Component {
	
	static propTypes = {
		index: PropTypes.number,
		sliderWidth: PropTypes.number,
		max: PropTypes.number,
		bounds: PropTypes.object.isRequired,
		fittedWidth: PropTypes.number.isRequired,
		previewHeight: PropTypes.number.isRequired,
		sliderHeight: PropTypes.number
	};

	static defaultProps = {
		index: 0,
		sliderWidth: 0,
		max: 0,
		sliderHeight: 0
	};

	offsetToOrigin(strokes) {
		let points = flatten(map(strokes, (stroke) => {
			return stroke.points;
		}));
		let minX = reduce(points, (min, point) => {
			return point.x < min ? point.x : min;
		}, points[0].x);
		let minY = reduce(points, (min, point) => {
			return point.y < min ? point.y : min;
		}, points[0].y);
		return {
			x: minX,
			y: minY
		};
	}

	getOffsetForTime(strokes, sliderWidth, max) {
		if (this.props.max > 0 && strokes[0].actionIndex) {
			return (sliderWidth * strokes[0].actionIndex) / max;
		} else {
			return 0;
		}
	}

	render() {
		let clonedBounds = cloneDeep(this.props.bounds);
		clonedBounds.width = this.props.fittedWidth;
		clonedBounds.height = this.props.previewHeight;
		let moveBy = this.offsetToOrigin(this.props.strokes);
		return (<div
				key={this.props.index}
				style={{
					position: 'absolute',
					top: -moveBy.y + ((this.props.sliderHeight - this.props.previewHeight) / 2),
					left: -moveBy.x + this.getOffsetForTime(this.props.strokes, this.props.sliderWidth, this.props.max)
				}}>
				<Wrapped {...this.props}
					bounds = {clonedBounds}
				></Wrapped>
			</div>);
	}

};