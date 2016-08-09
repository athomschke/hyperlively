import { jumpTo } from 'actions/timetravel';
import { connect } from 'react-redux';
import UndoRedo from 'components/dumb/UndoRedo';
import { togglePloma } from 'actions/configuring';
import UNDO_TIMEOUT from 'constants/canvas';

const mapStateToProps = (state) => {
	return {
		max: state.undoableScenes.past.length + state.undoableScenes.future.length,
		value: state.undoableScenes.past.length,
		callbackEnabled: state.ploma.usePloma,
		timeout: UNDO_TIMEOUT
	};
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
)(UndoRedo);