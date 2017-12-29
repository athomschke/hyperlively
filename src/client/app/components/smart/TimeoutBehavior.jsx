// @flow
import React, { PureComponent } from 'react';
import type { Component } from 'react-flow-types';

let runningTimeout;

type Props = {
	temporaryCallback: (_togglePloma: bool) => void,
	onChange: (_value: number) => void,
	callbackEnabled: bool,
	timeout: number,
	max: number,
	disabled: bool,
	value: number,
}

type State = {
	disableFunction: ?(boolean) => void,
}

export default (Wrapped: Component<Object>) => class extends PureComponent<Props, State> {
	static defaultProps = {
		temporaryCallback: () => {},
		onChange: () => {},
		callbackEnabled: false,
		timeout: 1000,
		max: 0,
		disabled: false,
		value: 0,
	};

	constructor() {
		super();
		(this:any).beActive = this.beActive.bind(this);
		(this:any).beNotActive = this.beNotActive.bind(this);
	}

	state: {
		disableFunction: ?(boolean) => void,
	}

	props: Props;

	componentDidMount() {
		this.state = {
			disableFunction: null,
		};
	}

	resetState(boundDisableFunction: ?(boolean) => void) {
		if (boundDisableFunction) {
			boundDisableFunction(true);
		}
		runningTimeout = undefined;
		this.setState({
			disableFunction: null,
		});
	}

	beActive(newValue: number) {
		if (!this.props.disabled && newValue !== this.props.value) {
			let disableFunction = this.state.disableFunction;
			if (this.props.callbackEnabled && !disableFunction) {
				this.props.temporaryCallback(false);
				disableFunction = this.props.temporaryCallback.bind(this, true);
			}
			if (runningTimeout) {
				clearTimeout(runningTimeout);
			}
			if (disableFunction) {
				runningTimeout = setTimeout(
						this.resetState.bind(this, disableFunction),
						this.props.timeout);
			}
			this.props.onChange(Math.min(this.props.max, Math.max(0, newValue)));
			this.setState({ disableFunction });
		}
	}

	beNotActive() {
		if (runningTimeout) {
			this.resetState(this.state.disableFunction);
			clearTimeout(runningTimeout);
		}
	}

	render() {
		return (<Wrapped
			{...this.props}
			onChange={this.beActive}
			afterChange={this.beNotActive}
		/>);
	}

};
