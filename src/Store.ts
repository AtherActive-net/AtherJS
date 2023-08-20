import { AtherOptions, StoreOptions } from './interfaces.js';
import { log,attributes } from './utils.js';
import { StateObject } from './StoreOptions.js';
import { AtherJS } from 'app.js';

/**
 * State class. Deals with anyting related to state.
 */
export class Store {
    private debugLogging:boolean
    private createStatesOnPageLoad:boolean = true;
    private updateElementListOnUpdate:boolean = true;
    public prefix:string = '';
    
    #stateObject:object = {};

    constructor(ather:AtherJS, opts:StoreOptions={}) {
        this.debugLogging = ather.debugLogging;

        // load options for state
        Object.keys(opts).forEach((key) => {
            this[key] = opts[key];
        })

        if(this.createStatesOnPageLoad){
            document.addEventListener('DOMContentLoaded', () => {
                this.createOnLoad();
            })
        }
    }

    /**
     * Update a value on the State Object
     * @param {string} key - Key to set
     * @param {any} value - Value to set
     */
    public set(key:string,value:any) {
        if(this.#stateObject[key] == undefined) {
            log(`Store key '${key}' does not exist. Creating it..`, 'warn');
            log('Stores should be created manually before setting values.', 'warn');
            this.create(key, value)
        }
        this.#stateObject[key].value = value;

        if(this.updateElementListOnUpdate) {
            this.#stateObject[key].updateElements();
        }
    }

    /**
     * Create a new State. This can be used to transfer values between pages.
     * @param {string} name - Name of the state
     * @param {any} value - Initial value of the state
     */
    public create(name:string,value:any) {
        this.#stateObject[name] = new StateObject(name,value,this.prefix);
    }

    /**
     * Get a value of a state.
     * @param {string} key - Key to get
     * @returns value of the key
     */
    public get(key:string) {
        if(this.#stateObject[key] == undefined) {
            log(`Store '${key}' does not exist. Returning undefined`, 'warn');
            return undefined;
        }
        return this.#stateObject[key].value;
    }

    /**
     * Delete a State from the Manager. This action is irreversible.
     * @param {string} key - Key to delete
     */
    public delete(key:string) {
        if(this.#stateObject[key] == undefined) {
            log(`Store '${key}' does not exist. Therefore it cannot be deleted.`, 'warn');
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

        const states = document.querySelectorAll(attributes.get(this.prefix+'state'));

        states.forEach((state:HTMLElement) => {
            if(this.#stateObject[state.getAttribute(attributes.get(this.prefix+'state'))] == undefined) {
                if(this.debugLogging) log(`⚙️ Creating state '${state.getAttribute(attributes.get(this.prefix+'state'))}' from page load.`, 'log');
                const name = state.getAttribute(attributes.get(this.prefix+'state'));
                const value = state.getAttribute(attributes.get(this.prefix+'state-init')) || '';
                this.create(name,value);
            }
        })
    }

    public debug() {
        console.log(this.#stateObject);
    }
}