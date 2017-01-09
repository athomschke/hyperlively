import React, { Component, PropTypes } from 'react';
import actions from 'actions/actions';
import HoverList from 'components/smart/HoverList';
import Modal from 'react-modal';
import { TreeMenu } from 'react-tree-menu';
import { keys, map, cloneDeep, filter, isEqual, findIndex, reduce } from 'lodash';
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
			let matchingChecks = filter(checkedArrays, (checkedArray) => {
				return checkedArray[depth] === key;
			});
			if (anObject[key] instanceof Object) {
				return {
					label: key,
					children: that.formatObject(anObject[key], matchingChecks, originalCheckedArrays, depth + 1)
				};
			} else {
				let parameterIndex = findArraysIndex(checkedArrays, matchingChecks[0]);
				let parameterIndicator = parameterIndex >= 0 ? ` (parameter ${parameterIndex})` : '';
				return {
					label: `${key}: ${anObject[key]}${parameterIndicator}`,
					checkbox: true,
					checked: matchingChecks.length > 0
				};
			}
		});
	}

	getPathToProperty(nestedArrayPath, arrayedJsonTree) {
		let node = {
			children: arrayedJsonTree
		};
		return map(nestedArrayPath, (index) => {
			node = node.children[index];
			return node.label.split(':')[0];
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
		return this.formatObject(rawData, this.state && this.state.checkedPaths);
	}

	onActionChoose (event, name) {
		let values = map(this.state.checkedPaths, (checkedPath) => {
			return reduce(checkedPath, (value, key) => {
				return value[key];
			}, this.props.jsonTree);
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