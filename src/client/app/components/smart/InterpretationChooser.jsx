// @flow
import React, { PureComponent } from 'react';
import { forEach, find, map, concat } from 'lodash';

import style from 'src/client/app/stylesheets/components/smart/actionChooser.scss';
import { relativeDividerPosition } from 'src/client/app/constants/configuration';
import type { ActionMapping, RecognitionResult, Parameters, Functions } from 'src/client/app/typeDefinitions';
import ActionChooser from 'src/client/app/containers/ActionChooser';
import ParameterChooser from 'src/client/app/containers/ParameterChooser';

export type InterpretationChooserProps = {
	onInterpretationChoose: (_functions: Functions, _parameters: Parameters) => void,
	onInterpretationTick: (_functions: Functions, _parameters: Parameters, _interval: number) => void,
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
	}

	constructor() {
		super();
		(this:any).onInterpretationChoose = this.onInterpretationChoose.bind(this);
		(this:any).onInterpretationTick = this.onInterpretationTick.bind(this);
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
						specificActions={this.props.specificActions}
					/>
					<ParameterChooser
						{...this.props}
						interpretations={this.props.interpretations}
					/>
				</div>
			</div>);
	}
}
