export declare class StorageItem {
    key: string;
    value: any;
    referenceElements: HTMLElement[];
    constructor(key: string, value: any, referenceElements?: HTMLElement[]);
    /**
     * Update the value of this StorageItem.
     * While doing this we also scan the DOM for elements that are referencing this StorageItem and update them.
     * @param {any} value The new value of this StorageItem
     */
    updateValue(value: any): void;
    /**
     * Hydrate the elements that are referencing this StorageItem with the value of this StorageItem.
     * Note: Arrays and Objects may not be displayed correctly.
     */
    hydrateElements(): void;
    /**
     * Refresh the list of elements that are referencing this StorageItem
     */
    refreshElementList(): void;
}
