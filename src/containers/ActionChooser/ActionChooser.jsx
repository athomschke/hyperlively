// @flow
import React from 'react';

import type { Functions, ActionMapping } from 'src/types';
import LabeledJsonPropertyChooser from 'src/components/LabeledJsonPropertyChooser';
import { PATH_DELIMITER } from 'src/constants/configuration';

import { allActions, formattedSignatures } from './actionSignatures';

export type ActionChooserStateProps = {
	expandedPaths: Array<string>,
	specificActions: Array<ActionMapping>,
	selectedActions: Functions,
}

export type ActionChooserDispatchProps = {
	onFunctionsChoose: (_functions: Functions) => void,
	onExpandedPathsChange: (_paths: Array<string>) => void,
	onSelect: (_paths: Array<string>) => void,
}

export type ActionChooserProps = ActionChooserStateProps & ActionChooserDispatchProps & {
	recognizedLabel?: string,
}

const ActionChooser = (props: ActionChooserProps) => {
	const actions = allActions(props.specificActions);

	const onFunctionsChoose = (paths: Array<string>) => {
		const signatures = paths.map(
			(path: string) => path.split(PATH_DELIMITER).reduce((jsonObject, pathPart) => jsonObject[pathPart], actions),
		);
		const signaturesFormatted = formattedSignatures(((signatures: any): Array<string>), props.recognizedLabel);
		props.onFunctionsChoose(
			[
				...props.selectedActions,
				...signaturesFormatted,
			],
		);
	};

	return (
		<LabeledJsonPropertyChooser
			prefixes={[]}
			label="actions"
			onParameterChoose={onFunctionsChoose}
			onExpandedPathsChange={props.onExpandedPathsChange}
			onSelect={props.onSelect}
			expandedPaths={props.expandedPaths}
			jsonTree={{ actions }}
		/>);
};

export default ActionChooser;
