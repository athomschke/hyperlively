// @flow
import React from 'react';

import type { FunctionConfiguration, ActionMapping } from 'src/types';
import LabeledJsonPropertyChooser from 'src/components/LabeledJsonPropertyChooser';
import { PATH_DELIMITER } from 'src/constants/configuration';

import { allActions, formattedSignatures } from './actionSignatures';

export type ActionChooserProps = {
	onFunctionsChoose: (Array<FunctionConfiguration>) => void,
	specificActions: Array<ActionMapping>,
	checkedPaths: Array<string>,
	expandedPaths: Array<string>,
	onExpandedPathsChange: (_paths: Array<string>) => void,
	onCheckedPathsChange: (_paths: Array<string>) => void,
}

const ActionChooser = (props: ActionChooserProps) => {
	const actions = allActions(props.specificActions);

	const onFunctionsChoose = (paths: Array<string>) => {
		const signatures = paths.map(
			(path: string) => path.split(PATH_DELIMITER).reduce((jsonObject, pathPart) => jsonObject[pathPart], actions),
		);
		props.onFunctionsChoose(formattedSignatures(((signatures: any): Array<string>)));
	};

	return (
		<LabeledJsonPropertyChooser
			prefixes={[]}
			label="actions"
			onParameterChoose={onFunctionsChoose}
			onExpandedPathsChange={props.onExpandedPathsChange}
			onCheckedPathsChange={props.onCheckedPathsChange}
			checkedPaths={props.checkedPaths}
			expandedPaths={props.expandedPaths}
			jsonTree={{ actions }}
		/>);
};

export default ActionChooser;
