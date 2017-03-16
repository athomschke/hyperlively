// @flow
import React, { PureComponent, PropTypes } from 'react';

let runningTimeout;

export default Wrapped => class extends PureComponent {

	static propTypes = {
		temporaryCallback: PropTypes.func,
		onChange: PropTypes.func,
		callbackEnabled: PropTypes.bool,
		timeout: PropTypes.number,
		max: PropTypes.number,
		disabled: PropTypes.bool,
		value: PropTypes.number,
	};

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
		this.beActive = this.beActive.bind(this);
		this.beNotActive = this.beNotActive.bind(this);
	}

	state: {
		disableFunction: ?(boolean) => void,
	}

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
