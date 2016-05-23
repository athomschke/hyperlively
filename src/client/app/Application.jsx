import React from 'react';
import Sketch from 'containers/Sketch';
import UndoRedo from 'containers/UndoRedo';
import Settings from 'containers/Settings';

'use strict'

const Application = () => (
	<div>
		<UndoRedo></UndoRedo>
		<Settings></Settings>
		<Sketch></Sketch>
	</div>
)

export default Application