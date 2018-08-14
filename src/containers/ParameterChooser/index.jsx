// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';
import { collapseParametersPath, checkParametersPath } from 'src/actionCreators';

import ParameterChooser, { type ParameterChooserStateProps, type ParameterChooserDispatchProps } from './ParameterChooser';

const mapStateToProps = (state: HyperlivelyState): ParameterChooserStateProps => ({
	expandedPaths: state.ui.parameters.expandedPath,
});

const mapDispatchToProps = (dispatch): ParameterChooserDispatchProps => ({
	onExpandedPathsChange: expandedPath => dispatch(collapseParametersPath(expandedPath)),
	onSelect: selectedPaths => dispatch(checkParametersPath(selectedPaths)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ParameterChooser);
