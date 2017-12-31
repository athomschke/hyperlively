// @flow
import Slider from 'rc-slider';
import React, { PureComponent } from 'react';

import { rcSlider } from 'src/client/app/stylesheets/components/dumb/Threshold.scss';
import { MIN_THRESHOLD, MAX_THRESHOLD } from 'src/client/app/constants/drawing';

type Props = {
	threshold: number;
	onChange: (_newThreshold: number) => void;
};

export default class Threshold extends PureComponent<Props> {
	static defaultProps = {
		threshold: 0,
		onChange: () => {},
	};

	props: Props;

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
