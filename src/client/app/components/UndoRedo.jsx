import React, {Component, PropTypes} from 'react';
import TemporaryCallbackSlider from 'components/smart/TemporaryCallbackSlider';

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

	render() {
		return (<div
				style={{
					width: window.innerWidth - 40
				}}
			>
			<TemporaryCallbackSlider ref="slider"
				onChange={this.props.jumpTo}
				temporaryCallback={this.props.togglePloma}
				timeout={this.props.plomaTimeout}
				min={0}
				max={this.props.max}
				value={this.props.value}
			/>
		</div>)
	}

}