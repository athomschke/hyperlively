import { last, keys, map, filter, isEqual, findIndex } from 'lodash';

export const findArraysIndex = (containingArray, containedArray) =>
	findIndex(containingArray, possibleMatch =>
		isEqual(possibleMatch, containedArray));

const findArraysEndingOnItem = (arrays, item) =>
	arrays.filter(matchingCheck =>
		last(matchingCheck) === item);

const formatTreeNode = (object, key, keyChecks, allChecks, children, keyCollapses) => {
	const matchingChecks = findArraysEndingOnItem(keyChecks, key);
	const parameterIndex = findArraysIndex(allChecks, matchingChecks[0]);
	const parameterIndicator = parameterIndex >= 0 ? ` (parameter ${parameterIndex})` : '';
	const item = {
		checkbox: true,
		checked: matchingChecks.length > 0,
		key,
	};
	if (children) {
		item.label = `${key}${parameterIndicator}`;
		item.children = children;
		item.collapsed = findArraysEndingOnItem(keyCollapses, key).length > 0;
		item.collapsible = true;
	} else {
		item.label = `${key}: ${object[key]}${parameterIndicator}`;
	}
	return item;
};

export const getPathToProperty = (nestedArrayPath, arrayedJsonTree) => {
	let node = {
		children: arrayedJsonTree,
	};
	return map(nestedArrayPath, (index) => {
		node = node.children[index];
		return node.key;
	});
};

export const formatObject = (anObject, checkedArrays, collapsedArrays, origCheckedArrays, depth) =>
	map(keys(anObject), (key) => {
		const checksContainingNode = filter(checkedArrays, checkedArray =>
			checkedArray[depth] === key);
		const collapsesContainingNode = filter(collapsedArrays, collapsedArray =>
			collapsedArray[depth] === key);
		let children;
		if (anObject[key] instanceof Object) {
			children = formatObject(
				anObject[key],
				checksContainingNode,
				collapsesContainingNode,
				origCheckedArrays,
				depth + 1);
		}
		return formatTreeNode(
			anObject,
			key,
			checksContainingNode,
			origCheckedArrays,
			children,
			collapsesContainingNode);
	}, this);
