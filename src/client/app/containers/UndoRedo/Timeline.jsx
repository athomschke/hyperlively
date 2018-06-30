// @flow
import React, { PureComponent } from 'react';
import Slider from 'rc-slider';
import { map, flatten } from 'lodash';

import type { Sketch, Stroke } from 'src/client/app/types';

import style from './Timeline.scss';
import TimelinePreview from './TimelinePreview';

type Props = {
	sliderHeight: number,
	trackOffset: number,
	sketches: Array<Sketch>,
	onSelectStokes: (_strokes: Array<Stroke>) => void,
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
				onSelect={() => this.props.onSelectStokes(sketch.strokes)}
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
				className={style.rcSlider}
				tipFormatter={null}
			/>
		</div>);
	}
}
