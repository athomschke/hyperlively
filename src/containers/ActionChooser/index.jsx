// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';
import { collapseActionsPath, checkActionsPath, chooseFunctions } from 'src/actionCreators';

import ActionChooser from './ActionChooser';

const mapStateToProps = (state: HyperlivelyState) => ({
	expandedPaths: state.ui.actions.expandedPath,
	checkedPaths: state.ui.actions.checkedPath,
	specificActions: state.data.specificActions,
});

const mapDispatchToProps = dispatch => ({
	onExpandedPathsChange: collapsedPath => dispatch(collapseActionsPath(collapsedPath)),
	onCheckedPathsChange: checkedPath => dispatch(checkActionsPath(checkedPath)),
	onFunctionsChoose: functions => dispatch(chooseFunctions(functions)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ActionChooser);
