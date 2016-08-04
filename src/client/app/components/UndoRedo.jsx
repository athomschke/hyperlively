import React, {Component, PropTypes} from 'react';
import { Slider } from 'reactrangeslider';

'use strict'

let runningPlomaTimeout;

export default class UndoRedo extends Component {

	static propTypes = {
		jumpTo: PropTypes.func,
		togglePloma: PropTypes.func,
		max: PropTypes.number,
		value: PropTypes.number,
		width: PropTypes.number,
		usePloma: PropTypes.bool,
		plomaTimeout: PropTypes.number
	};

	static defaultProps = {
		jumpTo: () => {},
		togglePloma: () => {},
		max: 0,
		value: 0,
		width: 100,
		usePloma: false,
		plomaTimeout: 1000
	};

	resetState() {
		this.props.togglePloma(true);
		runningPlomaTimeout = undefined;
	}

	onSliderMove(newValue) {
		let shouldDisablePlomaTemporarily = runningPlomaTimeout || this.props.usePloma;
		shouldDisablePlomaTemporarily && this.props.usePloma && this.props.togglePloma(false);
		let oldValue = this.props.value;
		this.props.jumpTo(newValue);
		if (shouldDisablePlomaTemporarily) {
			clearTimeout(runningPlomaTimeout);
			runningPlomaTimeout = setTimeout(this.resetState.bind(this), this.props.plomaTimeout)
		}
	}

	onSliderStop() {
		if (runningPlomaTimeout) {
			clearTimeout(runningPlomaTimeout);
			this.resetState()
		}
	}

	render() {
		let canUndo = this.props.value > 0;
		let canRedo = this.props.value < this.props.max;
		return (<div
				style={{
					width: window.innerWidth - 40
				}}
			>
			<Slider ref="slider"
				onChange={this.onSliderMove.bind(this)}
				afterChange={this.onSliderStop.bind(this)}
				disabled={!canUndo && !canRedo}
				min={0}
				max={this.props.max}
				value={this.props.value}
			></Slider>
		</div>)
	}

}