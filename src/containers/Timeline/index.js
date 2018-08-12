import * as React from 'react';
import { connect } from 'react-redux';
import { last } from 'lodash';

import { select } from 'src/actionCreators';
import type { HyperlivelyState, Stroke } from 'src/types';
import SketchCombiner, { type SketchCombinerProps } from 'src/decorators/SketchCombiner';
import TimeoutBehavior, { type TimeoutBehaviorProps } from 'src/decorators/TimeoutBehavior';
import HTMLWidth, { type HTMLWidthProps } from 'src/decorators/HTMLWidth';

import Timeline, { type TimelineProps } from './Timeline';

type HyperlivelyTimelineProps =
HTMLWidthProps<TimeoutBehaviorProps<SketchCombinerProps<TimelineProps>>>

const HyperlivelyTimeline: React.ComponentType<HyperlivelyTimelineProps> = HTMLWidth(TimeoutBehavior(SketchCombiner(Timeline)));

const mapStateToProps = (state: HyperlivelyState) => {
	const addStrokePoints = (count, stroke) => count + stroke.points.length;
	const addScenePoints = (count, scene) => count + scene.strokes.reduce(addStrokePoints, 0);
	const lastScenes = last([
		state.data.scenes.present,
		...state.data.scenes.future,
	]);
	const max = lastScenes.reduce(addScenePoints, 0);
	const strokes = lastScenes[state.data.sceneIndex] ? lastScenes[state.data.sceneIndex].strokes : [];
	const threshold = state.ui.threshold;

	const width = window.innerWidth;
	const height = window.innerHeight;

	return {
		max,
		strokes,
		threshold,
		width,
		height,
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
