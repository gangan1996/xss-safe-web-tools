import filterXssWithHtml from './xss'

/**
 * filter xss function
 *
 * @param {String} html
 * @param {Object} options { whiteList, onTag, onTagAttr, onIgnoreTag, onIgnoreTagAttr, safeAttrValue, escapeHtml }
 * @return {String}
 */
function filterXSS(html, options) {
  const escapeStr = filterXssWithHtml(html, options)
  return escapeStr
}

export { filterXSS }
