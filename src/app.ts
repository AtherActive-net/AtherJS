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
    bodyOverwrite?: string
    debugLogging?: boolean
    useCSSForFading?: boolean
    cssFadeOptions?: {
        fadeInCSSClass?: string
        fadeOutCSSClass?: string
    },
    jsFadeOptions?: {
        fadeNavbar?: boolean
        fadeFooter?: boolean
    },
    state?: StateOptions
}

/**
 * Option Class for State
 * @param updateElementListOnUpdate - Wether or not to update state elements on state update. `true` by default.
 */
interface StateOptions {
    updateElementListOnUpdate?: boolean,
    reloadOnSetState?: boolean
}

/**
 * AtherJS base class. Contains all functionality and hooks
 * @param {AtherOptions} options - Options for AtherJS
 */
class AtherJS {
    public body: string;
    public debugLogging: boolean;
    private animator = new Anims();
    private state: State;
    private isNavigating: boolean
    private activeScriptNameStates: string[] = [];
    private urlHistory: string[] = [];

    /**
     * AtherJS Constructor
     * @param opts - Options for AtherJS
     * @returns `void`
     */
    constructor(opts: AtherOptions={
        useCSSForFading: false,
        state: {
            updateElementListOnUpdate: true
        }
    }) {
        // Set the selector for the body. Per site it can be different, so it can be changed. Not setting it makes it default
        this.body = opts.bodyOverwrite || 'body';
        this.debugLogging = opts.debugLogging || true;

        // Create a new State object
        this.state = new State();
        this.isNavigating = false;

        if(!this.doesNavigatorExist()) {
            log('Navigator does not exist. AtherJS will not work.', 'error')
            return
        }

        log('✅ AtherJS is active!');
        document.addEventListener('DOMContentLoaded', () => {
            this.go(window.location.href);
        })
    }

    /**
     * Navigate to a page.
     * @param {string} url - URL to navigate to
     */
    public async go(url:string) {
        if(!this.isNavigating) {
            this.isNavigating = true;
            await this.navigate(url);
        } else {
            log(`Naviation is already in progress. Skipping navigation to ${url}`, 'warn');
        }
    }
    
    /**
     * Go back 1 page if this is possible.
     */
    public async back() {
        if(this.urlHistory.length > 1) {
            this.urlHistory.pop();
            await this.go(this.urlHistory[this.urlHistory.length - 1]);
        }
    }

    /**
     * Configure all found links to work with AtherJS.
     * If a link contains the `ather-ignore` attribute, it will be ignored.
     * This is run at startup, but can be called again to reconfigure all links.
     */
    public configLinks() {
        const links = document.querySelectorAll('a');
        links.forEach((link) =>{

            if(this.validateLink(link)) {

                if(!link.hasAttribute('ather-ignore')) {

                    link.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await this.go(link.href);
                    })
    
                    if(this.debugLogging) log(`🔗 Configured link ${link.href}`)
                }
            } else {
                if(link.hasAttribute('ather-ignore')) {
                    if(this.debugLogging) log(`🔗 Ignoring link ${link.nodeName}`)
                }
                else if(link.hasAttribute('ather-back')) {
                    link.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await this.back();
                    })
                } else if(link.hasAttribute('dropdown')) {
                    if(this.debugLogging) log(`🔗 Ignoring link ${link.nodeName}`)

                } else {
                    if(this.debugLogging) log(`❌ Link ${link.href} disabled as it failed validation check.`,'warn');
                    link.setAttribute('debug','test');
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        if(this.debugLogging) log(`❌ Link ${link.href} disabled.`,'warn');
                    })
                }
            }
        })
    }

    /**
     * Configure all found forms to work properly with AtherJS
     */
    private configForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach((form) => {
            if(form.hasAttribute('ather-ignore')) return;

            form.addEventListener('submit', async (e) => {
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
                })
                await this.go((await req).url);
            })

            if(this.debugLogging) log(`🔗 Configured form ${form.action} (${form.method})`)
        })
    }

    /**
     * Convert a form to JSON. It reads all input, select and textarea elements.
     * It then reads their name and value, and uses that to create a JSON object.
     * @param form the form to convert to JSON
     * @returns stringified JSON
     */
    private formToJSON(form: HTMLFormElement) {
        let data = {};
        const elements = form.querySelectorAll('input, select, textarea');
        elements.forEach((element:HTMLInputElement) => {
            data[element.name] = element.value;
        })

        return JSON.stringify(data);
    }

    /**
     * Navigate to a (new) page
     * @param url - URL to navigate to
     */
    private async navigate(url:string) {
        // WE start with a fade animation
        await this.animator.fadeOut(document.body.querySelector(this.body))
        const pageData = await this.requestPage(url);
        const body = await this.parsePage(pageData);
        
        // Cleanup and render the page
        this.cleanPage(body);

        this.destroyJSCache();
        this.executeJS(body);

        this.reloadLinkElements(body);
        // update the URL at the top of the browser
        window.history.pushState({}, '', url);

        // Configure links and forms to work with AtherJS
        this.configLinks();
        this.configForms();

        // Finally, we update all elements referencing State
        this.state.reloadState();

        // And in the end we fade in the new page.
        await this.animator.fadeIn(document.body.querySelector(this.body))
        document.dispatchEvent(new CustomEvent('atherjs:pagechange'))
        this.urlHistory.push(url);
        this.isNavigating = false;


    }

    /**
     * Request a page and return its body
     * @param url - URL to request
     * @returns `string` Returns the page body
     */
    private async requestPage(url:string) {
        if(this.debugLogging) log(`🌍 Requesting page ${url}`);
        if(url.split('/')[2] != window.location.href.split('/')[2]) {
            log('Leaving current website. AtherJS will not handle it.', 'warn')
            window.location.href = url;
            return
        }

        // Time the fetch and display the time in the console if debugLogging is on
        let startTime = new Date()

        let req = await fetch(url)

        let endTime = new Date()
        if(this.debugLogging) log(`📬 Page received in ${endTime.getTime() - startTime.getTime()}ms`);
        
        if(req.status !== 200) {
            log(`Error while fetching page. Status code: ${req.status}`, 'error')
            this.isNavigating = false;
            return
        }

        return await req.text()
    }

    /**
     * Parse the page and return the body
     * @param page - Page to parse
     * @returns body - Returns the body of the page
     */
    private async parsePage(page:string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(page, 'text/html');
        const body = doc.body;
        return body;
    }

    /**
     * Execute all JS in the page. It is embedded in a script tag and executed.
     * Note: Be careful with your script includes as it will include any script tag found in the body.
     * It will run all scripts in EVAL. Be absolutely sure you trust the code!
     * @param body - The new page's body to take the scripts from.
     */
    private executeJS(body:HTMLElement) {
        const scripts = body.querySelectorAll('script');
        const basePage = document.body.querySelector(this.body);
        scripts.forEach((script) => {
            // Check to see if a namespace is provided. If not, throw an error about it
            const identifier = script.getAttribute('ather-namespace');
            if(!identifier && this.debugLogging) log(`❌ Script ${script.src} has no namespace identifier configured. It will never unload.`, 'error');
            if(identifier) {
                // Check if the script is already loaded. If so, skip it.
                if(this.activeScriptNameStates.includes(identifier)) {
                    if(this.debugLogging) log(`❌ Script ${script.src} is already loaded. Skipping it.`, 'warn');
                    return
                }
                // Add the script to the list of active scripts
                this.activeScriptNameStates.push(identifier);
            }
            // Embed the script to the page. Also makes it execute.
            const newScript = document.createElement('script');
            newScript.innerHTML = script.innerHTML;
            newScript.src = script.src;
            basePage.appendChild(newScript);
            log(`📜 Running script ${script.src} ('${identifier}')`)
        })
    }

    /**
     * Remove all old JS script namespaces so new ones can take their place.
     */
    private destroyJSCache() {
        this.activeScriptNameStates.forEach((scriptName) => {
            if(this.debugLogging) log(`🗑️ Destroying script '${scriptName}' from cache`);
            delete window[scriptName];
        })
        this.activeScriptNameStates = [];
    }

    /**
     * Reload all link tags found in the body. This is absolutely needed in order to import all stylesheets.
     * @param body - The new page's body 
     */
    private reloadLinkElements(body:HTMLElement) {
        const links = body.querySelectorAll('link');
        links.forEach((link) => {
            const newLink = document.createElement('link');
            newLink.rel = link.rel;
            newLink.href = link.href;
            newLink.type = link.type;
            document.head.appendChild(newLink);
        })
    }

    /**
     * Clean up and render the page to the hidden body
     * @param page - Page to clean
     * @returns `void`
     */
    private cleanPage(page:Element) {
        // Check if we need to rebuild important components. Will be skipped if not needed
        this.rebuildComponent(page.querySelector('nav'));
        this.rebuildComponent(page.querySelector('footer'));
        // this.rebuildComponent(page.querySelector('footer'))
        this.rebuildBody(page);
        return
    }

    /**
     * Rebuild a component, if it is required
     * @param component - Component to replace the current component with
     * @returns `bool` Was this component rebuilt?
     */
    private rebuildComponent(component:Element) {
        if(component.hasAttribute('ather-rebuild')) {
            document.body.querySelector(component.tagName).replaceWith(component);
            return true;
        }
        return false;
    }

    /**
     * Rebuild the "body" of the page.
     * @param body - Body to replace the current body with
     */
    private rebuildBody(body:Element) {
        document.body.querySelector(this.body).innerHTML = '';
        document.body.querySelector(this.body).replaceWith(body.querySelector(this.body));
    }


    /**
     * Check to see if the navigator is valid
     * @returns {Boolean} Returns wether or not the navigator exists
     */
    private doesNavigatorExist():Boolean {
        return typeof window.navigator !== 'undefined'
    }

    /**
     * CHeck to see if a A tag is actually a Link or just a fancy button.
     * @param link - Link to check
     * @returns `bool` Is this link an actual link?
     */
    private validateLink(link:HTMLAnchorElement) {
        if(link.href == window.location.href) return false;
        return link.href.includes('http')
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
    public async fadeIn(el:HTMLElement, time:number=100) {
        return new Promise((resolve, reject) => {
            el.style.opacity = '0';
            // el.style.display = 'block';
            (function fade() {
                var val = parseFloat(el.style.opacity);
                if (!((val += .05) > 1)) {
                    el.style.opacity = val.toString();
                    requestAnimationFrame(fade);
                } else {
                    resolve(true)
                }
            })();
        })
    }

    /**
     * Play a fade out animation
     * @param el - Element to fade out
     * @param time - Time to fade out
     * @returns `Promise` Resolves when the animation is complete
     */
    public async fadeOut(el:HTMLElement, time:number=100) {
        return new Promise((resolve, reject) => {
            el.style.opacity = '1';
            (function fade() {
                if ((parseFloat(el.style.opacity) - 0.05) < -0.05) {
                    // el.style.display = 'none';
                    resolve(true)
                } else {
                    el.style.opacity = (parseFloat(el.style.opacity) - 0.05).toString();
                    requestAnimationFrame(fade);
                }
            })();
        })
    }
}

/**
 * State class. Deals with anyting related to state.
 */
class State {
    public debugLogging:boolean = true;
    public createStatesOnPageLoad:boolean = true;

    #stateObject:object = {};
    private updateElementListOnUpdate:boolean = true;

    constructor() {
        if(this.createStatesOnPageLoad){
            document.addEventListener('DOMContentLoaded', () => {
                this.createOnLoad();
            })
        }
    }

    /**
     * Update a value on the State Object
     * @param key - Key to set
     * @param value - Value to set
     */
    public setState(key:string,value:any) {
        if(this.#stateObject[key] == undefined) {
            log(`State key '${key}' does not exist. Creating it..`, 'warn');
            log('States should be created manually before setting values.', 'warn');
            this.createState(key, value)
        }
        this.#stateObject[key].value = value;

        if(this.updateElementListOnUpdate) {
            this.#stateObject[key].updateElements();
        }
    }

    /**
     * Create a new State. This can be used to transfer values between pages.
     * @param name - Name of the state
     * @param value - Initial value of the state
     */
    public createState(name:string,value:any) {
        this.#stateObject[name] = new StateObject(name,value);
    }

    /**
     * Get a value of a state.
     * @param key - Key to get
     * @returns value of the key
     */
    public getState(key:string) {
        if(this.#stateObject[key] == undefined) {
            log(`State '${key}' does not exist. Returning undefined`, 'warn');
            return undefined;
        }
        return this.#stateObject[key].value;
    }

    /**
     * Delete a State from the Manager. This action is irreversible.
     * @param key - Key to delete
     */
    public deleteState(key:string) {
        if(this.#stateObject[key] == undefined) {
            log(`State '${key}' does not exist. Therefore it cannot be deleted.`, 'warn');
        }
        delete this.#stateObject[key];
    }

    /**
     * Reload all elements that interact with State. Required after changing pages.
     * For changes to the DOM after load, call the `updateElements` function on the StateObject instead.
     */
    public reloadState() {
        for(let key in this.#stateObject) {
            this.#stateObject[key].findElements();
            this.#stateObject[key].updateElements();

            if(this.debugLogging) log(`🔃 Reloaded state '${key}'`, 'log');
        }
    }

    /**
     * Create new states on initial page load.
     * @returns void
     */
    private createOnLoad() {
        if(!this.createStatesOnPageLoad) return;

        const states = document.querySelectorAll('[ather-state]');

        states.forEach((state:HTMLElement) => {
            if(this.#stateObject[state.getAttribute('ather-state')] == undefined) {
                if(this.debugLogging) log(`⚙️ Creating state '${state.getAttribute('ather-state')}' from page load.`, 'log');
                const name = state.getAttribute('ather-state');
                const value = state.getAttribute('ather-state-inital') || '';
                this.createState(name,value);
            }
        })
    }
}

/**
 * A State Object is a single state. It contains the value, and a reference to elements that interact with it.
 */
class StateObject {
    private name:string;
    private value:any;
    private referencedElements:HTMLElement[] = [];

    constructor(name:string, value:any) {
        this.name = name;
        this.value = value;
        this.findElements();
        this.updateElements();
    }

    /**
     * Find all elements that reference this state
     */
    public findElements() {
        this.referencedElements = Array.from(document.querySelectorAll(`[ather-state="${this.name}"]`));
    }

    /**
     * Update all elements that reference this state
     */
    public updateElements() {
        this.referencedElements.forEach((el) => {
            if(el.getAttribute('ather-state-value')) {
                const key = el.getAttribute('ather-state');
                const value = el.getAttribute('ather-state-value');
                if(!value) {
                    log(`No value value requested by element.`, 'warn');
                    return;
                }

                try {
                    el.innerHTML = this.value[value];
                } catch {
                    log(`Value '${value}' does not exist on state '${key}'.`, 'warn');
                }
            } else {
                el.innerHTML = this.value;
            }
        })
    }
}


/**
* Log a message to the console
* @param msg - Message to log
* @param type - Type of log
*/
function log(msg:string , type:string="log") {
    switch(type) {
        case 'error':
            console.error(`[AtherJS] [ERROR] ${msg}`)
            break
        case 'warn':
            console.warn(`[AtherJS] [WARN] ${msg}`)
            break
        case 'log':
            console.log(`[AtherJS] [LOG] ${msg}`)
            break
        default:
            console.log(`[AtherJS] [LOG] ${msg}`)
    }
}