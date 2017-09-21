# Dead Leaves

> A utility for using a filter function to prune JavaScript objects


## Install
```
npm install --save dead-leaves
```

## Usage

```
import { prune } from 'dead-leaves'

const obj = {
  name: 'Bud',
  age: '',
  friends: []
}

const nextObj = prune(obj)

// data transformation is immutable
console.log(nextObj === obj) // false

// the default filter function removes all null or empty values
console.log(nextObj)
// {
//   name: 'Bud'
// }
```

## How it works
Prune is called with data and a filter function.  If you don't include a filter function,
the default is used, which is called 'isNotNilOrEmpty'.  You can also import isNotNilOrEmpty
from dead-leaves.  Each value is evaluated after it's children have been evaluated.  In the
case of isNotNilOrEmpty, if an object or array are empty after their children have been evaluated,
they will also be removed.  The passing values are copied into a new object, so the data
is immutable.  The parent object is always returned even if it fails the filter function.


## Custom filter function
```
import { prune, isNotNilOrEmpty } from 'dead-leaves'

// removes: 2, null, undefined, '', {}, []
const filterFn = value => {
  return value !== 2 && isNotNilOrEmpty(value)
}

const nextObj = prune(obj, filterFn)
```
