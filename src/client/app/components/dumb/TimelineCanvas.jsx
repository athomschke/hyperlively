// @flow
import * as React from 'react';

import ClickHandler, { type ClickHandlerProps } from 'src/client/app/components/hoc/ClickHandler';
import Point2BoundsScaler, { type Point2BoundsScalerProps } from 'src/client/app/components/hoc/Point2BoundsScaler';
import SketchTransformer, { type SketchTransformerProps } from 'src/client/app/components/hoc/SketchTransformer';
import SketchFitter, { type SketchFitterProps } from 'src/client/app/components/hoc/SketchFitter';
import PlainDrawer, { type PlainDrawerProps } from 'src/client/app/components/smart/PlainDrawer';

export type TimelineCanvasProps = ClickHandlerProps<Point2BoundsScalerProps<
  SketchTransformerProps<SketchFitterProps<PlainDrawerProps>>
>>;

const TimelineCanvas: React.ComponentType<TimelineCanvasProps> =
ClickHandler(Point2BoundsScaler(SketchTransformer(SketchFitter(PlainDrawer))));

export default TimelineCanvas;
