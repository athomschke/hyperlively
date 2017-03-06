import Slider from 'rc-slider';
import React, { Component, PropTypes } from 'react';
import { rcSlider } from 'stylesheets/components/dumb/Threshold';
import { MIN_THRESHOLD, MAX_THRESHOLD } from 'constants/drawing';

export default class Threshold extends Component {

	static propTypes = {
		threshold: PropTypes.number,
		onChange: PropTypes.func,
	};

	static defaultProps = {
		threshold: 0,
		onChange: () => {},
	};

	render() {
		return (<Slider
			ref='slider'
			className={rcSlider}
			value={Math.min(MAX_THRESHOLD, Math.max(MIN_THRESHOLD, this.props.threshold))}
			max={MAX_THRESHOLD}
			min={MIN_THRESHOLD}
			onChange={this.props.onChange}
			tipFormatter={null}
		/>);
	}

}
