// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import SketchCombiner, { type SketchCombinerProps } from 'src/decorators/SketchCombiner';
import type { HyperlivelyState, Scene } from 'src/types';

import Page, { type PageProps } from './Page';

type SketchCombinedPageProps = SketchCombinerProps<PageProps>

const SketchCombinedPage: React.ComponentType<SketchCombinedPageProps> = SketchCombiner(Page);

const strokes = (scenes: Array<Scene>, sceneIndex: number) => {
	const currentScene = scenes[sceneIndex];
	return currentScene ? currentScene.strokes : [];
};

const mapStateToProps = (state: HyperlivelyState) => ({
	threshold: state.ui.threshold,
	strokes: strokes(state.data.scenes.present, state.data.sceneIndex),
	showInterpreter: state.ui.showInterpreter,
});

export default connect(mapStateToProps, () => ({}))(SketchCombinedPage);
