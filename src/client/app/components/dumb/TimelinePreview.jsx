import React, { Component, PropTypes } from 'react';
import SketchTransformer from 'components/smart/SketchTransformer';
import Point2BoundsScaler from 'components/smart/Point2BoundsScaler';
import SketchFitter from 'components/smart/SketchFitter';
import PlainDrawer from 'components/smart/PlainDrawer';

let Canvas = Point2BoundsScaler(SketchTransformer(SketchFitter(PlainDrawer)));

export default class TimelinePreview extends Component {

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

	render() {
		return (<div ref='canvas'
			style={{
				pointerEvents: 'none'
			}}
		><Canvas {...this.props}
			finished={true}
			showBorder={true}
		/></div>);
	}

}