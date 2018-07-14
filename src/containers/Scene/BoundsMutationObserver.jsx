// @flow
import * as React from 'react';
import { forEach } from 'lodash';

import type { Stroke, Bounds, OnNodeChangedFunction, PerformActionFunction } from 'src/types';

export type BoundsMutationObserverProps<P> = P & {
	observeMutations: boolean;
	performAction: PerformActionFunction;
	bounds: Bounds;
	strokes: Array<Stroke>;
};

export type WrappedProps<P> = P & {
	onNodeChanged?: OnNodeChangedFunction,
	bounds: Bounds;
	strokes: Array<Stroke>;
}

type State = {
	observer: MutationObserver;
	observedNode: HTMLDivElement | null;
}

export default (Wrapped: React.ComponentType<WrappedProps<any>>) =>
	class extends React.PureComponent<BoundsMutationObserverProps<any>, State> {
	props: BoundsMutationObserverProps<any>;
	state: State;

	constructor() {
		super();
		this.state = this.state || {};
	}

	observe() {
		const { observedNode } = this.state;

		if (observedNode) {
			const observer = new MutationObserver(this.onMutations.bind(this));
			observer.observe(observedNode, {
				attributes: true,
			});
			this.setState({
				observer,
			});
		}
	}

	ignore() {
		if (this.state.observer && this.state.observer.disconnect) {
			this.state.observer.disconnect();
		}
		this.setState({
			observer: undefined,
		});
	}

	componentDidMount() {
		this.observe();
	}

	componentWillUnmount() {
		this.ignore();
	}

	boundsUpdatedWith(fromX: number, fromY: number, toX: number, toY: number) {
		this.props.performAction('updatePosition', this.props.strokes, fromX, fromY, toX, toY);
	}

	onMutations(mutationRecords: Array<MutationRecord>) {
		const wrappedComponent = this.state.observedNode;
		if (this.props.observeMutations && wrappedComponent) {
			forEach(mutationRecords, (mutationRecord) => {
				if (mutationRecord.attributeName === 'style') {
					const moveBy = {
						x: parseInt(wrappedComponent.style.left, 10) - this.props.bounds.x,
						y: parseInt(wrappedComponent.style.top, 10) - this.props.bounds.y,
					};
					if (moveBy.x !== 0 || moveBy.y !== 0) {
						this.boundsUpdatedWith(
							this.props.bounds.x,
							this.props.bounds.y,
							parseInt(wrappedComponent.style.left, 10),
							parseInt(wrappedComponent.style.top, 10),
						);
					}
				}
			});
		}
	}

	render() {
		// eslint-disable-next-line no-unused-vars
		const { _observeMutations, _performAction, ...rest } = this.props;

		return (<Wrapped
			{...rest}
			onNodeChanged={(divNode) => {
				this.state.observedNode = divNode;
			}}
			bounds={this.props.bounds}
			strokes={this.props.strokes}
		/>);
	}
	};
