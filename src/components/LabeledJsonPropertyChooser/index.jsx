// @flow
import * as React from 'react';
import { without } from 'lodash';

import { PATH_DELIMITER } from 'src/constants/configuration';
import PrefixedJSONPropertyChooser, { type PrefixedJSONPropertyChooserProps } from 'src/components/PrefixedJSONPropertyChooser';

type LabeledJsonPropertyChooserProps = PrefixedJSONPropertyChooserProps & {
	label: string,
}

const LabeledJsonPropertyChooser = (props: LabeledJsonPropertyChooserProps) => {
	const { label } = props;
	const jsonTree = { [label]: props.jsonTree };

	const prependActionsString = (paths: Array<string>) => paths.map(path => ['actions', ...without(path.split(PATH_DELIMITER), '')].join(PATH_DELIMITER));
	const removeActionsString = (paths: Array<string>) => paths.map(path => path.split(PATH_DELIMITER).slice(1).join(PATH_DELIMITER));

	const checkedPaths = prependActionsString(props.checkedPaths);
	const expandedPaths = prependActionsString(props.expandedPaths);

	return (
		<PrefixedJSONPropertyChooser
			prefixes={[]}
			onParameterChoose={(parameters: Array<string>) => {
				props.onParameterChoose(removeActionsString(parameters));
			}}
			onExpandedPathsChange={paths => props.onExpandedPathsChange(removeActionsString(paths))}
			onCheckedPathsChange={paths => props.onCheckedPathsChange(removeActionsString(paths))}
			checkedPaths={checkedPaths}
			expandedPaths={expandedPaths}
			jsonTree={jsonTree}
		/>);
};

export default LabeledJsonPropertyChooser;
