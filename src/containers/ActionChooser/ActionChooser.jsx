// @flow
import React from 'react';

import type { FunctionConfiguration, ActionMapping } from 'src/types';
import LabeledJsonPropertyChooser from 'src/components/LabeledJsonPropertyChooser';

import { allActions, formattedSignatures } from './actionSignatures';

type Props = {
	onFunctionsChoose: (Array<FunctionConfiguration>) => void,
	specificActions: Array<ActionMapping>,
	checkedPaths: Array<string>,
	expandedPaths: Array<string>,
	onExpandedPathsChange: (_paths: Array<string>) => void,
	onCheckedPathsChange: (_paths: Array<string>) => void,
}

const ActionChooser = (props: Props) => {
	const onFunctionsChoose = (signatures: Array<string>) => {
		props.onFunctionsChoose(formattedSignatures(signatures));
	};

	const actions = allActions(props.specificActions);

	return (
		<LabeledJsonPropertyChooser
			prefixes={[]}
			label="actions"
			onParameterChoose={onFunctionsChoose}
			onExpandedPathsChange={props.onExpandedPathsChange}
			onCheckedPathsChange={props.onCheckedPathsChange}
			checkedPaths={props.checkedPaths}
			expandedPaths={props.expandedPaths}
			jsonTree={actions}
		/>);
};

export default ActionChooser;
