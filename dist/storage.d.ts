import { AtherJS } from "./main.js";
import { StorageItem } from "./storageitem.js";
/**
 * Handles data storage between pages.
 * Also handles hydration of data on updates
 */
export declare class Storage {
    lib: AtherJS;
    private store;
    constructor(lib: AtherJS);
    /**
     * Set a value in Storage
     * @param {string} key They key to write to
     * @param {any} value The value to write
     */
    set(key: string, value: any): void;
    /**
     * Get a value from Storage
     * @param {string} key The key to read from
     * @returns The value read from Storage
     */
    get(key: string): any;
    /**
     * Set a StorageItem in Storage
     * @param {string} key The key to fetch the StorageItem from
     * @returns The StorageItem fetched from Storage | null if the StorageItem does not exist
     */
    getItem(key: string): StorageItem;
    setItem(item: StorageItem): void;
}
