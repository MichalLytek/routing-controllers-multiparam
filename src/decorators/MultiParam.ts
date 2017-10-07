import { createParamDecorator, Action, ExpressDriver, ParamMetadata, BaseDriver, KoaDriver } from "routing-controllers";
import {
    MultiParamDecoratorNamedOptions as NamedParamOptions,
    MultiParamDecoratorUnnamedOptions as UnamedParamOptions,
    MultiParamDecoratorOptions as ParamOptions,
    ParamType,
} from "../decorators-options/MultiParamOptions";
import { getParamFromRequest } from "../utils/getParamFromRequest";

export function MultiParam(options: NamedParamOptions): ParameterDecorator;
export function MultiParam(paramName: string, options: UnamedParamOptions): ParameterDecorator;
export function MultiParam(
    nameOrNamedOptions: string|NamedParamOptions,
    unamedOptions?: UnamedParamOptions,
): ParameterDecorator {
    // handle function param overloading
    let name: string;
    let options: ParamOptions;
    if (typeof nameOrNamedOptions === "string") {
        name = nameOrNamedOptions;
        options = unamedOptions!;
    } else {
        options = nameOrNamedOptions;
    }
    const { required = true, allow } = options;

    let value: (action: Action) => object | undefined;
    // if allow is type of ParamType
    if (typeof allow === "string") {
        value = action => getParamFromRequest(action, { name, type: allow });
    }
    // if allow is type of ParamType[]
    else if (Array.isArray(allow)) {
        value = action => {
            for (const paramType of allow) {
                const param = getParamFromRequest(action, { name, type: paramType });
                if (param) {
                    return param;
                }
            }
        };
    }
    // if allow is type of { key: ParamType }
    else {
        value = action => {
            for (const allowedType of Object.keys(allow)) {
                const paramNameOrNames = (allow as any)[allowedType] as string|string[];
                if (Array.isArray(paramNameOrNames)) {
                    for (const paramName of paramNameOrNames) {
                        const param = getParamFromRequest(action, { name: paramName, type: allowedType });
                        if (param) {
                            return param;
                        }
                    }
                } else {
                    const param = getParamFromRequest(action, { name: paramNameOrNames, type: allowedType });
                    if (param) {
                        return param;
                    }
                }
            }
        };
    }

    // register new param decorator
    return createParamDecorator({
        required,
        value,
        // TODO: handle transform and validation when new version of routing-controllers comes in
    });
}
