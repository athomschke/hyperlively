import React, {Component, PropTypes} from 'react';
import Checkbox from 'components/smart/Checkbox'

'use strict'

export default class Ploma extends Component {

	render() {
		return (
			<div>
				<Checkbox {...this.props}/>
				<span>Use Ploma</span>
			</div>
		)
	}

}