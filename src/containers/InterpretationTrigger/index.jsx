// @flow
import { connect } from 'react-redux';

import * as actionCreators from 'src/actionCreators';
import type { HyperlivelyState, Parameters } from 'src/types';

import InterpretationTrigger from './InterpretationTrigger';

const mapStateToProps = (state: HyperlivelyState) => ({
	handwritingRecognitionEnabled: state.ui.handwritingRecognition,
	showInterpreter: state.ui.showInterpreter,
	interpretation: state.data.interpretation,
	functions: state.ui.interpretations.functions,
	parameters: state.ui.interpretations.parameters,
	setInterval: setInterval.bind(window),
	clearInterval: clearInterval.bind(window),
	specificActions: state.data.specificActions,
});

const mapDispatchToProps = dispatch => ({
	performAction: (actionName: string, ...parameters: Parameters) => {
		if (actionCreators[actionName]) {
			dispatch(actionCreators.setObserveMutations(false));
			dispatch(actionCreators[actionName](...parameters.map(parameter => parameter.value)));
			dispatch(actionCreators.setObserveMutations(true));
		}
	},
	onInterpretationDone: (isSingleExecutionInterpretation: boolean, label?: string, actions?: string[]) => {
		if (isSingleExecutionInterpretation) {
			if (label && actions) {
				dispatch(actionCreators.storeInterpretation(label, actions));
			}
			dispatch(actionCreators.checkParametersPath([]));
			dispatch(actionCreators.chooseFunctions([]));
			dispatch(actionCreators.checkActionsPath([]));
			dispatch(actionCreators.chooseParameters([]));
		}
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationTrigger);
