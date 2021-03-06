// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import SketchCombiner, { type SketchCombinerProps } from 'src/decorators/SketchCombiner';
import type { HyperlivelyState } from 'src/types';
import referencedStrokes from 'src/containers/referencedStrokes';

import Page, { type PageProps } from './Page';

type SketchCombinedPageProps = SketchCombinerProps<PageProps>

const SketchCombinedPage: React.ComponentType<SketchCombinedPageProps> = SketchCombiner(Page);

const mapStateToProps = (state: HyperlivelyState) => ({
	threshold: state.ui.threshold,
	strokes: referencedStrokes(state.data.strokes, state.data.scenes.present, state.data.sceneIndex),
	showInterpreter: state.ui.showInterpreter,
});

export default connect(mapStateToProps, () => ({}))(SketchCombinedPage);
