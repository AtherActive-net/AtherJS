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
export class AtherJS {

    public debugLogging: boolean = false;
    public mountPointID: string = 'ather-mount';

    public Storage: Storage = new Storage(this);

    constructor(public options: AtherJSOptions) {
        // Load the options from the options object
        this.loadOptions();

        // Startup AtherJS
        this.init();
    }

    /**
     * Load options from the options object
     */
    private loadOptions() {
        Object.keys(this.options).forEach((key) => {
            if(this.options[key] !== undefined) this[key] = this.options[key];
        })
    }

    private checkCompatibility() {
        if(!window.navigator) throw new Error('AtherJS requires a browser that supports Navigator');
    }

    /**
     * Initialize AtherJS
     */
    private init() {
        this.checkCompatibility();
    }
}

const ather = new AtherJS({})