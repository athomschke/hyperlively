import React from 'react';
import Scene from 'containers/Scene';
import Window from 'containers/Window';
import Configuration from 'components/dumb/Configuration';

'use strict';

export default () => (
	<div>
		<Scene />
		<Window />
		<Configuration />
	</div>
);