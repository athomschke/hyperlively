// @flow
import React, { PureComponent } from 'react';
import Slider, { type Props as SliderProps } from 'rc-slider';

import TimeoutBehavior, { type TimeoutBehaviorProps } from 'src/client/app/components/TimeoutBehavior';
import HTMLWidth, { type HTMLWidthProps } from 'src/client/app/components/HTMLWidth';

import style from './UndoRedo.scss';

const UndoRedoSlider = HTMLWidth(TimeoutBehavior(Slider));

export type UndoRedoSliderProps = HTMLWidthProps<TimeoutBehaviorProps<SliderProps>>

export default class UndoRedo extends PureComponent<UndoRedoSliderProps> {
	props: UndoRedoSliderProps

	node: HTMLDivElement | null

	render() {
		return (<UndoRedoSlider
			{...this.props}
			min={0}
			className={style.rcSlider}
			tipFormatter={null}
		/>);
	}
}
