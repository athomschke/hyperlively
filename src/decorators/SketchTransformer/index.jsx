// @flow
import * as React from 'react';
import { find, reduce } from 'lodash';

import type { Stroke, Bounds } from 'src/types';

const joinBounds = (bounds1, bounds2) => ({
	left: Math.min(bounds1.left, bounds2.left),
	top: Math.min(bounds1.top, bounds2.top),
	right: Math.max(bounds1.right, bounds2.right),
	bottom: Math.max(bounds1.bottom, bounds2.bottom),
});

const extendBoundsToPoint = (bounds, point, position) => ({
	left: Math.min(bounds.left, point.x + position.x),
	top: Math.min(bounds.top, point.y + position.y),
	right: Math.max(bounds.right, point.x + position.x),
	bottom: Math.max(bounds.bottom, point.y + position.y),
});

const getLimitsForStrokes = (strokes) => {
	if (strokes.length && find(strokes, stroke => (stroke.points.length > 0))) {
		const infiniteBounds = {
			left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity,
		};
		return reduce(strokes, (bounds, stroke) => {
			const reduced = reduce(
				stroke.points,
				(curBounds, point) => extendBoundsToPoint(curBounds, point, stroke.position),
				bounds,
			);
			return joinBounds(bounds, reduced);
		}, infiniteBounds);
	}
	return {
		left: 0, top: 0, right: 0, bottom: 0,
	};
};

export type SketchTransformerProps<P> = P & {
	strokes: Array<Stroke>,
	finished?: bool,
	offset?: number,
}

type WrappedProps<P> = P & {
	bounds: Bounds
}

const getBoundsForLimits = (limits: {
	left: number,
	top: number,
	bottom: number,
	right: number
}, offset: number) => ({
	x: limits.left - offset,
	y: limits.top - offset,
	width: (limits.right - limits.left) + (2 * offset),
	height: (limits.bottom - limits.top) + (2 * offset),
});

const getContentTransform = (strokes: Array<Stroke>, offset: number) => {
	const strokeLimits = getLimitsForStrokes(strokes);
	const bounds = getBoundsForLimits(strokeLimits, offset);
	return bounds;
};

const getCanvasTransform = (strokes: Array<Stroke>, finished: boolean, offset: number) => {
	if (finished) {
		return getContentTransform(strokes, offset);
	}
	return {
		x: 0, y: 0, width: window.innerWidth, height: window.innerHeight,
	};
};

export default (
	Wrapped: React.ComponentType<WrappedProps<any>>,
) => (props: SketchTransformerProps<any>) => {
	const { offset, ...rest } = props;

	return (
		<Wrapped
			{...rest}
			bounds={getCanvasTransform(props.strokes, props.finished, offset || 0)}
		/>
	);
};
