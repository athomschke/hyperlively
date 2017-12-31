// @flow
import React, { PureComponent } from 'react';
import { map, last, filter } from 'lodash';
import type { Component } from 'react-flow-types';

import { OFFSET } from 'src/client/app/constants/canvas';
import { WHITE } from 'src/client/app/constants/drawing';
import type { Stroke, Sketch } from 'src/client/app/typeDefinitions';

const visibleStrokesInSketch = sketch => filter(sketch.strokes || [], stroke => !stroke.hidden);

type Props = {
	sketches: Array<Sketch>,
	cmdPressed: bool,
	relativeDividerPosition: number,
	height: number,
	paperColor: string,
};

export default (Wrapped: Component<Object>) => class extends PureComponent<Props> {
	props: Props;

	static defaultProps = {
		sketches: [],
		cmdPressed: false,
		relativeDividerPosition: 0.6,
		height: 0,
		paperColor: WHITE,
	}

	renderCanvas(strokes: Array<Stroke>, id: string, finished: boolean) {
		return (<Wrapped
			{...this.props}
			active={this.props.cmdPressed}
			strokes={strokes}
			finished={finished}
			offset={OFFSET}
			key={id}
		/>);
	}

	renderSketchedCanvasses() {
		const that = this;
		return map(this.props.sketches, (sketch, id) => {
			const strokesToRender = visibleStrokesInSketch(sketch);
			return strokesToRender.length > 0 && that.renderCanvas(strokesToRender, id, true);
		});
	}

	renderCanvasses() {
		const sketch = last(this.props.sketches);
		const canvasses = this.renderSketchedCanvasses();
		if ((!sketch || !sketch.strokes || sketch.finished)) {
			canvasses.push(this.renderCanvas([], this.props.sketches.length, false));
		}
		return canvasses;
	}

	getStyle() {
		return {
			width: `${this.props.relativeDividerPosition * 100}%`,
			height: this.props.height,
			backgroundColor: this.props.paperColor,
			display: 'inline-block',
			verticalAlign: 'top',
		};
	}

	render() {
		return (<div
			id="desk"
			style={this.getStyle()}
		>
			{this.renderCanvasses()}
		</div>);
	}

};
