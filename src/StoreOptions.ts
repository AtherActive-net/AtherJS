import { log,attributes } from './utils.js';

/**
 * A State Object is a single state. It contains the value, and a reference to elements that interact with it.
 */
export class StateObject {
    private name:string;
    private value:any;
    private referencedElements:HTMLElement[] = [];
    public prefix:string = '';

    constructor(name:string, value:any, prefix:string='') {
        this.name = name;
        this.value = value;
        this.prefix = prefix;
        this.findElements();
        this.updateElements();
    }

    /**
     * Find all elements that reference this state
     */
    public findElements() {
        const attribute = attributes.get(this.prefix+'state');
        this.referencedElements = Array.from(document.querySelectorAll(`[${attribute}^="${this.name}"]`));
    }

    /**
     * Update all elements that reference this state
     */
    public updateElements() {
        this.referencedElements.forEach((el) => {
            if(el.getAttribute(attributes.get(this.prefix+'state-value'))) {
                const key = el.getAttribute(attributes.get(this.prefix+'state'));
                const value = el.getAttribute(attributes.get(this.prefix+'state-value'));
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
                const key = el.getAttribute(attributes.get(this.prefix+'state'));
                
                // Attempt to get the proper value. This is needed for nested objects.
                // If the key is not nested, it will just return it.
                // Arrays are currently not yet supported.
                const splittedKey = key.split('.');
                let value = this.value;
                splittedKey.forEach(splitKey => {
                    if(splitKey == splittedKey[0]) return

                    value = value[splitKey];
                });

                // Return the value that we got.
                el.innerHTML = value;
            }
        })
    }
}
