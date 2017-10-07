import { Action, ParamMetadata } from "routing-controllers";

import { getDriver } from "../driver";

const driver = getDriver();
export const getParamFromRequest = (action: Action, param: { type: string, name?: string }) =>
    driver.getParamFromRequest(action, param as ParamMetadata);
