import { AtherOptions, StoreOptions } from './interfaces.js';
/**
 * AtherJS base class. Contains all functionality and hooks
 * @param {AtherOptions} options - Options for AtherJS
 */
export declare class AtherJS {
    body: string;
    debugLogging: boolean;
    useCSSForFading: boolean;
    private disableJSNavigation;
    CSSFadeOptions: {
        fadeInCSSClass: string;
        fadeOutCSSClass: string;
    };
    jsFadeOptions: {
        fadeNavbar: boolean;
        fadeFooter: boolean;
    };
    stateOptions: StoreOptions;
    private pageScript;
    private animator;
    private store;
    private isNavigating;
    pageCache: Object;
    private activeScriptNameStates;
    private urlHistory;
    /**
     * AtherJS Constructor
     * @param {AtherOptions} opts - Options for AtherJS
     * @returns `void`
     */
    constructor(opts?: AtherOptions);
    /**
     * Disables most JS navigation functionality as it is not compatible with AtherJS.
     * This is done by setting the `disableJSNavigation` property to `true`.
     * @returns void
     */
    private disableJsNav;
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
     * Submit a form using AtherJS. Meant to replace form.submit()
     * @param {HTMLFormElement} form the form to submit
     */
    submitForm(form: HTMLFormElement): Promise<void>;
    /**
     * Configure all found forms to work properly with AtherJS
     */
    private configForms;
    /**
     * Convert a form to JSON. It reads all input, select and textarea elements.
     * It then reads their name and value, and uses that to create a JSON object.
     * @param {HTMLFormElement} form the form to convert to JSON
     * @returns stringified JSON
     */
    private formToJSON;
    /**
     * Actually submit a form. Underthe hood function for `submitForm()` and handles most of the logic.
     * @param {HTMLFormElement} form the form to submit
     * @param {SubmitEvent} e the submit event
     */
    private formSubmit;
    /**
     * Navigate to a (new) page
     * @param {string} url - URL to navigate to
     * @param {boolean} playAnims - Whether or not to play animations
     */
    private navigate;
    private loadPageScript;
    /**
     * Request a page and return its body
     * @param {string} url - URL to request
     * @returns `string` Returns the page body
     */
    private requestPage;
    /**
     * Parse the page and return the body
     * @param {string} page - Page to parse
     * @returns body - Returns the body of the page
     */
    private parsePage;
    /**
     * Execute all JS in the page. It is embedded in a script tag and executed.
     * Note: Be careful with your script includes as it will include any script tag found in the body.
     * It will run all scripts in EVAL. Be absolutely sure you trust the code!
     * @param {HTMLElement} body - The new page's body to take the scripts from.
     */
    private executeJS;
    /**
     * Remove all old JS script namespaces so new ones can take their place.
     */
    private destroyJSCache;
    /**
     * Reload all link tags found in the body. This is absolutely needed in order to import all stylesheets.
     * @param {HTMLElement} body - The new page's body
     */
    private reloadLinkElements;
    /**
     * Clean up and render the page to the hidden body
     * @param {Element} page - Page to clean
     * @returns `void`
     */
    private cleanPage;
    /**
     * Rebuild a component, if it is required
     * @param {Element} component - Component to replace the current component with
     * @returns `bool` Was this component rebuilt?
     */
    private rebuildComponent;
    /**
     * Rebuild the "body" of the page.
     * @param {Element} body - Body to replace the current body with
     */
    private rebuildBody;
    /**
     * Check to see if the navigator is valid
     * @returns {Boolean} Returns wether or not the navigator exists
     */
    private doesNavigatorExist;
    /**
     * CHeck to see if a A tag is actually a Link or just a fancy button.
     * @param {HTMLAnchorElement} link - Link to check
     * @returns `bool` Is this link an actual link?
     */
    private validateLink;
    private hookEvents;
    /**
     * Bind custom events to elements base don their attributes
     * @param {Element} element Element to bind events to
     */
    private bindElementCustomEvents;
    /**
     * Add event handlers to elements based on a specific attribute
     * @param {Element} element The element to add the event listenener too
     * @param {string} attribute The attribute to listen for
     * @param {string} fetchAttribute The attribute to fetch the function name from
     */
    private addEventHandler;
}
