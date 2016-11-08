import React, {Component} from 'react';
import TimelineView from 'components/dumb/Timeline';
import TimeoutBehavior from 'components/smart/TimeoutBehavior';

let Timeline = TimeoutBehavior(TimelineView);

'use strict';

export default class UndoRedo extends Component {

	render() {
		return (<div
				style={{
					width: window.innerWidth - 40
				}}
			>
			<Timeline ref="slider" {...this.props}
				sliderWidth={window.innerWidth - 40}
				sliderHeight={80}
			/>
		</div>);
	}

}