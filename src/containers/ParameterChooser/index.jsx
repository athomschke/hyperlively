// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';
import { collapseParametersPath, checkParametersPath } from 'src/actionCreators';

import ParameterChooser, { type ParameterChooserStateProps, type ParameterChooserDispatchProps } from './ParameterChooser';

const mapStateToProps = (state: HyperlivelyState): ParameterChooserStateProps => ({
	expandedPaths: state.ui.parameters.expandedPath,
	checkedPaths: state.ui.parameters.checkedPath,
});

const mapDispatchToProps = (dispatch): ParameterChooserDispatchProps => ({
	onExpandedPathsChange: expandedPath => dispatch(collapseParametersPath(expandedPath)),
	onCheckedPathsChange: checkedPath => dispatch(checkParametersPath(checkedPath)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ParameterChooser);
