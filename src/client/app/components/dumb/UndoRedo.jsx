import React, { Component } from 'react';
import TimelineView from './Timeline';
import TimeoutBehavior from '../smart/TimeoutBehavior';

const Timeline = TimeoutBehavior(TimelineView);

export default class UndoRedo extends Component {

	render() {
		return (<div
			style={{
				width: window.innerWidth - 40,
			}}
		>
			<Timeline
				ref="slider"
				{...this.props}
				sliderWidth={window.innerWidth - 40}
				sliderHeight={80}
			/>
		</div>);
	}

}
