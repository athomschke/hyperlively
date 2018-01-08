// @flow
import React from 'react';

import { timelinePreview } from 'src/client/app/stylesheets/components/dumb/TimelinePreview.scss';
import SketchTransformer from 'src/client/app/components/hoc/SketchTransformer';
import Point2BoundsScaler from 'src/client/app/components/hoc/Point2BoundsScaler';
import SketchFitter from 'src/client/app/components/hoc/SketchFitter';
import PlainDrawer from 'src/client/app/components/smart/PlainDrawer';
import ClickHandler from 'src/client/app/components/hoc/ClickHandler';

const Canvas = ClickHandler(Point2BoundsScaler(SketchTransformer(SketchFitter(PlainDrawer))));

type Props = {
	onSelect: () => void;
	[key: string]: any;
};

export default function TimelinePreview(props: Props) {
	const { onSelect } = props;

	return (
		<div className={timelinePreview}>
			<Canvas
				{...props}
				onClick={onSelect}
				active
				finished
				showBorder
			/>
		</div>);
}
