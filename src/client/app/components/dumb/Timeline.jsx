import React, { Component, PropTypes } from 'react';
import Slider from 'rc-slider';
import { map, flatten } from 'lodash';
import TimelinePreview from './TimelinePreview';
import { rcSlider } from 'stylesheets/components/dumb/Timeline';

export default class Timeline extends Component {

	static propTypes = {
		sliderHeight: PropTypes.number,
		trackOffset: PropTypes.number,
		sketches: PropTypes.arrayOf(PropTypes.object),
	};

	static defaultProps = {
		sliderHeight: 0,
		trackOffset: 20,
		sketches: [],
	};

	getTrackHeight() {
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
				previewHeight={this.getTrackHeight()}
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
