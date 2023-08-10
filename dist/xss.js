"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default2 = _interopRequireDefault(require("./default"));
var _parser = require("./parser");
var _util = _interopRequireDefault(require("./util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * get attributes for a tag
 *
 * @param {String} html
 * @return {Object}
 *   - {String} html
 *   - {Boolean} closing
 */
function getAttrs(html) {
  var i = _util["default"].spaceIndex(html);
  if (i === -1) {
    return {
      html: '',
      closing: html[html.length - 2] === '/'
    };
  }
  html = _util["default"].trim(html.slice(i + 1, -1));
  var isClosing = html[html.length - 1] === '/';
  if (isClosing) html = _util["default"].trim(html.slice(0, -1));
  return {
    html: html,
    closing: isClosing
  };
}

/**
 * shallow copy
 *
 * @param {Object} obj
 * @return {Object}
 */
function shallowCopyObject(obj) {
  var ret = {};
  for (var i in obj) {
    ret[i] = obj[i];
  }
  return ret;
}
function keysToLowerCase(obj) {
  var ret = {};
  for (var i in obj) {
    if (Array.isArray(obj[i])) {
      ret[i.toLowerCase()] = obj[i].map(function (item) {
        return item.toLowerCase();
      });
    } else {
      ret[i.toLowerCase()] = obj[i];
    }
  }
  return ret;
}
function hasClasses(html, whiteClasses) {
  var attrs = getAttrs(html);
  var hasClass = false;
  (0, _parser.parseAttr)(attrs.html, function (name, value) {
    var classList = [];
    if (name === 'class') {
      classList = value.split(' ');
    }
    classList.forEach(function (c) {
      if (whiteClasses.indexOf(c) > -1) hasClass = true;
    });
  });
  return hasClass;
}
function filterXssWithHtml(html) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  html = html || '';
  html = html.toString();
  if (!html) return '';
  var whiteList = options.defaultWhiteList || _default2["default"].whiteList;
  var selfWhiteList = options.selfWhiteList || whiteList;
  var whiteAttrList = options.whiteAttrList || _default2["default"].whiteAttrList;
  var whiteClasses = options.whiteClasses || _default2["default"].whiteClasses;
  var isSafeAttrValue = _default2["default"].isSafeAttrValue;
  var escapeHtml = _default2["default"].escapeHtml;
  var urlTest = options.urlCheckFunc || _default2["default"].urlCheckFunc;
  var tagStartStack = [];
  var retHtml = (0, _parser.parseTag)(html, function (sourcePosition, position, tag, html, isClosing, isSelfClosing) {
    var info = {
      sourcePosition: sourcePosition,
      position: position,
      isClosing: isClosing,
      isSelfClosing: isSelfClosing,
      isWhite: Object.prototype.hasOwnProperty.call(whiteList, tag),
      isSelfWhite: Object.prototype.hasOwnProperty.call(selfWhiteList, tag)
    };
    var isNeedEscapeTag = false;
    if (info.isClosing && !info.isSelfClosing) {
      if (tagStartStack.length > 0 && tag === tagStartStack[tagStartStack.length - 1].tagName) {
        var startTag = tagStartStack.pop();
        if (startTag.isNeedEscapeTag) {
          return escapeHtml(html);
        }
      }
      return html;
    }
    if (info.isWhite && info.isSelfWhite && (whiteClasses.length === 0 || hasClasses(html, whiteClasses))) {
      var attrs = getAttrs(html);
      (0, _parser.parseAttr)(attrs.html, function (name, value) {
        var isWhiteAttr = _util["default"].indexOf(whiteList[tag], name) !== -1 && _util["default"].indexOf(selfWhiteList[tag], name) !== -1 || whiteAttrList.indexOf(name) !== -1 || name.indexOf('data-') > -1;
        if (isWhiteAttr) {
          isNeedEscapeTag = !isSafeAttrValue(tag, name, value, urlTest);
        } else {
          isNeedEscapeTag = true;
        }
      });
    } else {
      isNeedEscapeTag = true;
    }
    if (!info.isClosing && !info.isSelfClosing) {
      tagStartStack.push({
        tagName: tag,
        isNeedEscapeTag: isNeedEscapeTag
      });
    }
    if (isNeedEscapeTag) {
      html = escapeHtml(html);
    }
    return html;
  }, escapeHtml);
  return retHtml;
}
var _default = filterXssWithHtml;
exports["default"] = _default;