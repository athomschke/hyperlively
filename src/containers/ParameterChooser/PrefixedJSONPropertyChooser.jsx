import * as React from 'react';

import JsonPropertyChooser, { type JsonPropertyChooserProps } from 'src/components/JsonPropertyChooser';
import { PATH_DELIMITER } from 'src/constants/configuration';

export type PrefixedJSONPropertyChooserProps = JsonPropertyChooserProps & {
	prefixes: Array<string>
}

export const pathsWithPrefixes = (paths: Array<string>, prefixes: Array<string>) => paths.filter(
	path => path.indexOf(prefixes.join(PATH_DELIMITER)) === 0,
);

export const combinePaths = (prefixes: Array<string>, longPaths: Array<string>, shortPaths: Array<string>): Array<string> => {
	let shortPathIndex = 0;
	const newLongPaths = longPaths.map((longPath) => {
		const matchesPrefix = longPath.indexOf(prefixes.join(PATH_DELIMITER)) >= 0;
		if (matchesPrefix) {
			const computedLongPath = `${prefixes.join(PATH_DELIMITER)}${PATH_DELIMITER}${shortPaths[shortPathIndex]}`;
			if (longPath === computedLongPath) {
				shortPathIndex += 1;
				return longPath;
			} // else long path has been removed, aka. un-checked
			return null;
		}
		return longPath;
	}).filter(path => path);
	if (shortPathIndex < shortPaths.length) {
		newLongPaths.push(`${prefixes.join(PATH_DELIMITER)}${PATH_DELIMITER}${shortPaths[shortPaths.length - 1]}`);
	}
	return newLongPaths;
};

export const filterPaths = (prefixes: Array<string>, paths: Array<string>): Array<string> => pathsWithPrefixes(paths, prefixes).map(
	path => path.split(PATH_DELIMITER).slice(prefixes.length).join(PATH_DELIMITER),
);

export default (props: PrefixedJSONPropertyChooserProps) => {
	const { prefixes } = props;

	const onCheck = (checked) => {
		props.onCheckedPathsChange(checked);
		props.onParameterChoose(checked);
	};

	const jsonTree = prefixes.reduce((accumulator, prefix) => accumulator[prefix], props.jsonTree);
	const checkedPaths = filterPaths(prefixes, props.checkedPaths);
	const expandedPaths = filterPaths(prefixes, props.expandedPaths);

	return (
		<JsonPropertyChooser
			position={props.position}
			jsonTree={jsonTree}
			checkedPaths={checkedPaths}
			expandedPaths={expandedPaths}
			onCheckedPathsChange={paths => onCheck(combinePaths(props.prefixes, props.checkedPaths, paths))}
			onExpandedPathsChange={paths => props.onExpandedPathsChange(combinePaths(props.prefixes, props.expandedPaths, paths))}
		/>
	);
};
