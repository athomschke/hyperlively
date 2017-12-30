// @flow
import React, { PureComponent } from 'react';
import TimeoutBehavior from 'components/hoc/TimeoutBehavior';
import TimelineView from './Timeline';

const Timeline = TimeoutBehavior(TimelineView);

type State = {
	sliderWidth: number,
}

type Props = {}

export default class UndoRedo extends PureComponent<Props, State> {
	constructor(props: any) {
		super(props);
		this.state = {
			sliderWidth: 0,
		};
	}

	state: State

	componentDidMount() {
		this.state.sliderWidth = this.node.getBoundingClientRect().width;
	}

	props: Props

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
