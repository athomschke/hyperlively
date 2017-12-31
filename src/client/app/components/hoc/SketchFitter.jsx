// @flow
import React, { PureComponent } from 'react';
import type { ClassComponent } from 'react-flow-types';
import { cloneDeep } from 'lodash';

import { offsetToOrigin, getOffsetForTime } from 'src/client/app/helpers/sketchFitting';
import type { Bounds, Stroke } from 'src/client/app/typeDefinitions';

type Props = {
	index: number,
	sliderWidth: number,
	sliderHeight: number,
	max: number,
	offsetIndex: number,
	bounds: Bounds,
	fittedWidth: number,
	previewHeight: number,
	strokes: Array<Stroke>,
};

// type WrappedProps = {
// 	bounds: Bounds;
// 	[key: string]: any;
// }

export default (Wrapped: ClassComponent<any, any>) => class extends PureComponent<Props> {
	props: Props;

	static defaultProps = {
		index: 0,
		sliderWidth: 0,
		sliderHeight: 0,
		max: 0,
		offsetIndex: 0,
	};

	render() {
		const clonedBounds = cloneDeep(this.props.bounds);
		clonedBounds.width = this.props.fittedWidth;
		clonedBounds.height = this.props.previewHeight;
		const moveBy = offsetToOrigin(this.props.strokes);
		const top = -moveBy.y + ((this.props.sliderHeight - this.props.previewHeight) / 2);
		const left = -moveBy.x + getOffsetForTime(
				this.props.strokes, this.props.sliderWidth, this.props.max, this.props.offsetIndex);
		return (
			<div
				key={this.props.index}
				style={{
					position: 'absolute',
					top,
					left,
				}}
			>
				<Wrapped
					{...this.props}
					bounds={clonedBounds}
				/>
			</div>);
	}

};
