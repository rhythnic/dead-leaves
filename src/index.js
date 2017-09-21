export function isPlainObj (o) {
  return o && typeof o === 'object' && o.constructor === Object
}

export function isNotNilOrEmpty (x) {
  return !(x == null || x === '' || (Array.isArray(x) && !x.length) || (isPlainObj(x) && !Object.keys(x).length))
}

export function prune (data, fn = isNotNilOrEmpty) {
  if (Array.isArray(data)) {
    return data.map(x => prune(x, fn)).filter(fn)
  } else if (isPlainObj(data)) {
    return Object.keys(data).reduce((acc, x) => {
      const val = prune(data[x], fn)
      if (fn(val)) acc[x] = val
      return acc
    }, {})
  }
  return data
}
