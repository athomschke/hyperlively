import * as React from 'react';

import JsonPropertyChooser, { type JsonPropertyChooserProps } from 'src/components/JsonPropertyChooser';
import { PATH_DELIMITER } from 'src/constants/configuration';

export type PrefixedJSONPropertyChooserProps = JsonPropertyChooserProps & {
	prefixes: Array<string>
}

const pathsWithoutPrefixes = (paths: Array<string>, prefixes: Array<string>) => paths.filter(
	path => prefixes.reduce((
		isEqual,
		prefixPart,
		i,
	) => isEqual && (prefixPart !== path.split(PATH_DELIMITER)[i]), true),
);

const pathsWithPrefixes = (paths: Array<string>, prefixes: Array<string>) => paths.filter(
	path => prefixes.reduce((
		isEqual,
		prefixPart,
		i,
	) => isEqual && (prefixPart === path.split(PATH_DELIMITER)[i]), true),
);

const combinePaths = (prefixes: Array<string>, longPaths: Array<string>, shortPaths: Array<string>): Array<string> => [
	...pathsWithoutPrefixes(longPaths, prefixes),
	...shortPaths.map(path => [
		...prefixes,
		...path.split(PATH_DELIMITER),
	].join(PATH_DELIMITER)),
];

export const filterPaths = (prefixes: Array<string>, paths: Array<string>): Array<string> => pathsWithPrefixes(paths, prefixes).map(
	path => path.split(PATH_DELIMITER).slice(1).join(PATH_DELIMITER),
);

export default (props: PrefixedJSONPropertyChooserProps) => {
	const { prefixes } = props;

	const jsonTree = prefixes.reduce((accumulator, prefix) => accumulator[prefix], props.jsonTree);
	const checkedPaths = filterPaths(prefixes, props.checkedPaths);
	const expandedPaths = filterPaths(prefixes, props.expandedPaths);

	return (
		<JsonPropertyChooser
			position={props.position}
			jsonTree={jsonTree}
			checkedPaths={checkedPaths}
			expandedPaths={expandedPaths}
			onParameterChoose={props.onParameterChoose}
			onCheckedPathsChange={paths => props.onCheckedPathsChange(combinePaths(props.prefixes, props.checkedPaths, paths))}
			onExpandedPathsChange={paths => props.onExpandedPathsChange(combinePaths(props.prefixes, props.expandedPaths, paths))}
		/>
	);
};
