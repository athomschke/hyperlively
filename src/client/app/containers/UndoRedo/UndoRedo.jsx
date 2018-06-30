// @flow
import React, { PureComponent } from 'react';
import Slider from 'rc-slider';

import TimeoutBehavior from 'src/client/app/components/TimeoutBehavior';
import HTMLWidth from 'src/client/app/components/HTMLWidth';

import style from './UndoRedo.scss';

const UndoRedoSlider = HTMLWidth(TimeoutBehavior(Slider));

type Props<P> = P

export default class UndoRedo extends PureComponent<Props<any>> {
	props: Props<any>

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
