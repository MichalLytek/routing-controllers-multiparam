# routing-controllers-multiparam

[![npm version](https://badge.fury.io/js/routing-controllers-multiparam.svg)](https://badge.fury.io/js/routing-controllers-multiparam)
[![Dependency Status](https://david-dm.org/19majkel94/routing-controllers-multiparam.svg)](https://david-dm.org/19majkel94/routing-controllers-multiparam)
[![devDependency Status](https://david-dm.org/19majkel94/routing-controllers-multiparam/dev-status.svg)](https://david-dm.org/19majkel94/routing-controllers-multiparam#info=devDependencies)
[![peerDependency Status](https://david-dm.org/19majkel94/routing-controllers-multiparam/peer-status.svg)](https://david-dm.org/19majkel94/routing-controllers-multiparam#info=devDependencies)

A simple plugin for [routing-controller](https://github.com/pleerock/routing-controller) which allows to inject param from multiple sources.

## Installation

#### Module installation

`npm install routing-controllers-multiparam --save`

(or the short way with NPM v5):

`npm i routing-controllers-multiparam`

#### Peer dependencies

This package is only a simple plugin, so you have to install the `routing-controllers` package because it can't work without them.

## Usage

The usage of this module is very simple. All you need is:

```ts
import { JsonController, Post, createExpressServer } from "routing-controllers";
// import the `@MultiParam` decorator and `ParamType` enum from the module
import { MultiParam, ParamType } from "routing-controllers-multiparam";

// declare the controller class using routing-controller decorators
@JsonController()
class ProductsController {
    // for example, register action on two routes
    // and get `categoryId` param from query or path
    // so both routes will work
    @Get("/products")
    @Get("/categories/:categoryId/products")
    getProductsByCategory(
        // use the `@MultiParam` decorator to define the sources of the param to inject
        @MultiParam("categoryId", { required: true, allow: [ParamType.QueryParam, ParamType.Param] })
        categoryId: number,
    ) {
        return {
            categoryId,
        };
    }
}

// start the server
createExpressServer({ controllers: [SampleController]}).listen(3000);

```
And that's it! This will lead to inject the first non-undefined value from the list of sources, so when you specify `roleBody` param in body but not `roleQuery` inside path (query string) it will be injected. It works just like switch-case!

## API reference

#### Function signatures

The `@MultiParam` decorator has two overloads:
```ts
export function MultiParam(options: NamedParamOptions): ParameterDecorator;
```

```ts
export function MultiParam(paramName: string, options: UnamedParamOptions): ParameterDecorator;
```

#### Parameters and types

- `NamedParamOptions` - a type of object that property `allow` can be a dictionary of allowed types:
```ts
{
    required?: boolean;
    allow: { 
        [P in ParamType]?: string | string[];
    };
};
```
So the usage is just like this:
```ts
@MultiParam({ allow: {
    [ParamType.QueryParam]: ["api_key", "apiKey"],
    [ParamType.HeaderParam]: "X-Auth-Api-Key",
}})
```
- `UnamedParamOptions` - a type of object that property `allow` can be `ParamType` or array of `ParamType`
```ts
{
    required?: boolean;
    allow: ParamType | ParamType[];
};
```
It can be used only with `paramName` parameter when you want to get the param from multiple source but which is avaible on the same name:
```ts
@MultiParam("api", { allow: [ParamType.QueryParam, ParamType.HeaderParam] })
```

## More info

If you need more examples of usage, go to the sources and check unit tests file - `/src/decorators/MultiParam.spec.ts`. If you have questions or new features/ideas, feel free to open an issue on GitHub repository.

## Release notes

**0.1.0**

* initial version with basic `@MultiParam` decorator support
