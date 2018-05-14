// @flow
import React, { PureComponent } from 'react';

import TimeoutBehavior from 'src/client/app/components/hoc/TimeoutBehavior';

import TimelineView from './Timeline';

const Timeline = TimeoutBehavior(TimelineView);

type State = {
	sliderWidth: number,
}

type Props<P> = P

export default class UndoRedo extends PureComponent<Props<any>, State> {
	constructor() {
		super();
		this.state = {
			sliderWidth: 0,
		};
	}

	state: State

	componentDidMount() {
		this.state.sliderWidth = ((this.node: any): HTMLDivElement).getBoundingClientRect().width;
	}

	props: Props<any>

	node: HTMLDivElement | null

	render() {
		return (<div
			ref={(node) => { this.node = node; }}
			style={{
				width: '100%',
			}}
		>
			<Timeline
				{...this.props}
				{...this.state}
				sliderHeight={80}
			/>
		</div>);
	}
}
