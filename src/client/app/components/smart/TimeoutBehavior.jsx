import React, { Component, PropTypes } from 'react';

let runningTimeout;

export default Wrapped => class extends Component {

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

	componentDidMount() {
		this.setState({
			disableFunction: null,
		});
	}

	resetState(boundDisableFunction) {
		if (boundDisableFunction) {
			boundDisableFunction(true);
		}
		runningTimeout = undefined;
		this.setState({
			disableFunction: null,
		});
	}

	beActive(newValue) {
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
			ref="wrapped"
			{...this.props}
			onChange={this.beActive.bind(this)}
			afterChange={this.beNotActive.bind(this)}
		/>);
	}

};
