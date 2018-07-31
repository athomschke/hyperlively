// @flow
import { last, keys } from 'lodash';

import { PATH_DELIMITER } from 'src/constants/configuration';
import type {
	ReactTreeNodeFormat,
	ReactTreeLeafFormat,
	SortedPath,
} from 'src/types';

const extendedPath = (path?: string, key: string) => [
	...(path ? path.split(PATH_DELIMITER) : []),
	key,
].join(PATH_DELIMITER);

const formatTreeNode = (
	object: Object,
	allChecks: Array<SortedPath>,
	children: Array<ReactTreeLeafFormat | ReactTreeNodeFormat>,
	allCollapses: Array<string>,
	path: string,
): ReactTreeNodeFormat => {
	const checkedPath: SortedPath | typeof undefined = allChecks.find(sortedPath => sortedPath.path === path);
	const checked = !!checkedPath;
	let label = last(path.split(PATH_DELIMITER));
	if (checkedPath) {
		label += ` (property ${checkedPath.globalIndex})`;
	}
	return {
		checkbox: true,
		checked,
		key: path,
		label,
		children,
		collapsed: allCollapses.indexOf(path) >= 0,
		collapsible: true,
		isLeaf: false,
	};
};

export const formatTreeLeaf = (
	object: Object,
	allChecks: Array<SortedPath>,
	path: string,
): ReactTreeLeafFormat => {
	const sortedCheckedPath: SortedPath | typeof undefined = allChecks.find(sortedPath => sortedPath.path === path);
	const checked = !!sortedCheckedPath;
	const propKey = last(path.split(PATH_DELIMITER));
	let label = `${propKey}: ${object[propKey]}`;
	if (sortedCheckedPath) {
		const parameterIndex: number = sortedCheckedPath.globalIndex;
		label += parameterIndex >= 0 ? ` (property ${parameterIndex})` : '';
	}
	return {
		checkbox: true,
		checked,
		key: path,
		label,
		isLeaf: true,
	};
};

export const formatObject = (
	anObject: Object,
	checkedPaths: Array<SortedPath>,
	collapsedPaths: Array<string>,
	path?: string,
): Array<ReactTreeLeafFormat | ReactTreeNodeFormat> => keys(anObject).map((key: string) => {
	let children: Array<ReactTreeLeafFormat | ReactTreeNodeFormat> = [];
	if (anObject[key] instanceof Object) {
		children = formatObject(
			anObject[key],
			checkedPaths,
			collapsedPaths,
			extendedPath(path, key),
		);
	}
	if (children.length > 0) {
		return formatTreeNode(
			anObject,
			checkedPaths,
			children,
			collapsedPaths,
			extendedPath(path, key),
		);
	}
	return formatTreeLeaf(
		anObject,
		checkedPaths,
		extendedPath(path, key),
	);
}, this);
