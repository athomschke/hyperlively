// @flow
import React from 'react';

import { timelinePreview } from 'src/client/app/stylesheets/components/dumb/TimelinePreview.scss';
import SketchTransformer from 'src/client/app/components/hoc/SketchTransformer';
import Point2BoundsScaler from 'src/client/app/components/hoc/Point2BoundsScaler';
import SketchFitter from 'src/client/app/components/hoc/SketchFitter';
import PlainDrawer from 'src/client/app/components/smart/PlainDrawer';

const Canvas = Point2BoundsScaler(SketchTransformer(SketchFitter(PlainDrawer)));

export default function TimelinePreview(props: Object) {
	return (
		<div className={timelinePreview}>
			<Canvas
				{...props}
				finished
				showBorder
			/>
		</div>);
}
