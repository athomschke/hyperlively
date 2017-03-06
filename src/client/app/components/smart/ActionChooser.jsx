import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { TreeMenu } from 'react-tree-menu';
import { last, keys, map, cloneDeep, filter, isEqual, findIndex, reduce } from 'lodash';
import HoverList from './HoverList';
import actions from 'actions/actions';
import { actionChooser } from 'stylesheets/components/smart/actionChooser';

const findArraysIndex = (containingArray, containedArray) =>
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

export default class ActionChooser extends Component {

	static propTypes = {
		onActionChoose: PropTypes.func,
		jsonTree: PropTypes.object,
		onCheckChange: PropTypes.func,
		lastStrokes: PropTypes.arrayOf(PropTypes.object),
		selectedStrokes: PropTypes.arrayOf(PropTypes.object),
	};

	static defaultProps = {
		onActionChoose: () => {},
		jsonTree: {},
		onCheckChange: () => {},
		lastStrokes: [],
		selectedStrokes: [],
	}

	componentDidMount() {
		this.setState({
			checkedPaths: [],
			collapsedPaths: [],
		});
	}

	onTreeNodeCheckChange(path) {
		const pathToProperty = this.getPathToProperty(path, this.getFormattedData());
		const checkedIndex = findArraysIndex(this.state.checkedPaths, pathToProperty);
		if (checkedIndex >= 0) {
			this.setState({
				checkedPaths: this.state.checkedPaths
					.slice(0, checkedIndex)
					.concat(this.state.checkedPaths.slice(checkedIndex + 1)),
			});
		} else {
			this.setState({
				checkedPaths: this.state.checkedPaths.concat([pathToProperty]),
			});
		}
		this.props.onCheckChange();
	}

	onTreeNodeCollapseChange(path) {
		const pathToProperty = this.getPathToProperty(path, this.getFormattedData());
		const collapsedIndex = findArraysIndex(this.state.collapsedPaths, pathToProperty);
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

	onActionChoose(event, signature) {
		const rawData = {
			lastStrokes: this.props.lastStrokes,
		};
		if (this.props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = this.props.selectedStrokes;
		}
		Object.assign(rawData, this.props.jsonTree);
		const values = map(this.state.checkedPaths, checkedPath =>
			reduce(checkedPath, (value, key) => value[key], rawData));
		this.props.onActionChoose(event, this.getFunctionNameFromSignature(signature), values);
		this.setState({
			checkedPaths: [],
		});
	}

	getFormattedData() {
		const rawData = cloneDeep(this.props.jsonTree);
		rawData.lastStrokes = this.props.lastStrokes;
		if (this.props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = this.props.selectedStrokes;
		}
		return this.formatObject(
			rawData,
			this.state && this.state.checkedPaths,
			this.state && this.state.collapsedPaths,
			this.state && this.state.checkedPaths,
			0);
	}

	getPathToProperty(nestedArrayPath, arrayedJsonTree) {
		let node = {
			children: arrayedJsonTree,
		};
		return map(nestedArrayPath, (index) => {
			node = node.children[index];
			return node.key;
		});
	}

	getSignatureFromFunction(aFunction) {
		return aFunction.toString().split(' {')[0].split('function ')[1];
	}

	getActions() {
		return Object.keys(actions).map(actionName =>
			this.getSignatureFromFunction(actions[actionName]));
	}

	getFunctionNameFromSignature(signature) {
		return signature.split('(')[0];
	}

	formatObject(anObject, checkedArrays, collapsedArrays, originalCheckedArrays, depth) {
		return map(keys(anObject), (key) => {
			const checksContainingNode = filter(checkedArrays, checkedArray =>
				checkedArray[depth] === key);
			const collapsesContainingNode = filter(collapsedArrays, collapsedArray =>
				collapsedArray[depth] === key);
			let children;
			if (anObject[key] instanceof Object) {
				children = this.formatObject(
					anObject[key],
					checksContainingNode,
					collapsesContainingNode,
					originalCheckedArrays,
					depth + 1);
			}
			return formatTreeNode(
				anObject,
				key,
				checksContainingNode,
				originalCheckedArrays,
				children,
				collapsesContainingNode);
		}, this);
	}

	render() {
		return (
			<Modal
				className={actionChooser}
				ref="modal"
				{...this.props}
				contentLabel="I am required by a11y"
			>
				<HoverList
					ref="list"
					{...this.props}
					onItemClick={(event, name) => {
						this.onActionChoose(event, name);
					}}
					items={this.getActions()}
				/>
				<TreeMenu
					ref="tree"
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
				/>
			</Modal>);
	}

}
