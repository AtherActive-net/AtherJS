import { AtherJS } from "./main.js";
import { StorageItem } from "./storageitem.js";

/**
 * Handles data storage between pages.
 * Also handles hydration of data on updates
 */
export class Storage {
    private store = window.localStorage;

    constructor(public lib:AtherJS){}
    /**
     * Set a value in Storage
     * @param {string} key They key to write to
     * @param {any} value The value to write
     */
    public set(key: string, value: any) {
        this.store.setItem(key, JSON.stringify(value));
    }

    /**
     * Get a value from Storage
     * @param {string} key The key to read from
     * @returns The value read from Storage
     */
    public get(key: string) {
        return JSON.parse(this.store.getItem(key));
    }

    /**
     * Set a StorageItem in Storage
     * @param {string} key The key to fetch the StorageItem from
     * @returns The StorageItem fetched from Storage | null if the StorageItem does not exist
     */
    public getItem(key: string) {
        const item = this.get(key);
        if(item === null) return null;
        return JSON.parse(this.store.getItem(key)) as StorageItem;
    }

    public setItem(item:StorageItem) {
        this.store.setItem(item.key, JSON.stringify(item));
    }

}