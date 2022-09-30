/**
 * Option class for AtherJS
 * @param bodyOverwrite - Overwrite the body element. Must be an element / class / id.
 * @param useCSSForFading - Use CSS for fading instead of JS.
 * @param cssFadeOptions - Options for CSS fading.
 * @param cssFadeOptions.fadeInCSSClass - fadeIn CSS class.
 * @param cssFadeOptions.fadeOutCSSClass - fadeOut CSS class.
 * @param jsFadeOptions - Options for JS fading.
 * @param jsFadeOptions.fadeNavbar - Wether or not to fade the navbar
 * @param jsFadeOptions.fadeFooter - Wether or not to fade the footer
 * @param state - Settings related to State
 * @param state.updateStateElementsOnUpdate - Wether or not to update state elements on state update
 */
interface AtherOptions {
    bodyOverwrite?: string;
    debugLogging?: boolean;
    useCSSForFading?: boolean;
    cssFadeOptions?: {
        fadeInCSSClass?: string;
        fadeOutCSSClass?: string;
    };
    jsFadeOptions?: {
        fadeNavbar?: boolean;
        fadeFooter?: boolean;
    };
    state?: StateOptions;
}
/**
 * Option Class for State
 * @param updateElementListOnUpdate - Wether or not to update state elements on state update. `true` by default.
 */
interface StateOptions {
    updateElementListOnUpdate?: boolean;
    reloadOnSetState?: boolean;
}
/**
 * AtherJS base class. Contains all functionality and hooks
 * @param {AtherOptions} options - Options for AtherJS
 */
declare class AtherJS {
    body: string;
    debugLogging: boolean;
    private animator;
    private state;
    private isNavigating;
    private activeScriptNameStates;
    private urlHistory;
    /**
     * AtherJS Constructor
     * @param opts - Options for AtherJS
     * @returns `void`
     */
    constructor(opts?: AtherOptions);
    /**
     * Navigate to a page.
     * @param {string} url - URL to navigate to
     */
    go(url: string, playAnims?: boolean): Promise<void>;
    /**
     * Go back 1 page if this is possible.
     */
    back(): Promise<void>;
    /**
     * Configure all found links to work with AtherJS.
     * If a link contains the `ather-ignore` attribute, it will be ignored.
     * This is run at startup, but can be called again to reconfigure all links.
     */
    configLinks(): void;
    /**
     * Configure all found forms to work properly with AtherJS
     */
    private configForms;
    /**
     * Convert a form to JSON. It reads all input, select and textarea elements.
     * It then reads their name and value, and uses that to create a JSON object.
     * @param form the form to convert to JSON
     * @returns stringified JSON
     */
    private formToJSON;
    /**
     * Navigate to a (new) page
     * @param url - URL to navigate to
     */
    private navigate;
    /**
     * Request a page and return its body
     * @param url - URL to request
     * @returns `string` Returns the page body
     */
    private requestPage;
    /**
     * Parse the page and return the body
     * @param page - Page to parse
     * @returns body - Returns the body of the page
     */
    private parsePage;
    /**
     * Execute all JS in the page. It is embedded in a script tag and executed.
     * Note: Be careful with your script includes as it will include any script tag found in the body.
     * It will run all scripts in EVAL. Be absolutely sure you trust the code!
     * @param body - The new page's body to take the scripts from.
     */
    private executeJS;
    /**
     * Remove all old JS script namespaces so new ones can take their place.
     */
    private destroyJSCache;
    /**
     * Reload all link tags found in the body. This is absolutely needed in order to import all stylesheets.
     * @param body - The new page's body
     */
    private reloadLinkElements;
    /**
     * Clean up and render the page to the hidden body
     * @param page - Page to clean
     * @returns `void`
     */
    private cleanPage;
    /**
     * Rebuild a component, if it is required
     * @param component - Component to replace the current component with
     * @returns `bool` Was this component rebuilt?
     */
    private rebuildComponent;
    /**
     * Rebuild the "body" of the page.
     * @param body - Body to replace the current body with
     */
    private rebuildBody;
    /**
     * Check to see if the navigator is valid
     * @returns {Boolean} Returns wether or not the navigator exists
     */
    private doesNavigatorExist;
    /**
     * CHeck to see if a A tag is actually a Link or just a fancy button.
     * @param link - Link to check
     * @returns `bool` Is this link an actual link?
     */
    private validateLink;
}
/**
 * Deals with animations
 */
declare class Anims {
    /**
     * Play a fade in animation
     * @param el - Element to fade in
     * @param time - Time to fade in
     * @returns `Promise` Resolves when the animation is complete
     */
    fadeIn(el: HTMLElement, time?: number): Promise<unknown>;
    /**
     * Play a fade out animation
     * @param el - Element to fade out
     * @param time - Time to fade out
     * @returns `Promise` Resolves when the animation is complete
     */
    fadeOut(el: HTMLElement, time?: number): Promise<unknown>;
}
/**
 * State class. Deals with anyting related to state.
 */
declare class State {
    #private;
    debugLogging: boolean;
    createStatesOnPageLoad: boolean;
    private updateElementListOnUpdate;
    constructor();
    /**
     * Update a value on the State Object
     * @param key - Key to set
     * @param value - Value to set
     */
    setState(key: string, value: any): void;
    /**
     * Create a new State. This can be used to transfer values between pages.
     * @param name - Name of the state
     * @param value - Initial value of the state
     */
    createState(name: string, value: any): void;
    /**
     * Get a value of a state.
     * @param key - Key to get
     * @returns value of the key
     */
    getState(key: string): any;
    /**
     * Delete a State from the Manager. This action is irreversible.
     * @param key - Key to delete
     */
    deleteState(key: string): void;
    /**
     * Reload all elements that interact with State. Required after changing pages.
     * For changes to the DOM after load, call the `updateElements` function on the StateObject instead.
     */
    reloadState(): void;
    /**
     * Create new states on initial page load.
     * @returns void
     */
    private createOnLoad;
}
/**
 * A State Object is a single state. It contains the value, and a reference to elements that interact with it.
 */
declare class StateObject {
    private name;
    private value;
    private referencedElements;
    constructor(name: string, value: any);
    /**
     * Find all elements that reference this state
     */
    findElements(): void;
    /**
     * Update all elements that reference this state
     */
    updateElements(): void;
}
/**
* Log a message to the console
* @param msg - Message to log
* @param type - Type of log
*/
declare function log(msg: string, type?: string): void;
