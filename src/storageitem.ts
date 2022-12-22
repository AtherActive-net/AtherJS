export class StorageItem {
    constructor(public key:string, public value:any, public referenceElements:HTMLElement[] = []){}

    /**
     * Update the value of this StorageItem.
     * While doing this we also scan the DOM for elements that are referencing this StorageItem and update them.
     * @param {any} value The new value of this StorageItem
     */
    public updateValue(value:any){
        this.value = value;
        this.refreshElementList();
        this.hydrateElements();
    }

    /**
     * Hydrate the elements that are referencing this StorageItem with the value of this StorageItem.
     * Note: Arrays and Objects may not be displayed correctly.
     */
    public hydrateElements() {
        this.referenceElements.forEach((element) => {
            element.innerHTML = this.value;
        })
    }

    /**
     * Refresh the list of elements that are referencing this StorageItem
     */
    public refreshElementList() {
        this.referenceElements = Array.from(document.querySelectorAll(`[at-get="${this.key}"]`));
    }
}