// @flow
import * as React from 'react';
import { without } from 'lodash';

import { PATH_DELIMITER } from 'src/constants/configuration';
import PrefixedJSONPropertyChooser, { type PrefixedJSONPropertyChooserProps } from 'src/components/PrefixedJSONPropertyChooser';

export type LabeledJsonPropertyChooserProps = PrefixedJSONPropertyChooserProps & {
	label: string,
}

const LabeledJsonPropertyChooser = (props: LabeledJsonPropertyChooserProps) => {
	const { label } = props;

	const prependLabelString = (paths: Array<string>) => paths.map(path => [label, ...without(path.split(PATH_DELIMITER), '')].join(PATH_DELIMITER));
	const removeLabelString = (paths: Array<string>) => paths.map(path => path.split(PATH_DELIMITER).slice(1).join(PATH_DELIMITER));

	const expandedPaths = prependLabelString(props.expandedPaths);

	return (
		<PrefixedJSONPropertyChooser
			prefixes={[]}
			onParameterChoose={(parameters: Array<string>) => {
				props.onParameterChoose(removeLabelString(parameters));
			}}
			onExpandedPathsChange={paths => props.onExpandedPathsChange(removeLabelString(paths))}
			onCheckedPathsChange={paths => props.onCheckedPathsChange(removeLabelString(paths))}
			expandedPaths={expandedPaths}
			jsonTree={props.jsonTree}
		/>);
};

export default LabeledJsonPropertyChooser;
