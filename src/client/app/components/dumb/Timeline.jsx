import React, {Component, PropTypes} from 'react';
import TimelinePreview from 'components/dumb/TimelinePreview';
import Slider from 'rc-slider';
import { map, flatten } from 'lodash';
import { rcSlider } from 'stylesheets/components/dumb/Timeline';

'use strict';

export default class Timeline extends Component {

	static propTypes = {
		max: PropTypes.number,
		sliderHeight: PropTypes.number,
		trackOffset: PropTypes.number,
		sketches: PropTypes.array
	};

	static defaultProps = {
		max: 0,
		sliderHeight: 0,
		trackOffset: 20,
		sketches: []
	};

	renderPreview() {
		let offsetIndex = 0;
		return map(this.props.sketches, (sketch, id) => {
			let preview = (<TimelinePreview {...this.props}
				key={id}
				index={id}
				offsetIndex={offsetIndex}
				strokes={sketch.strokes}
				fittedHeight={this.props.sliderHeight}
				previewHeight={this.getTrackHeight()}
			/>);
			let points = flatten(map(sketch.strokes, (stroke) => {
				return stroke.points;
			}));
			offsetIndex += points.length;
			return preview;
		});
	}

	getTrackHeight() {
		return this.props.sliderHeight - this.props.trackOffset;
	}

	render() {
		return (<div>
			<div ref="previewContainer" >
				{this.renderPreview()}
			</div>
			<Slider ref="slider" {...this.props}
				min={0}
				className={rcSlider}
				tipFormatter={null}
			/>
		</div>);
	}

}