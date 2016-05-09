import React from 'react';
import Sketch from 'containers/Sketch';
import UndoRedo from 'containers/UndoRedo';

'use strict'

const Application = () => (
	<div>
		<UndoRedo></UndoRedo>
		<Sketch usePloma={false} ></Sketch>
	</div>
)

export default Application