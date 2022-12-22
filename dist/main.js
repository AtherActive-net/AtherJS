import { Storage } from "./storage.js";
/**
 * AtherJS class. This is the main class that you will be using to interact with AtherJS.
 */
export class AtherJS {
    constructor(options) {
        this.options = options;
        this.debugLogging = false;
        this.mountPointID = 'ather-mount';
        this.Storage = new Storage(this);
        // Load the options from the options object
        this.loadOptions();
        // Startup AtherJS
        this.init();
    }
    /**
     * Load options from the options object
     */
    loadOptions() {
        Object.keys(this.options).forEach((key) => {
            if (this.options[key] !== undefined)
                this[key] = this.options[key];
        });
    }
    checkCompatibility() {
        if (!window.navigator)
            throw new Error('AtherJS requires a browser that supports Navigator');
    }
    /**
     * Initialize AtherJS
     */
    init() {
        this.checkCompatibility();
    }
}
const ather = new AtherJS({});
