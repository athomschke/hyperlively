import { jumpTo } from 'actions/timetravel';
import { connect } from 'react-redux';
import UndoRedo from 'components/dumb/UndoRedo';
import SketchCombiner from 'components/smart/SketchCombiner';
import { togglePloma } from 'actions/configuring';
import UNDO_TIMEOUT from 'constants/canvas';
import { last } from 'lodash';

const mapStateToProps = (state, ownProps) => {
	let returnProps = {};
	Object.assign(returnProps, {
		max: state.undoableScenes.past.length + state.undoableScenes.future.length,
		value: state.undoableScenes.past.length,
		callbackEnabled: state.ploma.usePloma,
		timeout: UNDO_TIMEOUT,
		scene: state.undoableScenes.future.length > 0 ? last(last(state.undoableScenes.future)) : last(state.undoableScenes.present)
	}, ownProps);
	return returnProps;
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChange: (value) => dispatch(jumpTo(value)),
		temporaryCallback: (bool) => dispatch(togglePloma(bool))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SketchCombiner(UndoRedo));