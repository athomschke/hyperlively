// @flow
import React, { PureComponent } from 'react';
import { forEach, find, map, concat } from 'lodash';
import { actionChooser } from 'stylesheets/components/smart/actionChooser.scss';
import ActionChooser from './ActionChooser';
import ParameterChooser from './ParameterChooser';
import type { FunctionConfiguration, TreeParameter, ActionMapping } from '../../typeDefinitions';

type State = {
	parameters: Array<Array<TreeParameter>>,
	functions: Array<{
		name: string,
		parameters: number,
	}>
};


type Props = {
	onInterpretationChoose: () => void,
	onInterpretationTick: () => void,
	relativeDividerPosition: number,
	specificActions: Array<ActionMapping>,
};

export default class InterpretationChooser extends PureComponent {

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
		let functions = [];
		forEach(this.state.functions, (aFunction) => {
			const specificAction = find(this.props.specificActions,
				action => action.actionName === aFunction.name);
			if (specificAction) {
				const primitiveActions = map(specificAction.actionNames,
					actionName => ({ name: actionName, parameters: 1 }));
				functions = concat(functions, primitiveActions);
			} else {
				functions.push(aFunction);
			}
		});
		this.props.onInterpretationChoose(functions, this.state.parameters);
	}

	onInterpretationTick() {
		this.props.onInterpretationTick(this.state.functions, this.state.parameters, 1000);
	}

	props: Props

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
						specificActions={this.props.specificActions}
					/>
					<ParameterChooser
						{...this.props}
						onParameterChoose={this.onParameterChoose}
					/>
				</div>
			</div>);
	}

}
