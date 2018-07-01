// @flow
import React, { PureComponent } from 'react';
import { map, flatten } from 'lodash';

import type { Sketch, Stroke } from 'src/client/app/types';
import { TRACK_OFFSET, SLIDER_HEIGHT } from 'src/client/app/constants/configuration';

import TimelinePreview from './TimelinePreview';

type Props = {
	sketches: Array<Sketch>,
	onSelectStokes: (_strokes: Array<Stroke>) => void,
};

export default class Timeline extends PureComponent<Props> {
	static defaultProps = {
		sketches: [],
	};

	props: Props;

	node: HTMLDivElement | null

	renderPreview() {
		let offsetIndex = 0;
		return map(this.props.sketches, (sketch, id) => {
			const preview = (<TimelinePreview
				{...this.props}
				key={id}
				index={id}
				offsetIndex={offsetIndex}
				strokes={sketch.strokes}
				fittedHeight={SLIDER_HEIGHT}
				previewHeight={SLIDER_HEIGHT - TRACK_OFFSET}
				onSelect={() => this.props.onSelectStokes(sketch.strokes)}
			/>);
			const points = flatten(map(sketch.strokes, stroke => stroke.points));
			offsetIndex += points.length;
			return preview;
		});
	}

	render() {
		return <div>{this.renderPreview()}</div>;
	}
}
