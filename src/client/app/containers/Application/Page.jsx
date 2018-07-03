// @flow
import * as React from 'react';

import InterpretationTrigger from 'src/client/app/containers/InterpretationTrigger';
import Interpreter from 'src/client/app/containers/Interpreter';
import Scene from 'src/client/app/containers/Scene';
import UndoRedo from 'src/client/app/containers/UndoRedo';
import Timeline from 'src/client/app/containers/Timeline';
import Ploma from 'src/client/app/containers/Ploma';
import Threshold from 'src/client/app/containers/Threshold';
import Window from 'src/client/app/containers/Window';
import AppConfiguration from 'src/client/app/containers/AppConfiguration';
import type { Sketch } from 'src/client/app/types';

export type PageProps = {
	sketches: Array<Sketch>,
};

export default (props: PageProps) => (
	<div>
		<div>
			<Scene sketches={props.sketches} />
			<Interpreter sketches={props.sketches} />
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
