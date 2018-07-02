import * as React from 'react';
import { connect } from 'react-redux';

import { select } from 'src/client/app/actionCreators';
import type { HyperlivelyState, Stroke } from 'src/client/app/types';
import SketchCombiner, { type SketchCombinerProps } from 'src/client/app/components/SketchCombiner';
import TimeoutBehavior, { type TimeoutBehaviorProps } from 'src/client/app/components/TimeoutBehavior';
import HTMLWidth, { type HTMLWidthProps } from 'src/client/app/components/HTMLWidth';

import Timeline, { type TimelineProps } from './Timeline';

type HyperlivelyTimelineProps =
HTMLWidthProps<TimeoutBehaviorProps<SketchCombinerProps<TimelineProps>>>

const HyperlivelyTimeline: React.ComponentType<HyperlivelyTimelineProps> =
HTMLWidth(TimeoutBehavior(SketchCombiner(Timeline)));

const mapStateToProps = (state: HyperlivelyState) => ({
	max: state.data.scenes.present.reduce(
		(scenesPointCount, scene) => scenesPointCount + scene.strokes.reduce(
			(strokesPointCount, stroke) => strokesPointCount + stroke.points.length,
			0,
		),
		0,
	),
	scene: state.data.scenes.present[state.data.sceneIndex],
	threshold: state.ui.threshold,
});

const mapDispatchToProps = dispatch => ({
	onSelectStokes: (strokes: Array<Stroke>) => {
		dispatch(select(strokes));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(HyperlivelyTimeline);
