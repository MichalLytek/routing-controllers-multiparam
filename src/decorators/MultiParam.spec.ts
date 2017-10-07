import "reflect-metadata";
import { JsonController, createExpressServer, getMetadataArgsStorage, Get, Post, useExpressServer } from "routing-controllers";
import * as express from "express";
import * as bodyParser from "body-parser";
import { use, expect, request } from "chai";
import chaiHttp  = require("chai-http");
use(chaiHttp);

import { ParamType } from "../decorators-options/MultiParamOptions";
import { MultiParam } from "./MultiParam";

describe("@MultiParam", () => {

    let expressApp: Express.Application;

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @JsonController()
        class TestController {

            @Get("/single")
            singleParam(
                @MultiParam("role", { allow: ParamType.QueryParam })
                role: string,
            ) {
                return {
                    role,
                };
            }

            @Get("/single-array")
            singleArrayParam(
                @MultiParam("role", {allow: [ParamType.QueryParam]})
                role: string,
            ) {
                return {
                    role,
                };
            }

            @Post("/multiple-array")
            multipleArrayParam(
                @MultiParam("role", {allow: [
                    ParamType.QueryParam,
                    ParamType.BodyParam,
                ]})
                role: string,
            ) {
                return {
                    role,
                };
            }

            @Get("/single-object")
            singleObject(
                @MultiParam({ allow: {
                    [ParamType.QueryParam]: "role",
                }})
                role: string,
            ) {
                return {
                    role,
                };
            }

            @Get("/multiple-object-values")
            multipleObjectValues(
                @MultiParam({ allow: {
                    [ParamType.QueryParam]: ["role", "roleQuery"],
                }})
                role: string,
            ) {
                return {
                    role,
                };
            }

            @Post("/multiple-objects")
            multipleObjects(
                @MultiParam({ allow: {
                    [ParamType.QueryParam]: "roleQuery",
                    [ParamType.BodyParam]: "roleBody",
                }})
                role: string,
            ) {
                return {
                    role,
                };
            }
        }

        const app = express();
        app.use(bodyParser.json());

        const serverOptions = {
            controllers: [TestController],
        };

        expressApp = useExpressServer(app, serverOptions);
    });

    it("should handle allowed single param", async () => {
        const response = await request(expressApp)
            .get("/single?role=admin");

        expect(response.status).to.equals(200);
        expect(response.body.role).to.equals("admin");
    });

    it("should handle allowed param array", async () => {
        const response = await request(expressApp)
            .get("/single-array?role=admin");

        expect(response.status).to.equals(200);
        expect(response.body.role).to.equals("admin");
    });

    it("should get first value from params array", async () => {
        const response = await request(expressApp)
            .post("/multiple-array?role=query-admin")
            .send({
                role: "body-admin",
            });

        expect(response.status).to.equals(200);
        expect(response.body.role).to.equals("query-admin");
    });

    it("should fallback to next array param values if not exist", async () => {
        const response = await request(expressApp)
            .post("/multiple-array")
            .send({
                role: "body-admin",
            });

        expect(response.status).to.equals(200);
        expect(response.body.role).to.equals("body-admin");
    });

    it("should handle allowed param dictionary", async () => {
        const response = await request(expressApp)
            .get("/single-object?role=admin");

        expect(response.status).to.equals(200);
        expect(response.body.role).to.equals("admin");
    });

    it("should handle allowed param's array in dictionary", async () => {
        const response = await request(expressApp)
            .get("/multiple-object-values?roleQuery=admin");

        expect(response.status).to.equals(200);
        expect(response.body.role).to.equals("admin");
    });

    it("should get first value from params array in dictionary", async () => {
        const response = await request(expressApp)
            .post("/multiple-objects?roleQuery=query-admin")
            .send({
                roleBody: "body-admin",
            });

        expect(response.status).to.equals(200);
        expect(response.body.role).to.equals("query-admin");
    });

    it("should fallback to next array param's dictionary values if not exist", async () => {
        const response = await request(expressApp)
            .post("/multiple-objects")
            .send({
                roleBody: "body-admin",
            });

        expect(response.status).to.equals(200);
        expect(response.body.role).to.equals("body-admin");
    });

});
