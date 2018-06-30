// @flow
import { connect } from 'react-redux';
import { last, concat } from 'lodash';

import UndoRedo from 'src/client/app/components/dumb/UndoRedo';
import SketchCombiner from 'src/client/app/components/hoc/SketchCombiner';
import { togglePloma, setObserveMutations, jumpTo, select } from 'src/client/app/actionCreators';
import { UNDO_TIMEOUT } from 'src/client/app/constants/canvas';
import relevantStatesForScene from 'src/client/app/helpers/relevantStatesForScene';
import type { Stroke, HyperlivelyState } from 'src/client/app/typeDefinitions';

const mapStateToProps = (state: HyperlivelyState, ownProps) => {
	const returnProps = {};
	const pastStatesInScene = relevantStatesForScene(
		state.data.undoableScenes.past,
		state.data.sceneIndex,
	);
	const futureStatesInScene = relevantStatesForScene(
		state.data.undoableScenes.future,
		state.data.sceneIndex,
	);
	const max = pastStatesInScene.length + futureStatesInScene.length;
	const allStatesInScene = concat(
		pastStatesInScene,
		[state.data.undoableScenes.present],
		futureStatesInScene,
	);
	const strokesCount = state.data.undoableScenes.present.reduce(
		(sceneStrokesCount, scene) => sceneStrokesCount + scene.strokes.length,
		0,
	);
	const pointsCount = state.data.undoableScenes.present.reduce(
		(scenesPointCount, scene) => scenesPointCount + scene.strokes.reduce(
			(strokesPointCount, stroke) => strokesPointCount + stroke.points.length,
			0,
		),
		0,
	);
	Object.assign(returnProps, ownProps, {
		max,
		pointsCount,
		strokesCount,
		disabled: max <= 0,
		value: pastStatesInScene.length,
		callbackEnabled: state.ui.ploma.usePloma,
		timeout: UNDO_TIMEOUT,
		scene: last(allStatesInScene)[state.data.sceneIndex],
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
