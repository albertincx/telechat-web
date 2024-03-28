let observers = {}
let data = ''
let observerName = ''
// @ts-ignore
function emitChange (method, title = '') {
  try {
    // @ts-ignore
    if (observers[observerName] && observers[observerName][method]) {
      // @ts-ignore
      observers[observerName][method](data, title)
    }
  } catch (e) {
    console.warn(e)
  }
}
// @ts-ignore
export default function observe (name: string, listeners = {}) {
  // @ts-ignore
  observers[name] = listeners
  // @ts-ignore
  emitChange()
  return () => {
    // @ts-ignore
    observers = null
  }
}
// @ts-ignore
export function emitData (type, val, title = '') {
  observerName = type
  data = val
  emitChange(type, title)
}
