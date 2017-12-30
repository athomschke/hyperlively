// @flow
import Slider from 'rc-slider';
import React, { PureComponent, PropTypes } from 'react';

import { rcSlider } from 'stylesheets/components/dumb/Threshold.scss';
import { MIN_THRESHOLD, MAX_THRESHOLD } from 'constants/drawing';

export default class Threshold extends PureComponent {

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
			className={rcSlider}
			value={Math.min(MAX_THRESHOLD, Math.max(MIN_THRESHOLD, this.props.threshold))}
			max={MAX_THRESHOLD}
			min={MIN_THRESHOLD}
			onChange={this.props.onChange}
			tipFormatter={null}
		/>);
	}

}
