import React from 'react';
import Scene from './Scene';
import UndoRedo from './UndoRedo';
import Ploma from './Ploma';
import HandwritingRecognition from './HandwritingRecognition';
import Threshold from './Threshold';
import Window from './Window';
import AppConfiguration from './AppConfiguration';

export default function Page(props) {
	return (<div>
		<Scene {...props} />
		<Window {...props} />
		<AppConfiguration>
			<UndoRedo {...props} />
			<Threshold />
			<Ploma />
			<HandwritingRecognition />
		</AppConfiguration>
	</div>);
}
