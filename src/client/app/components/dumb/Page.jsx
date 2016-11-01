import React, {Component} from 'react';
import Scene from 'containers/Scene';
import Configuration from 'components/dumb/Configuration';
import Window from 'containers/Window';

export default class Page extends Component {

	render() {
		return (<div>
			<Scene {...this.props}/>
			<Window />
			<Configuration {...this.props}/>
		</div>);
	}
}