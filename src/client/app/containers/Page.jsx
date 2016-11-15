import React, {Component} from 'react';
import Scene from 'containers/Scene';
import UndoRedo from 'containers/UndoRedo';
import Ploma from 'containers/Ploma';
import HandwritingRecognition from 'containers/HandwritingRecognition';
import Threshold from 'containers/Threshold';
import Window from 'containers/Window';
import AppConfiguration from 'containers/AppConfiguration';

export default class Page extends Component {

	render() {
		return (<div>
			<Scene {...this.props}/>
			<Window {...this.props}/>
			<AppConfiguration>
				<UndoRedo {...this.props} />
				<Threshold />
				<Ploma />
				<HandwritingRecognition />
			</AppConfiguration>
		</div>);
	}
}