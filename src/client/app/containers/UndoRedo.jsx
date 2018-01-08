import { connect } from 'react-redux';
import { last, concat } from 'lodash';

import UndoRedo from 'src/client/app/components/dumb/UndoRedo';
import SketchCombiner from 'src/client/app/components/hoc/SketchCombiner';
import { togglePloma, setObserveMutations, jumpTo } from 'src/client/app/actions/configuring';
import { select } from 'src/client/app/actions/manipulating';
import UNDO_TIMEOUT from 'src/client/app/constants/canvas';
import relevantStatesForScene from 'src/client/app/helpers/relevantStatesForScene';
import type { Stroke } from 'src/client/app/typeDefinitions';

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
	onSelectStokes: (strokes: Array<Stroke>) => {
		dispatch(select(strokes));
	},
	temporaryCallback: bool => dispatch(togglePloma(bool)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SketchCombiner(UndoRedo));
