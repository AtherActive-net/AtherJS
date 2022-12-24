import { log,attributes } from './utils.js';

/**
 * A State Object is a single state. It contains the value, and a reference to elements that interact with it.
 */
export class StateObject {
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
        const attribute = attributes.get('state');
        this.referencedElements = Array.from(document.querySelectorAll(`[${attribute}="${this.name}"]`));
    }

    /**
     * Update all elements that reference this state
     */
    public updateElements() {
        this.referencedElements.forEach((el) => {
            if(el.getAttribute(attributes.get('state-value'))) {
                const key = el.getAttribute(attributes.get('state'));
                const value = el.getAttribute(attributes.get('state-value'));
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
