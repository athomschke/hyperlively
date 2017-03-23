import React from 'react';
import Scene from './Scene';
import Interpreter from './Interpreter';
import UndoRedo from './UndoRedo';
import Ploma from './Ploma';
import HandwritingRecognition from './HandwritingRecognition';
import InterpretationTrigger from './InterpretationTrigger';
import Threshold from './Threshold';
import Window from './Window';
import AppConfiguration from './AppConfiguration';

export default function Page(props) {
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
			<HandwritingRecognition />
			<InterpretationTrigger {...props} />
		</AppConfiguration>
	</div>);
}
