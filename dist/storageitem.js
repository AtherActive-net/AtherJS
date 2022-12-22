export class StorageItem {
    constructor(key, value, referenceElements = []) {
        this.key = key;
        this.value = value;
        this.referenceElements = referenceElements;
    }
    /**
     * Update the value of this StorageItem.
     * While doing this we also scan the DOM for elements that are referencing this StorageItem and update them.
     * @param {any} value The new value of this StorageItem
     */
    updateValue(value) {
        this.value = value;
        this.refreshElementList();
        this.hydrateElements();
    }
    /**
     * Hydrate the elements that are referencing this StorageItem with the value of this StorageItem.
     * Note: Arrays and Objects may not be displayed correctly.
     */
    hydrateElements() {
        this.referenceElements.forEach((element) => {
            element.innerHTML = this.value;
        });
    }
    /**
     * Refresh the list of elements that are referencing this StorageItem
     */
    refreshElementList() {
        this.referenceElements = Array.from(document.querySelectorAll(`[at-get="${this.key}"]`));
    }
}
