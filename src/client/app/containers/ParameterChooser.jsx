// @flow
import { connect } from 'react-redux';

import ParameterChooser from 'src/client/app/components/smart/ParameterChooser';
import type { HyperlivelyState } from 'src/client/app/typeDefinitions';
import { collapseParametersPath, checkParametersPath, chooseParameters } from 'src/client/app/actionCreators';

const mapStateToProps = (state: HyperlivelyState) => ({
	collapsedPaths: state.ui.parameters.collapsedPath,
	checkedPaths: state.ui.parameters.checkedPath,
	parameters: state.ui.interpretations.parameters,
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
