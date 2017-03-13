// @flow
import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { actionChooser } from 'stylesheets/components/smart/actionChooser.scss';
import ActionChooser from './ActionChooser';
import ParameterChooser from './ParameterChooser';
import { type FunctionConfiguration } from '../../typeDefinitions';

type State = {
	parameters: Array<Array<string>>,
	functions: Array<{
		name: string,
		parameters: number,
	}>
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
		this.onInterpretationChoose = this.onInterpretationChoose.bind(this);
	}

	state: State;

	componentDidMount() {
		this.state = {
			parameters: [],
			functions: [],
		};
	}

	onActionChoose(functions: Array<FunctionConfiguration>) {
		this.setState({ functions });
	}

	onParameterChoose(parameters: Array<Array<string>>) {
		this.setState({ parameters });
	}

	onInterpretationChoose() {
		this.props.onInterpretationChoose(this.state.functions, this.state.parameters);
	}

	render() {
		return (
			<Modal
				className={actionChooser}
				{...this.props}
				contentLabel="I am required by a11y"
			>
				<button
					onClick={this.onInterpretationChoose}
				>{'Accept Interpretation'}</button>
				<div>
					<ActionChooser
						onActionChoose={this.onActionChoose}
					/>
					<ParameterChooser
						{...this.props}
						onParameterChoose={this.onParameterChoose}
					/>
				</div>
			</Modal>);
	}

}
