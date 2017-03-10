import React, { Component, PropTypes } from 'react';
import { map } from 'lodash';

export default class HoverList extends Component {

	static propTypes = {
		onItemClick: PropTypes.func,
		items: PropTypes.arrayOf(PropTypes.string),
	};

	static defaultProps = {
		onItemClick: () => {},
		items: [],
	};

	constructor() {
		super();
		this.onEnterItem = this.onEnterItem.bind(this);
		this.onLeaveItem = this.onLeaveItem.bind(this);
	}

	componentDidMount() {
		this.state = {};
	}

	onEnterItem(event) {
		const hoveredIndex = Array.from(event.target.parentElement.childNodes).indexOf(event.target);
		this.setState({ hoveredIndex });
	}

	onLeaveItem(event) {
		const index = Array.from(event.target.parentElement.childNodes).indexOf(event.target);
		const hoveredIndex = this.state && (this.state.hoveredIndex === index) ?
			undefined :
			this.state.hoveredIndex;
		this.setState({ hoveredIndex });
	}

	getItemStyleAt(index) {
		return {
			listStyleType: 'none',
			padding: 5,
			backgroundColor: this.state && (this.state.hoveredIndex === index) ? 'lightGray' : 'transparent',
		};
	}

	renderChildren() {
		return map(this.props.items, (aText, index) => (
			<li
				key={index}
				style={this.getItemStyleAt(index)}
				onMouseEnter={this.onEnterItem}
				onMouseLeave={this.onLeaveItem}
				onClick={(event) => {
					this.props.onItemClick(event, aText);
				}}
			>
				{aText}
			</li>));
	}

	render() {
		return (<ul className="list-view">
			{this.renderChildren()}
		</ul>);
	}
}
