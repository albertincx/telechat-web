function toInt (v) {
  let inVal = parseInt(v, 10)
  if (isNaN(inVal)) {
    inVal = 0
  }
  return inVal
}

class Storage {
  _ (k, def) {
    let v = localStorage.getItem(k)
    if (v && v.match(/^{/)) {
      v = JSON.parse(v)
    }
    return v || def
  }

  __ (k, v) {
    return localStorage.setItem(k, v)
  }

  rm (k) {
    return localStorage.removeItem(k)
  }

  get (k, def = '') {
    return this._(k, def)
  }

  set (k, v) {
    return this.__(k, v)
  }
}

export default new Storage()
