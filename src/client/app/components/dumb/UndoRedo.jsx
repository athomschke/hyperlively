// @flow
import React from 'react';
import TimelineView from './Timeline';
import TimeoutBehavior from '../smart/TimeoutBehavior';

const Timeline = TimeoutBehavior(TimelineView);

export default function UndoRedo(props: Object) {
	return (<div
		style={{
			width: window.innerWidth - 40,
		}}
	>
		<Timeline
			{...props}
			sliderWidth={window.innerWidth - 40}
			sliderHeight={80}
		/>
	</div>);
}
