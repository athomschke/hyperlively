// @flow
import React, { Component, PropTypes } from 'react';
import { cloneDeep } from 'lodash';
import { offsetToOrigin, getOffsetForTime } from 'helpers/sketchFitting';

export default Wrapped => class extends Component {

	static propTypes = {
		index: PropTypes.number,
		sliderWidth: PropTypes.number,
		max: PropTypes.number,
		sliderHeight: PropTypes.number,
		offsetIndex: PropTypes.number,
		bounds: PropTypes.objectOf(PropTypes.number).isRequired,
		fittedWidth: PropTypes.number.isRequired,
		previewHeight: PropTypes.number.isRequired,
		strokes: PropTypes.arrayOf(PropTypes.object).isRequired,
	};

	static defaultProps = {
		index: 0,
		sliderWidth: 0,
		max: 0,
		sliderHeight: 0,
		offsetIndex: 0,
	};

	render() {
		const clonedBounds = cloneDeep(this.props.bounds);
		clonedBounds.width = this.props.fittedWidth;
		clonedBounds.height = this.props.previewHeight;
		const moveBy = offsetToOrigin(this.props.strokes);
		const top = -moveBy.y + ((this.props.sliderHeight - this.props.previewHeight) / 2);
		const left = -moveBy.x + getOffsetForTime(
				this.props.strokes, this.props.sliderWidth, this.props.max, this.props.offsetIndex);
		return (
			<div
				key={this.props.index}
				style={{
					position: 'absolute',
					top,
					left,
				}}
			>
				<Wrapped
					{...this.props}
					bounds={clonedBounds}
				/>
			</div>);
	}

};
