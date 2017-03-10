import React from 'react';
import { timelinePreview } from 'stylesheets/components/dumb/TimelinePreview.scss';
import SketchTransformer from '../smart/SketchTransformer';
import Point2BoundsScaler from '../smart/Point2BoundsScaler';
import SketchFitter from '../smart/SketchFitter';
import PlainDrawer from '../smart/PlainDrawer';

const Canvas = Point2BoundsScaler(SketchTransformer(SketchFitter(PlainDrawer)));

export default function TimelinePreview(props) {
	return (
		<div className={timelinePreview}>
			<Canvas
				{...props}
				finished
				showBorder
			/>
		</div>);
}
