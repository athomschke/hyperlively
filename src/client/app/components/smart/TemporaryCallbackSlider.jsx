import React, {Component, PropTypes} from 'react';
import { Slider } from 'reactrangeslider';

'use strict'

let runningTimeout;

let disableFunction = null;

export default class TemporaryCallbackSlider extends Component {

	static propTypes = {
		onChange: PropTypes.func,
		temporaryCallback: PropTypes.func,
		callbackEnabled: PropTypes.bool,
		max: PropTypes.number,
		value: PropTypes.number,
		timeout: PropTypes.number
	};

	static defaultProps = {
		onChange: () => {},
		temporaryCallback: () => {},
		callbackEnabled: false,
		max: 0,
		value: 0,
		timeout: 1000
	};

	resetState(boundDisableFunction) {
		boundDisableFunction(true);
		runningTimeout = undefined;
		disableFunction = null;
	}

	onSliderMove(newValue) {
		if (this.props.callbackEnabled && !disableFunction) {
			this.props.temporaryCallback(false);
			disableFunction = this.props.temporaryCallback.bind(this, true);
		}
		if (runningTimeout) {
			clearTimeout(runningTimeout);
		}
		if (disableFunction) {
			runningTimeout = setTimeout(this.resetState.bind(this, disableFunction), this.props.timeout)
		}
		this.props.onChange(Math.min(this.props.max, Math.max(0, newValue)));
	}

	onSliderStop() {
		if (runningTimeout) {
			clearTimeout(runningTimeout);
			this.resetState(disableFunction);
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