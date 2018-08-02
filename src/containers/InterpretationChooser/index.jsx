// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';
import { collapseParametersPath, checkParametersPath, chooseParameters } from 'src/actionCreators';

import InterpretationChooser, { type InterpretationChooserStateProps, type InterpretationChooserDispatchProps } from './InterpretationChooser';

const mapStateToProps = (state: HyperlivelyState): InterpretationChooserStateProps => ({
	strokes: state.data.scenes.present.length > state.data.sceneIndex ? state.data.scenes.present[state.data.sceneIndex].strokes : [],
	expandedPaths: state.ui.parameters.expandedPath,
	checkedPaths: state.ui.parameters.checkedPath,
	interpretation: state.data.interpretation,
	selectedParameters: state.ui.interpretations.parameters,
});

const mapDispatchToProps = (dispatch): InterpretationChooserDispatchProps => ({
	onExpandedPathsChange: expandedPath => dispatch(collapseParametersPath(expandedPath)),
	onCheckedPathsChange: checkedPath => dispatch(checkParametersPath(checkedPath)),
	onParameterChoose: functions => dispatch(chooseParameters(functions)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InterpretationChooser);