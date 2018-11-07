// @flow
import * as React from 'react';

import SketchTransformer, { type SketchTransformerProps } from 'src/decorators/SketchTransformer';
import PlainSketch, { type PlainSketchProps } from 'src/components/Sketch/PlainSketch';

import SketchFitter, { type SketchFitterProps } from './SketchFitter';
import Point2BoundsScaler, { type Point2BoundsScalerProps } from './Point2BoundsScaler';
import ClickHandler, { type ClickHandlerProps } from './ClickHandler';

export type TimelineCanvasProps = ClickHandlerProps<Point2BoundsScalerProps<
	SketchTransformerProps<SketchFitterProps<PlainSketchProps>>
>>;

const TimelineCanvas: React.ComponentType<TimelineCanvasProps> = ClickHandler(
	Point2BoundsScaler(SketchTransformer(SketchFitter(PlainSketch))),
);

export default TimelineCanvas;
