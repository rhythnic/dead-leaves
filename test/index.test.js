import { check, gen, property } from 'testcheck'
import { prune, isPlainObj, isNotNilOrEmpty } from '../src/index'

const empty = { array: [], object: {} }

function expectNoEmpty (data) {
  expect(data).not.toBeNull()
  expect(data).not.toBeUndefined()
  expect(data).not.toBe('')
  if (Array.isArray(data)) {
    expect(data).not.toEqual(empty.array)
    data.forEach(expectNoEmpty)
  } else if (isPlainObj(data)) {
    expect(data).not.toEqual(empty.object)
    Object.keys(data).forEach(key => expectNoEmpty(data[key]))
  }
}

function expectNoneEqual (val) {
  function internal (data) {
    expect(data).not.toBe(val)
    if (Array.isArray(data)) {
      data.forEach(internal)
    } else if (isPlainObj(data)) {
      Object.keys(data).forEach(key => internal(data[key]))
    }
  }
}

describe('isPlainObj', () => {
  test('rejects Date object', () => {
    expect(isPlainObj(new Date())).toBe(false)
  })
  test('rejects array', () => {
    expect(isPlainObj([])).toBe(false)
  })
  test('accepts plain object', () => {
    expect(isPlainObj({})).toBe(true)
  })
})

describe('isNotNilOrEmpty', () => {
  test('rejects empty values', () => {
    [null, void 0, '', {}, []].forEach(x => {
      expect(isNotNilOrEmpty(x)).toBe(false)
    })
  })
  test('accpets non-empty values', () => {
    [0, -1, 'a', 'undefined', { a: 0 }, [-1]].forEach(x => {
      expect(isNotNilOrEmpty(x)).toBe(true)
    })
  })
})

describe('prune with default function', () => {
  test('remove empty values', () => {
    const data = { a: '', b: undefined, c: null }
    expect(Object.keys(prune(data)).length).toBe(0)
  })
  test('remove nested empty values', () => {
    const data = { a: 'a', b: { c: [] } }
    expect(prune(data)).toEqual({ a: 'a' })
  })
  test('property-based testing', () => {
    check(
      property(
        gen.object(gen.any, { maxSize: 10 }),
        data => expectNoEmpty(prune(data))
      ),
      { numTests: 25 }
    )
  })
})

describe('prune with custom function', () => {
  const notTwo = x => x !== 2
  test('property-based testing', () => {
    check(
      property(
        gen.object(gen.any, { maxSize: 10 }),
        data => expectNoneEqual(2)(prune(data, notTwo))
      ),
      { numTests: 25 }
    )
  })
})
