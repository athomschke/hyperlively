import React, {Component, PropTypes} from 'react';

'use strict'

export default class Checkbox extends Component {

	static propTypes = {
		onChange: PropTypes.func,
		checked: PropTypes.bool
	};

	static defaultProps = {
		onChange: () => {},
		checked: true
	};

	onClick() {
		this.props.onChange(!this.props.checked);
	}

	render() {
		return (
			<input 
				type='checkbox'
				checked={this.props.checked}
				onClick={this.onClick.bind(this)}
				onChange={()=>{}}
			/>
		)
	}

}