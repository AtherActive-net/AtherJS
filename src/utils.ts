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

    // Overwrites
    ['onsubmit', 'at-onsubmit'],
    ['onchange', 'at-onchange'],
    ['onclick', 'at-onclick'],
    ['oninput', 'at-oninput'],
    ['onkeydown', 'at-onkeydown'],
    ['onkeyup', 'at-onkeyup'],
    ['onkeypress', 'at-onkeypress'],
    
    // prevent
    ['prevent', 'at-prevent'],
])
