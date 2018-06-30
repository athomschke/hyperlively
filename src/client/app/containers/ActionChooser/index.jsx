// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/client/app/types';
import { collapseActionsPath, checkActionsPath, chooseFunctions } from 'src/client/app/actionCreators';

import ActionChooser from './ActionChooser';

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
