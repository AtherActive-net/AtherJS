# Using stores
A Store is a globally stored variable. It can only contain numbers and strings.
It is useful for data that should be stored globally, but also for anything that you want to be able to render in the UI.

## Page Store vs Global Store
There are 2 Stores active at all time. These are the `page` and the `store`. The `page` store will NOT be transferred to other pages, while the `store` will. You can access the `page` store by using `ather.page`, and the `store` by using `ather.store`.

On this page we will be using the `store` store, however the `page` store works in the same way and you can swap the `store` for `page` in the examples below if you want to use the `page` store.

## Creating a store
This step is optional, but recommended. You can easily create a store by doing this:
```ts
// assuming you have initialized AtherJS in window.ather
const ather = window.ather;
ather.store.create('myStore', 0);
```
What we've done here is create a store called `myStore` with the value `0`. This is easily accessible later.

## Using a store in HTML
Now you've created a store, you can use it in HTML. This is done by using the `at-store` attribute.
```html
<p at-store="myStore"></p>
```
Now when the store is updated, the text inside the `<p>` tag will be updated as well.

## Updating a store
Values change all the time. So do stores, and it's easy to update them.
```ts
// assuming you have initialized AtherJS in window.ather
const ather = window.ather;
ather.store.set('myStore', 1);
```
Now the store `myStore` has been updated to the value `1`. This will update the text in the `<p>` tag.

## Deleting a store
Stores are not auto-deleted. This is something you'll have to do yourself.
```ts
// assuming you have initialized AtherJS in window.ather
const ather = window.ather;
ather.store.delete('myStore');
```
Now the store `myStore` has been deleted. This will also remove the text in the `<p>` tag. The attribute reference remains.