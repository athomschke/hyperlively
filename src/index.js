// @flow
import { render } from 'react-dom';

import hyperlively from './hyperlively';

const appNode = document.getElementById('app');

if (appNode) {
	render(hyperlively(), appNode);
} else {
	throw new Error('Cannot find a node with id "app"');
}
