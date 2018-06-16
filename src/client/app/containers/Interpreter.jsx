// @flow
import { connect } from 'react-redux';

import * as actionCreators from 'src/client/app/actionCreators';
import Interpreter from 'src/client/app/components/smart/Interpreter';

const mapStateToProps = (state) => {
	const returnState = {};
	returnState.handwritingRecognitionEnabled = state.handwritingRecognition;
	returnState.showInterpreter = state.interpretation.showInterpreter;
	returnState.interpretations = state.interpretation.interpretations;
	returnState.setInterval = setInterval;
	returnState.clearInterval = clearInterval;
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
