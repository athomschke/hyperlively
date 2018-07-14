// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';
import { collapseParametersPath, checkParametersPath, chooseParameters } from 'src/actionCreators';

import ParameterChooser from './ParameterChooser';

const mapStateToProps = (state: HyperlivelyState) => ({
	collapsedPaths: state.ui.parameters.collapsedPath,
	checkedPaths: state.ui.parameters.checkedPath,
	parameters: state.ui.interpretations.parameters,
	interpretation: state.data.interpretation,
});

const mapDispatchToProps = dispatch => ({
	onCollapsedPathsChange: collapsedPath => dispatch(collapseParametersPath(collapsedPath)),
	onCheckedPathsChange: checkedPath => dispatch(checkParametersPath(checkedPath)),
	onParameterChoose: functions => dispatch(chooseParameters(functions)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ParameterChooser);
