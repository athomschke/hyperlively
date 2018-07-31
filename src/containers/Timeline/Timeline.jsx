// @flow
import * as React from 'react';
import { map, flatten } from 'lodash';

import type { Sketch, Stroke } from 'src/types';
import { TRACK_OFFSET, SLIDER_HEIGHT } from 'src/constants/configuration';

import TimelinePreview from './TimelinePreview';

export type TimelineProps = {
	sketches: Array<Sketch>,
	onSelectStokes: (_strokes: Array<Stroke>) => void,
};

export default class Timeline extends React.PureComponent<TimelineProps> {
	props: TimelineProps;

	node: HTMLDivElement | null

	renderPreview() {
		let offsetIndex = 0;
		return map(this.props.sketches, (sketch, id) => {
			const preview = (
				<TimelinePreview
					{...this.props}
					key={id}
					index={id}
					offsetIndex={offsetIndex}
					strokes={sketch.strokes}
					fittedHeight={SLIDER_HEIGHT}
					previewHeight={SLIDER_HEIGHT - TRACK_OFFSET}
					onSelect={() => this.props.onSelectStokes(sketch.strokes)}
				/>
			);
			const points = flatten(map(sketch.strokes, stroke => stroke.points));
			offsetIndex += points.length;
			return preview;
		});
	}

	render() {
		return (
			<div>
				{this.renderPreview()}
			</div>
		);
	}
}
