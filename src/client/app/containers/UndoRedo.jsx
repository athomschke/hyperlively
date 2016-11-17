import { jumpTo } from 'actions/timetravel';
import { connect } from 'react-redux';
import UndoRedo from 'components/dumb/UndoRedo';
import SketchCombiner from 'components/smart/SketchCombiner';
import { togglePloma, setObserveMutations } from 'actions/configuring';
import UNDO_TIMEOUT from 'constants/canvas';
import { last } from 'lodash';

const mapStateToProps = (state, ownProps) => {
	let returnProps = {};
	Object.assign(returnProps, {
		max: state.content.undoableScenes.past.length + state.content.undoableScenes.future.length,
		value: state.content.undoableScenes.past.length,
		callbackEnabled: state.ploma.usePloma,
		timeout: UNDO_TIMEOUT,
		scene: state.content.undoableScenes.future.length > 0 ? last(last(state.content.undoableScenes.future)) : last(state.content.undoableScenes.present)
	}, ownProps);
	return returnProps;
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChange: (value) => {
			dispatch(setObserveMutations(false));
			dispatch(jumpTo(value));
			dispatch(setObserveMutations(true));
		},
		temporaryCallback: (bool) => dispatch(togglePloma(bool))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SketchCombiner(UndoRedo));