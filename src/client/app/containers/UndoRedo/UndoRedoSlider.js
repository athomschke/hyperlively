import Slider, { type Props as SliderProps } from 'rc-slider';

import TimeoutBehavior, { type TimeoutBehaviorProps } from 'src/client/app/components/TimeoutBehavior';
import HTMLWidth, { type HTMLWidthProps } from 'src/client/app/components/HTMLWidth';

export type UndoRedoSliderProps = HTMLWidthProps<TimeoutBehaviorProps<SliderProps>>

export default HTMLWidth(TimeoutBehavior(Slider));
