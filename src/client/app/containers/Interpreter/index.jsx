// @flow
import { connect } from 'react-redux';

import * as actionCreators from 'src/client/app/actionCreators';
import type { HyperlivelyState } from 'src/client/app/types';

import Interpreter from './Interpreter';

const mapStateToProps = (state: HyperlivelyState) => ({
	handwritingRecognitionEnabled: state.ui.handwritingRecognition,
	showInterpreter: state.ui.showInterpreter,
	interpretations: state.data.interpretation.interpretations,
	functions: state.ui.interpretations.functions,
	parameters: state.ui.interpretations.parameters,
	setInterval: setInterval.bind(window),
	clearInterval: clearInterval.bind(window),
});

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
