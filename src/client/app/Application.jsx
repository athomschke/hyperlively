import React from 'react';
import Sketch from 'containers/Sketch';
import UndoRedo from 'containers/UndoRedo';
import Settings from 'containers/Settings';

'use strict'

const Application = () => (
	<div>
		<div className="hyperlively-canvas">
			<Sketch></Sketch>
		</div>
		<div className="hyperlively-control">
			<UndoRedo></UndoRedo>
			<Settings></Settings>
		</div>
	</div>
)

export default Application