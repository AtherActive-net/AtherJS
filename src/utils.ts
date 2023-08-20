/**
* Log a message to the console
* @param {string} msg - Message to log
* @param {string} type - Type of log
* All supported types: 'log', 'warn', 'error'
*/
export function log(msg:string , type:string="log") {
    switch(type) {
        case 'error':
            console.error(`[AtherJS] [ERROR] ${msg}`)
            break
        case 'warn':
            console.warn(`[AtherJS] [WARN] ${msg}`)
            break
        case 'log':
            console.log(`[AtherJS] [LOG] ${msg}`)
            break
        default:
            console.log(`[AtherJS] [LOG] ${msg}`)
    }
}

/**
 * A Map of all attributes used by AtherJS.
 * We store this here as a map to make it easier to change the attribute names if ever needed.
 */
export const attributes = new Map<string,string>([
    ['state', 'at-store'],
    ['state-value', 'at-store-value'],
    ['state-init', 'at-store-initial'],
    ['ignore', 'at-ignore'],
    ['back', 'at-back'],
    ['link', 'at-link'],
    ['namespace', 'at-namespace'],
    ['rebuild', 'at-rebuild'],

    ['pagestate', 'at-var'],
    ['pagestate-value', 'at-var-value'],
    ['pagestate-init', 'at-var-initial'],
    

    // Overwrites
    ['onsubmit', 'at-onsubmit'],
    ['onchange', 'at-onchange'],
    ['onclick', 'at-onclick'],
    ['oninput', 'at-oninput'],
    ['onkeydown', 'at-onkeydown'],
    ['onkeyup', 'at-onkeyup'],
    ['onkeypress', 'at-onkeypress'],

    // for
    ['foreach', 'at-foreach'],
    ['each', 'at-each'],

    // component
    ['component', 'at-component'],
    ['component-uuid', 'at-component-uuid'],
    
    // prevent
    ['prevent', 'at-prevent'],
])

export class ComponentFetchError extends Error {
    public status:number = 404;

    constructor(message:string, status:number=404) {
        super(message);
        this.name = 'ComponentFetchError';
        this.status = status;
    }
}

export function assembleValue(key: string, variable:any) {
    const splittedKey = key.split('.');
    let value = variable;
    splittedKey.forEach(splitKey => {
        if (splitKey == splittedKey[0])
            return;

        value = value?.[splitKey];
    });
    return value;
}