const _ = {
  indexOf(arr, item) {
    var i, j
    if (Array.prototype.indexOf) {
      return arr.indexOf(item)
    }
    for (i = 0, j = arr.length; i < j; i++) {
      if (arr[i] === item) {
        return i
      }
    }
    return -1
  },
  forEach(arr, fn, scope) {
    var i, j
    if (Array.prototype.forEach) {
      return arr.forEach(fn, scope)
    }
    for (i = 0, j = arr.length; i < j; i++) {
      fn.call(scope, arr[i], i, arr)
    }
  },
  trim(str) {
    if (String.prototype.trim) {
      return str.trim()
    }
    return str.replace(/(^\s*)|(\s*$)/g, '')
  },
  spaceIndex(str) {
    var reg = /\s|\n|\t/
    var match = reg.exec(str)
    return match ? match.index : -1
  }
}
export default _
