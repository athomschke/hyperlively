// @flow
import * as React from 'react';
import { last, filter } from 'lodash';

import { OFFSET } from 'src/client/app/constants/canvas';
import { WHITE } from 'src/client/app/constants/drawing';
import type { Stroke, Sketch } from 'src/client/app/typeDefinitions';

const visibleStrokesInSketch = sketch => filter(sketch.strokes || [], stroke => !stroke.hidden);

export type DeskProps<P> = P & {
	sketches: Array<Sketch>,
	cmdPressed: bool,
	relativeDividerPosition: number,
	height: number,
	paperColor: string,
};

type WrappedProps<P> = P & {
	active: boolean,
	strokes: Array<Stroke>,
	finished: boolean,
	offset: number,
}

const getStyle = (relativeDividerPosition: number, paperColor: string, height: number) => ({
	width: `${relativeDividerPosition * 100}%`,
	height,
	backgroundColor: paperColor,
	display: 'inline-block',
	verticalAlign: 'top',
});

const renderCanvas = (
	Wrapped: React.ComponentType<WrappedProps<any>>,
	strokes: Array<Stroke>,
	id: string,
	finished: boolean,
	cmdPressed: boolean,
	rest: WrappedProps<any>,
) => (<Wrapped
	{...rest}
	active={cmdPressed}
	strokes={strokes}
	finished={finished}
	offset={OFFSET}
	key={id}
/>);

const renderSketchedCanvasses = (
	Wrapped: React.ComponentType<WrappedProps<any>>,
	sketches: Array<Sketch>,
	cmdPressed: boolean,
	rest: WrappedProps<any>,
) => sketches.map((sketch, id) => {
	const strokesToRender = visibleStrokesInSketch(sketch);
	return strokesToRender.length > 0 && renderCanvas(Wrapped, strokesToRender, `${id}`, true, cmdPressed, rest);
});

const renderCanvasses = (
	Wrapped: React.ComponentType<WrappedProps<any>>,
	sketches: Array<Sketch>,
	cmdPressed: boolean,
	rest: WrappedProps<any>,
) => {
	const sketch = last(sketches);
	const canvasses = renderSketchedCanvasses(Wrapped, sketches, cmdPressed, rest);
	if ((!sketch || !sketch.strokes || sketch.finished)) {
		canvasses.push(renderCanvas(Wrapped, [], `canvas_${sketches.length}`, false, cmdPressed, rest));
	}
	return canvasses;
};

export default (Wrapped: React.ComponentType<WrappedProps<any>>) =>
class extends React.PureComponent<DeskProps<any>> {
	props: DeskProps<any>;

	static defaultProps = {
		sketches: [],
		cmdPressed: false,
		relativeDividerPosition: 0.6,
		height: 0,
		paperColor: WHITE,
	}

	render() {
		const {
			relativeDividerPosition,
			paperColor,
			sketches,
			cmdPressed,
			...rest
		} = this.props;
		return (<div
			id="desk"
			style={getStyle(relativeDividerPosition, paperColor, rest.height)}
		>
			{renderCanvasses(Wrapped, sketches, cmdPressed, rest)}
		</div>);
	}

};
