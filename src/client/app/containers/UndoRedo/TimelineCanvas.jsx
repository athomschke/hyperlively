// @flow
import * as React from 'react';

import Point2BoundsScaler, { type Point2BoundsScalerProps } from 'src/client/app/containers/UndoRedo/Point2BoundsScaler';
import SketchTransformer, { type SketchTransformerProps } from 'src/client/app/components/SketchTransformer';
import SketchFitter, { type SketchFitterProps } from 'src/client/app/containers/UndoRedo/SketchFitter';
import PlainDrawer, { type PlainDrawerProps } from 'src/client/app/components/Drawer/PlainDrawer';

import ClickHandler, { type ClickHandlerProps } from './ClickHandler';

export type TimelineCanvasProps = ClickHandlerProps<Point2BoundsScalerProps<
  SketchTransformerProps<SketchFitterProps<PlainDrawerProps>>
>>;

const TimelineCanvas: React.ComponentType<TimelineCanvasProps> =
ClickHandler(Point2BoundsScaler(SketchTransformer(SketchFitter(PlainDrawer))));

export default TimelineCanvas;
