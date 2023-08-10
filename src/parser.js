import _ from './util'

/**
 * get tag name
 *
 * @param {String} html e.g. '<a hef="#">'
 * @return {String}
 */
function getTagName(html) {
  var i = _.spaceIndex(html)
  var tagName
  if (i === -1) {
    tagName = html.slice(1, -1)
  } else {
    tagName = html.slice(1, i + 1)
  }
  tagName = _.trim(tagName).toLowerCase()
  if (tagName.slice(0, 1) === '/') tagName = tagName.slice(1)
  if (tagName.slice(-1) === '/') tagName = tagName.slice(0, -1)
  return tagName
}

/**
 * is close tag?
 *
 * @param {String} html 如：'<a hef="#">'
 * @return {Boolean}
 */
function isClosing(html) {
  return html.slice(0, 2) === '</'
}
function isSelfClosing(html) {
  return html.slice(-2) === '/>'
}

/**
 * parse input html and returns processed html
 *
 * @param {String} html
 * @param {Function} onTag e.g. function (sourcePosition, position, tag, html, isClosing)
 * @param {Function} escapeHtml
 * @return {String}
 */
function parseTag(html, onTag, escapeHtml) {
  var rethtml = ''
  var lastPos = 0
  var tagStart = false
  var currentPos = 0
  var len = html.length
  var currentTagName = ''
  var currentHtml = ''

  for (currentPos = 0; currentPos < len; currentPos++) {
    var c = html.charAt(currentPos)
    if (c === '<') {
      rethtml += escapeHtml(html.slice(lastPos, currentPos))
      tagStart = true
      lastPos = currentPos
    }
    if (c === '>' && tagStart) {
      currentHtml = html.slice(lastPos, currentPos + 1)
      currentTagName = getTagName(currentHtml)
      rethtml += onTag(
        tagStart,
        rethtml.length,
        currentTagName,
        currentHtml,
        isClosing(currentHtml),
        isSelfClosing(currentHtml)
      )
      lastPos = currentPos + 1
      tagStart = false
    }
  }

  if (lastPos < len) {
    rethtml += escapeHtml(html.substr(lastPos))
  }

  return rethtml
}

var REGEXP_ILLEGAL_ATTR_NAME = /[^a-zA-Z0-9\\_:.-]/gim

/**
 * parse input attributes and returns processed attributes
 *
 * @param {String} html e.g. `href="#" target="_blank"`
 * @param {Function} onAttr e.g. `function (name, value)`
 * @return {String}
 */
function parseAttr(html, onAttr) {
  'use strict'

  var lastPos = 0
  var lastMarkPos = 0
  var retAttrs = []
  var tmpName = false
  var len = html.length

  function addAttr(name, value) {
    name = _.trim(name)
    name = name.replace(REGEXP_ILLEGAL_ATTR_NAME, '').toLowerCase()
    if (name.length < 1) return
    var ret = onAttr(name, value || '')
    if (ret) retAttrs.push(ret)
  }

  // 逐个分析字符
  for (var i = 0; i < len; i++) {
    var c = html.charAt(i)
    var v, j
    if (tmpName === false && c === '=') {
      tmpName = html.slice(lastPos, i)
      lastPos = i + 1
      lastMarkPos =
        html.charAt(lastPos) === '"' || html.charAt(lastPos) === "'" ? lastPos : findNextQuotationMark(html, i + 1)
      continue
    }
    if (tmpName !== false) {
      if (i === lastMarkPos) {
        j = html.indexOf(c, i + 1)
        if (j === -1) {
          break
        } else {
          v = _.trim(html.slice(lastMarkPos + 1, j))
          addAttr(tmpName, v)
          tmpName = false
          i = j
          lastPos = i + 1
          continue
        }
      }
    }
    if (/\s|\n|\t/.test(c)) {
      html = html.replace(/\s|\n|\t/g, ' ')
      if (tmpName === false) {
        j = findNextEqual(html, i)
        if (j === -1) {
          v = _.trim(html.slice(lastPos, i))
          addAttr(v)
          tmpName = false
          lastPos = i + 1
          continue
        } else {
          i = j - 1
          continue
        }
      } else {
        j = findBeforeEqual(html, i - 1)
        if (j === -1) {
          v = _.trim(html.slice(lastPos, i))
          v = stripQuoteWrap(v)
          addAttr(tmpName, v)
          tmpName = false
          lastPos = i + 1
          continue
        } else {
          continue
        }
      }
    }
  }

  if (lastPos < html.length) {
    if (tmpName === false) {
      addAttr(html.slice(lastPos))
    } else {
      addAttr(tmpName, stripQuoteWrap(_.trim(html.slice(lastPos))))
    }
  }

  return _.trim(retAttrs.join(' '))
}

function findNextEqual(str, i) {
  for (; i < str.length; i++) {
    var c = str[i]
    if (c === ' ') continue
    if (c === '=') return i
    return -1
  }
}

function findNextQuotationMark(str, i) {
  for (; i < str.length; i++) {
    var c = str[i]
    if (c === ' ') continue
    if (c === "'" || c === '"') return i
    return -1
  }
}

function findBeforeEqual(str, i) {
  for (; i > 0; i--) {
    var c = str[i]
    if (c === ' ') continue
    if (c === '=') return i
    return -1
  }
}

function isQuoteWrapString(text) {
  if ((text[0] === '"' && text[text.length - 1] === '"') || (text[0] === "'" && text[text.length - 1] === "'")) {
    return true
  } else {
    return false
  }
}

function stripQuoteWrap(text) {
  if (isQuoteWrapString(text)) {
    return text.substr(1, text.length - 2)
  } else {
    return text
  }
}

export { parseTag, parseAttr }
