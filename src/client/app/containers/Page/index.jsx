// @flow
import React from 'react';

import InterpretationTrigger from 'src/client/app/containers/InterpretationTrigger';
import Interpreter from 'src/client/app/containers/Interpreter';
import Scene from 'src/client/app/containers/Scene';
import UndoRedo from 'src/client/app/containers/UndoRedo';
import Ploma from 'src/client/app/containers/Ploma';
import Threshold from 'src/client/app/containers/Threshold';
import Window from 'src/client/app/containers/Window';
import AppConfiguration from 'src/client/app/containers/AppConfiguration';

type PageProps = {}

export default function Page(props: PageProps) {
	return (<div>
		<div>
			<Scene {...props} />
			<Interpreter {...props} />
		</div>
		<Window {...props} />
		<AppConfiguration>
			<UndoRedo {...props} />
			<Threshold />
			<Ploma />
			<InterpretationTrigger {...props} />
		</AppConfiguration>
	</div>);
}
