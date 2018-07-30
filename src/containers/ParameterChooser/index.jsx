// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';
import { collapseParametersPath, checkParametersPath, chooseParameters } from 'src/actionCreators';

import ParameterChooser, { type ParameterChooserStateProps, type ParameterChooserDispatchProps } from './ParameterChooser';

const mapStateToProps = (state: HyperlivelyState): ParameterChooserStateProps => ({
	strokes: state.data.scenes.present.length > state.data.sceneIndex ? state.data.scenes.present[state.data.sceneIndex].strokes : [],
	expandedPaths: state.ui.parameters.expandedPath,
	checkedPaths: state.ui.parameters.checkedPath,
	interpretation: state.data.interpretation,
	parameters: state.ui.interpretations.parameters,
});

const mapDispatchToProps = (dispatch): ParameterChooserDispatchProps => ({
	onExpandedPathsChange: expandedPath => dispatch(collapseParametersPath(expandedPath)),
	onCheckedPathsChange: checkedPath => dispatch(checkParametersPath(checkedPath)),
	onParameterChoose: functions => dispatch(chooseParameters(functions)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ParameterChooser);
