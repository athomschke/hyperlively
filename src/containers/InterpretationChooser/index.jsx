// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';
import referencedStrokes from 'src/containers/referencedStrokes';
import { collapseParametersPath, checkParametersPath, chooseParameters } from 'src/actionCreators';

import InterpretationChooser, { type InterpretationChooserStateProps, type InterpretationChooserDispatchProps } from './InterpretationChooser';

const mapStateToProps = (state: HyperlivelyState): InterpretationChooserStateProps => ({
	strokes: referencedStrokes(state.data.strokes, state.data.scenes.present, state.data.sceneIndex),
	expandedPaths: state.ui.parameters.expandedPath,
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
