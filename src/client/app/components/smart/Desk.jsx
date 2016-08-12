import React, {Component, PropTypes} from 'react';
import { OFFSET } from 'constants/canvas';
import { map, last } from 'lodash';

export default (Wrapped) => class extends Component {

	static propTypes = {
		sketches: PropTypes.array
	};

	static defaultProps = {
		sketches: []
	}

	renderCanvas(strokes, id, finished) {
		return (<Wrapped {...this.props}
			active={this.props.cmdPressed}
			strokes={strokes}
			finished={finished}
			offset={OFFSET}
			key={id}
		/>);
	}

	renderSketchedCanvasses() {
		let that = this;
		return map(this.props.sketches, (sketch, id) => {
			return that.renderCanvas(sketch.strokes || [], id, true);
		});
	}

	renderPlaceholderCanvas() {
		let sketch = last(this.props.sketches);
		if ((!sketch || sketch.finished)) {
			return this.renderCanvas([], this.props.sketches.length, false);
		}
	}

	render() {
		return (<div>
			{this.renderSketchedCanvasses().concat(this.renderPlaceholderCanvas())}
		</div>);
	}

};