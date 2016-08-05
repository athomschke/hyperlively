import React, {Component, PropTypes} from 'react';
import TemporaryCallbackSlider from 'components/smart/TemporaryCallbackSlider';

'use strict'

export default class UndoRedo extends Component {

	render() {
		return (<div
				style={{
					width: window.innerWidth - 40
				}}
			>
			<TemporaryCallbackSlider ref="slider" {...this.props}/>
		</div>)
	}

}