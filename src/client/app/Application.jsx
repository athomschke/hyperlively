import React from 'react';
import Scene from 'containers/Scene';
import UndoRedo from 'containers/UndoRedo';
import Settings from 'containers/Settings';
import Window from 'containers/Window';
import Configuration from 'containers/Configuration';

'use strict';

let getControlStyle = () => {
	return {
		position: 'absolute',
		top: 20,
		left: 20
	};
};

export default () => (
	<div>
		<Scene></Scene>
		<Window></Window>
		<div
			style={getControlStyle()}>
			<UndoRedo></UndoRedo>
			<Configuration></Configuration>
			<Settings></Settings>
		</div>
	</div>
);