// @flow
import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { SyntheticMouseEvent } from 'flow-bin';
import { actionChooser } from 'stylesheets/components/smart/actionChooser.scss';
import ActionChooser from './ActionChooser';
import ParameterChooser from './ParameterChooser';

type State = {
	parameters: Array<Array<string>>,
};

export default class InterpretationChooser extends Component {

	static propTypes = {
		onInterpretationChoose: PropTypes.func,
	};

	static defaultProps = {
		onInterpretationChoose: () => {},
	}

	constructor() {
		super();
		this.onActionChoose = this.onActionChoose.bind(this);
		this.onParameterChoose = this.onParameterChoose.bind(this);
	}

	state: State;

	componentDidMount() {
		this.state = {
			parameters: [],
		};
	}

	onActionChoose(event: SyntheticMouseEvent, functionName: string) {
		this.onInterpretationChoose(event, functionName);
	}

	onParameterChoose(parameters: Array<Array<string>>) {
		this.setState({ parameters });
	}

	onInterpretationChoose(event: SyntheticMouseEvent, functionName: string) {
		this.props.onInterpretationChoose(event, functionName, this.state.parameters);
	}

	render() {
		return (
			<Modal
				className={actionChooser}
				{...this.props}
				contentLabel="I am required by a11y"
			>
				<ActionChooser
					onActionChoose={this.onActionChoose}
				/>
				<ParameterChooser
					{...this.props}
					{...this.state}
					onParameterChoose={this.onParameterChoose}
				/>
			</Modal>);
	}

}
