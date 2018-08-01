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
	choosersProps: Array<{
		key: string,
		prefixes: Array<string>,
	}>,
	jsonTree: JSONObject,
	onParameterChoose: (parameters: Array<string>) => void,
}

const ParameterChooser = (props: ParameterChooserProps) => (
	<div>
		{props.choosersProps.map((chooserProps) => {
			if (chooserProps.key === 'selectedStrokes') {
				return (
					<PrefixedJSONPropertyChooser
						key={chooserProps.key}
						prefixes={[]}
						onParameterChoose={props.onParameterChoose}
						jsonTree={{ selectedStrokes: props.jsonTree.selectedStrokes }}
						checkedPaths={props.checkedPaths}
						expandedPaths={props.expandedPaths}
						onCheckedPathsChange={props.onCheckedPathsChange}
						onExpandedPathsChange={props.onExpandedPathsChange}
					/>
				);
			} return (
				<PrefixedJSONPropertyChooser
					key={chooserProps.key}
					prefixes={chooserProps.prefixes}
					onParameterChoose={props.onParameterChoose}
					jsonTree={props.jsonTree}
					checkedPaths={props.checkedPaths}
					expandedPaths={props.expandedPaths}
					onCheckedPathsChange={props.onCheckedPathsChange}
					onExpandedPathsChange={props.onExpandedPathsChange}
				/>
			);
		})}
	</div>
);

export default ParameterChooser;
