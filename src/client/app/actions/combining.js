// @flow
import { APPEND_SPECIFC_ACTION } from 'src/client/app/constants/actionTypes';

export function appendSpecificAction(actionName: string, ...actionNames: Array<string>) {
	return { type: APPEND_SPECIFC_ACTION, actionName, actionNames };
}
