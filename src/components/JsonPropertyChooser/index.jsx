// @flow
import React from 'react';
import { cloneDeep } from 'lodash';
import Tree, { TreeNode } from 'rc-tree';

import type { Coordinate, ReactTreeLeafFormat, ReactTreeNodeFormat } from 'src/types';

import formatObject from './formatObject';
import style from './index.scss';

export type JSONObject = {
	[key: string]: any;
}

export type JsonPropertyChooserProps = {
	position: ?Coordinate,
	jsonTree: JSONObject,
	expandedPaths: Array<string>,
	onCheckedPathsChange: (checkedPaths: Array<string>) => void,
	onExpandedPathsChange: (expandedPaths: Array<string>) => void,
}

const renderTreeNodes = (data: Array<ReactTreeLeafFormat | ReactTreeNodeFormat>) => data.map(nodeData => (
	<TreeNode
		title={nodeData.label}
		key={nodeData.key}
	>
		{nodeData.isLeaf ? null : renderTreeNodes(nodeData.children)}
	</TreeNode>
));

const JsonPropertyChooser = (props: JsonPropertyChooserProps) => {
	const getFormattedData = () => {
		const rawData: Object = cloneDeep(props.jsonTree);
		return formatObject(
			rawData,
			props.expandedPaths,
		);
	};

	const onSelect = selected => props.onCheckedPathsChange(selected);

	const data = getFormattedData();
	const divStyle: any = {};
	const position = props.position;
	if (position) {
		divStyle.position = 'absolute';
		divStyle.left = position.x;
		divStyle.top = position.y;
	}

	return (
		<div className={style.treeView} style={divStyle}>
			<Tree
				prefixCls="json-property-chooser-tree"
				expandedKeys={props.expandedPaths}
				defaultExpandedKeys={props.expandedPaths}
				defaultExpandParent={false}
				selectedKeys={[]}
				onSelect={onSelect}
				onExpand={props.onExpandedPathsChange}
				selectable
			>
				{renderTreeNodes(data)}
			</Tree>
		</div>
	);
};

export default JsonPropertyChooser;
