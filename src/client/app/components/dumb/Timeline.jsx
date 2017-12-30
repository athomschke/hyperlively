// @flow
import React, { PureComponent } from 'react';
import Slider from 'rc-slider';
import { map, flatten } from 'lodash';

import { rcSlider } from 'stylesheets/components/dumb/Timeline.scss';
import type { Sketch } from 'typeDefinitions';

import TimelinePreview from './TimelinePreview';

type Props = {
	sliderHeight: number,
	trackOffset: number,
	sketches: Array<Sketch>,
};

export default class Timeline extends PureComponent<Props> {
	static defaultProps = {
		sliderHeight: 0,
		trackOffset: 20,
		sketches: [],
	};

	props: Props;

	calculateTrackHeight() {
		return this.props.sliderHeight - this.props.trackOffset;
	}

	renderPreview() {
		let offsetIndex = 0;
		return map(this.props.sketches, (sketch, id) => {
			const preview = (<TimelinePreview
				{...this.props}
				key={id}
				index={id}
				offsetIndex={offsetIndex}
				strokes={sketch.strokes}
				fittedHeight={this.props.sliderHeight}
				previewHeight={this.calculateTrackHeight()}
			/>);
			const points = flatten(map(sketch.strokes, stroke => stroke.points));
			offsetIndex += points.length;
			return preview;
		});
	}

	render() {
		return (<div>
			<div>
				{this.renderPreview()}
			</div>
			<Slider
				{...this.props}
				min={0}
				className={rcSlider}
				tipFormatter={null}
			/>
		</div>);
	}

}
