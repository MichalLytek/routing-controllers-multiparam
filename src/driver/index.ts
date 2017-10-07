import { BaseDriver, ExpressDriver, KoaDriver } from "routing-controllers";

export function getDriver(): BaseDriver {
    let driver: BaseDriver;
    try {
        driver = new KoaDriver();
    } catch {
        try {
            driver = new ExpressDriver();
        } catch {
            throw new Error("Cannot create express nor koa driver. Make sure that all deps are installed!");
        }
    }
    return driver;
}
