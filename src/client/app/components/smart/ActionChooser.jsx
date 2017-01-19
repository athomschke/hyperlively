import React, { Component, PropTypes } from 'react';
import actions from 'actions/actions';
import HoverList from 'components/smart/HoverList';
import Modal from 'react-modal';
import { TreeMenu } from 'react-tree-menu';
import { last, keys, map, cloneDeep, filter, isEqual, findIndex, reduce, flatten } from 'lodash';
import { actionChooser } from 'stylesheets/components/smart/actionChooser';

const findArraysIndex = (containingArray, containedArray) => {
	return findIndex(containingArray, (possibleMatch) => {
		return isEqual(possibleMatch, containedArray);
	});
};

export default class ActionChooser extends Component {

	static propTypes = {
		isOpen: PropTypes.bool,
		onActionChoose: PropTypes.func,
		jsonTree: PropTypes.object,
		onCheckChange: PropTypes.func
	};

	static defaultProps = {
		isOpen: false,
		onActionChoose: () => {},
		jsonTree: {},
		onCheckChange: () => {}
	}

	componentDidMount () {
		this.setState({
			checkedPaths: []
		});
	}

	formatObject(anObject, optCheckedArrays, optOriginalCheckedArrays, optDepth) {
		let that = this;
		let checkedArrays = optCheckedArrays || [];
		let originalCheckedArrays = optOriginalCheckedArrays || [];
		let depth = optDepth|| 0;
		return map(keys(anObject), (key) => {
			let checksContainingNode = filter(checkedArrays, (checkedArray) => {
				return checkedArray[depth] === key;
			});
			let children;
			if (anObject[key] instanceof Object) {
				children = that.formatObject(anObject[key], checksContainingNode, originalCheckedArrays, depth + 1);
			}
			let matchingChecks = checksContainingNode.filter((matchingCheck) => {
				return last(matchingCheck) === key;
			});
			let parameterIndex = findArraysIndex(checkedArrays, matchingChecks[0]);
			let parameterIndicator = parameterIndex >= 0 ? ` (parameter ${parameterIndex})` : '';
			let item = {
				checkbox: true,
				checked: matchingChecks.length > 0,
				key: key
			};
			if (children) {
				item.label = `${key}${parameterIndicator}`;
				item.children  = children;
			} else {
				item.label = `${key}: ${anObject[key]}${parameterIndicator}`;
			}
			return item;
		});
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
		findIndex(this.state.checkedPaths, (checkedPath) => {
			return isEqual(checkedPath, pathToProperty);
		});
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

	getFormattedData() {
		let rawData = cloneDeep(this.props.jsonTree);
		if (rawData) {
			rawData.strokes = this.props.strokes;
		}
		return this.formatObject(rawData, this.state && this.state.checkedPaths);
	}

	onActionChoose (event, name) {
		let rawData = {
			strokes: this.props.strokes
		};
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
					onTreeNodeCheckChange={(path) => {
						this.onTreeNodeCheckChange(path);
					}}
				/>
			</Modal>);
	}

}