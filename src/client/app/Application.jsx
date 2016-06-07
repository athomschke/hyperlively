import React from 'react';
import Sketch from 'containers/Sketch';
import UndoRedo from 'containers/UndoRedo';
import Settings from 'containers/Settings';

'use strict'

let getControlStyle = () => {
	return {
		position: 'absolute',
		top: 20,
		left: 20
	}
}
const Application = () => (
	<div>
		<div>
			<Sketch></Sketch>
		</div>
		<div
			style={getControlStyle()}>
			<UndoRedo></UndoRedo>
			<Settings></Settings>
		</div>
	</div>
)

export default Application