import { jumpTo } from 'actions/timetravel';
import { connect } from 'react-redux';
import UndoRedo from 'components/dumb/UndoRedo';
import SketchCombiner from 'components/smart/SketchCombiner';
import { togglePloma, setObserveMutations } from 'actions/configuring';
import UNDO_TIMEOUT from 'constants/canvas';
import { last, concat } from 'lodash';
import relevantStatesForScene from 'helpers/relevantStatesForScene';

const mapStateToProps = (state, ownProps) => {
	let returnProps = {};
	let pastStatesInScene = relevantStatesForScene(state.content.undoableScenes.past, state.content.sceneIndex);
	let futureStatesInScene = relevantStatesForScene(state.content.undoableScenes.future, state.content.sceneIndex);
	let max = pastStatesInScene.length + futureStatesInScene.length;
	Object.assign(returnProps, ownProps, {
		max:  max,
		disabled: max <= 0,
		value: pastStatesInScene.length,
		callbackEnabled: state.ploma.usePloma,
		timeout: UNDO_TIMEOUT,
		scene: last(concat(pastStatesInScene, [state.content.undoableScenes.present], futureStatesInScene))[state.content.sceneIndex]
	});
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