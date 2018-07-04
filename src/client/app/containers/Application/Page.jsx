// @flow
import * as React from 'react';
import { last, filter, flatten, map } from 'lodash';

import InterpretationTrigger from 'src/client/app/containers/InterpretationTrigger';
import Interpreter from 'src/client/app/containers/Interpreter';
import Scene from 'src/client/app/containers/Scene';
import UndoRedo from 'src/client/app/containers/UndoRedo';
import Timeline from 'src/client/app/containers/Timeline';
import Ploma from 'src/client/app/containers/Ploma';
import Threshold from 'src/client/app/containers/Threshold';
import Window from 'src/client/app/containers/Window';
import AppConfiguration from 'src/client/app/containers/AppConfiguration';
import ActionChooser from 'src/client/app/containers/ActionChooser';
import ParameterChooser from 'src/client/app/containers/ParameterChooser';
import type { Sketch } from 'src/client/app/types';

export type PageProps = {
	sketches: Array<Sketch>,
};
export const getSelectedStrokes = (sketches: Array<Sketch>) => filter(flatten(map(sketches, 'strokes')), 'selected');

export default (props: PageProps) => {
	const selectedStrokes = getSelectedStrokes(props.sketches);
	const lastSketch = last(props.sketches);
	const lastStrokes = lastSketch ? lastSketch.strokes : [];
	return (
		<div>
			<div>
				<Scene sketches={props.sketches} />
				<Interpreter>
					<ActionChooser />
					<ParameterChooser
						lastStrokes={lastStrokes}
						selectedStrokes={selectedStrokes}
					/>
				</Interpreter>
			</div>
			<Window sketches={props.sketches} />
			<AppConfiguration>
				<UndoRedo />
				<Timeline />
				<Threshold />
				<Ploma />
				<InterpretationTrigger sketches={props.sketches} />
			</AppConfiguration>
		</div>
	);
};
