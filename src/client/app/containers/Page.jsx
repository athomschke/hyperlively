// @flow
import React from 'react';

import Scene from './Scene';
import Interpreter from './Interpreter';
import UndoRedo from './UndoRedo';
import Ploma from './Ploma';
import InterpretationTrigger from './InterpretationTrigger';
import Threshold from './Threshold';
import Window from './Window';
import AppConfiguration from './AppConfiguration';

type PageProps = {
	
}

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
