// @flow
import { connect } from 'react-redux';

import SketchCombiner from 'src/client/app/components/SketchCombiner';
import { togglePloma, setObserveMutations, jumpTo } from 'src/client/app/actionCreators';
import { UNDO_TIMEOUT } from 'src/client/app/constants/canvas';
import type { HyperlivelyState } from 'src/client/app/types';

import UndoRedo from './UndoRedo';

const mapStateToProps = (state: HyperlivelyState) => ({
	disabled: (state.data.scenes.past.length + state.data.scenes.future.length)
		<= 0,
	max: state.data.scenes.past.length + state.data.scenes.future.length,
	value: state.data.scenes.past.length,
	callbackEnabled: state.ui.ploma.usePloma,
	timeout: UNDO_TIMEOUT,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChange: (value) => {
		dispatch(setObserveMutations(false));
		dispatch(jumpTo(value, ownProps.sceneIndex));
		dispatch(setObserveMutations(true));
	},
	temporaryCallback: bool => dispatch(togglePloma(bool)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SketchCombiner(UndoRedo));
