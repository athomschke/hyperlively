import * as React from 'react';

import JsonPropertyChooser, { type JsonPropertyChooserProps } from 'src/components/JsonPropertyChooser';
import { PATH_DELIMITER } from 'src/constants/configuration';

export type PrefixedJSONPropertyChooserProps = JsonPropertyChooserProps & {
	prefixes: Array<string>
}

export const pathsWithoutPrefixes = (paths: Array<string>, prefixes: Array<string>) => paths.filter(
	path => path.indexOf(prefixes.join(PATH_DELIMITER)) !== 0,
);

export const pathsWithPrefixes = (paths: Array<string>, prefixes: Array<string>) => paths.filter(
	path => path.indexOf(prefixes.join(PATH_DELIMITER)) === 0,
);

export const combinePaths = (prefixes: Array<string>, longPaths: Array<string>, shortPaths: Array<string>): Array<string> => [
	...pathsWithoutPrefixes(longPaths, prefixes),
	...shortPaths.map(shortPath => `${prefixes.join(PATH_DELIMITER)}${PATH_DELIMITER}${shortPath}`),
];

export const filterPaths = (prefixes: Array<string>, paths: Array<string>): Array<string> => pathsWithPrefixes(paths, prefixes).map(
	path => path.split(PATH_DELIMITER).slice(prefixes.length).join(PATH_DELIMITER),
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
