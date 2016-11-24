import React, { Component, PropTypes } from 'react';
import map from 'lodash';

export default class extends Component {

	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.string),
		onChange: PropTypes.func
	};

	static defaultProps = {
		items: [],
		onChange: () => {}
	}

	getStyle() {
		let height = this.props.items.length * 20;
		let width = 100;
		return {
			position: 'absolute',
			width: width,
			height: height,
			top: window.innerHeight / 2 - (height / 2),
			left: window.innerWidth  / 2 - (width / 2)
		};
	}

	renderItem(name, id) {
		let that = this;
		return (<li
			key={id}
			onClick={() => {
				that.props.onChange.apply(that, [name]);
			}}
		>{name}</li>);
	}

	renderItems() {
		return map(this.props.items, this.renderItem);
	}

	render() {
		return (<ul
			style={this.getStyle()}
			>
			{this.renderItems()}
		</ul>);
	}
}