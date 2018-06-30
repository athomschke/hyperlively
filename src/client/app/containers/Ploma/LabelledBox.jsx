// @flow
import React, { PureComponent } from 'react';

import Checkbox from 'src/client/app/containers/Ploma/Checkbox';

type Props = {
		label: string;
}

export default class LabelledBox extends PureComponent<Props> {
	static defaultProps = {
		label: '',
	};

	props: Props;

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
