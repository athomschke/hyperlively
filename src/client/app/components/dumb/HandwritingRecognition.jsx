import React, { Component } from 'react';
import LabelledBox from 'components/dumb/LabelledBox';

'use strict';

export default class HandwritingRecognition extends Component {

	render() {
		return (<LabelledBox {...this.props}
			label={'Use Handwriting Recognition'}
		/>);
	}

}