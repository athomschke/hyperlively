import React, {Component, PropTypes} from 'react';
import { Slider } from 'reactrangeslider';

'use strict'

let runningTimeout;

export default class TemporaryCallbackSlider extends Component {

	static propTypes = {
		onChange: PropTypes.func,
		temporaryCallback: PropTypes.func,
		max: PropTypes.number,
		value: PropTypes.number,
		timeout: PropTypes.number
	};

	static defaultProps = {
		onChange: () => {},
		temporaryCallback: () => {},
		max: 0,
		value: 0,
		timeout: 1000
	};

	resetState() {
		this.props.temporaryCallback(true);
		runningTimeout = undefined;
	}

	onSliderMove(newValue) {
		this.props.temporaryCallback(false);
		this.props.onChange(Math.min(this.props.max, Math.max(0, newValue)));
		if (runningTimeout) {
			clearTimeout(runningTimeout);
		}
		runningTimeout = setTimeout(this.resetState.bind(this), this.props.timeout)
	}

	onSliderStop() {
		if (runningTimeout) {
			clearTimeout(runningTimeout);
			this.resetState()
		}
	}

	render() {
		return (<Slider ref="slider"
			onChange={this.onSliderMove.bind(this)}
			afterChange={this.onSliderStop.bind(this)}
			disabled={this.props.max <= 0}
			min={0}
			max={this.props.max}
			value={this.props.value}
		/>)
	}

}