import * as React from 'react';

import { type JSONObject } from 'src/components/JsonPropertyChooser';
import PrefixedJSONPropertyChooser from 'src/components/PrefixedJSONPropertyChooser';

export type ParameterChooserStateProps = {
	checkedPaths: Array<string>,
	expandedPaths: Array<string>,
}

export type ParameterChooserDispatchProps = {
	onCheckedPathsChange: (checkedPath: Array<string>) => void,
	onExpandedPathsChange: (collapsedPath: Array<string>) => void,
}

type ParameterChooserProps = ParameterChooserStateProps & ParameterChooserDispatchProps & {
	key: string,
	prefixes: Array<string>,
	jsonTree: JSONObject,
	onParameterChoose: (parameters: Array<string>) => void,
}

const ParameterChooser = (props: ParameterChooserProps) => <PrefixedJSONPropertyChooser {...props} />;

export default ParameterChooser;
