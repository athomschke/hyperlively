import React, {Component, PropTypes} from 'react';
import TemporaryCallbackSlider from 'components/smart/TemporaryCallbackSlider';

'use strict'

export default class UndoRedo extends Component {

	static propTypes = {
		temporaryCallback: PropTypes.func,
		usePloma: PropTypes.bool
	};

	static defaultProps = {
		temporaryCallback: () => {},
		usePloma: false
	};

	render() {
		return (<div
				style={{
					width: window.innerWidth - 40
				}}
			>
			<TemporaryCallbackSlider ref="slider" {...this.props}
				temporaryCallback={this.props.usePloma ? this.props.temporaryCallback : () => {}}
			/>
		</div>)
	}

}