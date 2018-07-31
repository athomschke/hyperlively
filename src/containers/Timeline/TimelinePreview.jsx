// @flow
import * as React from 'react';

import style from './TimelinePreview.scss';
import TimelineCanvas, { type TimelineCanvasProps } from './TimelineCanvas';

type TimelinePreviewProps<P> = P & {
	onSelect: () => void;
};

const TimelinePreview = (props: TimelinePreviewProps<any>) => {
	const { onSelect, ...rest } = props;

	const timelineCanvasProps: TimelineCanvasProps = {
		...rest,
		onClick: onSelect,
		active: true,
		finished: true,
		showBorder: true,
	};

	return (
		<div className={style.timelinePreview}>
			<TimelineCanvas {...timelineCanvasProps} />
		</div>);
};

export default TimelinePreview;
