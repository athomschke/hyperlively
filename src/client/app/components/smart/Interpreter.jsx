import React, { Component } from 'react';
import { invokeMap, map } from 'lodash';

export default (Wrapped) => class extends Component {

	onTextDetected(candidates) {
		if(invokeMap(map(candidates, 'label'), 'toLowerCase').indexOf('o') >= 0) {
			console.log('circle');
			return 'circle';
		}
	}

	onShapeDetected(candidates) {
		if ( map(candidates, 'label').indexOf('arrow') >= 0) {
			console.log('arrow');
			return 'arrow';
		}
	}

	render() {
		return (<Wrapped {...this.props}
			onTextDetected={this.onTextDetected}
			onShapeDetected={this.onShapeDetected}
		></Wrapped>);
	}
};