import React, {Component} from 'react';
import UndoRedo from 'containers/UndoRedo';
import Ploma from 'containers/Ploma';
import HandwritingRecognition from 'containers/HandwritingRecognition';
import Threshold from 'containers/Threshold';

let getControlStyle = () => {
	return {
		position: 'absolute',
		top: 20,
		left: 20
	};
};

export default class Configuration extends Component {

	render() {
		return (
			<div style={getControlStyle()}>
				<UndoRedo />
				<Threshold />
				<Ploma
					label={'Use Ploma'}
				/>
				<HandwritingRecognition
					label={'Use Handwriting Recognition'}
				/>
			</div>
		);
	}
}