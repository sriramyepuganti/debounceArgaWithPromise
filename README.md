# INSTALL

```
npm i debounce-promises
```

# USAGE

**commonJS:** const { debouncePromise } = require('debounce-promises');
**EsModules:** import { debouncePromise } from 'debounce-promises';

# PARAMS
```
Arg-1: Async function
Args-2: Debounce time or cooling time in milli seconds
```

# EXAMPLE
__Some expensive function in your code__  
```
const expensiveFunction = (arg1) =>
    new Promise((res) => {
      setTimeout(() => {
        res(arg1);
      }, 2000);
});
```
__Add debounce wrapper for your function__
```
const test = debouncePromise(expensiveFunction, 90);
```
__use that wrapper in multiple places__
```
test([1, 2, 3]).then((res) => console.log(res));
test([4, 5, 6]).then((res) => console.log(res));
test([7, 8, 9]).then((res) => console.log(res));
```

__output__
```
[1,2,3,4,5,6,7,8,9]
```
