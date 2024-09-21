# kid-gloves
🌐 Kid Gloves turns many JS errors into warnings


Kid Gloves patches a bunch of JS quirks that potentially throw errors and turns those into warnings. This is intended to be used as a learning tool and for debugging purposes and not meant to monkey patch live production software.

Fixes So far:

### Use `new` with `BigInt` and `Symbol`
Using the `new` keyword returns an Object wrapped version of `BigInt` and `Sybmol` while printing a warning to the console recommending to switch to not using it

### Use `Promise`, `Set`, and `Map`
These objects can be called as a constructor without using the `new` keyword and prints a warning

### `document.querySelector`
`document.querySelector` returns `null` even when given an invalid query and prints the typical error as a warning

### `document.querySelectorAll`
`document.querySelectorAll` returns an empty `NodeList` even when given an invalid query and prints the typical error as a warning


### `document.getElementById`
`document.getElementById` returns `null` even when given an invalid query and prints the typical error as a warning

### `document.getElementsByTagName`
`document.getElementsBy(TagName|TagNameNS|ClassName|Name)` returns an empty `HTMLCollection` even when given an invalid query and prints the typical error as a warning