"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterXSS = filterXSS;
var _xss = _interopRequireDefault(require("./xss"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * filter xss function
 *
 * @param {String} html
 * @param {Object} options { whiteList, onTag, onTagAttr, onIgnoreTag, onIgnoreTagAttr, safeAttrValue, escapeHtml }
 * @return {String}
 */
function filterXSS(html, options) {
  var escapeStr = (0, _xss["default"])(html, options);
  return escapeStr;
}