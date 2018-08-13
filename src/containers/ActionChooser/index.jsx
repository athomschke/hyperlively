// @flow
import { connect } from 'react-redux';

import type { HyperlivelyState } from 'src/types';
import { collapseActionsPath, checkActionsPath, chooseFunctions } from 'src/actionCreators';

import ActionChooser, { type ActionChooserStateProps } from './ActionChooser';

const mapStateToProps = (state: HyperlivelyState): ActionChooserStateProps => ({
	expandedPaths: state.ui.actions.expandedPath,
	specificActions: state.data.specificActions,
	selectedActions: state.ui.interpretations.functions,
});

const mapDispatchToProps = dispatch => ({
	onExpandedPathsChange: collapsedPath => dispatch(collapseActionsPath(collapsedPath)),
	onSelect: checkedPath => dispatch(checkActionsPath(checkedPath)),
	onFunctionsChoose: functions => dispatch(chooseFunctions(functions)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ActionChooser);
