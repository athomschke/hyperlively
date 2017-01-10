import { jumpTo } from 'actions/timetravel';
import { connect } from 'react-redux';
import UndoRedo from 'components/dumb/UndoRedo';
import SketchCombiner from 'components/smart/SketchCombiner';
import { togglePloma, setObserveMutations } from 'actions/configuring';
import UNDO_TIMEOUT from 'constants/canvas';
import { reduce, isEqual, fill } from 'lodash';

const relevantStatesForScene = (states, sceneIndex) => {
	let length = 0;
	reduce(states, (previousState, state) => {
		if (state[sceneIndex] && !isEqual(state[sceneIndex], previousState[sceneIndex])){
			length += 1;
		}
		return state;
	}, fill(new Array(sceneIndex), undefined));
	return length;
};

const mapStateToProps = (state, ownProps) => {
	let returnProps = {};
	let pastStatesInScene = relevantStatesForScene(state.content.undoableScenes.past, state.content.sceneIndex);
	let futureStatesInScene = relevantStatesForScene(state.content.undoableScenes.future, state.content.sceneIndex);
	let max = pastStatesInScene + futureStatesInScene;
	Object.assign(returnProps, {
		max:  pastStatesInScene + futureStatesInScene,
		disabled: max <= 0,
		value: pastStatesInScene,
		callbackEnabled: state.ploma.usePloma,
		timeout: UNDO_TIMEOUT,
		scene: ownProps.scene
	}, ownProps);
	return returnProps;
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onChange: (value) => {
			dispatch(setObserveMutations(false));
			dispatch(jumpTo(value, ownProps.sceneIndex));
			dispatch(setObserveMutations(true));
		},
		temporaryCallback: (bool) => dispatch(togglePloma(bool))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SketchCombiner(UndoRedo));