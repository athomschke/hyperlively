// @flow
import * as React from 'react';

export type ModuleChooserProps<P> = P & {
	componentIndex: number
};

export type WrappedProps<P> = P;

export default (components: Array<React.ComponentType<WrappedProps<any>>>) => class ModuleChooser extends React.PureComponent<any> {
	props: ModuleChooserProps<any>;

	render() {
		const { componentIndex, ...rest } = this.props;
		const ChosenMudule = components[componentIndex];
		if (ChosenMudule) {
			return <ChosenMudule {...rest} />;
		}
		return <div />;
	}
};
