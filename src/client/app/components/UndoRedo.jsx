import React, {Component, PropTypes} from 'react';
import ReactSlider from 'react-slider';

'use strict'

export default class UndoRedo extends Component {

	static propTypes = {
		jumpToPast: PropTypes.func,
		jumpToFuture: PropTypes.func,
		max: PropTypes.number,
		value: PropTypes.number
	};

	static defaultProps = {
		jumpToPast: () => {},
		jumpToFuture: () => {},
		max: 0,
		value: 0
	};

	onUndoClick() {
		debugger
		this.props.jumpToPast(this.props.value-1);
	};

	onRedoClick() {
		this.props.jumpToFuture(1);
	};

	onSliderMove(newValue) {
		let oldValue = this.props.value;
		let direction
		if (newValue < oldValue) {
			return this.props.jumpToPast(newValue);
		} else if (newValue > oldValue) {
			return this.props.jumpToFuture(newValue - oldValue);
		}
	}

	render() {
		let canUndo = this.props.value > 0;
		let canRedo = this.props.value < this.props.max;
		return (<div>
			<button ref="undo"
				onClick={this.onUndoClick.bind(this)}
				disabled={!canUndo}
			>Undo</button>
			<ReactSlider ref="slider"
				onChange={this.onSliderMove.bind(this)}
				disabled={!canUndo && !canRedo}
				min={0}
				max={this.props.max}
				value={this.props.value}
			></ReactSlider>
			<button ref="redo"
				onClick={this.onRedoClick.bind(this)}
				disabled={!canRedo}
			>Redo</button>
		</div>)
	}

}