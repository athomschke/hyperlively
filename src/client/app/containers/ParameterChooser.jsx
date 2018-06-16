// @flow
import { connect } from 'react-redux';

import ParameterChooser from 'src/client/app/components/smart/ParameterChooser';
import type { HyperlivelyState } from 'src/client/app/typeDefinitions';
import { collapseParametersPath, checkParametersPath } from 'src/client/app/actionCreators';

const mapStateToProps = (state: HyperlivelyState) => ({
	collapsedPaths: state.ui.parameters.collapsedPath,
	checkedPaths: state.ui.parameters.checkedPath,
});

const mapDispatchToProps = dispatch => ({
	onCollapsedPathsChange: collapsedPath => dispatch(collapseParametersPath(collapsedPath)),
	onCheckedPathsChange: checkedPath => dispatch(checkParametersPath(checkedPath)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ParameterChooser);
