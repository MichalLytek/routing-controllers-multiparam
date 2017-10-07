import { ParamOptions } from "routing-controllers";

export enum ParamType {
    Body = "body",
    BodyParam = "body-param",
    Param = "param",
    Params = "params",
    Session = "session",
    QueryParam = "query",
    QueryParams = "queries",
    HeaderParam = "header",
    HeaderParams = "headers",
    CookieParam = "cookie",
    CookieParams = "cookies",
    // ...
}
// TODO: allow for options like transform and validation
export type MultiParamDecoratorUnnamedOptions = /* ParamOptions & */ {
    required?: boolean;
    allow: ParamType | ParamType[];
};
export type MultiParamDecoratorNamedOptions = /* ParamOptions & */ {
    required?: boolean;
    allow: { [P in ParamType]?: string | string[] };
};
export type MultiParamDecoratorOptions = MultiParamDecoratorUnnamedOptions | MultiParamDecoratorNamedOptions;
