import { jumpTo } from 'actions/timetravel';
import { connect } from 'react-redux';
import UndoRedo from 'components/dumb/UndoRedo';
import SketchCombiner from 'components/smart/SketchCombiner';
import { togglePloma, setObserveMutations } from 'actions/configuring';
import UNDO_TIMEOUT from 'constants/canvas';
import { reduce, isEqual } from 'lodash';

const relevantStatesForScene = (states, sceneIndex) => {
	let length = 0;
	reduce(states, (previousState, state) => {
		if (state[sceneIndex] && !isEqual(state[sceneIndex], previousState[sceneIndex])){
			length += 1;
		}
		return state;
	}, new Array(sceneIndex).fill(undefined));
	return length;
};

const mapStateToProps = (state, ownProps) => {
	let returnProps = {};
	let pastStatesInScene = relevantStatesForScene(state.content.undoableScenes.past, ownProps.sceneIndex);
	let futureStatesInScene = relevantStatesForScene(state.content.undoableScenes.future, ownProps.sceneIndex);
	Object.assign(returnProps, {
		max:  pastStatesInScene + futureStatesInScene,
		value: pastStatesInScene,
		callbackEnabled: state.ploma.usePloma,
		timeout: UNDO_TIMEOUT,
		scene: ownProps.scene
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