// @flow
import * as React from 'react';
import { cloneDeep } from 'lodash';

import { offsetToOrigin, getOffsetForTime } from 'src/client/app/helpers/sketchFitting';
import type { Bounds, Stroke } from 'src/client/app/typeDefinitions';

export type SketchFitterProps<P> = P & {
	bounds: Bounds,
	fittedWidth: number,
	previewHeight: number,
	sliderHeight: number,
	sliderWidth: number,
	max: number,
	offsetIndex: number,
	strokes: Array<Stroke>,
	index: number,
};

export type WrappedProps<P> = P & {
	bounds: Bounds,
}

export default (Wrapped: React.ComponentType<WrappedProps<any>>) =>
	class extends React.PureComponent<SketchFitterProps<any>> {
	props: SketchFitterProps<any>;

	static defaultProps = {
		bounds: {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
		},
		index: 0,
		sliderWidth: 0,
		sliderHeight: 0,
		max: 0,
		offsetIndex: 0,
	};

	render() {
		const {
			fittedWidth,
			previewHeight,
			sliderHeight,
			sliderWidth,
			offsetIndex,
			index,
			...rest
		} = this.props;

		const clonedBounds = cloneDeep(this.props.bounds);
		clonedBounds.width = fittedWidth;
		clonedBounds.height = previewHeight;
		const moveBy = offsetToOrigin(this.props.strokes);
		const top = -moveBy.y + ((sliderHeight - previewHeight) / 2);
		const left = -moveBy.x + getOffsetForTime(
			this.props.strokes, sliderWidth, this.props.pointsCount, offsetIndex);
		return (
			<div
				key={index}
				style={{
					position: 'absolute',
					top,
					left,
				}}
			>
				<Wrapped
					{...rest}
					bounds={clonedBounds}
				/>
			</div>);
	}
	};
