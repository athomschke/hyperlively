// @flow
import React, { PureComponent } from 'react';

import UndoRedoSlider, { type UndoRedoSliderProps } from './UndoRedoSlider';
import style from './UndoRedo.scss';

export default class UndoRedo extends PureComponent<UndoRedoSliderProps> {
	props: UndoRedoSliderProps

	node: HTMLDivElement | null

	render() {
		return (
			<UndoRedoSlider
				{...this.props}
				min={0}
				className={style.rcSlider}
				tipFormatter={null}
			/>
		);
	}
}
