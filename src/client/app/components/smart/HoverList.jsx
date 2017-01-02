import React, {Component, PropTypes} from 'react';
import { map } from 'lodash';

export default class HoverList extends Component {

	static propTypes = {
		onItemClick: PropTypes.func,
		items: PropTypes.array
	};

	static defaultProps = {
		onItemClick: () => {},
		items: []
	};

	componentDidMount() {
		this.setState({});
	}

	getItemStyleAt(index) {
		return {
			listStyleType: 'none',
			padding: 5,
			backgroundColor: this.state && (this.state.hoveredIndex === index) ? 'lightGray' : 'transparent'
		};
	}

	onEnterItem(index) {
		this.setState({
			hoveredIndex: index
		});
	}

	onLeaveItem(index) {
		this.setState({
			hoveredIndex: this.state && (this.state.hoveredIndex === index) ? undefined : this.state.hoveredIndex
		});
	}

	renderChildren() {
		return map(this.props.items, (aText, index) => {
			return (<li
				key={index}
				style={this.getItemStyleAt(index)}
				onMouseEnter={this.onEnterItem.bind(this, index)}
				onMouseLeave={this.onLeaveItem.bind(this, index)}
				onClick={(event) => {
					this.props.onItemClick(event, aText);
				}}
			>{aText}</li>);
		});
	}

	render() {
		return (<ul className='list-view'>
			{this.renderChildren()}
		</ul>);
	}
}