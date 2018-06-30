import { connect } from 'react-redux';
import { last, concat } from 'lodash';

import { select } from 'src/client/app/actionCreators';
import SketchCombiner from 'src/client/app/components/SketchCombiner';
import type { HyperlivelyState, Stroke } from 'src/client/app/types';
import TimeoutBehavior from 'src/client/app/components/TimeoutBehavior';
import HTMLWidth from 'src/client/app/components/HTMLWidth';

import Timeline from './Timeline';

const HyperlivelyTimeline = HTMLWidth(TimeoutBehavior(SketchCombiner(Timeline)));

const mapStateToProps = (state: HyperlivelyState) => {
	const pastStatesInScene = state.data.undoableScenes.past;
	const futureStatesInScene = state.data.undoableScenes.future;
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
	return {
		max,
		pointsCount,
		strokesCount,
		scene: last(allStatesInScene)[state.data.sceneIndex],
		threshold: state.ui.threshold,
		sliderHeight: 80,
	};
};

const mapDispatchToProps = dispatch => ({
	onSelectStokes: (strokes: Array<Stroke>) => {
		dispatch(select(strokes));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(HyperlivelyTimeline);
