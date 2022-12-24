var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { log, attributes } from './utils.js';
import { Store } from './Store.js';
import { Anims } from './Anims.js';
/**
 * AtherJS base class. Contains all functionality and hooks
 * @param {AtherOptions} options - Options for AtherJS
 */
export class AtherJS {
    /**
     * AtherJS Constructor
     * @param {AtherOptions} opts - Options for AtherJS
     * @returns `void`
     */
    constructor(opts = {
        bodyOverwrite: 'body',
        debugLogging: false,
        useCSSForFading: false,
        cssFadeOptions: {
            fadeInCSSClass: 'fadeIn',
            fadeOutCSSClass: 'fadeOut'
        },
        jsFadeOptions: {
            fadeNavbar: true,
            fadeFooter: true
        },
        store: {
            updateElementListOnUpdate: true,
        }
    }) {
        this.debugLogging = false;
        this.useCSSForFading = false;
        this.disableJSNavigation = true;
        this.stateOptions = {
            updateElementListOnUpdate: true,
        };
        this.animator = new Anims();
        this.pageCache = {};
        this.activeScriptNameStates = [];
        this.urlHistory = [];
        if (!this.doesNavigatorExist()) {
            log('Navigator does not exist. AtherJS will not work.', 'error');
            return;
        }
        // This setting must be set before anything else to make sure it works properly
        this.body = opts.bodyOverwrite || 'body';
        Object.keys(opts).forEach((key) => {
            this[key] = opts[key];
        });
        // Create a new State object
        this.store = new Store();
        this.isNavigating = false;
        // Disable JS navigation if needed
        if (this.disableJSNavigation)
            this.disableJsNav();
        log('✅ AtherJS is active!');
        document.addEventListener('DOMContentLoaded', () => {
            this.go(window.location.href, false);
        });
    }
    /**
     * Disables most JS navigation functionality as it is not compatible with AtherJS.
     * This is done by setting the `disableJSNavigation` property to `true`.
     * @returns void
     */
    disableJsNav() {
        history.back = () => { };
        history.forward = () => { };
        history.go = () => { };
    }
    /**
     * Navigate to a page.
     * @param {string} url - URL to navigate to
     */
    go(url, playAnims = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isNavigating) {
                this.isNavigating = true;
                yield this.navigate(url, playAnims);
            }
            else {
                log(`Naviation is already in progress. Skipping navigation to ${url}`, 'warn');
            }
        });
    }
    /**
     * Go back 1 page if this is possible.
     */
    back() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.urlHistory.length > 1) {
                this.urlHistory.pop();
                yield this.go(this.urlHistory[this.urlHistory.length - 1]);
                this.urlHistory.pop();
            }
        });
    }
    /**
     * Configure all found links to work with AtherJS.
     * If a link contains the `ather-ignore` attribute, it will be ignored.
     * This is run at startup, but can be called again to reconfigure all links.
     */
    configLinks() {
        const links = document.querySelectorAll('a');
        links.forEach((link) => {
            // Its a bit of a christmas tree, but best I could come up with
            if (this.validateLink(link)) {
                if (!link.hasAttribute(attributes.get('ignore'))) {
                    link.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                        e.preventDefault();
                        yield this.go(link.href);
                    }));
                    if (this.debugLogging)
                        log(`🔗 Configured link ${link.href}`);
                }
            }
            else {
                if (link.hasAttribute(attributes.get('ignore'))) {
                    if (this.debugLogging)
                        log(`🔗 Ignoring link ${link.nodeName}`);
                }
                else if (link.hasAttribute(attributes.get('back'))) {
                    link.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                        e.preventDefault();
                        yield this.back();
                    }));
                }
                else {
                    if (this.debugLogging)
                        log(`❌ Link ${link.href} disabled as it failed validation check.`, 'warn');
                    link.setAttribute('debug', 'test');
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (this.debugLogging)
                            log(`❌ Link ${link.href} disabled.`, 'warn');
                    });
                }
            }
        });
    }
    /**
     * Submit a form using AtherJS. Meant to replace form.submit()
     * @param {HTMLFormElement} form the form to submit
     */
    submitForm(form) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.formSubmit(form, null);
        });
    }
    /**
     * Configure all found forms to work properly with AtherJS
     */
    configForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach((form) => {
            if (form.hasAttribute(attributes.get('ignore')))
                return;
            if (form.hasAttribute('action')) {
                form.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
                    yield this.formSubmit(form, e);
                }));
                if (this.debugLogging)
                    log(`🔗 Configured form ${form.action} (${form.method})`);
            }
        });
    }
    /**
     * Convert a form to JSON. It reads all input, select and textarea elements.
     * It then reads their name and value, and uses that to create a JSON object.
     * @param {HTMLFormElement} form the form to convert to JSON
     * @returns stringified JSON
     */
    formToJSON(form) {
        let data = {};
        const elements = form.querySelectorAll('input, select, textarea');
        elements.forEach((element) => {
            data[element.name] = element.value;
        });
        return JSON.stringify(data);
    }
    /**
     * Actually submit a form. Underthe hood function for `submitForm()` and handles most of the logic.
     * @param {HTMLFormElement} form the form to submit
     * @param {SubmitEvent} e the submit event
     */
    formSubmit(form, e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e != null)
                e.preventDefault();
            // get form data, make sure it is in JSON format
            const url = form.getAttribute('action');
            const method = form.getAttribute('method');
            const data = this.formToJSON(form);
            let req = fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            });
            yield this.go((yield req).url);
        });
    }
    /**
     * Navigate to a (new) page
     * @param {string} url - URL to navigate to
     * @param {boolean} playAnims - Whether or not to play animations
     */
    navigate(url, playAnims = true) {
        return __awaiter(this, void 0, void 0, function* () {
            // WE start with a fade animation
            if (playAnims)
                yield this.animator.fadeOut(document.body.querySelector(this.body));
            const pageData = yield this.requestPage(url);
            const body = yield this.parsePage(pageData);
            // Cleanup and render the page
            this.cleanPage(body);
            // We reload link elements to allow scripts to create objects that require these styles.
            this.reloadLinkElements(body);
            try {
                this.destroyJSCache();
                this.executeJS(body);
            }
            catch (e) {
                log(`❌ Failed to execute JS: ${e}`, 'error');
            }
            // update the URL at the top of the browser
            window.history.pushState({}, '', url);
            // Configure links and forms to work with AtherJS
            try {
                this.configLinks();
                this.configForms();
            }
            catch (e) {
                log(`❌ Failed to configure links and forms: ${e}`, 'error');
            }
            // Finally, we update all elements referencing State
            this.store.reloadState();
            this.hookEvents();
            // And in the end we fade in the new page.
            if (playAnims)
                yield this.animator.fadeIn(document.body.querySelector(this.body));
            document.dispatchEvent(new CustomEvent('atherjs:pagechange'));
            // Store the URL in the History array. We cut off the arguments as it may cause issues and generally is not needed.
            this.urlHistory.push(url.split('?')[0]);
            this.isNavigating = false;
            // Update the script references
            yield this.loadPageScript();
        });
    }
    loadPageScript() {
        return __awaiter(this, void 0, void 0, function* () {
            const script = document.querySelector('script:not([src])');
            if (script == null)
                return;
            // We encode the script to make it work with import()
            const encoded = encodeURIComponent(script.innerHTML);
            const uri = `data:text/javascript;charset=utf-8,${encoded}`;
            const imports = yield import(uri);
            this.pageScript = yield imports;
        });
    }
    /**
     * Request a page and return its body
     * @param {string} url - URL to request
     * @returns `string` Returns the page body
     */
    requestPage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debugLogging)
                log(`🌍 Requesting page ${url}`);
            if (url.split('/')[2] != window.location.href.split('/')[2]) {
                log('Leaving current website. AtherJS will not handle it.', 'warn');
                window.location.href = url;
                return;
            }
            // Time the fetch and display the time in the console if debugLogging is on
            let startTime = new Date();
            let req = yield fetch(url);
            let endTime = new Date();
            if (this.debugLogging)
                log(`📬 Page received in ${endTime.getTime() - startTime.getTime()}ms`);
            if (req.status !== 200) {
                log(`Error while fetching page. Status code: ${req.status}`, 'error');
                this.isNavigating = false;
                return;
            }
            return yield req.text();
        });
    }
    /**
     * Parse the page and return the body
     * @param {string} page - Page to parse
     * @returns body - Returns the body of the page
     */
    parsePage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const parser = new DOMParser();
            const doc = parser.parseFromString(page, 'text/html');
            const body = doc.body;
            return body;
        });
    }
    /**
     * Execute all JS in the page. It is embedded in a script tag and executed.
     * Note: Be careful with your script includes as it will include any script tag found in the body.
     * It will run all scripts in EVAL. Be absolutely sure you trust the code!
     * @param {HTMLElement} body - The new page's body to take the scripts from.
     */
    executeJS(body) {
        const scripts = body.querySelectorAll('script');
        const basePage = document.body.querySelector(this.body);
        scripts.forEach((script) => {
            if (script.hasAttribute(attributes.get('ignore')))
                return;
            // Check to see if a namespace is provided. If not, throw an error about it
            const identifier = script.getAttribute(attributes.get('namespace'));
            if (!identifier && this.debugLogging)
                log(`❌ Script ${script.src} has no namespace identifier configured. It will never unload.`, 'error');
            if (identifier) {
                // Check if the script is already loaded. If so, skip it.
                if (this.activeScriptNameStates.includes(identifier)) {
                    if (this.debugLogging)
                        log(`❌ Script ${script.src} is already loaded. Skipping it.`, 'warn');
                    return;
                }
                // Add the script to the list of active scripts
                this.activeScriptNameStates.push(identifier);
            }
            // Embed the script to the page. Also makes it execute.
            const newScript = document.createElement('script');
            newScript.innerHTML = script.innerHTML;
            newScript.src = script.src;
            basePage.appendChild(newScript);
            if (this.debugLogging)
                log(`📜 Running script ${script.src} ('${identifier}')`);
        });
    }
    /**
     * Remove all old JS script namespaces so new ones can take their place.
     */
    destroyJSCache() {
        this.activeScriptNameStates.forEach((scriptName) => {
            if (this.debugLogging)
                log(`🗑️ Destroying script '${scriptName}' from cache`);
            delete window[scriptName];
        });
        this.activeScriptNameStates = [];
    }
    /**
     * Reload all link tags found in the body. This is absolutely needed in order to import all stylesheets.
     * @param {HTMLElement} body - The new page's body
     */
    reloadLinkElements(body) {
        const links = body.querySelectorAll('link');
        links.forEach((link) => {
            const newLink = document.createElement('link');
            newLink.rel = link.rel;
            newLink.href = link.href;
            newLink.type = link.type;
            document.head.appendChild(newLink);
        });
    }
    /**
     * Clean up and render the page to the hidden body
     * @param {Element} page - Page to clean
     * @returns `void`
     */
    cleanPage(page) {
        // Check if we need to rebuild important components. Will be skipped if not needed
        this.rebuildComponent(page.querySelector('nav'));
        this.rebuildComponent(page.querySelector('footer'));
        // this.rebuildComponent(page.querySelector('footer'))
        this.rebuildBody(page);
        return;
    }
    /**
     * Rebuild a component, if it is required
     * @param {Element} component - Component to replace the current component with
     * @returns `bool` Was this component rebuilt?
     */
    rebuildComponent(component) {
        if (!component)
            return false;
        if (component.hasAttribute(attributes.get('rebuild'))) {
            document.body.querySelector(component.tagName).replaceWith(component);
            return true;
        }
        return false;
    }
    /**
     * Rebuild the "body" of the page.
     * @param {Element} body - Body to replace the current body with
     */
    rebuildBody(body) {
        document.body.querySelector(this.body).innerHTML = '';
        document.body.querySelector(this.body).replaceWith(body.querySelector(this.body));
    }
    /**
     * Check to see if the navigator is valid
     * @returns {Boolean} Returns wether or not the navigator exists
     */
    doesNavigatorExist() {
        return typeof window.navigator !== 'undefined';
    }
    /**
     * CHeck to see if a A tag is actually a Link or just a fancy button.
     * @param {HTMLAnchorElement} link - Link to check
     * @returns `bool` Is this link an actual link?
     */
    validateLink(link) {
        // if(link.href == window.location.href) return false;
        return link.href.includes('http');
    }
    hookEvents() {
        const elements = document.querySelectorAll(`[${attributes.get('onchange')}],[${attributes.get('onclick')}],[${attributes.get('oninput')}],[${attributes.get('onkeydown')}],[${attributes.get('onkeyup')}],[${attributes.get('onkeypress')}],[${attributes.get('onsubmit')}]
        `);
        elements.forEach((element) => {
            this.bindElementCustomEvents(element);
        });
    }
    /**
     * Bind custom events to elements base don their attributes
     * @param {Element} element Element to bind events to
     */
    bindElementCustomEvents(element) {
        // switch case based on specific attributes
        switch (true) {
            case element.hasAttribute(attributes.get('ignore')):
                break;
            case element.hasAttribute(attributes.get('onchange')):
                this.addEventHandler(element, 'change', 'onchange');
                break;
            case element.hasAttribute(attributes.get('onclick')):
                this.addEventHandler(element, 'click', 'onclick');
                break;
            case element.hasAttribute(attributes.get('oninput')):
                this.addEventHandler(element, 'input', 'oninput');
                break;
            case element.hasAttribute(attributes.get('onkeydown')):
                this.addEventHandler(element, 'keydown', 'onkeydown');
                break;
            case element.hasAttribute(attributes.get('onkeyup')):
                this.addEventHandler(element, 'keyup', 'onkeyup');
                break;
            case element.hasAttribute(attributes.get('onkeypress')):
                this.addEventHandler(element, 'keypress', 'onkeypress');
                break;
            case element.hasAttribute(attributes.get('onsubmit')):
                this.addEventHandler(element, 'submit', 'onsubmit');
                break;
        }
    }
    /**
     * Add event handlers to elements based on a specific attribute
     * @param {Element} element The element to add the event listenener too
     * @param {string} attribute The attribute to listen for
     * @param {string} fetchAttribute The attribute to fetch the function name from
     */
    addEventHandler(element, attribute, fetchAttribute) {
        element.addEventListener(attribute, (e) => {
            if (element.hasAttribute(attributes.get('prevent')))
                e.preventDefault();
            const functionName = element.getAttribute(attributes.get(fetchAttribute));
            try {
                this.pageScript[functionName](element, e);
            }
            catch (e) {
                log(`Error: ${e.message} in ${functionName}()`, 'error');
            }
        });
    }
}
