// @flow
import * as React from 'react';

import { getFittedWidth, scaleToTime } from 'src/client/app/helpers/scalingPointsToBounds';
import type { Stroke } from 'src/client/app/typeDefinitions';

export type Point2BoundsScalerProps<P> = P & {
	strokes: Array<Stroke>,
	sliderWidth: number,
	previewHeight: number,
	max: number,
};

export type WrappedProps<P> = P & {
	strokes: Array<Stroke>,
	fittedWidth: number,
	finished: boolean,
	showBorder: boolean,
}

export default (Wrapped: React.ComponentType<WrappedProps<any>>) =>
	class extends React.PureComponent<Point2BoundsScalerProps<any>> {
	props: Point2BoundsScalerProps<any>;

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
