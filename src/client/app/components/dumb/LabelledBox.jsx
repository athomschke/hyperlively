// @flow
import React, { Component, PropTypes } from 'react';
import Checkbox from '../smart/Checkbox';

export default class LabelledBox extends Component {

	static propTypes = {
		label: PropTypes.string,
	};

	static defaultProps = {
		label: '',
	};

	render() {
		return (
			<div>
				<Checkbox
					{...this.props}
				/>
				<span>{this.props.label}</span>
			</div>
		);
	}

}
