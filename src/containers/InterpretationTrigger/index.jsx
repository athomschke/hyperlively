// @flow
import { connect } from 'react-redux';

import * as actionCreators from 'src/actionCreators';
import type { HyperlivelyState } from 'src/types';

import InterpretationTrigger from './InterpretationTrigger';

const mapStateToProps = (state: HyperlivelyState) => ({
	handwritingRecognitionEnabled: state.ui.handwritingRecognition,
	showInterpreter: state.ui.showInterpreter,
	interpretation: state.data.interpretation,
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
	onInterpretationDone: () => {},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationTrigger);
