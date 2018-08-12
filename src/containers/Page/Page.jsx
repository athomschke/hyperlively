// @flow
import * as React from 'react';
import { filter, flatten, map } from 'lodash';

import Scene from 'src/containers/Scene';
import UndoRedo from 'src/containers/UndoRedo';
import Timeline from 'src/containers/Timeline';
import Ploma from 'src/containers/Ploma';
import ShowInterpreter from 'src/containers/ShowInterpreter';
import Threshold from 'src/containers/Threshold';
import Window from 'src/containers/Window';
import AppConfiguration from 'src/containers/AppConfiguration';
import HandwritingRecognitionTrigger from 'src/containers/HandwritingRecognitionTrigger';
import InterpretationChooser from 'src/containers/InterpretationChooser';
import type { Sketch, Stroke } from 'src/types';

export type PageProps = {
	sketches: Array<Sketch>,
	showInterpreter: boolean,
};
export const getSelectedStrokes = (sketches: Array<Sketch>) => filter(flatten(map(sketches, 'strokes')), 'selected');

const renderInterpreter = (selectedStrokes: Array<Stroke>, sketches: Array<Sketch>) => (
	<InterpretationChooser
		selectedStrokes={selectedStrokes}
		sketches={sketches}
	/>
);

const Page = (props: PageProps) => {
	const selectedStrokes = getSelectedStrokes(props.sketches);
	return (
		<div>
			<Scene sketches={props.sketches} />
			<Window sketches={props.sketches} />
			{props.showInterpreter ? renderInterpreter(selectedStrokes, props.sketches) : null}
			<AppConfiguration>
				<Timeline />
				<UndoRedo />
				<Threshold />
				<Ploma />
				<ShowInterpreter />
				<HandwritingRecognitionTrigger sketches={props.sketches} />
			</AppConfiguration>
		</div>
	);
};

export default Page;
