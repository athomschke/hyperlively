// @flow
import * as React from 'react';

import style from 'src/client/app/stylesheets/components/dumb/TimelinePreview.scss';

import TimelineCanvas, { type TimelineCanvasProps } from './TimelineCanvas';

type TimelinePreviewProps<P> = P & {
	onSelect: () => void;
};

export default function TimelinePreview(props: TimelinePreviewProps<any>) {
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
}
