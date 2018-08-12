import Slider, { type Props as SliderProps } from 'rc-slider';

import TimeoutBehavior, { type TimeoutBehaviorProps } from 'src/decorators/TimeoutBehavior';
import HTMLWidth, { type HTMLWidthProps } from 'src/decorators/HTMLWidth';

export type UndoRedoSliderProps = HTMLWidthProps<TimeoutBehaviorProps<SliderProps>>

export default HTMLWidth(TimeoutBehavior(Slider));
