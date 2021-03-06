// @flow
import React, { type ChildrenArray, PureComponent } from 'react';

import style from './AppConfiguration.scss';

export type AppConfigurationProps = {
	active: boolean;
	children: ChildrenArray<any>;
}

export default class AppConfiguration extends PureComponent<AppConfigurationProps> {
	props: AppConfigurationProps;

	render() {
		return (
			<div
				id="configuration"
				className={style.configuration}
				style={{
					pointerEvents: this.props.active ? 'auto' : 'none',
				}}
			>
				{this.props.children}
			</div>
		);
	}
}
