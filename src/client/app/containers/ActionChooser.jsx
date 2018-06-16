// @flow
import { connect } from 'react-redux';

import ActionChooser from 'src/client/app/components/smart/ActionChooser';
import type { HyperlivelyState } from 'src/client/app/typeDefinitions';
import { collapseActionsPath, checkActionsPath, chooseFunctions } from 'src/client/app/actionCreators';

const mapStateToProps = (state: HyperlivelyState) => ({
	collapsedPaths: state.ui.actions.collapsedPath,
	checkedPaths: state.ui.actions.checkedPath,
});

const mapDispatchToProps = dispatch => ({
	onCollapsedPathsChange: collapsedPath => dispatch(collapseActionsPath(collapsedPath)),
	onCheckedPathsChange: checkedPath => dispatch(checkActionsPath(checkedPath)),
	onFunctionsChoose: functions => dispatch(chooseFunctions(functions)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ActionChooser);
