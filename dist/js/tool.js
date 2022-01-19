/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(8)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(21);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

Nova.booting(function (Vue, router, store) {
  router.addRoutes([{
    name: 'bulk-tagging-self-check-questions',
    path: '/bulk-tagging/self-check-questions',
    component: __webpack_require__(5)
  }, {
    name: 'bulk-tagging-profile-answers',
    path: '/bulk-tagging/profile-answers',
    component: __webpack_require__(11)
  }, {
    name: 'card-change-type',
    path: '/bulk-tagging/card/change-type',
    component: __webpack_require__(16)
  }]);
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(6)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(9)
/* template */
var __vue_template__ = __webpack_require__(10)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Tool.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-68ff5483", Component.options)
  } else {
    hotAPI.reload("data-v-68ff5483", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("6e5db1d0", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-68ff5483\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Tool.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-68ff5483\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Tool.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Scoped Styles */\n.mt-2 {\n    margin-top: 0.4rem;\n    margin-bottom: .5rem;\n}\n.label-select-all {\n    font-weight: bold;\n}\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            appType: null,
            appTypes: null,
            selfCheckQuestions: null,
            cards: null,
            finalDestination: false,
            selected: [],
            untag: false
        };
    },

    computed: {
        canSubmit: function canSubmit() {
            return this.readyForCardSelection && this.selected.length;
        },
        readyForCardSelection: function readyForCardSelection() {
            return this.appType;
        },
        selectAll: {
            get: function get() {
                return this.cards ? this.selected.length == this.cards.length : false;
            },
            set: function set(value) {
                var selected = [];
                if (value) {
                    this.selfCheckQuestions.forEach(function (question) {
                        selected.push(question.id);
                    });
                }
                this.selected = selected;
            }
        }
    },
    mounted: function mounted() {
        this.setUp(this.$route.query.cards);
    },

    methods: {
        cancel: function cancel() {
            this.$router.push('/resources/card-alls');
        },
        setUp: function setUp(cards) {
            var _this = this;

            // this may also will need to passthrough the card Ids
            this.cards = cards;
            axios.get('/nova/app-types/').then(function (response) {
                _this.appTypes = response.data;
            });
        },
        getQuestionText: function getQuestionText(questionId) {
            return this.selfCheckQuestions.filter(function (q) {
                return q.id === questionId;
            })[0].question;
        },
        getSelfCheckQuestions: function getSelfCheckQuestions() {
            var _this2 = this;

            axios.get('/nova/self-check-questions/' + this.appType).then(function (response) {
                _this2.selfCheckQuestions = response.data;
            });
        },
        sendBackToCardSelection: function sendBackToCardSelection() {
            this.$router.push('/resources/card-alls');
        },
        setFinalDestination: function setFinalDestination() {
            this.finalDestination = true;
        },
        setUntag: function setUntag() {
            this.untag = !this.untag;
        },
        submitClone: function submitClone() {
            var postData = {
                questionsToTag: this.selected,
                cards: this.cards,
                untag: this.untag
            };
            axios.post('/nova/tag/', postData).then(function (response) {
                this.setFinalDestination();
            }.bind(this)).catch(function (error) {
                var response = error.response;
                if (response.status === 422) {
                    var errors = response.data.errors;
                    var messages = [];
                    object.entries(errors).foreach(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2),
                            key = _ref2[0],
                            val = _ref2[1];

                        messages.push(val[0]); // the value of the current key.
                    });
                    window.alert(messages.join("\n"));
                } else {
                    console.log(response);
                }
            });
        }
    }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("form", { attrs: { autocomplete: "off" } }, [
      _c("div", { staticClass: "mb-8" }, [
        _c("h1", { staticClass: "mb-3 text-90 font-normal text-2xl" }, [
          _vm._v("\n                Bulk Tag Cards\n            ")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card" }, [
          _vm.finalDestination
            ? _c("div", [
                _c("div", { staticClass: "py-6 px-8 w-1/2" }, [
                  _vm.untag
                    ? _c("label", [_vm._v("Untagged These Answers:")])
                    : _c("label", [_vm._v("Tagged To These Answers:")]),
                  _vm._v(" "),
                  _c(
                    "ul",
                    _vm._l(_vm.selected, function(question) {
                      return _c("li", { staticClass: "py-1" }, [
                        _vm._v(_vm._s(_vm.getQuestionText(question)))
                      ])
                    }),
                    0
                  ),
                  _vm._v(" "),
                  _vm.untag
                    ? _c("p", { staticClass: "py-4" }, [
                        _vm._v("Removed these cards: " + _vm._s(_vm.cards))
                      ])
                    : _c("p", { staticClass: "py-4" }, [
                        _vm._v("Added these cards: " + _vm._s(_vm.cards))
                      ]),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass:
                        "btn btn-default btn-primary inline-flex items-center relative",
                      attrs: { type: "button" },
                      on: { click: _vm.sendBackToCardSelection }
                    },
                    [_vm._v("Return to All Cards\n                        ")]
                  )
                ])
              ])
            : _c("div", [
                _c("div", { staticClass: "flex border-b border-40" }, [
                  _vm._m(0),
                  _vm._v(" "),
                  _c("div", { staticClass: "py-6 px-8 w-1/2" }, [
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.appType,
                            expression: "appType"
                          }
                        ],
                        staticClass: "w-full form-control form-select",
                        attrs: { id: "actionType" },
                        on: {
                          change: [
                            function($event) {
                              var $$selectedVal = Array.prototype.filter
                                .call($event.target.options, function(o) {
                                  return o.selected
                                })
                                .map(function(o) {
                                  var val = "_value" in o ? o._value : o.value
                                  return val
                                })
                              _vm.appType = $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            },
                            _vm.getSelfCheckQuestions
                          ]
                        }
                      },
                      [
                        _c("option", { attrs: { disabled: "", value: "" } }, [
                          _vm._v("Please select one")
                        ]),
                        _vm._v(" "),
                        _vm._l(_vm.appTypes, function(type) {
                          return _c(
                            "option",
                            { domProps: { value: type.id } },
                            [_vm._v(_vm._s(type.slug))]
                          )
                        })
                      ],
                      2
                    )
                  ])
                ]),
                _vm._v(" "),
                _vm.readyForCardSelection
                  ? _c("div", [
                      _c("div", { staticClass: "flex border-b border-40" }, [
                        _vm._m(1),
                        _vm._v(" "),
                        _c("div", { staticClass: "py-6 px-8 mx-8 w-full" }, [
                          _c("label", [
                            _c("input", {
                              staticClass: "checkbox mt-2",
                              attrs: { type: "checkbox" },
                              domProps: { value: this.untag },
                              on: { click: _vm.setUntag }
                            })
                          ])
                        ])
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _vm.readyForCardSelection
                  ? _c("div", [
                      _c("div", { staticClass: "flex border-b border-40" }, [
                        _vm._m(2),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "py-6 px-8 mx-8 w-full" },
                          [
                            _c("label", { staticClass: "label-select-all" }, [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.selectAll,
                                    expression: "selectAll"
                                  }
                                ],
                                staticClass: "checkbox mt-2",
                                attrs: { type: "checkbox" },
                                domProps: {
                                  checked: Array.isArray(_vm.selectAll)
                                    ? _vm._i(_vm.selectAll, null) > -1
                                    : _vm.selectAll
                                },
                                on: {
                                  change: function($event) {
                                    var $$a = _vm.selectAll,
                                      $$el = $event.target,
                                      $$c = $$el.checked ? true : false
                                    if (Array.isArray($$a)) {
                                      var $$v = null,
                                        $$i = _vm._i($$a, $$v)
                                      if ($$el.checked) {
                                        $$i < 0 &&
                                          (_vm.selectAll = $$a.concat([$$v]))
                                      } else {
                                        $$i > -1 &&
                                          (_vm.selectAll = $$a
                                            .slice(0, $$i)
                                            .concat($$a.slice($$i + 1)))
                                      }
                                    } else {
                                      _vm.selectAll = $$c
                                    }
                                  }
                                }
                              }),
                              _vm._v(
                                "\n                                    Select All\n                                "
                              )
                            ]),
                            _vm._v(" "),
                            _vm._l(_vm.selfCheckQuestions, function(question) {
                              return _c("div", { key: question.id }, [
                                _c("label", [
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.selected,
                                        expression: "selected"
                                      }
                                    ],
                                    staticClass: "checkbox mt-2",
                                    attrs: { type: "checkbox" },
                                    domProps: {
                                      value: question.id,
                                      checked: Array.isArray(_vm.selected)
                                        ? _vm._i(_vm.selected, question.id) > -1
                                        : _vm.selected
                                    },
                                    on: {
                                      change: function($event) {
                                        var $$a = _vm.selected,
                                          $$el = $event.target,
                                          $$c = $$el.checked ? true : false
                                        if (Array.isArray($$a)) {
                                          var $$v = question.id,
                                            $$i = _vm._i($$a, $$v)
                                          if ($$el.checked) {
                                            $$i < 0 &&
                                              (_vm.selected = $$a.concat([$$v]))
                                          } else {
                                            $$i > -1 &&
                                              (_vm.selected = $$a
                                                .slice(0, $$i)
                                                .concat($$a.slice($$i + 1)))
                                          }
                                        } else {
                                          _vm.selected = $$c
                                        }
                                      }
                                    }
                                  }),
                                  _vm._v(
                                    "\n                                        " +
                                      _vm._s(question.question) +
                                      "\n                                    "
                                  )
                                ])
                              ])
                            })
                          ],
                          2
                        )
                      ])
                    ])
                  : _vm._e()
              ])
        ])
      ]),
      _vm._v(" "),
      !_vm.finalDestination
        ? _c("div", { staticClass: "flex items-center" }, [
            _c(
              "button",
              {
                staticClass:
                  "btn btn-link dim cursor-pointer text-80 ml-auto mr-6",
                on: { click: _vm.cancel }
              },
              [_vm._v("Cancel\n            ")]
            ),
            _vm._v(" "),
            _vm.appType
              ? _c(
                  "button",
                  {
                    staticClass:
                      "btn btn-default btn-primary inline-flex items-center relative",
                    attrs: { type: "button", disabled: !_vm.canSubmit },
                    on: { click: _vm.submitClone }
                  },
                  [_vm._v("Update Questions\n            ")]
                )
              : _vm._e()
          ])
        : _vm._e()
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "w-1/5 px-8 py-6" }, [
      _c("label", { attrs: { for: "appType" } }, [_vm._v("App Type")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "w-1/5 px-8 py-6" }, [
      _c("label", [
        _vm._v(
          "\n                                    Untag cards?\n                                "
        )
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "w-1/5 px-8 py-6" }, [
      _c("label", [
        _vm._v(
          "\n                                    Self Check Questions\n                                "
        )
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-68ff5483", module.exports)
  }
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(12)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(14)
/* template */
var __vue_template__ = __webpack_require__(15)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/ProfileAnswerBulkTag.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7e49f668", Component.options)
  } else {
    hotAPI.reload("data-v-7e49f668", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a919d2fe", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7e49f668\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ProfileAnswerBulkTag.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7e49f668\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ProfileAnswerBulkTag.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Scoped Styles */\n.mt-2 {\n    margin-top: 0.4rem;\n    margin-bottom: .5rem;\n}\n.label-select-all {\n    font-weight: bold;\n}\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            appType: null,
            appTypes: null,
            profileAnswers: null,
            cards: null,
            finalDestination: false,
            selected: [],
            untag: false
        };
    },

    computed: {
        canSubmit: function canSubmit() {
            return this.readyForCardSelection && this.selected.length;
        },
        readyForCardSelection: function readyForCardSelection() {
            return this.appType;
        },
        selectAll: {
            get: function get() {
                return this.cards ? this.selected.length == this.cards.length : false;
            },
            set: function set(value) {
                var selected = [];
                if (value) {
                    this.profileAnswers.forEach(function (answer) {
                        selected.push(answer.id);
                    });
                }
                this.selected = selected;
            }
        }
    },
    mounted: function mounted() {
        this.setUp(this.$route.query.cards);
    },

    methods: {
        cancel: function cancel() {
            this.$router.push('/resources/card-alls');
        },
        setUp: function setUp(cards) {
            var _this = this;

            // this may also will need to passthrough the card Ids
            this.cards = cards;
            axios.get('/nova/app-types/').then(function (response) {
                _this.appTypes = response.data;
            });
        },
        getAnswerText: function getAnswerText(answerId) {
            return this.profileAnswers.filter(function (q) {
                return q.id === answerId;
            })[0].answer;
        },
        getProfileAnswers: function getProfileAnswers() {
            var _this2 = this;

            axios.get('/nova/profile-answers/' + this.appType).then(function (response) {
                _this2.profileAnswers = response.data;
            });
        },
        sendBackToCardSelection: function sendBackToCardSelection() {
            this.$router.push('/resources/card-alls');
        },
        setFinalDestination: function setFinalDestination() {
            this.finalDestination = true;
        },
        setUntag: function setUntag() {
            this.untag = !this.untag;
        },
        submitClone: function submitClone() {
            var postData = {
                answersToTag: this.selected,
                cards: this.cards,
                untag: this.untag
            };
            axios.post('/nova/tag/', postData).then(function (response) {
                this.setFinalDestination();
            }.bind(this)).catch(function (error) {
                var response = error.response;
                if (response.status === 422) {
                    var errors = response.data.errors;
                    var messages = [];
                    object.entries(errors).foreach(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2),
                            key = _ref2[0],
                            val = _ref2[1];

                        messages.push(val[0]); // the value of the current key.
                    });
                    window.alert(messages.join("\n"));
                } else {
                    console.log(response);
                }
            });
        }
    }
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("form", { attrs: { autocomplete: "off" } }, [
      _c("div", { staticClass: "mb-8" }, [
        _c("h1", { staticClass: "mb-3 text-90 font-normal text-2xl" }, [
          _vm._v("\n                Bulk Tag Profile Answers\n            ")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card" }, [
          _vm.finalDestination
            ? _c("div", [
                _c("div", { staticClass: "py-6 px-8 w-1/2" }, [
                  _vm.untag
                    ? _c("label", [_vm._v("Untagged These Answers:")])
                    : _c("label", [_vm._v("Tagged To These Answers:")]),
                  _vm._v(" "),
                  _c(
                    "ul",
                    _vm._l(_vm.selected, function(answer) {
                      return _c("li", { staticClass: "py-1" }, [
                        _vm._v(_vm._s(_vm.getAnswerText(answer)))
                      ])
                    }),
                    0
                  ),
                  _vm._v(" "),
                  _vm.untag
                    ? _c("p", { staticClass: "py-4" }, [
                        _vm._v("Removed these cards: " + _vm._s(_vm.cards))
                      ])
                    : _c("p", { staticClass: "py-4" }, [
                        _vm._v("Added these cards: " + _vm._s(_vm.cards))
                      ]),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass:
                        "btn btn-default btn-primary inline-flex items-center relative",
                      attrs: { type: "button" },
                      on: { click: _vm.sendBackToCardSelection }
                    },
                    [_vm._v("Return to All Cards\n                        ")]
                  )
                ])
              ])
            : _c("div", [
                _c("div", { staticClass: "flex border-b border-40" }, [
                  _vm._m(0),
                  _vm._v(" "),
                  _c("div", { staticClass: "py-6 px-8 w-1/2" }, [
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.appType,
                            expression: "appType"
                          }
                        ],
                        staticClass: "w-full form-control form-select",
                        attrs: { id: "actionType" },
                        on: {
                          change: [
                            function($event) {
                              var $$selectedVal = Array.prototype.filter
                                .call($event.target.options, function(o) {
                                  return o.selected
                                })
                                .map(function(o) {
                                  var val = "_value" in o ? o._value : o.value
                                  return val
                                })
                              _vm.appType = $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            },
                            _vm.getProfileAnswers
                          ]
                        }
                      },
                      [
                        _c("option", { attrs: { disabled: "", value: "" } }, [
                          _vm._v("Please select one")
                        ]),
                        _vm._v(" "),
                        _vm._l(_vm.appTypes, function(type) {
                          return _c(
                            "option",
                            { domProps: { value: type.id } },
                            [_vm._v(_vm._s(type.slug))]
                          )
                        })
                      ],
                      2
                    )
                  ])
                ]),
                _vm._v(" "),
                _vm.readyForCardSelection
                  ? _c("div", [
                      _c("div", { staticClass: "flex border-b border-40" }, [
                        _vm._m(1),
                        _vm._v(" "),
                        _c("div", { staticClass: "py-6 px-8 mx-8 w-full" }, [
                          _c("label", [
                            _c("input", {
                              staticClass: "checkbox mt-2",
                              attrs: { type: "checkbox" },
                              domProps: { value: this.untag },
                              on: { click: _vm.setUntag }
                            })
                          ])
                        ])
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _vm.readyForCardSelection
                  ? _c("div", [
                      _c("div", { staticClass: "flex border-b border-40" }, [
                        _vm._m(2),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "py-6 px-8 mx-8 w-full" },
                          [
                            _c("label", { staticClass: "label-select-all" }, [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.selectAll,
                                    expression: "selectAll"
                                  }
                                ],
                                staticClass: "checkbox mt-2",
                                attrs: { type: "checkbox" },
                                domProps: {
                                  checked: Array.isArray(_vm.selectAll)
                                    ? _vm._i(_vm.selectAll, null) > -1
                                    : _vm.selectAll
                                },
                                on: {
                                  change: function($event) {
                                    var $$a = _vm.selectAll,
                                      $$el = $event.target,
                                      $$c = $$el.checked ? true : false
                                    if (Array.isArray($$a)) {
                                      var $$v = null,
                                        $$i = _vm._i($$a, $$v)
                                      if ($$el.checked) {
                                        $$i < 0 &&
                                          (_vm.selectAll = $$a.concat([$$v]))
                                      } else {
                                        $$i > -1 &&
                                          (_vm.selectAll = $$a
                                            .slice(0, $$i)
                                            .concat($$a.slice($$i + 1)))
                                      }
                                    } else {
                                      _vm.selectAll = $$c
                                    }
                                  }
                                }
                              }),
                              _vm._v(
                                "\n                                    Select All\n                                "
                              )
                            ]),
                            _vm._v(" "),
                            _vm._l(_vm.profileAnswers, function(answer) {
                              return _c("div", { key: answer.id }, [
                                _c("label", [
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.selected,
                                        expression: "selected"
                                      }
                                    ],
                                    staticClass: "checkbox mt-2",
                                    attrs: { type: "checkbox" },
                                    domProps: {
                                      value: answer.id,
                                      checked: Array.isArray(_vm.selected)
                                        ? _vm._i(_vm.selected, answer.id) > -1
                                        : _vm.selected
                                    },
                                    on: {
                                      change: function($event) {
                                        var $$a = _vm.selected,
                                          $$el = $event.target,
                                          $$c = $$el.checked ? true : false
                                        if (Array.isArray($$a)) {
                                          var $$v = answer.id,
                                            $$i = _vm._i($$a, $$v)
                                          if ($$el.checked) {
                                            $$i < 0 &&
                                              (_vm.selected = $$a.concat([$$v]))
                                          } else {
                                            $$i > -1 &&
                                              (_vm.selected = $$a
                                                .slice(0, $$i)
                                                .concat($$a.slice($$i + 1)))
                                          }
                                        } else {
                                          _vm.selected = $$c
                                        }
                                      }
                                    }
                                  }),
                                  _vm._v(
                                    "\n                                        " +
                                      _vm._s(answer.answer) +
                                      "\n                                    "
                                  )
                                ])
                              ])
                            })
                          ],
                          2
                        )
                      ])
                    ])
                  : _vm._e()
              ])
        ])
      ]),
      _vm._v(" "),
      !_vm.finalDestination
        ? _c("div", { staticClass: "flex items-center" }, [
            _c(
              "button",
              {
                staticClass:
                  "btn btn-link dim cursor-pointer text-80 ml-auto mr-6",
                on: { click: _vm.cancel }
              },
              [_vm._v("Cancel\n            ")]
            ),
            _vm._v(" "),
            _vm.appType
              ? _c(
                  "button",
                  {
                    staticClass:
                      "btn btn-default btn-primary inline-flex items-center relative",
                    attrs: { type: "button", disabled: !_vm.canSubmit },
                    on: { click: _vm.submitClone }
                  },
                  [_vm._v("Update Questions\n            ")]
                )
              : _vm._e()
          ])
        : _vm._e()
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "w-1/5 px-8 py-6" }, [
      _c("label", { attrs: { for: "appType" } }, [_vm._v("App Type")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "w-1/5 px-8 py-6" }, [
      _c("label", [
        _vm._v(
          "\n                                    Untag cards?\n                                "
        )
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "w-1/5 px-8 py-6" }, [
      _c("label", [
        _vm._v(
          "\n                                    Profile Answers\n                                "
        )
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7e49f668", module.exports)
  }
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(17)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(19)
/* template */
var __vue_template__ = __webpack_require__(20)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/CardTypeChangeTool.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1393501d", Component.options)
  } else {
    hotAPI.reload("data-v-1393501d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("05193ab4", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1393501d\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CardTypeChangeTool.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1393501d\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CardTypeChangeTool.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Scoped Styles */\n.mt-2 {\n    margin-top: 0.4rem;\n    margin-bottom: .5rem;\n}\n.label-select-all {\n    font-weight: bold;\n}\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            groupCards: null,
            cardTypes: [],
            selfCheckQuestions: null,
            cards: null,
            selected: [],
            type: null
        };
    },

    computed: {
        canSubmit: function canSubmit() {
            return this.readyForCardSelection && this.selected.length;
        },
        readyForCardSelection: function readyForCardSelection() {
            return this.type;
        },
        selectAll: {
            get: function get() {
                return this.cards ? this.selected.length == this.cards.length : false;
            },
            set: function set(value) {
                var selected = [];
                if (value) {
                    this.groupCards.forEach(function (card) {
                        selected.push(card.id);
                    });
                }
                this.selected = selected;
            }
        }
    },
    mounted: function mounted() {
        this.setUp(this.$route.query.groupId);
    },

    methods: {
        cancel: function cancel() {
            this.$router.push('/resources/groups');
        },
        setUp: function setUp(groupId) {
            var _this = this;

            axios.get('/nova/cards-by-group/' + groupId).then(function (response) {
                _this.groupCards = response.data;
            });

            axios.get('/nova/card-types').then(function (response) {
                _this.cardTypes = response.data;
            });
        },
        sendBackToCardSelection: function sendBackToCardSelection() {
            this.$router.push('/resources/groups');
        },
        submitCards: function submitCards() {
            var postData = {
                cardsToChange: this.selected,
                type: this.type
            };
            axios.post('/nova/change-card-type/', postData).then(function (response) {
                this.sendBackToCardSelection();
            }.bind(this)).catch(function (error) {
                var response = error.response;
                if (response.status === 422) {
                    var errors = response.data.errors;
                    var messages = [];
                    object.entries(errors).foreach(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2),
                            key = _ref2[0],
                            val = _ref2[1];

                        messages.push(val[0]); // the value of the current key.
                    });
                    window.alert(messages.join("\n"));
                } else {
                    console.log(response);
                }
            });
        }
    }
});

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("form", { attrs: { autocomplete: "off" } }, [
      _c("div", { staticClass: "mb-8" }, [
        _c("h1", { staticClass: "mb-3 text-90 font-normal text-2xl" }, [
          _vm._v("\n                Change Card Type\n            ")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card" }, [
          _c("div", { staticClass: "flex border-b border-40" }, [
            _vm._m(0),
            _vm._v(" "),
            _c("div", { staticClass: "py-6 px-8 w-1/2" }, [
              _c(
                "select",
                {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.type,
                      expression: "type"
                    }
                  ],
                  staticClass: "w-full form-control form-select",
                  attrs: { id: "actionType" },
                  on: {
                    change: function($event) {
                      var $$selectedVal = Array.prototype.filter
                        .call($event.target.options, function(o) {
                          return o.selected
                        })
                        .map(function(o) {
                          var val = "_value" in o ? o._value : o.value
                          return val
                        })
                      _vm.type = $event.target.multiple
                        ? $$selectedVal
                        : $$selectedVal[0]
                    }
                  }
                },
                [
                  _c("option", { attrs: { disabled: "", value: "" } }, [
                    _vm._v("Please select one")
                  ]),
                  _vm._v(" "),
                  _vm._l(_vm.cardTypes, function(t) {
                    return _c("option", { domProps: { value: t.id } }, [
                      _vm._v(_vm._s(t.name))
                    ])
                  })
                ],
                2
              )
            ])
          ]),
          _vm._v(" "),
          _vm.readyForCardSelection
            ? _c("div", [
                _c("div", { staticClass: "flex border-b border-40" }, [
                  _vm._m(1),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "py-6 px-8 mx-8 w-full" },
                    [
                      _c("label", { staticClass: "label-select-all" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.selectAll,
                              expression: "selectAll"
                            }
                          ],
                          staticClass: "checkbox mt-2",
                          attrs: { type: "checkbox" },
                          domProps: {
                            checked: Array.isArray(_vm.selectAll)
                              ? _vm._i(_vm.selectAll, null) > -1
                              : _vm.selectAll
                          },
                          on: {
                            change: function($event) {
                              var $$a = _vm.selectAll,
                                $$el = $event.target,
                                $$c = $$el.checked ? true : false
                              if (Array.isArray($$a)) {
                                var $$v = null,
                                  $$i = _vm._i($$a, $$v)
                                if ($$el.checked) {
                                  $$i < 0 && (_vm.selectAll = $$a.concat([$$v]))
                                } else {
                                  $$i > -1 &&
                                    (_vm.selectAll = $$a
                                      .slice(0, $$i)
                                      .concat($$a.slice($$i + 1)))
                                }
                              } else {
                                _vm.selectAll = $$c
                              }
                            }
                          }
                        }),
                        _vm._v(
                          "\n                                    Select All\n                                "
                        )
                      ]),
                      _vm._v(" "),
                      _vm._l(_vm.groupCards, function(card) {
                        return _c("div", { key: card.id }, [
                          _c("label", [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.selected,
                                  expression: "selected"
                                }
                              ],
                              staticClass: "checkbox mt-2",
                              attrs: { type: "checkbox" },
                              domProps: {
                                value: card.id,
                                checked: Array.isArray(_vm.selected)
                                  ? _vm._i(_vm.selected, card.id) > -1
                                  : _vm.selected
                              },
                              on: {
                                change: function($event) {
                                  var $$a = _vm.selected,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false
                                  if (Array.isArray($$a)) {
                                    var $$v = card.id,
                                      $$i = _vm._i($$a, $$v)
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        (_vm.selected = $$a.concat([$$v]))
                                    } else {
                                      $$i > -1 &&
                                        (_vm.selected = $$a
                                          .slice(0, $$i)
                                          .concat($$a.slice($$i + 1)))
                                    }
                                  } else {
                                    _vm.selected = $$c
                                  }
                                }
                              }
                            }),
                            _vm._v(
                              "\n                                        " +
                                _vm._s(card.title) +
                                "\n                                    "
                            )
                          ])
                        ])
                      })
                    ],
                    2
                  )
                ])
              ])
            : _vm._e()
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "flex items-center" }, [
        _c(
          "button",
          {
            staticClass: "btn btn-link dim cursor-pointer text-80 ml-auto mr-6",
            on: { click: _vm.cancel }
          },
          [_vm._v("Cancel\n            ")]
        ),
        _vm._v(" "),
        _vm.type
          ? _c(
              "button",
              {
                staticClass:
                  "btn btn-default btn-primary inline-flex items-center relative",
                attrs: { type: "button", disabled: !_vm.canSubmit },
                on: { click: _vm.submitCards }
              },
              [_vm._v("Update Cards\n            ")]
            )
          : _vm._e()
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "w-1/5 px-8 py-6" }, [
      _c("label", { attrs: { for: "actionType" } }, [_vm._v("Card Types")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "w-1/5 px-8 py-6" }, [
      _c("label", [
        _vm._v(
          "\n                                    Cards\n                                "
        )
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1393501d", module.exports)
  }
}

/***/ }),
/* 21 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: Error: Missing binding /Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/node-sass/vendor/darwin-x64-64/binding.node\nNode Sass could not find a binding for your current environment: OS X 64-bit with Node.js 10.x\n\nFound bindings for the following environments:\n  - OS X 64-bit with Node.js 14.x\n\nThis usually happens because your environment has changed since running `npm install`.\nRun `npm rebuild node-sass` to download the binding for your current environment.\n    at module.exports (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/node-sass/lib/binding.js:15:13)\n    at Object.<anonymous> (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/node-sass/lib/index.js:14:35)\n    at Module._compile (internal/modules/cjs/loader.js:778:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)\n    at Module.load (internal/modules/cjs/loader.js:653:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:593:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:585:3)\n    at Module.require (internal/modules/cjs/loader.js:692:17)\n    at require (internal/modules/cjs/helpers.js:25:18)\n    at Object.<anonymous> (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/sass-loader/lib/loader.js:3:14)\n    at Module._compile (internal/modules/cjs/loader.js:778:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)\n    at Module.load (internal/modules/cjs/loader.js:653:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:593:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:585:3)\n    at Module.require (internal/modules/cjs/loader.js:692:17)\n    at require (internal/modules/cjs/helpers.js:25:18)\n    at loadLoader (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/loadLoader.js:18:17)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:176:18\n    at loadLoader (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/loadLoader.js:47:3)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:176:18\n    at loadLoader (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/loadLoader.js:47:3)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:176:18\n    at loadLoader (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/loadLoader.js:47:3)\n    at runLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/webpack/lib/NormalModule.js:195:19)\n    at /Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at /Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:172:11\n    at loadLoader (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/loadLoader.js:32:11)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:176:18\n    at loadLoader (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/loadLoader.js:47:3)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:176:18\n    at loadLoader (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/loadLoader.js:47:3)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\n    at /Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:176:18\n    at loadLoader (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/loadLoader.js:47:3)\n    at iteratePitchingLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:169:2)\n    at runLoaders (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/loader-runner/lib/LoaderRunner.js:365:2)\n    at NormalModule.doBuild (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/webpack/lib/NormalModule.js:182:3)\n    at NormalModule.build (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/webpack/lib/NormalModule.js:275:15)\n    at Compilation.buildModule (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/webpack/lib/Compilation.js:157:10)\n    at moduleFactory.create (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/webpack/lib/Compilation.js:460:10)\n    at factory (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/webpack/lib/NormalModuleFactory.js:243:5)\n    at applyPluginsAsyncWaterfall (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/webpack/lib/NormalModuleFactory.js:94:13)\n    at /Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/tapable/lib/Tapable.js:268:11\n    at NormalModuleFactory.params.normalModuleFactory.plugin (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/webpack/lib/CompatibilityPlugin.js:52:5)\n    at NormalModuleFactory.applyPluginsAsyncWaterfall (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/tapable/lib/Tapable.js:272:13)\n    at resolver (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/webpack/lib/NormalModuleFactory.js:69:10)\n    at process.nextTick (/Users/labrynth/grit/nova-bulk-tagging-tool/node_modules/webpack/lib/NormalModuleFactory.js:196:7)\n    at process._tickCallback (internal/process/next_tick.js:61:11)");

/***/ })
/******/ ]);