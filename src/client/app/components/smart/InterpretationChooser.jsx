// @flow
import React, { PureComponent } from 'react';
import { forEach, find, map, concat } from 'lodash';

import style from 'src/client/app/stylesheets/components/smart/actionChooser.scss';
import { relativeDividerPosition } from 'src/client/app/constants/configuration';
import type { FunctionConfiguration, TreeParameter, ActionMapping, RecognitionResult, Parameters, Functions } from 'src/client/app/typeDefinitions';
import ActionChooser from 'src/client/app/containers/ActionChooser';
import ParameterChooser from 'src/client/app/containers/ParameterChooser';

export type InterpretationChooserProps = {
	onInterpretationChoose: (_functions: Functions, _parameters: Parameters) => void,
	onInterpretationTick: (_functions: Functions, _parameters: Parameters, _interval: number) => void,
	onFunctionsChoose: (functions: Functions) => void,
	onParametersChoose: (parameters: Parameters) => void,
	specificActions: Array<ActionMapping>,
	interpretations: RecognitionResult,
	parameters: Parameters,
	functions: Functions
};

export default class InterpretationChooser
	extends PureComponent<InterpretationChooserProps> {
	static defaultProps = {
		onInterpretationChoose: () => undefined,
		onInterpretationTick: () => undefined,
		onParametersChoose: () => undefined,
		onActionsChoose: () => undefined,
	}

	constructor() {
		super();
		(this:any).onActionChoose = this.onActionChoose.bind(this);
		(this:any).onParameterChoose = this.onParameterChoose.bind(this);
		(this:any).onInterpretationChoose = this.onInterpretationChoose.bind(this);
		(this:any).onInterpretationTick = this.onInterpretationTick.bind(this);
	}

	onActionChoose(functions: Array<FunctionConfiguration>) {
		this.props.onFunctionsChoose(functions);
	}

	onParameterChoose(parameters: Array<TreeParameter>) {
		this.props.onParametersChoose(parameters);
	}

	onInterpretationChoose() {
		let functions = [];
		forEach(this.props.functions, (aFunction) => {
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
		this.props.onInterpretationChoose(functions, this.props.parameters);
		this.onParameterChoose(this.props.parameters);
	}

	onInterpretationTick() {
		this.props.onInterpretationTick(this.props.functions, this.props.parameters, 1000);
	}

	props: InterpretationChooserProps

	render() {
		return (
			<div
				className={style.actionChooser}
				style={{ width: `${(1 - relativeDividerPosition) * 100}%` }}
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
						interpretations={this.props.interpretations}
						onParameterChoose={this.onParameterChoose}
					/>
				</div>
			</div>);
	}
}
