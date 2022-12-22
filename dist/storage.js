/**
 * Handles data storage between pages.
 * Also handles hydration of data on updates
 */
export class Storage {
    constructor(lib) {
        this.lib = lib;
        this.store = window.localStorage;
    }
    /**
     * Set a value in Storage
     * @param {string} key They key to write to
     * @param {any} value The value to write
     */
    set(key, value) {
        this.store.setItem(key, JSON.stringify(value));
    }
    /**
     * Get a value from Storage
     * @param {string} key The key to read from
     * @returns The value read from Storage
     */
    get(key) {
        return JSON.parse(this.store.getItem(key));
    }
    /**
     * Set a StorageItem in Storage
     * @param {string} key The key to fetch the StorageItem from
     * @returns The StorageItem fetched from Storage | null if the StorageItem does not exist
     */
    getItem(key) {
        const item = this.get(key);
        if (item === null)
            return null;
        return JSON.parse(this.store.getItem(key));
    }
    setItem(item) {
        this.store.setItem(item.key, JSON.stringify(item));
    }
}
