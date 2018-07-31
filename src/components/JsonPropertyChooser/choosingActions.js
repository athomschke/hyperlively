// @flow
import { isEqual } from 'lodash';

import { PATH_DELIMITER } from 'src/constants/configuration';
import type { ReactTreeNodeFormat, ReactTreeLeafFormat, SortedPath } from 'src/types';
import { stroke } from 'src/reducers/data/strokes/stroke';

const blacklistedKeys = ['strokeIds'];

const isStroke = (anObject: Object): boolean => isEqual(Object.keys(anObject), Object.keys(stroke(undefined, { type: '' })));

const formatLabel = (key: string, value: Object, sortedCheckedPath?: SortedPath): string => {
	let label = key;
	if (value instanceof Object) {
		if (value.label) {
			label = value.label;
		}
		if (isStroke(value)) {
			const { points } = value;
			const { length } = points;
			const start = length > 0 ? `[${points[0].x}, ${points[0].y}]` : '';
			const end = length > 1 ? `[${points[length - 1].x}, ${points[length - 1].y}]` : '';
			label = `stroke ${label} (${points.length} points, from ${start} to ${end})`;
		}
	} else {
		label += `: ${value.toString()}`;
	}
	if (sortedCheckedPath) {
		label += ` (property ${sortedCheckedPath.globalIndex})`;
	}
	return label;
};

export const formatObject = (
	anObject: Object,
	sortedCheckedPaths: Array<SortedPath>,
	collapsedPaths: Array<string>,
	path?: string,
): Array<ReactTreeLeafFormat | ReactTreeNodeFormat> => Object
	.keys(anObject)
	.filter(key => anObject[key] && blacklistedKeys.indexOf(key) < 0)
	.map((key: string) => {
		const extendedPath = path ? `${path}${PATH_DELIMITER}${key}` : key;
		const sortedCheckedPath: SortedPath | typeof undefined = sortedCheckedPaths.find(sortedPath => sortedPath.path === extendedPath);
		const checked = !!sortedCheckedPath;
		const label = formatLabel(key, anObject[key], sortedCheckedPath);

		const treeFormat = {
			key: extendedPath,
			checkbox: true,
			checked,
			label,
		};

		if (anObject[key] instanceof Object && !isStroke(anObject[key])) {
			const collapsed = collapsedPaths.indexOf(extendedPath) >= 0;
			const children = formatObject(anObject[key], sortedCheckedPaths, collapsedPaths, extendedPath);
			return ({
				...treeFormat,
				isLeaf: false,
				collapsible: true,
				collapsed,
				children,
			}: ReactTreeNodeFormat);
		}

		return ({
			...treeFormat,
			isLeaf: true,
		}: ReactTreeLeafFormat);
	}, this);
