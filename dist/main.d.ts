import { Storage } from "./storage.js";
/**
 * AtherJSOptions interface is used to define the options that can be passed to the AtherJS class.
 * @param debugLogging - If set to true, AtherJS will log debug messages to the console.
 * @param mountPointID - The ID of the element where AtherJS will mount the body of the app.
 */
interface AtherJSOptions {
    debugLogging?: boolean;
    mountPointID?: string;
}
/**
 * AtherJS class. This is the main class that you will be using to interact with AtherJS.
 */
export declare class AtherJS {
    options: AtherJSOptions;
    debugLogging: boolean;
    mountPointID: string;
    Storage: Storage;
    constructor(options: AtherJSOptions);
    /**
     * Load options from the options object
     */
    private loadOptions;
    private checkCompatibility;
    /**
     * Initialize AtherJS
     */
    private init;
}
export {};
