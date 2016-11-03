import React, { Component } from 'react';
import LabelledBox from 'components/dumb/LabelledBox';

'use strict';

export default class Ploma extends Component {

	render() {
		return (<LabelledBox {...this.props}
			label={'Use Ploma'}
		/>);
	}

}