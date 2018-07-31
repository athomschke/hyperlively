// @flow
import * as React from 'react';
import { cloneDeep } from 'lodash';

import type { Bounds, Stroke } from 'src/types';
import { SLIDER_HEIGHT } from 'src/constants/configuration';

import { offsetToOrigin, getOffsetForTime } from './sketchFitting';

export type SketchFitterProps<P> = P & {
	bounds: Bounds,
	fittedWidth: number,
	previewHeight: number,
	htmlWidth: number,
	max: number,
	offsetIndex: number,
	strokes: Array<Stroke>,
	index: number,
};

export type WrappedProps<P> = P & {
	bounds: Bounds,
}

export default (Wrapped: React.ComponentType<WrappedProps<any>>) => class SketchFitter extends React.PureComponent<SketchFitterProps<any>> {
	props: SketchFitterProps<any>;

	render() {
		const {
			fittedWidth,
			previewHeight,
			htmlWidth,
			offsetIndex,
			index,
			...rest
		} = this.props;

		const clonedBounds = cloneDeep(this.props.bounds);
		clonedBounds.width = fittedWidth;
		clonedBounds.height = previewHeight;
		const moveBy = offsetToOrigin(this.props.strokes);
		const top = -moveBy.y + ((SLIDER_HEIGHT - previewHeight) / 2);
		const left = -moveBy.x + getOffsetForTime(
			this.props.strokes, htmlWidth, this.props.max, offsetIndex,
		);
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
