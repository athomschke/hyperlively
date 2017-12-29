// @flow
import React, { PureComponent } from 'react';
import { TreeMenu } from 'react-tree-menu';
import { cloneDeep, map, reduce, keys } from 'lodash';
import { getPathToProperty, findArraysIndex, formatObject } from 'helpers/choosingActions';
import type { TreeParameter } from '../../typeDefinitions';

type State = {
	collapsedPaths: Array<Array<string>>,
	checkedPaths: Array<Array<string>>,
};

type Props = {
	jsonTree: Object,
	onParameterChoose: (parameters: Array<TreeParameter>) => void,
}

export default class JsonPropertyChooser extends PureComponent<Props, State> {

	static defaultProps = {
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
		const rawData = {};
		Object.assign(rawData, this.props.jsonTree);
		const values: Array<TreeParameter> = map(checkedPaths, (checkedPath: Array<string>) =>
			reduce(checkedPath, (value: Object, key: string) => value[key], rawData));
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

	props: Props

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
