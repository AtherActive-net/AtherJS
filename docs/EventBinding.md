# Binding events to elements
AtherJS allows you to hook events to elements, like `onsubmit` or `onclick`. This is done by using the `at-[event]` attribute.

AtherJS uses the embedded script tag to import your page script. This is where you will define the functions that will be called when the event is triggered. It is EXTREMELY important to NOT have any `import` statements in your embedded script. This is due to an active bug right now which is being worked on.

## Setting up your Embedded Script
AtherJS will attempt to load the first script tag that does not have a `src` attribute.
Now, AtherJS does not ask much, but a few small things must be done.
```html
<script type="module">
    // Your script here
</script>
```
Setting your script to be a module is a MUST. It is also not recommended to have several embedded scripts as only one will be loaded.

## Example: 'oninput' on an Input element
For this example we will add an `oninput` event to an input element. This will update the text in the paragraph element when the input is changed.

```html
{# Your HTML file #}
<p at-store="field"></p>
<input type="text" at-oninput="inputUpdated">
```
We need some basic HTML to start with. We have a paragraph element with the `at-store` attribute, and an input element with the `at-oninput` attribute. Now, let's add some JS to make this happen.

```js
// NOTE: This MUST be in the <script> tag that is EMBEDDED in the HTML file.

// assuming you have initialized AtherJS in window.ather    
const ather = window.ather;

// Here we export the function that will be called when the input is updated.
export function inputUpdated(element,event) {
    ather.store.set('field',element.value);
}
```

Now, why are we exporting functions? This is because AtherJS will import the page script into itself and stores all exports for use. We do this so it's easy for you to use functions in your page script.

Now, inside the function we simply set the store `field` to the value of the input element. This will update the text in the paragraph element.