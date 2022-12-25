# Using stores
A Store is a globally stored variable. It can only contain numbers and strings.
It is useful for data that should be stored globally, but also for anything that you want to be able to render in the UI.

## Page Store vs Global Store
There are 2 Stores active at all time. These are the `page` and the `store`. The Page Store will NOT be transferred to other pages, while the global one will. You can access the Page Store by using `AtherJS.page`, and the global one by using `AtherJS.store`.

All info on this page will be using the Page Store as it should be used for most operations (like an input field changing a piece of text).

### Page Store specifics
To interact with the Page Store, you can use `AtherJS.page` in your JS code. This will give you access to all regular Store methods (like the ones below) but will only affect the Page Store.

To use anything stored in the Page Store in HTML, you can use the `at-var` keyword.

### Global Store specifics
To interact with the Global Store, you can use `AtherJS.store` in your JS code. This will give you access to all regular Store methods (like the ones below) but will only affect the Global Store.

To use anything stored in the Global Store in HTML, you can use the `at-store` keyword.

## Creating a (Page) store
This step is optional, but recommended. You can easily create a store by doing this:
```ts
// assuming you have initialized AtherJS in window.ather
const ather = window.ather;
ather.page.create('myStore', 0);
```
What we've done here is create a store called `myStore` with the value `0`. This is easily accessible later.

## Using a store in HTML
Now you've created a store, you can use it in HTML. This is done by using the `at-store` attribute.
```html
<p at-var="myStore"></p>
```
Now when the store is updated, the text inside the `<p>` tag will be updated as well.

## Updating a store
Values change all the time. So do stores, and it's easy to update them.
```ts
// assuming you have initialized AtherJS in window.ather
const ather = window.ather;
ather.page.set('myStore', 1);
```
Now the store `myStore` has been updated to the value `1`. This will update the text in the `<p>` tag.

## Deleting a store
Stores are not auto-deleted. This is something you'll have to do yourself.
```ts
// assuming you have initialized AtherJS in window.ather
const ather = window.ather;
ather.page.delete('myStore');
```
Now the store `myStore` has been deleted. This will also remove the text in the `<p>` tag. The attribute reference remains.