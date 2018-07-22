import * as React from 'react';

import JsonPropertyChooser, { type JsonPropertyChooserProps } from 'src/components/JsonPropertyChooser';
import { PATH_DELIMITER } from 'src/constants/configuration';

export type PrefixedJSONPropertyChooserProps = JsonPropertyChooserProps & {
	prefix: string
}

const combinePaths = (prefix: string, upperPaths: Array<string>, lowerPaths: Array<string>): Array<string> => [
	...upperPaths.filter(path => path.split(PATH_DELIMITER)[0] !== prefix),
	...lowerPaths.map(path => [prefix, ...path.split(PATH_DELIMITER)].join(PATH_DELIMITER)),
];
const filterPaths = (prefix: string, paths: Array<string>): Array<string> => paths.filter(
	path => path.split(PATH_DELIMITER)[0] === prefix,
).map(
	path => path.split(PATH_DELIMITER).slice(1).join(PATH_DELIMITER),
);

export default (props: PrefixedJSONPropertyChooserProps) => {
	const { prefix } = props;

	return (
		<JsonPropertyChooser
			position={props.position}
			jsonTree={props.jsonTree[prefix]}
			checkedPaths={filterPaths(prefix, props.checkedPaths)}
			expandedPaths={filterPaths(prefix, props.expandedPaths)}
			onParameterChoose={props.onParameterChoose}
			onCheckedPathsChange={paths => props.onCheckedPathsChange(combinePaths(props.prefix, props.checkedPaths, paths))}
			onExpandedPathsChange={paths => props.onExpandedPathsChange(combinePaths(props.prefix, props.expandedPaths, paths))}
		/>
	);
};
