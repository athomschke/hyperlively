import React, { Component, PropTypes } from 'react';
import actions from 'actions/actions';
import HoverList from 'components/smart/HoverList';
import Modal from 'react-modal';
import { TreeMenu } from 'react-tree-menu';
import { last, keys, map, cloneDeep, filter, isEqual, findIndex, reduce } from 'lodash';
import { actionChooser } from 'stylesheets/components/smart/actionChooser';

const findArraysIndex = (containingArray, containedArray) => {
	return findIndex(containingArray, (possibleMatch) => {
		return isEqual(possibleMatch, containedArray);
	});
};

const findArraysEndingOnItem = (arrays, item) => {
	return arrays.filter((matchingCheck) => {
		return last(matchingCheck) === item;
	});
};

const formatTreeNode = (object, key, keyChecks, allChecks, children, keyCollapses) => {
	let matchingChecks = findArraysEndingOnItem(keyChecks, key);
	let parameterIndex = findArraysIndex(allChecks, matchingChecks[0]);
	let parameterIndicator = parameterIndex >= 0 ? ` (parameter ${parameterIndex})` : '';
	let item = {
		checkbox: true,
		checked: matchingChecks.length > 0,
		key: key
	};
	if (children) {
		item.label = `${key}${parameterIndicator}`;
		item.children  = children;
		item.collapsed = findArraysEndingOnItem(keyCollapses, key).length > 0;
		item.collapsible = true;
	} else {
		item.label = `${key}: ${object[key]}${parameterIndicator}`;
	}
	return item;
};

export default class ActionChooser extends Component {

	static propTypes = {
		isOpen: PropTypes.bool,
		onActionChoose: PropTypes.func,
		jsonTree: PropTypes.object,
		onCheckChange: PropTypes.func,
		lastStrokes: PropTypes.array,
		selectedStrokes: PropTypes.array
	};

	static defaultProps = {
		isOpen: false,
		onActionChoose: () => {},
		jsonTree: {},
		onCheckChange: () => {},
		lastStrokes: [],
		selectedStrokes: []
	}

	componentDidMount () {
		this.setState({
			checkedPaths: [],
			collapsedPaths: []
		});
	}

	formatObject(anObject, checkedArrays, collapsedArrays, originalCheckedArrays, depth) {
		return map(keys(anObject), (key) => {
			let checksContainingNode = filter(checkedArrays, (checkedArray) => {
				return checkedArray[depth] === key;
			});
			let collapsesContainingNode = filter(collapsedArrays, (collapsedArray) => {
				return collapsedArray[depth] === key;
			});
			let children;
			if (anObject[key] instanceof Object) {
				children = this.formatObject(anObject[key], checksContainingNode, collapsesContainingNode, originalCheckedArrays, depth + 1);
			}
			return formatTreeNode(anObject, key, checksContainingNode, originalCheckedArrays, children, collapsesContainingNode);
		}, this);
	}

	getPathToProperty(nestedArrayPath, arrayedJsonTree) {
		let node = {
			children: arrayedJsonTree
		};
		return map(nestedArrayPath, (index) => {
			node = node.children[index];
			return node.key;
		});
	}

	onTreeNodeCheckChange(path) {
		let pathToProperty = this.getPathToProperty(path, this.getFormattedData());
		let checkedIndex = findArraysIndex(this.state.checkedPaths, pathToProperty);
		if (checkedIndex >= 0) {
			this.setState({
				checkedPaths: this.state.checkedPaths.slice(0, checkedIndex).concat(this.state.checkedPaths.slice(checkedIndex + 1))
			});
		} else {
			this.setState({
				checkedPaths: this.state.checkedPaths.concat([pathToProperty])
			});
		}
		this.props.onCheckChange();
	}

	onTreeNodeCollapseChange(path) {
		let pathToProperty = this.getPathToProperty(path, this.getFormattedData());
		let collapsedIndex = findArraysIndex(this.state.collapsedPaths, pathToProperty);
		if (collapsedIndex >= 0) {
			this.setState({
				collapsedPaths: this.state.collapsedPaths.slice(0, collapsedIndex).concat(this.state.collapsedPaths.slice(collapsedIndex + 1))
			});
		} else {
			this.setState({
				collapsedPaths: this.state.collapsedPaths.concat([pathToProperty])
			});
		}
	}

	getFormattedData() {
		let rawData = cloneDeep(this.props.jsonTree);
		rawData.lastStrokes = this.props.lastStrokes;
		if (this.props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = this.props.selectedStrokes;
		}
		return this.formatObject(rawData, this.state && this.state.checkedPaths, this.state && this.state.collapsedPaths, this.state && this.state.checkedPaths, 0);
	}

	onActionChoose (event, name) {
		let rawData = {
			lastStrokes: this.props.lastStrokes
		};
		if (this.props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = this.props.selectedStrokes;
		}
		Object.assign(rawData, this.props.jsonTree);
		let values = map(this.state.checkedPaths, (checkedPath) => {
			return reduce(checkedPath, (value, key) => {
				return value[key];
			}, rawData);
		});
		this.props.onActionChoose(event, name, values);
		this.setState({
			checkedPaths: []
		});
	}

	render() {
		return (
			<Modal className={actionChooser} ref='modal' {...this.props}
				contentLabel="I am required by a11y"
			>
				<HoverList ref='list' {...this.props}
					onItemClick={(event, name) => {
						this.onActionChoose(event, name);
					}}
					items={Object.keys(actions).map((actionName) => actionName)}
				/>
				<TreeMenu ref='tree'
					data={this.getFormattedData()}
					collapsible={true}
					expandIconClass='expand'
					collapseIconClass='collapse'
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