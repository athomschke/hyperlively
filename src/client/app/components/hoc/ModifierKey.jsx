// @flow
import React, { PureComponent } from 'react';
import type { ClassComponent } from 'react-flow-types';

export default (Wrapped: ClassComponent<any, any>) => class extends PureComponent {

	constructor(props: Object) {
		super(props);
		this.state = {
			cmdPressed: false,
			returnPressed: false,
			ctrlPressed: false,
		};
	}

	state: {
		cmdPressed: boolean,
		returnPressed: boolean,
		ctrlPressed: boolean,
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown.bind(this));
		window.removeEventListener('keyup', this.handleKeyUp.bind(this));
	}

	handleKeyDown(event: KeyboardEvent) {
		if (event.metaKey && !event.ctrlKey) {
			this.setState({ cmdPressed: true });
		}
		if (event.which === 13 || event.keyCode === 13) {
			this.setState({ returnPressed: true });
		}
		if (event.ctrlKey) {
			this.setState({ ctrlPressed: true });
		}
	}

	handleKeyUp(event: KeyboardEvent) {
		if (this.state.cmdPressed && (!event.metaKey || event.ctrlKey)) {
			this.setState({ cmdPressed: false });
		}
		if (this.state.returnPressed && (event.which === 13 && event.keyCode === 13)) {
			this.setState({ returnPressed: false });
		}
		if (this.state.ctrlPressed && !event.ctrlKey) {
			this.setState({ ctrlPressed: false });
		}
	}

	render() {
		return (<Wrapped {...this.props} {...this.state} />);
	}
};
