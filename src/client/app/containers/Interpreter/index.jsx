// @flow
import { connect } from 'react-redux';

import * as actionCreators from 'src/client/app/actionCreators';
import type { HyperlivelyState } from 'src/client/app/types';

import Interpreter from './Interpreter';

const mapStateToProps = (state: HyperlivelyState) => {
	const returnState = {};
	returnState.handwritingRecognitionEnabled = state.ui.handwritingRecognition;
	returnState.showInterpreter = state.data.interpretation.showInterpreter;
	returnState.interpretations = state.data.interpretation.interpretations;
	returnState.setInterval = setInterval.bind(window);
	returnState.clearInterval = clearInterval.bind(window);
	return returnState;
};

const mapDispatchToProps = dispatch => ({
	performAction: (actionName, ...args) => {
		if (actionCreators[actionName]) {
			dispatch(actionCreators.setObserveMutations(false));
			dispatch(actionCreators[actionName](...args));
			dispatch(actionCreators.setObserveMutations(true));
		}
	},
	onInterpretationDone: (bool) => {
		dispatch(actionCreators.toggleInterpreter(bool));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Interpreter);
