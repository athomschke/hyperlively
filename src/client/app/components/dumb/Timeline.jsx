import React, {Component, PropTypes} from 'react';
import TimelinePreview from 'components/dumb/TimelinePreview';
import { Slider } from 'reactrangeslider';
import { map, flatten } from 'lodash';

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

	getStyle() {
		return {
			track: {
				backgroundColor: 'rgba(0,0,0,0)',
				borderRadius: 3,
				height: this.getTrackHeight()
			},
			handle: {
				backgroundColor: 'rgba(0,0,0,0)',
				borderRadius: 3,
				height: this.props.sliderHeight
			},
			wrapper: {
				height: this.props.sliderHeight
			}
		};
	}

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
			<div ref="previewContainer" style={this.getStyle().preview}>
				{this.renderPreview()}
			</div>
			<Slider ref="slider" {...this.props}
				disabled={this.props.max <= 0}
				min={0}
				trackStyle={this.getStyle().track}
				handleStyle={this.getStyle().handle}
				wrapperStyle={this.getStyle().wrapper}
			/>
		</div>);
	}

}