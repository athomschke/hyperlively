// @flow
import React, { Component, PropTypes } from 'react';
import { getFittedWidth, scaleToTime } from 'helpers/scalingPointsToBounds';

export default Wrapped => class extends Component {

	static propTypes = {
		strokes: PropTypes.arrayOf(PropTypes.object),
		sliderWidth: PropTypes.number,
		previewHeight: PropTypes.number,
		max: PropTypes.number,
	};

	static defaultProps = {
		strokes: [],
		sliderWidth: 0,
		previewHeight: 0,
		max: 0,
	};

	render() {
		const fittedWidth = getFittedWidth(this.props.strokes, this.props.sliderWidth, this.props.max);
		const strokes = scaleToTime(this.props.strokes, fittedWidth, this.props.previewHeight);
		return (<Wrapped
			{...this.props}
			strokes={strokes}
			fittedWidth={fittedWidth}
			finished
			showBorder
		/>);
	}

};
