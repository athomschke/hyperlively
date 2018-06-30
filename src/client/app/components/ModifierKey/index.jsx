// @flow
import * as React from 'react';

type State = {
	cmdPressed: boolean;
	returnPressed: boolean;
	ctrlPressed: boolean;
}

export type ModifierKeyProps<P> = P;

type WrappedProps<P> = ModifierKeyProps<P>;

export default (Wrapped: React.ComponentType<WrappedProps<any>>) =>
	class extends React.PureComponent<ModifierKeyProps<any>, State> {
		constructor() {
			super();
			this.state = {
				cmdPressed: false,
				returnPressed: false,
				ctrlPressed: false,
			};
		}

	state: State;

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
