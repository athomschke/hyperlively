// @flow
import React, { PureComponent, PropTypes } from 'react';
import { actionChooser } from 'stylesheets/components/smart/actionChooser.scss';
import ActionChooser from './ActionChooser';
import ParameterChooser from './ParameterChooser';
import type { FunctionConfiguration, TreeParameter } from '../../typeDefinitions';

type State = {
	parameters: Array<Array<TreeParameter>>,
	functions: Array<{
		name: string,
		parameters: number,
	}>
};

export default class InterpretationChooser extends PureComponent {

	static propTypes = {
		onInterpretationChoose: PropTypes.func,
		onInterpretationTick: PropTypes.func,
		relativeDividerPosition: PropTypes.number,
	};

	static defaultProps = {
		onInterpretationChoose: () => {},
		onInterpretationTick: () => {},
		relativeDividerPosition: 0,
	}

	constructor() {
		super();
		(this:any).onActionChoose = this.onActionChoose.bind(this);
		(this:any).onParameterChoose = this.onParameterChoose.bind(this);
		(this:any).onInterpretationChoose = this.onInterpretationChoose.bind(this);
		(this:any).onInterpretationTick = this.onInterpretationTick.bind(this);
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

	onParameterChoose(parameters: Array<Array<TreeParameter>>) {
		this.setState({ parameters });
	}

	onInterpretationChoose() {
		this.props.onInterpretationChoose(this.state.functions, this.state.parameters);
	}

	onInterpretationTick() {
		this.props.onInterpretationTick(this.state.functions, this.state.parameters, 1000);
	}

	render() {
		return (
			<div
				className={actionChooser}
				style={{ width: `${(1 - this.props.relativeDividerPosition) * 100}%` }}
			>
				<button
					onClick={this.onInterpretationChoose}
				>{'Accept Interpretation'}</button>
				<button
					onClick={this.onInterpretationTick}
				>{'Tick'}</button>
				<div>
					<ActionChooser
						onActionChoose={this.onActionChoose}
					/>
					<ParameterChooser
						{...this.props}
						onParameterChoose={this.onParameterChoose}
					/>
				</div>
			</div>);
	}

}
