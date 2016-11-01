import React, {Component} from 'react';
import Timeline from 'components/smart/Timeline';

'use strict';

export default class UndoRedo extends Component {

	render() {
		return (<div
				style={{
					width: window.innerWidth - 40
				}}
			>
			<Timeline ref="slider" {...this.props}/>
		</div>);
	}

}