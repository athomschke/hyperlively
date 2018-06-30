// @flow
import * as React from 'react';

import SketchTransformer, { type SketchTransformerProps } from 'src/client/app/components/SketchTransformer';
import PlainDrawer, { type PlainDrawerProps } from 'src/client/app/components/Drawer/PlainDrawer';

import SketchFitter, { type SketchFitterProps } from './SketchFitter';
import Point2BoundsScaler, { type Point2BoundsScalerProps } from './Point2BoundsScaler';
import ClickHandler, { type ClickHandlerProps } from './ClickHandler';

export type TimelineCanvasProps = ClickHandlerProps<Point2BoundsScalerProps<
  SketchTransformerProps<SketchFitterProps<PlainDrawerProps>>
>>;

const TimelineCanvas: React.ComponentType<TimelineCanvasProps> =
ClickHandler(Point2BoundsScaler(SketchTransformer(SketchFitter(PlainDrawer))));

export default TimelineCanvas;
