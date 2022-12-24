/**
 * Option class for AtherJS
 * @param bodyOverwrite - Overwrite the body element. Must be an element / class / id.
 * @param useCSSForFading - Use CSS for fading instead of JS.
 * @param cssFadeOptions - Options for CSS fading.
 * @param disableJSNavigation - Disable JS navigation functions (back etc.).
 * @param cssFadeOptions.fadeInCSSClass - fadeIn CSS class.
 * @param cssFadeOptions.fadeOutCSSClass - fadeOut CSS class.
 * @param jsFadeOptions - Options for JS fading.
 * @param jsFadeOptions.fadeNavbar - Wether or not to fade the navbar
 * @param jsFadeOptions.fadeFooter - Wether or not to fade the footer
 * @param store - Settings related to State
 * @param store.updateStateElementsOnUpdate - Wether or not to update state elements on state update
 */
export interface AtherOptions {
    bodyOverwrite?: string
    debugLogging?: boolean
    useCSSForFading?: boolean
    disableJSNavigation?: boolean
    cssFadeOptions?: {
        fadeInCSSClass?: string
        fadeOutCSSClass?: string
    },
    jsFadeOptions?: {
        fadeNavbar?: boolean
        fadeFooter?: boolean
    },
    store?: StoreOptions
}

/**
 * Option Class for Store
 * @param updateElementListOnUpdate - Wether or not to update state elements on state update. `true` by default.
 */
export interface StoreOptions {
    updateElementListOnUpdate?: boolean,
    createStatesOnPageLoad?: boolean
}