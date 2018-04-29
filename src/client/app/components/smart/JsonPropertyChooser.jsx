// @flow
import React, { PureComponent } from 'react';
import { TreeMenu } from 'react-tree-menu';
import { cloneDeep, map, keys } from 'lodash';

import { getPathToProperty, findArraysIndex, formatObject } from 'src/client/app/helpers/choosingActions';
import type { TreeParameter } from 'src/client/app/typeDefinitions';

type State = {
	collapsedPaths: Array<Array<string>>,
	checkedPaths: Array<Array<string>>,
};


export type JSONObject = {
	[key: string]: Array<JSONObject | string | number> | JSONObject | string | number
}

export type JsonPropertyChooserProps = {
	jsonTree: JSONObject,
	onParameterChoose: (parameters: Array<TreeParameter>) => void,
}

export default class JsonPropertyChooser extends PureComponent<JsonPropertyChooserProps, State> {

	static defaultProps: JsonPropertyChooserProps = {
		jsonTree: {},
		onParameterChoose: (_parameters: Array<TreeParameter>) => {},
	}

	state: State;

	componentDidMount() {
		this.state = {
			collapsedPaths: [],
			checkedPaths: [],
		};
	}

	componentWillReceiveProps(props: any) {
		this.state = Object.assign({}, this.state, {
			collapsedPaths: map(keys(props.jsonTree), key => [key]),
		});
	}

	onTreeNodeCheckChange(path: Array<number>) {
		const pathToProperty: Array<string> =
			getPathToProperty(path, this.getFormattedData());
		const checkedIndex: number =
			findArraysIndex(this.state.checkedPaths, pathToProperty);
		let checkedPaths: Array<Array<string>>;
		if (checkedIndex >= 0) {
			checkedPaths = this.state.checkedPaths
				.slice(0, checkedIndex)
				.concat(this.state.checkedPaths.slice(checkedIndex + 1));
		} else {
			checkedPaths = this.state.checkedPaths.concat([pathToProperty]);
		}
		const rawData: JSONObject = {
			...this.props.jsonTree,
		};
		const mixedValues = checkedPaths
			.map(checkedPath =>
				checkedPath.reduce((value, key) => {
					if (
						(typeof key === 'number' && value instanceof Array) ||
						(typeof key === 'string' && value instanceof Object)
					) {
						return value[key];
					}
					return null;
				},
				rawData,
			));
		// $FlowFixMe needs flow array type refinement, see https://github.com/facebook/flow/issues/1414
		const values: Array<JSONObject | string | number> = mixedValues.filter(value => value !== null);
		this.props.onParameterChoose(values);
		this.setState({
			checkedPaths,
		});
	}

	onTreeNodeCollapseChange(path: Array<number>) {
		const pathToProperty: Array<string> =
			getPathToProperty(path, this.getFormattedData());
		const collapsedIndex: number =
			findArraysIndex(this.state.collapsedPaths, pathToProperty);
		if (collapsedIndex >= 0) {
			this.setState({
				collapsedPaths: this.state.collapsedPaths
					.slice(0, collapsedIndex)
					.concat(this.state.collapsedPaths.slice(collapsedIndex + 1)),
			});
		} else {
			this.setState({
				collapsedPaths: this.state.collapsedPaths.concat([pathToProperty]),
			});
		}
	}

	getFormattedData() {
		const rawData: Object = cloneDeep(this.props.jsonTree);
		return formatObject(
			rawData,
			this.state && this.state.checkedPaths,
			this.state && this.state.collapsedPaths,
			this.state && this.state.checkedPaths,
			0);
	}

	props: JsonPropertyChooserProps

	render() {
		return (<TreeMenu
			data={this.getFormattedData()}
			collapsible
			expandIconClass="expand"
			collapseIconClass="collapse"
			onTreeNodeCheckChange={(path) => {
				this.onTreeNodeCheckChange(path);
			}}
			onTreeNodeCollapseChange={(path) => {
				this.onTreeNodeCollapseChange(path);
			}}
		/>);
	}

}
