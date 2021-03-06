// @flow
import * as React from 'react';

import JsonPropertyChooser, { type JSONObject } from 'src/components/JsonPropertyChooser';
import { PATH_DELIMITER } from 'src/constants/configuration';
import type { SortedPath, Coordinate } from 'src/types';

export type PrefixedJSONPropertyChooserProps = {
	position?: ?Coordinate,
	jsonTree: JSONObject,
	expandedPaths: Array<string>,
	prefixes: Array<string>,
	onSelect: (selectedPaths: Array<string>) => void,
	onExpandedPathsChange: (expandedPaths: Array<string>) => void,
	onParameterChoose: (parameters: Array<string>) => void,
};

export const pathsWithPrefixes = (paths: Array<string>, prefixes: Array<string>) => paths.filter(
	path => path.indexOf(prefixes.join(PATH_DELIMITER)) === 0,
);

export const combinePaths = (prefixes: Array<string>, longPaths: Array<string>, shortPaths: Array<string>): Array<string> => {
	let shortPathIndex = 0;
	const newLongPaths: Array<string> = (longPaths.map((longPath) => {
		const matchesPrefix = longPath.indexOf(prefixes.join(PATH_DELIMITER)) >= 0;
		if (matchesPrefix) {
			const computedLongPath = [...prefixes, shortPaths[shortPathIndex]].join(PATH_DELIMITER);
			if (longPath === computedLongPath) {
				shortPathIndex += 1;
				return longPath;
			} // else long path has been removed, aka. un-checked
			return null;
		}
		return longPath;
	}): any).filter(path => path);
	if (shortPathIndex < shortPaths.length) {
		newLongPaths.push([...prefixes, shortPaths[shortPaths.length - 1]].join(PATH_DELIMITER));
	}
	return newLongPaths;
};

export const filterPaths = (prefixes: Array<string>, paths: Array<string>): Array<string> => pathsWithPrefixes(paths, prefixes).map(
	path => path.split(PATH_DELIMITER).slice(prefixes.length).join(PATH_DELIMITER),
);

export const filterSortedPaths = (
	prefixes: Array<string>,
	paths: Array<string>,
): Array<SortedPath> => paths.map(
	(path, i) => ({ path, globalIndex: i }),
).filter(
	sortedPath => sortedPath.path.indexOf(prefixes.join(PATH_DELIMITER)) === 0,
).map(
	(sortedPath: SortedPath) => ({
		path: sortedPath.path.split(PATH_DELIMITER).slice(prefixes.length).join(PATH_DELIMITER),
		globalIndex: sortedPath.globalIndex,
	}),
);

const PrefixedJSONPropertyChooser = (props: PrefixedJSONPropertyChooserProps) => {
	const { prefixes } = props;

	const onSelect = (selected: Array<string>) => {
		props.onSelect(selected);
		props.onParameterChoose(selected);
	};

	const jsonTree = prefixes.reduce((accumulator, prefix) => accumulator[prefix], props.jsonTree);
	const expandedPaths = filterPaths(prefixes, props.expandedPaths);

	return (
		<JsonPropertyChooser
			position={props.position}
			jsonTree={jsonTree}
			expandedPaths={expandedPaths}
			onSelect={paths => onSelect(combinePaths(props.prefixes, [], paths))}
			onExpandedPathsChange={paths => props.onExpandedPathsChange(combinePaths(props.prefixes, props.expandedPaths, paths))}
		/>
	);
};

PrefixedJSONPropertyChooser.defaultProps = {
	position: undefined,
};

export default PrefixedJSONPropertyChooser;
