import { connect } from 'react-redux';

import actions from 'src/client/app/actions/actions';
import Interpreter from 'src/client/app/components/smart/Interpreter';

const mapStateToProps = (state) => {
	const returnState = {};
	returnState.handwritingRecognitionEnabled = state.handwritingRecognition;
	returnState.showInterpreter = state.interpretation.showInterpreter;
	returnState.interpretations = state.interpretation.interpretations;
	return returnState;
};

const mapDispatchToProps = dispatch => ({
	performAction: (actionName, ...args) => {
		if (actions[actionName]) {
			dispatch(actions.setObserveMutations(false));
			dispatch(actions[actionName](...args));
			dispatch(actions.setObserveMutations(true));
		}
	},
	onInterpretationDone: (bool) => {
		dispatch(actions.toggleInterpreter(bool));
	},
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Interpreter);
