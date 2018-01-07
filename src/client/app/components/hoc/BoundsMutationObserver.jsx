// @flow
import React, { PureComponent } from 'react';
import { forEach } from 'lodash';
import type { ClassComponent } from 'react-flow-types';

import type { Stroke, Bounds } from 'src/client/app/typeDefinitions';

type Props = {
	observeMutations: boolean;
	performAction: (_name: string, ..._rest: any[]) => void;
	bounds: Bounds;
	strokes: Array<Stroke>;
}

type State = {
	observer: MutationObserver;
	observedNode: HTMLDivElement | null;
}

export default (Wrapped: ClassComponent<any, any>) => class extends PureComponent<Props, State> {
	props: Props;
	state: State;

	static defaultProps = {
		observeMutations: true,
		performAction: () => {},
		bounds: {
			x: 0,
			y: 0,
		},
		strokes: [],
	};

	constructor(props: Props) {
		super(props);
		this.state = this.state || {};
	}

	observe() {
		const wrappedComponent = this.state.observedNode;
		if (wrappedComponent) {
			const observer = new MutationObserver(this.onMutations.bind(this));
			const node = wrappedComponent;
			if (node) {
				observer.observe(node, {
					attributes: true,
				});
				this.setState({
					observer,
				});
			}
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
		return (<Wrapped
			onNodeChanged={(divNode) => {
				this.state.observedNode = divNode;
			}}
			{...this.props}
		/>);
	}
};
