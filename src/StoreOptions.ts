import type { AtherJS } from 'app.js';
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
        
        // if it wasnt found, we can assume it is a component
        if(!attribute) {
            const component = (window['ather'] as AtherJS).componentFunctions.getComponentByUUID(this.prefix);
            if(!component) {
                log(`Could not find component with UUID '${this.prefix}'.`, 'warn');
                return;
            }
            
            this.referencedElements = Array.from(component.element.querySelectorAll(`[at-var^="&.${this.name}"]`));
            return;
        }

        this.referencedElements = Array.from(document.querySelectorAll(`[${attribute}^="${this.name}"]`));
    }

    /**
     * Update all elements that reference this state
     */
    public updateElements() {
        // send out a custom event
        const event = new CustomEvent('atherjs:state-update', { detail: { name: this.name, value: this.value, prefix: this.prefix } });
        document.dispatchEvent(event);
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
                let key = this.removePefixFromKey(el.getAttribute("at-var"));
                
                // Attempt to get the proper value. This is needed for nested objects.
                // If the key is not nested, it will just return it.
                // Arrays are currently not yet supported.
                let value = this.assembleValue(key);
                
                // Check if the value is actually defined. If not, log a warning.
                // We will actually render the undefined value though.
                if(value == undefined) {
                    log(`Value '${key}' does not exist on store '${this.name}'.`, 'warn');
                }

                // Return the value that we got.
                el.innerHTML = value;
            }
        })
    }

    /**
     * Assemble the value of a Store. 
     * We loop over the entire key, and we will find our way through the object if there is a dot in the key.
     * @param {string} key - Key received from the element
     * @returns value of the key
     */
    private assembleValue(key: string) {
        const splittedKey = key.split('.');
        let value = this.value;
        splittedKey.forEach(splitKey => {
            if (splitKey == splittedKey[0])
                return;

            value = value[splitKey];
        });
        return value;
    }

    private removePefixFromKey(key:string) {
        if(key.startsWith("&.")) return key.replace("&.", "");
        if(key.startsWith("@")) return key.replace("@", "");
        return key;
    }
}
