import { connect } from 'react-redux';
import UndoRedo from 'components/dumb/UndoRedo';
import SketchCombiner from 'components/smart/SketchCombiner';
import { togglePloma, setObserveMutations, jumpTo } from 'actions/configuring';
import UNDO_TIMEOUT from 'constants/canvas';
import { last, concat } from 'lodash';
import relevantStatesForScene from 'helpers/relevantStatesForScene';

const mapStateToProps = (state, ownProps) => {
	const returnProps = {};
	const pastStatesInScene = relevantStatesForScene(
			state.content.undoableScenes.past,
			state.content.sceneIndex);
	const futureStatesInScene = relevantStatesForScene(
			state.content.undoableScenes.future,
			state.content.sceneIndex);
	const max = pastStatesInScene.length + futureStatesInScene.length;
	const allStatesInScene = concat(
			pastStatesInScene,
			[state.content.undoableScenes.present],
			futureStatesInScene);
	Object.assign(returnProps, ownProps, {
		max,
		disabled: max <= 0,
		value: pastStatesInScene.length,
		callbackEnabled: state.ploma.usePloma,
		timeout: UNDO_TIMEOUT,
		scene: last(allStatesInScene)[state.content.sceneIndex],
	});
	return returnProps;
};

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
