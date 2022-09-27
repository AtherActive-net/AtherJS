var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _State_stateObject;
/**
 * AtherJS base class. Contains all functionality and hooks
 * @param {AtherOptions} options - Options for AtherJS
 */
class AtherJS {
    /**
     * AtherJS Constructor
     * @param opts - Options for AtherJS
     * @returns `void`
     */
    constructor(opts = {
        useCSSForFading: false,
        state: {
            updateElementListOnUpdate: true
        }
    }) {
        this.animator = new Anims();
        // Set the selector for the body. Per site it can be different, so it can be changed. Not setting it makes it default
        this.body = opts.bodyOverwrite || 'body';
        this.debugLogging = opts.debugLogging || true;
        // Create a new State object
        this.state = new State();
        this.isNavigating = false;
        if (!this.doesNavigatorExist()) {
            log('Navigator does not exist. AtherJS will not work.', 'error');
            return;
        }
        log('✅ AtherJS is active!');
        document.addEventListener('DOMContentLoaded', () => {
            this.configLinks();
        });
    }
    /**
     * Navigate to a page.
     * @param {string} url - URL to navigate to
     */
    go(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isNavigating) {
                this.isNavigating = true;
                yield this.navigate(url);
            }
            else {
                log(`Naviation is already in progress. Skipping navigation to ${url}`, 'warn');
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
            if (this.validateLink(link)) {
                if (!link.hasAttribute('ather-ignore')) {
                    link.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                        e.preventDefault();
                        yield this.go(link.href);
                    }));
                    if (this.debugLogging)
                        log(`🔗 Configured link ${link.href}`);
                }
            }
            else {
                if (this.debugLogging)
                    log(`❌ Link ${link.href} disabled as it failed validation check.`, 'warn');
                link.removeAttribute('href');
            }
        });
    }
    /**
     * Navigate to a (new) page
     * @param url - URL to navigate to
     */
    navigate(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // WE start with a fade animation
            yield this.animator.fadeOut(document.body.querySelector(this.body));
            const pageData = yield this.requestPage(url);
            const body = yield this.parsePage(yield pageData);
            // Cleanup and render the page
            this.cleanPage(body);
            this.executeJS(body);
            // update the URL at the top of the browser
            window.history.pushState({}, '', url);
            // We need to fully reload all links as these have not yet been intercepted.
            this.configLinks();
            // Finally, we update all elements referencing State
            this.state.reloadState();
            // And in the end we fade in the new page.
            yield this.animator.fadeIn(document.body.querySelector(this.body));
            document.dispatchEvent(new CustomEvent('atherjs:pagechange'));
            this.isNavigating = false;
        });
    }
    /**
     * Request a page and return its body
     * @param url - URL to request
     * @returns `string` Returns the page body
     */
    requestPage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debugLogging)
                log(`🌍 Requesting page ${url}`);
            // Time the fetch and display the time in the console if debugLogging is on
            let startTime = new Date();
            let req = yield fetch(url);
            let endTime = new Date();
            if (this.debugLogging)
                log(`📬 Page received in ${endTime.getTime() - startTime.getTime()}ms`);
            if (req.status !== 200) {
                log(`Error while fetching page. Status code: ${req.status}`, 'error');
                return;
            }
            if (req.url.split('/')[2] != window.location.href.split('/')[2]) {
                log('Leaving current website. AtherJS will not handle it.', 'warn');
            }
            return yield req.text();
        });
    }
    /**
     * Parse the page and return the body
     * @param page - Page to parse
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
     * @param body - The new page's body to take the scripts from.
     */
    executeJS(body) {
        const scripts = body.querySelectorAll('script');
        const basePage = document.body.querySelector(this.body);
        scripts.forEach((script) => {
            const newScript = document.createElement('script');
            newScript.innerHTML = script.innerHTML;
            newScript.src = script.src;
            basePage.appendChild(newScript);
        });
    }
    /**
     * Clean up and render the page to the hidden body
     * @param page - Page to clean
     * @returns `void`
     */
    cleanPage(page) {
        // Check if we need to rebuild important components. Will be skipped if not needed
        this.rebuildComponent(page.querySelector('nav'));
        // this.rebuildComponent(page.querySelector('footer'))
        this.rebuildBody(page);
        return;
    }
    /**
     * Rebuild a component, if it is required
     * @param component - Component to replace the current component with
     * @returns `bool` Was this component rebuilt?
     */
    rebuildComponent(component) {
        if (component.hasAttribute('ather-rebuild')) {
            document.body.querySelector(component.tagName).replaceWith(component);
            return true;
        }
        return false;
    }
    /**
     * Rebuild the "body" of the page.
     * @param body - Body to replace the current body with
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
     * @param link - Link to check
     * @returns `bool` Is this link an actual link?
     */
    validateLink(link) {
        if (link.href == window.location.href)
            return false;
        return link.href.includes('http');
    }
}
/**
 * Deals with animations
 */
class Anims {
    /**
     * Play a fade in animation
     * @param el - Element to fade in
     * @param time - Time to fade in
     * @returns `Promise` Resolves when the animation is complete
     */
    fadeIn(el, time = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                el.style.opacity = '0';
                // el.style.display = 'block';
                (function fade() {
                    var val = parseFloat(el.style.opacity);
                    if (!((val += .05) > 1)) {
                        el.style.opacity = val.toString();
                        requestAnimationFrame(fade);
                    }
                    else {
                        resolve(true);
                    }
                })();
            });
        });
    }
    /**
     * Play a fade out animation
     * @param el - Element to fade out
     * @param time - Time to fade out
     * @returns `Promise` Resolves when the animation is complete
     */
    fadeOut(el, time = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                el.style.opacity = '1';
                (function fade() {
                    if ((parseFloat(el.style.opacity) - 0.05) < -0.05) {
                        // el.style.display = 'none';
                        resolve(true);
                    }
                    else {
                        el.style.opacity = (parseFloat(el.style.opacity) - 0.01).toString();
                        requestAnimationFrame(fade);
                    }
                })();
            });
        });
    }
}
/**
 * State class. Deals with anyting related to state.
 */
class State {
    constructor() {
        this.debugLogging = true;
        this.createStatesOnPageLoad = true;
        _State_stateObject.set(this, {});
        this.updateElementListOnUpdate = true;
        if (this.createStatesOnPageLoad) {
            document.addEventListener('DOMContentLoaded', () => {
                this.createOnLoad();
            });
        }
    }
    /**
     * Update a value on the State Object
     * @param key - Key to set
     * @param value - Value to set
     */
    setState(key, value) {
        if (__classPrivateFieldGet(this, _State_stateObject, "f")[key] == undefined) {
            log(`State key '${key}' does not exist. Creating it..`, 'warn');
            log('States should be created manually before setting values.', 'warn');
            this.createState(key, value);
        }
        __classPrivateFieldGet(this, _State_stateObject, "f")[key].value = value;
        if (this.updateElementListOnUpdate) {
            __classPrivateFieldGet(this, _State_stateObject, "f")[key].updateElements();
        }
    }
    /**
     * Create a new State. This can be used to transfer values between pages.
     * @param name - Name of the state
     * @param value - Initial value of the state
     */
    createState(name, value) {
        __classPrivateFieldGet(this, _State_stateObject, "f")[name] = new StateObject(name, value);
    }
    /**
     * Get a value of a state.
     * @param key - Key to get
     * @returns value of the key
     */
    getState(key) {
        if (__classPrivateFieldGet(this, _State_stateObject, "f")[key] == undefined) {
            log(`State '${key}' does not exist. Returning undefined`, 'warn');
            return undefined;
        }
        return __classPrivateFieldGet(this, _State_stateObject, "f")[key].value;
    }
    /**
     * Delete a State from the Manager. This action is irreversible.
     * @param key - Key to delete
     */
    deleteState(key) {
        if (__classPrivateFieldGet(this, _State_stateObject, "f")[key] == undefined) {
            log(`State '${key}' does not exist. Therefore it cannot be deleted.`, 'warn');
        }
        delete __classPrivateFieldGet(this, _State_stateObject, "f")[key];
    }
    /**
     * Reload all elements that interact with State. Required after changing pages.
     * For changes to the DOM after load, call the `updateElements` function on the StateObject instead.
     */
    reloadState() {
        for (let key in __classPrivateFieldGet(this, _State_stateObject, "f")) {
            __classPrivateFieldGet(this, _State_stateObject, "f")[key].findElements();
            __classPrivateFieldGet(this, _State_stateObject, "f")[key].updateElements();
            if (this.debugLogging)
                log(`🔃 Reloaded state '${key}'`, 'log');
        }
    }
    /**
     * Create new states on initial page load.
     * @returns void
     */
    createOnLoad() {
        if (!this.createStatesOnPageLoad)
            return;
        const states = document.querySelectorAll('[ather-state]');
        states.forEach((state) => {
            if (__classPrivateFieldGet(this, _State_stateObject, "f")[state.getAttribute('ather-state')] == undefined) {
                if (this.debugLogging)
                    log(`⚙️ Creating state '${state.getAttribute('ather-state')}' from page load.`, 'log');
                const name = state.getAttribute('ather-state');
                const value = state.getAttribute('ather-state-inital') || '';
                this.createState(name, value);
            }
        });
    }
}
_State_stateObject = new WeakMap();
/**
 * A State Object is a single state. It contains the value, and a reference to elements that interact with it.
 */
class StateObject {
    constructor(name, value) {
        this.referencedElements = [];
        this.name = name;
        this.value = value;
        this.findElements();
        this.updateElements();
    }
    /**
     * Find all elements that reference this state
     */
    findElements() {
        this.referencedElements = Array.from(document.querySelectorAll(`[ather-state="${this.name}"]`));
    }
    /**
     * Update all elements that reference this state
     */
    updateElements() {
        this.referencedElements.forEach((el) => {
            if (el.getAttribute('ather-state-value')) {
                const key = el.getAttribute('ather-state');
                const value = el.getAttribute('ather-state-value');
                if (!value) {
                    log(`No value value requested by element.`, 'warn');
                    return;
                }
                try {
                    el.innerHTML = this.value[value];
                }
                catch (_a) {
                    log(`Value '${value}' does not exist on state '${key}'.`, 'warn');
                }
            }
            else {
                el.innerHTML = this.value;
            }
        });
    }
}
/**
* Log a message to the console
* @param msg - Message to log
* @param type - Type of log
*/
function log(msg, type = "log") {
    switch (type) {
        case 'error':
            console.error(`[AtherJS] [ERROR] ${msg}`);
            break;
        case 'warn':
            console.warn(`[AtherJS] [WARN] ${msg}`);
            break;
        case 'log':
            console.log(`[AtherJS] [LOG] ${msg}`);
            break;
        default:
            console.log(`[AtherJS] [LOG] ${msg}`);
    }
}
