// @flow
import React, { PureComponent } from 'react';
import type { ClassComponent } from 'react-flow-types';

import { getFittedWidth, scaleToTime } from 'helpers/scalingPointsToBounds';
import type { Stroke } from 'typeDefinitions';

type Props = {
	strokes: Array<Stroke>,
	sliderWidth: number,
	previewHeight: number,
	max: number,
};

// type WrappedProps = {
// 	strokes: Array<Stroke>;
// 	fittedWidth: number;
// 	finished: boolean;
// 	showBorder: boolean;
// 	[key: string]: any;
// }

export default (Wrapped: ClassComponent<any, any>) => class extends PureComponent<Props> {
	props: Props;

	static defaultProps = {
		strokes: [],
		sliderWidth: 0,
		previewHeight: 0,
		max: 0,
	};

	render() {
		const fittedWidth = getFittedWidth(this.props.strokes, this.props.sliderWidth, this.props.max);
		const strokes = scaleToTime(this.props.strokes, fittedWidth, this.props.previewHeight);
		return (<Wrapped
			{...this.props}
			strokes={strokes}
			fittedWidth={fittedWidth}
			finished
			showBorder
		/>);
	}

};
