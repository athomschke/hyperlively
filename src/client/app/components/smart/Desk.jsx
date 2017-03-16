// @flow
import React, { PureComponent, PropTypes } from 'react';
import { map, last, filter } from 'lodash';
import { OFFSET } from 'constants/canvas';
import { WHITE } from 'constants/drawing';
import { type Stroke } from '../../typeDefinitions';

const visibleStrokesInSketch = sketch => filter(sketch.strokes || [], stroke => !stroke.hidden);

export default Wrapped => class extends PureComponent {

	static propTypes = {
		sketches: PropTypes.arrayOf(PropTypes.object),
		cmdPressed: PropTypes.bool,
		width: PropTypes.number,
		height: PropTypes.number,
		paperColor: PropTypes.string,
	};

	static defaultProps = {
		sketches: [],
		cmdPressed: false,
		width: 0,
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
			width: this.props.width,
			height: this.props.height,
			position: 'absolute',
			top: 0,
			left: 0,
			backgroundColor: this.props.paperColor,
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
