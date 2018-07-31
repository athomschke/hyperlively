// @flow
import * as React from 'react';
import {
	last, filter, flatten, map,
} from 'lodash';

import InterpretationTrigger from 'src/containers/InterpretationTrigger';
import Interpreter from 'src/containers/Interpreter';
import Scene from 'src/containers/Scene';
import UndoRedo from 'src/containers/UndoRedo';
import Timeline from 'src/containers/Timeline';
import Ploma from 'src/containers/Ploma';
import ShowInterpreter from 'src/containers/ShowInterpreter';
import Threshold from 'src/containers/Threshold';
import Window from 'src/containers/Window';
import AppConfiguration from 'src/containers/AppConfiguration';
import ParameterChooser from 'src/containers/ParameterChooser';
import InterpretationDisplay from 'src/containers/InterpretationDisplay';
import type { Sketch, Stroke } from 'src/types';

export type PageProps = {
	sketches: Array<Sketch>,
	showInterpreter: boolean,
};
export const getSelectedStrokes = (sketches: Array<Sketch>) => filter(flatten(map(sketches, 'strokes')), 'selected');

const renderInterpreter = (selectedStrokes: Array<Stroke>, lastStrokes: Array<Stroke>) => (
	<Interpreter>
		<InterpretationDisplay />
		<ParameterChooser
			lastStrokes={lastStrokes}
			selectedStrokes={selectedStrokes}
		/>
	</Interpreter>
);

const Page = (props: PageProps) => {
	const selectedStrokes = getSelectedStrokes(props.sketches);
	const lastSketch = last(props.sketches);
	const lastStrokes = lastSketch ? lastSketch.strokes : [];
	return (
		<div>
			<Scene sketches={props.sketches} />
			<Window sketches={props.sketches} />
			{props.showInterpreter ? renderInterpreter(selectedStrokes, lastStrokes) : null}
			<AppConfiguration>
				<UndoRedo />
				<Timeline />
				<Threshold />
				<Ploma />
				<ShowInterpreter />
				<InterpretationTrigger sketches={props.sketches} />
			</AppConfiguration>
		</div>
	);
};

export default Page;
