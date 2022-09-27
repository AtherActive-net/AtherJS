# AtherJS

Make any static site a feel like a modern SPA and include easy Data persistence between pages! With its small size it can help create a better experience on pretty much any Static Site.

## Initial setup

...

## Features

* Client-side Router
* Partial (or full) body rebuild
    * Navbar and footer can be rebuild based on Attribute settings
    * Specify a specific element to mount the new body to
* Data persistence between pages
    * Automatic value creation based on attributes
* Page transition effects
    * Both JS and CSS supported

### Client-side routing

> NOTE: Javascript functions that take over navigation are not supported and therefore not working with our router. We **only** support regular links.

AtherJS has a client-side router built-in to create a smoother experience when navigating pages. This router works with any URL on the same domain, and will obviously switch off when going to an outside link.

#### Automatic link Configuration

All links are automatically configured to work with AtherJS. If you do not want a link to work, you can add `ather-ignore` to this link and it will automatically ignore it.

#### Page Transitions

By default AtherJS will play a `fade out > fade in` animation when navigating between pages. Our default animations are done with JS and do not require any additional stylesheets.

You can configure it to use your own animations however using CSS. (see `Inital Setup`

#### Page Rebuilding

When going to a new URL, the current body gets rebuild (obviously). By default, it will preserve the navbar / footer, however you can force them to be rebuild using the `ather-rebuild` attribute on them.
Additionally, you can customize what we can see as your main body (for example, a container) using the `bodyOverwrite` option when creating a `new AtherJS({opts})`.

### State Object (Data persistence)

Data persistence is not reserved only for the big frameworks! While our State system is not *as* wide in terms of features, it allows easy data storage between routes.

You can assign Elements to a state using `ather-state="your_value_here"`. If your State is an object, you can also assign `ather-state-value="your_value_here"` to get a specific property on that object.

#### Automatic State Creation

States can be created automatically by AtherJS by analysing the page on load. For this, `updateElementListOnUpdate` must be `true` (Which it is by default).

When your page gets loaded, it will look for all `ather-state` attributes and see if the State they reference exists. If it does not, it will create it and if `ather-state-initial` has a value, that will be the value.

After this, it will update all elements referencing this State to the value of said State.

#### Manual State Creation

Sometimes you need to manually create a State. This is extremely easy with the following code:

```js
const ather = new AtherJS();
ather.state.createState(NAME,INITIAL_VALUE);
// NAME    : The name of this State
// VALUE   : Initial value
```

After this, you can update the state, and/or reference it on elements with `ather-state`.

#### Getting and Updating a State

Let's say you got a State with the name `Count`. It's value is just a simple number, for this example `0`.

Now, when I press a button I want it to go up. How does that work? Easy!

```html
{# html #}
<button onclick="increment()"><span ather-state="counter"></span></button>
```

```JS
// JS
const ather = new AtherJS();

function increment() {
    ather.state.setState('Count', parseInt(ather.state.getState('Count')) + 1);
}
```
With `AtherJS.state.setState(NAME,VALUE)` you can easily update a state! In this case whenever we press the button we increment the value stored in `Count`.

To get the current value stored in `Count` we can use `AtherJS.state.getState(NAME)`.

#### Deleting a State
States are never deleted unless the page does a hard reload (resetting AtherJS). However, if you got some states that are only relevant for a short period of time it is important to clean them up. This can easily be done with `AtherJS.state.deleteState(NAME)`.

#### Reloading a State
On every page transition all States are automatically reloaded. This is done so it can rebuild its element cache. You can also manually call it to do so.

Usually this is not required manually as `state.updateElementListOnUpdate` is able to catch new elements in most cases, but it can be a good idea if you just did a massive change to the DOM that is not a page transition.