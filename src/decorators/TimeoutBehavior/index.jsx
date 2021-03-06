// @flow
import * as React from 'react';

let runningTimeout;

export type TimeoutBehaviorProps<P> = P & {
	temporaryCallback: (_value: any) => void,
	onChange: (_value: number) => void,
	callbackEnabled: bool,
	timeout: number,
	max: number,
	disabled: bool,
	value: number,
}

type WrappedProps<P> = P & {
	onChange: (_value: number) => void,
	disabled: bool,
	max: number,
	value: number,
	afterChange: () => void,
};

type State = {
	disableFunction: ?(boolean) => void,
}

export default (
	Wrapped: React.ComponentType<WrappedProps<*>>,
) => class TimeoutBehavior extends React.Component<TimeoutBehaviorProps<*>, State> {
	constructor() {
		super();
		(this:any).beActive = this.beActive.bind(this);
		(this:any).beNotActive = this.beNotActive.bind(this);
	}

	state: {
		disableFunction: ?(boolean) => void,
	}

	componentDidMount() {
		this.state = {
			disableFunction: null,
		};
	}

	props: TimeoutBehaviorProps<*>;

	resetState(boundDisableFunction: ?(boolean) => void) {
		if (boundDisableFunction) {
			boundDisableFunction(true);
		}
		runningTimeout = undefined;
		this.setState({
			disableFunction: null,
		});
	}

	beActive(newValue: number, passedDisableFunction: ?(boolean) => void) {
		if (!this.props.disabled && newValue !== this.props.value) {
			let disableFunction = passedDisableFunction;
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
					this.props.timeout,
				);
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
		const {
			// eslint-disable-next-line no-unused-vars
			temporaryCallback, onChange, callbackEnabled, timeout, max, disabled, value,
			...rest
		} = this.props;

		return (
			<Wrapped
				{...rest}
				max={this.props.max}
				value={this.props.value}
				onChange={(newValue: number) => this.beActive(newValue, this.state.disableFunction)}
				disabled={this.props.disabled}
				afterChange={this.beNotActive}
			/>
		);
	}
};
