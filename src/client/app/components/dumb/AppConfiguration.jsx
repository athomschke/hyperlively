// @flow
import React, { type ChildrenArray, PureComponent } from 'react';

import { configuration } from 'src/client/app/stylesheets/components/dumb/AppConfiguration.scss';

type Props = {
	active: boolean;
	children: ChildrenArray<any>;
}

export default class AppConfiguration extends PureComponent<Props> {
	static defaultProps = {
		active: true,
		children: [],
	}

	props: Props;

	render() {
		return (
			<div
				id="configuration"
				className={configuration}
				style={{
					pointerEvents: this.props.active ? 'auto' : 'none',
				}}
			>
				{this.props.children}
			</div>
		);
	}
}
