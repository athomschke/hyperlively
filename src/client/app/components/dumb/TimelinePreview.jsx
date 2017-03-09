import React, { Component } from 'react';
import { timelinePreview } from 'stylesheets/components/dumb/TimelinePreview.scss';
import SketchTransformer from '../smart/SketchTransformer';
import Point2BoundsScaler from '../smart/Point2BoundsScaler';
import SketchFitter from '../smart/SketchFitter';
import PlainDrawer from '../smart/PlainDrawer';

const Canvas = Point2BoundsScaler(SketchTransformer(SketchFitter(PlainDrawer)));

export default class TimelinePreview extends Component {

	render() {
		return (
			<div className={timelinePreview}>
				<Canvas
					{...this.props}
					finished
					showBorder
				/>
			</div>);
	}

}
