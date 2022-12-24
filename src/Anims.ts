/**
 * Deals with animations
 */
export class Anims {
    /**
     * Play a fade in animation
     * @param {HTMLElement} el - Element to fade in
     * @returns `Promise` Resolves when the animation is complete
     */
    public async fadeIn(el:HTMLElement) {
        return new Promise((resolve, reject) => {
            el.style.opacity = '0';
            // el.style.display = 'block';
            (function fade() {
                var val = parseFloat(el.style.opacity);
                if (!((val += .05) > 1)) {
                    el.style.opacity = val.toString();
                    requestAnimationFrame(fade);
                } else {
                    resolve(true)
                }
            })();
        })
    }

    /**
     * Play a fade out animation
     * @param {HTMLElement} el - Element to fade out
     * @returns `Promise` Resolves when the animation is complete
     */
    public async fadeOut(el:HTMLElement) {
        return new Promise((resolve, reject) => {
            el.style.opacity = '1';
            (function fade() {
                if ((parseFloat(el.style.opacity) - 0.05) < -0.05) {
                    // el.style.display = 'none';
                    resolve(true)
                } else {
                    el.style.opacity = (parseFloat(el.style.opacity) - 0.05).toString();
                    requestAnimationFrame(fade);
                }
            })();
        })
    }
}
