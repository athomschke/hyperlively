// @flow
import {
	last, keys, map, filter, isEqual, findIndex,
} from 'lodash';

import { PATH_DELIMITER } from 'src/constants/configuration';
import type { ReactTreeNodeFormat, ReactTreeLeafFormat, JSONPath } from 'src/types';

const extendedPath = (path?: string, key: string) => [
	...(path ? path.split(PATH_DELIMITER) : []),
	key,
].join(PATH_DELIMITER);

export const valueAtPath = (obj: Object, path: string) => path.split(PATH_DELIMITER).reduce((subtree, key) => subtree[key], obj);

export const findArraysIndex = (
	containingArray: JSONPath,
	containedArray: Array<any>,
): number => findIndex(containingArray, possibleMatch => isEqual(possibleMatch, containedArray));

export const findArraysEndingOnItem = (
	arrays: JSONPath,
	item: string,
	depth: number,
): JSONPath => filter(arrays, matchingCheck => (last(matchingCheck) === item) && matchingCheck.length === depth + 1);

const formatTreeNode = (
	object: Object,
	allChecks: Array<string>,
	children: Array<ReactTreeLeafFormat | ReactTreeNodeFormat>,
	allCollapses: Array<string>,
	path: string,
): ReactTreeNodeFormat => {
	const checked = allChecks.indexOf(path) >= 0;
	const parameterIndex: number = allChecks.indexOf(path);
	const parameterIndicator: string = parameterIndex >= 0 ? ` (property ${parameterIndex})` : '';
	return {
		checkbox: true,
		checked,
		key: path,
		label: `${last(path.split(PATH_DELIMITER))}${parameterIndicator}`,
		children,
		collapsed: allCollapses.indexOf(path) >= 0,
		collapsible: true,
		isLeaf: false,
	};
};

export const formatTreeLeaf = (
	object: Object,
	allChecks: Array<string>,
	path: string,
): ReactTreeLeafFormat => {
	const checked = allChecks.indexOf(path) >= 0;
	const parameterIndex: number = allChecks.indexOf(path);
	const parameterIndicator: string = parameterIndex >= 0 ? ` (property ${parameterIndex})` : '';
	const propKey = last(path.split(PATH_DELIMITER));
	return {
		checkbox: true,
		checked,
		key: path,
		label: `${propKey}: ${object[propKey]}${parameterIndicator}`,
		isLeaf: true,
	};
};

export const getPathToProperty = (
	nestedArrayPath: Array<number>,
	arrayedJsonTree: Array<ReactTreeNodeFormat | ReactTreeLeafFormat>,
): Array<string> => {
	let node = {
		children: arrayedJsonTree,
	};
	return map(nestedArrayPath, (index) => {
		const children: any = node.children;
		if (children && children.length > 0) {
			node = children[index];
		} else {
			throw new Error('cannot access json property');
		}
		return node.key;
	});
};

export const arraysWithStringAtIndex = (
	arrays: Array<Array<string>>,
	string: string,
	index: number,
): Array<Array<string>> => filter(arrays, (array: Array<string>) => array[index] === string);

export const formatObject = (
	anObject: Object,
	checkedPaths: Array<string>,
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
