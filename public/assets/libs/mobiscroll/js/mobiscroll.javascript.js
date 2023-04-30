/* eslint-disable */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mobiscroll = {}));
}(this, (function (exports) { 'use strict';

  /* eslint-disable */
  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                  t[p[i]] = s[p[i]];
          }
      return t;
  }

  var Observable = /*#__PURE__*/ (function () {
      function Observable() {
          this.nr = 0;
          this.keys = 1;
          // handler function map
          this.subscribers = {};
      }
      /**
       * Subscribes a function that will be called when the observable changes. It will receive the new value as parameter.
       * NOTE: Don't forget to unsubscribe to prevent memory leaks!
       * @param handler A function that will be called when a new value is provided by the observable
       */
      Observable.prototype.subscribe = function (handler) {
          var key = this.keys++;
          this.subscribers[key] = handler;
          this.nr++;
          return key;
      };
      /**
       * Unsubscribes a handler from the observable
       * @param handler The handler of the function returned by the subscribe method or the function itself
       */
      Observable.prototype.unsubscribe = function (key) {
          this.nr--;
          delete this.subscribers[key];
      };
      /**
       * Notifies the subscribers of the observable of the next value.
       * @param value The next value of the observable
       */
      Observable.prototype.next = function (value) {
          var subscribers = this.subscribers;
          for (var _i = 0, _a = Object.keys(subscribers); _i < _a.length; _i++) {
              var key = _a[_i];
              if (subscribers[key]) {
                  subscribers[key](value);
              }
          }
      };
      return Observable;
  }());

  var os;
  var vers;
  var version = [];
  var touchUi = false;
  var isBrowser = typeof window !== 'undefined';
  var isDarkQuery = isBrowser && window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)');
  var userAgent = isBrowser ? navigator.userAgent : '';
  var platform = isBrowser ? navigator.platform : '';
  var maxTouchPoints = isBrowser ? navigator.maxTouchPoints : 0;
  var device = userAgent && userAgent.match(/Android|iPhone|iPad|iPod|Windows Phone|Windows|MSIE/i);
  var isSafari = userAgent && /Safari/.test(userAgent);
  if (/Android/i.test(device)) {
      os = 'android';
      vers = userAgent.match(/Android\s+([\d.]+)/i);
      touchUi = true;
      if (vers) {
          version = vers[0].replace('Android ', '').split('.');
      }
  }
  else if (/iPhone|iPad|iPod/i.test(device) || /iPhone|iPad|iPod/i.test(platform) || (platform === 'MacIntel' && maxTouchPoints > 1)) {
      // On iPad with iOS 13 desktop site request is automatically enabled in Safari,
      // so 'iPad' is no longer present in the user agent string.
      // In this case we check `navigator.platform` and `navigator.maxTouchPoints`.
      // maxTouchPoints is needed to exclude desktop Mac OS X.
      os = 'ios';
      vers = userAgent.match(/OS\s+([\d_]+)/i);
      touchUi = true;
      if (vers) {
          version = vers[0].replace(/_/g, '.').replace('OS ', '').split('.');
      }
  }
  else if (/Windows Phone/i.test(device)) {
      os = 'wp';
      touchUi = true;
  }
  else if (/Windows|MSIE/i.test(device)) {
      os = 'windows';
  }
  var majorVersion = +version[0];
  var minorVersion = +version[1];

  /** @hidden */
  var options = {};
  /** @hidden */
  var util = {};
  /** @hidden */
  var themes = {};
  /** @hidden */
  var autoDetect = {};
  /** @hidden */
  var globalChanges = new Observable();
  /** @hidden */
  function getAutoTheme() {
      var autoTheme = '';
      var theme = '';
      var firstTheme = '';
      if (os === 'android') {
          theme = 'material';
      }
      else if (os === 'wp' || os === 'windows') {
          theme = 'windows';
      }
      else {
          theme = 'ios';
      }
      for (var key in themes) {
          // Stop at the first custom theme with the OS base theme
          if (themes[key].baseTheme === theme && themes[key].auto !== false && key !== theme + '-dark') {
              autoTheme = key;
              break;
          }
          else if (key === theme) {
              autoTheme = key;
          }
          else if (!firstTheme) {
              firstTheme = key;
          }
      }
      return autoTheme || firstTheme;
  }
  function setOptions(local) {
      for (var _i = 0, _a = Object.keys(local); _i < _a.length; _i++) {
          var k = _a[_i];
          options[k] = local[k];
      }
      globalChanges.next(options);
  }
  /**
   * Creates a custom theme definition object. It inherits the defaults from the specified base theme.
   * @param name Name of the custom theme.
   * @param baseTheme Name of the base theme (ios, material or windows).
   * @param auto Allow to set it as auto theme, if the component has theme: 'auto' set. True, if not set.
   */
  function createCustomTheme(name, baseTheme, auto) {
      var base = themes[baseTheme];
      themes[name] = __assign({}, base, { auto: auto,
          baseTheme: baseTheme });
      autoDetect.theme = getAutoTheme();
  }
  var platform$1 = {
      majorVersion: majorVersion,
      minorVersion: minorVersion,
      name: os,
  };

  // tslint:disable max-line-length
  var arrowBack = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"/></svg>';

  // tslint:disable max-line-length
  var arrowDown = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"/></svg>';

  // tslint:disable max-line-length
  var arrowForward = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"/></svg>';

  // tslint:disable max-line-length
  var arrowUp = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273 167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4 24.6 9.4 33.9 0l127.1-127z"/></svg>';

  // tslint:disable max-line-length
  var clear = '<svg xmlns="http://www.w3.org/2000/svg" height="17" viewBox="0 0 17 17" width="17"><path d="M8.5 0a8.5 8.5 0 110 17 8.5 8.5 0 010-17zm3.364 5.005a.7.7 0 00-.99 0l-2.44 2.44-2.439-2.44-.087-.074a.7.7 0 00-.903 1.064l2.44 2.439-2.44 2.44-.074.087a.7.7 0 001.064.903l2.439-2.441 2.44 2.441.087.074a.7.7 0 00.903-1.064l-2.441-2.44 2.441-2.439.074-.087a.7.7 0 00-.074-.903z" fill="currentColor" fill-rule="evenodd"/></svg>';

  var textFieldOpt = {
      clearIcon: clear,
      labelStyle: 'inline',
  };
  var themeName = 'ios';
  themes[themeName] = {
      Calendar: {
          nextIconH: arrowForward,
          nextIconV: arrowDown,
          prevIconH: arrowBack,
          prevIconV: arrowUp,
      },
      Checkbox: {
          position: 'end',
      },
      Datepicker: {
          clearIcon: clear,
          display: 'bottom',
      },
      Dropdown: textFieldOpt,
      Eventcalendar: {
          chevronIconDown: arrowDown,
          nextIconH: arrowForward,
          nextIconV: arrowDown,
          prevIconH: arrowBack,
          prevIconV: arrowUp,
      },
      Input: textFieldOpt,
      Radio: {
          position: 'end',
      },
      Scroller: {
          display: 'bottom',
          itemHeight: 34,
          minWheelWidth: 55,
          rows: 5,
          scroll3d: true,
      },
      SegmentedGroup: {
          drag: true,
      },
      Select: {
          clearIcon: clear,
      },
      Textarea: textFieldOpt,
  };
  createCustomTheme('ios-dark', themeName);

  autoDetect.theme = getAutoTheme();

  var UNDEFINED = undefined;
  var ARRAY3 = getArray(3);
  var ARRAY4 = getArray(4);
  var ARRAY7 = getArray(7);
  getArray(24);
  /**
   * Constrains the value to be between min and max.
   * @hidden
   * @param val   Tha value to constrain.
   * @param min   Min value.
   * @param max   Max value.
   * @return      The constrained value.
   */
  function constrain(val, min, max) {
      return Math.max(min, Math.min(val, max));
  }
  /** @hidden */
  function isArray(obj) {
      return Array.isArray(obj);
  }
  /** @hidden */
  function isNumeric(a) {
      return a - parseFloat(a) >= 0;
  }
  /** @hidden */
  function isNumber(a) {
      return typeof a === 'number';
  }
  /** @hidden */
  function isString(s) {
      return typeof s === 'string';
  }
  /** @hidden */
  function isEmpty(v) {
      return v === UNDEFINED || v === null || v === '';
  }
  /** @hidden */
  function isUndefined(v) {
      return typeof v === 'undefined';
  }
  /** @hidden */
  function isObject(v) {
      return typeof v === 'object';
  }
  /** @hidden */
  function emptyOrTrue(value) {
      return value !== null && value !== UNDEFINED && "" + value !== 'false';
  }
  /**
   * Returns an array with the specified length.
   * @hidden
   * @param nr Length of the array to create.
   * @return Array with the specified length.
   */
  function getArray(nr) {
      return Array.apply(0, Array(Math.max(0, nr)));
  }
  /** @hidden */
  function addPixel(value) {
      return value !== UNDEFINED ? value + (isNumeric(value) ? 'px' : '') : '';
  }
  /** @hidden */
  function noop() {
      return;
  }
  /** @hidden */
  function pad(num, size) {
      if (size === void 0) { size = 2; }
      var str = num + '';
      while (str.length < size) {
          str = '0' + str;
      }
      return str;
  }
  /** @hidden */
  function round(nr) {
      return Math.round(nr);
  }
  /** @hidden */
  function step(value, st) {
      // return Math.min(max, floor(value / st) * st + min);
      return floor(value / st) * st;
  }
  /** @hidden */
  function floor(nr) {
      return Math.floor(nr);
  }
  /** @hidden */
  function debounce(fn, threshhold) {
      if (threshhold === void 0) { threshhold = 100; }
      var timer;
      return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          clearTimeout(timer);
          timer = setTimeout(function () {
              fn.apply(void 0, args);
          }, threshhold);
      };
  }
  /**
   * Like setTimeout, but only for Angular, otherwise calls the function instantly.
   * @param inst The component instance.
   * @param cb The callback function.
   */
  function ngSetTimeout(inst, cb) {
      if (inst._cdr) {
          // It's an Angular component
          setTimeout(cb);
      }
      else {
          cb();
      }
  }
  /**
   * Returns the value of the first element in the array that satisfies the testing function.
   * If no values satisfy the testing function, undefined is returned.
   * @hidden
   * @param arr The array to search.
   * @param fn Function to execute on each value in the array.
   */
  function find(arr, fn) {
      return findItemOrIndex(arr, fn);
  }
  /**
   * Returns the index of the first element in the array that satisfies the testing function.
   * If no values satisfy the testing function, -1 is returned.
   * @hidden
   * @param arr The array to search.
   * @param fn Function to execute on each value in the array.
   */
  function findIndex(arr, fn) {
      return findItemOrIndex(arr, fn, true);
  }
  function findItemOrIndex(arr, fn, index) {
      var len = arr.length;
      for (var i = 0; i < len; i++) {
          var item = arr[i];
          if (fn(item, i)) {
              return index ? i : item;
          }
      }
      return index ? -1 : UNDEFINED;
  }
  /**
   * Just like the .map() function, only it checks for single values as well, not only arrays
   * @param v a single value or an array of values to call the function on
   * @param fn the ransform function to call on each items
   * @returns a single value or an array values transformed by the function provided
   */
  function map(v, fn) {
      if (isArray(v)) {
          return v.map(fn);
      }
      else {
          return fn(v, 0, [v]);
      }
  }

  // tslint:disable no-non-null-assertion
  /**
   * Generic DOM functions.
   */
  var doc = isBrowser ? document : UNDEFINED;
  var win = isBrowser ? window : UNDEFINED;
  var prefixes = ['Webkit', 'Moz'];
  var elem = doc && doc.createElement('div').style;
  var canvas = doc && doc.createElement('canvas');
  var ctx = canvas && canvas.getContext && canvas.getContext('2d', { willReadFrequently: true });
  var css = win && win.CSS;
  var cssSupports = css && css.supports;
  var textColors = {};
  var raf = (win && win.requestAnimationFrame) ||
      (function (func) {
          return setTimeout(func, 20);
      });
  var rafc = (win && win.cancelAnimationFrame) ||
      (function (id) {
          clearTimeout(id);
      });
  var hasAnimation = elem && elem.animationName !== UNDEFINED;
  // UIWebView on iOS still has the ghost click,
  // WkWebView does not have a ghost click, but it's hard to tell if it's UIWebView or WkWebView
  // In addition in iOS 12.2 if we enable tap handling, it brakes the form inputs
  // (keyboard appears, but the cursor is not in the input).
  var isWebView = os === 'ios' && !isSafari;
  var isWkWebView = isWebView && win && win.webkit && win.webkit.messageHandlers;
  var hasGhostClick = (elem && elem.touchAction === UNDEFINED) || (isWebView && !isWkWebView);
  var jsPrefix = getPrefix();
  var cssPrefix = jsPrefix ? '-' + jsPrefix.toLowerCase() + '-' : '';
  var has3d = cssSupports && cssSupports('(transform-style: preserve-3d)');
  cssSupports && (cssSupports('position', 'sticky') || cssSupports('position', '-webkit-sticky'));
  /** @hidden */
  function getPrefix() {
      if (!elem || elem.transform !== UNDEFINED) {
          return '';
      }
      for (var _i = 0, prefixes_1 = prefixes; _i < prefixes_1.length; _i++) {
          var prefix = prefixes_1[_i];
          if (elem[prefix + 'Transform'] !== UNDEFINED) {
              return prefix;
          }
      }
      return '';
  }
  /**
   * @hidden
   * @param el
   * @param event
   * @param handler
   */
  function listen(el, event, handler, opt) {
      if (el) {
          el.addEventListener(event, handler, opt);
      }
  }
  /**
   * @hidden
   * @param el
   * @param event
   * @param handler
   */
  function unlisten(el, event, handler, opt) {
      if (el) {
          el.removeEventListener(event, handler, opt);
      }
  }
  /**
   * @hidden
   * @param el
   */
  function getDocument(el) {
      if (!isBrowser) {
          return UNDEFINED;
      }
      return el && el.ownerDocument ? el.ownerDocument : doc;
  }
  function getDimension(el, property) {
      return parseFloat(getComputedStyle(el)[property] || '0');
  }
  function getScrollLeft(el) {
      return el.scrollLeft !== UNDEFINED ? el.scrollLeft : el.pageXOffset;
  }
  function getScrollTop(el) {
      return el.scrollTop !== UNDEFINED ? el.scrollTop : el.pageYOffset;
  }
  function setScrollLeft(el, val) {
      if (el.scrollTo) {
          el.scrollTo(val, el.scrollY);
      }
      else {
          el.scrollLeft = val;
      }
  }
  function setScrollTop(el, val) {
      if (el.scrollTo) {
          el.scrollTo(el.scrollX, val);
      }
      else {
          el.scrollTop = val;
      }
  }
  /**
   * @hidden
   * @param el
   */
  function getWindow(el) {
      if (!isBrowser) {
          return UNDEFINED;
      }
      return el && el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : win;
  }
  /**
   * @hidden
   * @param el
   * @param vertical
   */
  function getPosition(el, vertical) {
      var style = getComputedStyle(el);
      var transform = jsPrefix ? style[jsPrefix + 'Transform'] : style.transform;
      var matrix = transform.split(')')[0].split(', ');
      var px = vertical ? matrix[13] || matrix[5] : matrix[12] || matrix[4];
      return +px || 0;
  }
  /**
   * Calculates the text color to be used with a given color (black or white)
   * @hidden
   * @param color
   */
  function getTextColor(color) {
      if (!ctx || !color) {
          return '#000';
      }
      // Cache calculated text colors, because it is slow
      if (textColors[color]) {
          return textColors[color];
      }
      // Use canvas element, since it does not require DOM append
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      var img = ctx.getImageData(0, 0, 1, 1);
      var rgb = img ? img.data : [0, 0, 0];
      var delta = +rgb[0] * 0.299 + +rgb[1] * 0.587 + +rgb[2] * 0.114;
      var textColor = delta < 130 ? '#fff' : '#000';
      textColors[color] = textColor;
      return textColor;
  }
  /** @hidden */
  function scrollStep(elm, startTime, fromX, fromY, toX, toY, callback) {
      var elapsed = Math.min(1, (+new Date() - startTime) / 468);
      var eased = 0.5 * (1 - Math.cos(Math.PI * elapsed));
      var currentX;
      var currentY;
      if (toX !== UNDEFINED) {
          currentX = round(fromX + (toX - fromX) * eased);
          elm.scrollLeft = currentX;
      }
      if (toY !== UNDEFINED) {
          currentY = round(fromY + (toY - fromY) * eased);
          elm.scrollTop = currentY;
      }
      if (currentX !== toX || currentY !== toY) {
          raf(function () {
              scrollStep(elm, startTime, fromX, fromY, toX, toY, callback);
          });
      }
      else if (callback) {
          callback();
      }
  }
  /**
   * Scrolls a container to the given position
   * @hidden
   * @param elm Element to scroll
   * @param toX Position to scroll horizontally to
   * @param toY Position to scroll vertically to
   * @param animate If true, scroll will be animated
   * @param rtl Rtl
   * @param callback Callback when scroll position is reached
   */
  function smoothScroll(elm, toX, toY, animate, rtl, callback) {
      if (toX !== UNDEFINED) {
          toX = Math.max(0, round(toX));
      }
      if (toY !== UNDEFINED) {
          toY = Math.max(0, round(toY));
      }
      if (rtl && toX !== UNDEFINED) {
          toX = -toX;
      }
      if (animate) {
          scrollStep(elm, +new Date(), elm.scrollLeft, elm.scrollTop, toX, toY, callback);
      }
      else {
          if (toX !== UNDEFINED) {
              elm.scrollLeft = toX;
          }
          if (toY !== UNDEFINED) {
              elm.scrollTop = toY;
          }
          if (callback) {
              callback();
          }
      }
  }
  /**
   * Convert html text to plain text
   * @hidden
   * @param htmlString
   */
  function htmlToText(htmlString) {
      if (doc && htmlString) {
          var tempElm = doc.createElement('div');
          tempElm.innerHTML = htmlString;
          return tempElm.textContent.trim();
      }
      return htmlString || '';
  }
  /**
   * Gets the offset of a HTML element relative to the window
   * @param el The HTML element
   */
  function getOffset(el) {
      var bRect = el.getBoundingClientRect();
      var ret = {
          left: bRect.left,
          top: bRect.top,
      };
      var window = getWindow(el);
      if (window !== UNDEFINED) {
          ret.top += getScrollTop(window);
          ret.left += getScrollLeft(window);
      }
      return ret;
  }
  /**
   * Checks if an HTML element matches the given selector
   * @param elm
   * @param selector
   */
  function matches(elm, selector) {
      // IE11 only supports msMatchesSelector
      var matchesSelector = elm && (elm.matches || elm.msMatchesSelector);
      return matchesSelector && matchesSelector.call(elm, selector);
  }
  /**
   * Returns the closest parent element matching the selector
   * @param elm The starting element
   * @param selector The selector string
   * @param context Only look within the context element
   */
  function closest(elm, selector, context) {
      while (elm && !matches(elm, selector)) {
          if (elm === context || elm.nodeType === elm.DOCUMENT_NODE) {
              return null;
          }
          elm = elm.parentNode;
      }
      return elm;
  }
  /**
   * Triggers an event on a HTML element
   * NOTE: React messes with the eventlisteners, so triggering an event with
   * this method will not be picked up with a react way listener (ex. `<input onChange={handler} />`),
   * instead will require to be listened manually (ex. listen/unlisten util functions)
   * @param elm The target HTML element, the event will triggered on
   * @param name The name of the event
   * @param data Additional event data
   */
  function trigger(elm, name, data) {
      var evt;
      try {
          evt = new CustomEvent(name, {
              bubbles: true,
              cancelable: true,
              detail: data,
          });
      }
      catch (e) {
          evt = document.createEvent('Event');
          evt.initEvent(name, true, true);
          evt.detail = data;
      }
      elm.dispatchEvent(evt);
  }
  function forEach(items, func) {
      for (var i = 0; i < items.length; i++) {
          func(items[i], i);
      }
  }

  var EMPTY_OBJ = {};
  var EMPTY_ARR = [];
  var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

  /**
   * Assign properties from `props` to `obj`
   * @template O, P The obj and props types
   * @param {O} obj The object to copy properties to
   * @param {P} props The object to copy properties from
   * @returns {O & P}
   */
  function assign(obj, props) {
    // @ts-ignore We change the type of `obj` to be `O & P`
    for (var i in props) {
      obj[i] = props[i];
    }

    return (
      /** @type {O & P} */
      obj
    );
  }
  /**
   * Remove a child node from its parent if attached. This is a workaround for
   * IE11 which doesn't support `Element.prototype.remove()`. Using this function
   * is smaller than including a dedicated polyfill.
   * @param {Node} node The node to remove
   */

  function removeNode(node) {
    var parentNode = node.parentNode;
    if (parentNode) parentNode.removeChild(node);
  }

  /**
   * Find the closest error boundary to a thrown error and call it
   * @param {object} error The thrown value
   * @param {import('../internal').VNode} vnode The vnode that threw
   * the error that was caught (except for unmounting when this parameter
   * is the highest parent that was being unmounted)
   */
  function _catchError(error, vnode) {
    /** @type {import('../internal').Component} */
    var component, ctor, handled;

    for (; vnode = vnode._parent;) {
      if ((component = vnode._component) && !component._processingException) {
        try {
          ctor = component.constructor;

          if (ctor && ctor.getDerivedStateFromError != null) {
            component.setState(ctor.getDerivedStateFromError(error));
            handled = component._dirty;
          }

          if (component.componentDidCatch != null) {
            component.componentDidCatch(error);
            handled = component._dirty;
          } // This is an error boundary. Mark it as having bailed out, and whether it was mid-hydration.


          if (handled) {
            return component._pendingError = component;
          }
        } catch (e) {
          error = e;
        }
      }
    }

    throw error;
  }

  /**
   * The `option` object can potentially contain callback functions
   * that are called during various stages of our renderer. This is the
   * foundation on which all our addons like `preact/debug`, `preact/compat`,
   * and `preact/hooks` are based on. See the `Options` type in `internal.d.ts`
   * for a full list of available option hooks (most editors/IDEs allow you to
   * ctrl+click or cmd+click on mac the type definition below).
   * @type {import('./internal').Options}
   */

  var options$1 = {
    _catchError: _catchError,
    _vnodeId: 0
  };

  /**
   * Create an virtual node (used for JSX)
   * @param {import('./internal').VNode["type"]} type The node name or Component
   * constructor for this virtual node
   * @param {object | null | undefined} [props] The properties of the virtual node
   * @param {Array<import('.').ComponentChildren>} [children] The children of the virtual node
   * @returns {import('./internal').VNode}
   */

  function createElement(type, props, children) {
    var normalizedProps = {},
        key,
        ref,
        i;

    for (i in props) {
      if (i == 'key') key = props[i];else if (i == 'ref') ref = props[i];else normalizedProps[i] = props[i];
    }

    if (arguments.length > 3) {
      children = [children]; // https://github.com/preactjs/preact/issues/1916

      for (i = 3; i < arguments.length; i++) {
        children.push(arguments[i]);
      }
    }

    if (children != null) {
      normalizedProps.children = children;
    } // If a Component VNode, check for and apply defaultProps
    // Note: type may be undefined in development, must never error here.


    if (typeof type == 'function' && type.defaultProps != null) {
      for (i in type.defaultProps) {
        if (normalizedProps[i] === undefined) {
          normalizedProps[i] = type.defaultProps[i];
        }
      }
    }

    return createVNode(type, normalizedProps, key, ref, null);
  }
  /**
   * Create a VNode (used internally by Preact)
   * @param {import('./internal').VNode["type"]} type The node name or Component
   * Constructor for this virtual node
   * @param {object | string | number | null} props The properties of this virtual node.
   * If this virtual node represents a text node, this is the text of the node (string or number).
   * @param {string | number | null} key The key for this virtual node, used when
   * diffing it against its children
   * @param {import('./internal').VNode["ref"]} ref The ref property that will
   * receive a reference to its created child
   * @returns {import('./internal').VNode}
   */

  function createVNode(type, props, key, ref, original) {
    // V8 seems to be better at detecting type shapes if the object is allocated from the same call site
    // Do not inline into createElement and coerceToVNode!
    var vnode = {
      type: type,
      props: props,
      key: key,
      ref: ref,
      _children: null,
      _parent: null,
      _depth: 0,
      _dom: null,
      // _nextDom must be initialized to undefined b/c it will eventually
      // be set to dom.nextSibling which can return `null` and it is important
      // to be able to distinguish between an uninitialized _nextDom and
      // a _nextDom that has been set to `null`
      _nextDom: undefined,
      _component: null,
      _hydrating: null,
      constructor: undefined,
      _original: original == null ? ++options$1._vnodeId : original
    };
    if (options$1.vnode != null) options$1.vnode(vnode);
    return vnode;
  }
  function Fragment(props) {
    return props.children;
  }

  /**
   * Base Component class. Provides `setState()` and `forceUpdate()`, which
   * trigger rendering
   * @param {object} props The initial component props
   * @param {object} context The initial context from parent components'
   * getChildContext
   */

  function Component(props, context) {
    this.props = props;
    this.context = context;
  }
  /**
   * Update component state and schedule a re-render.
   * @this {import('./internal').Component}
   * @param {object | ((s: object, p: object) => object)} update A hash of state
   * properties to update with new values or a function that given the current
   * state and props returns a new partial state
   * @param {() => void} [callback] A function to be called once component state is
   * updated
   */

  Component.prototype.setState = function (update, callback) {
    // only clone state when copying to nextState the first time.
    var s;

    if (this._nextState != null && this._nextState !== this.state) {
      s = this._nextState;
    } else {
      s = this._nextState = assign({}, this.state);
    }

    if (typeof update == 'function') {
      // Some libraries like `immer` mark the current state as readonly,
      // preventing us from mutating it, so we need to clone it. See #2716
      update = update(assign({}, s), this.props);
    }

    if (update) {
      assign(s, update);
    } // Skip update if updater function returned null


    if (update == null) return;

    if (this._vnode) {
      if (callback) this._renderCallbacks.push(callback);
      enqueueRender(this);
    }
  };
  /**
   * Immediately perform a synchronous re-render of the component
   * @this {import('./internal').Component}
   * @param {() => void} [callback] A function to be called after component is
   * re-rendered
   */


  Component.prototype.forceUpdate = function (callback) {
    if (this._vnode) {
      // Set render mode so that we can differentiate where the render request
      // is coming from. We need this because forceUpdate should never call
      // shouldComponentUpdate
      this._force = true;
      if (callback) this._renderCallbacks.push(callback);
      enqueueRender(this);
    }
  };
  /**
   * Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
   * Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
   * @param {object} props Props (eg: JSX attributes) received from parent
   * element/component
   * @param {object} state The component's current state
   * @param {object} context Context object, as returned by the nearest
   * ancestor's `getChildContext()`
   * @returns {import('./index').ComponentChildren | void}
   */


  Component.prototype.render = Fragment;
  /**
   * @param {import('./internal').VNode} vnode
   * @param {number | null} [childIndex]
   */

  function getDomSibling(vnode, childIndex) {
    if (childIndex == null) {
      // Use childIndex==null as a signal to resume the search from the vnode's sibling
      return vnode._parent ? getDomSibling(vnode._parent, vnode._parent._children.indexOf(vnode) + 1) : null;
    }

    var sibling;

    for (; childIndex < vnode._children.length; childIndex++) {
      sibling = vnode._children[childIndex];

      if (sibling != null && sibling._dom != null) {
        // Since updateParentDomPointers keeps _dom pointer correct,
        // we can rely on _dom to tell us if this subtree contains a
        // rendered DOM node, and what the first rendered DOM node is
        return sibling._dom;
      }
    } // If we get here, we have not found a DOM node in this vnode's children.
    // We must resume from this vnode's sibling (in it's parent _children array)
    // Only climb up and search the parent if we aren't searching through a DOM
    // VNode (meaning we reached the DOM parent of the original vnode that began
    // the search)


    return typeof vnode.type == 'function' ? getDomSibling(vnode) : null;
  }
  /**
   * Trigger in-place re-rendering of a component.
   * @param {import('./internal').Component} component The component to rerender
   */

  function renderComponent(component) {
    var vnode = component._vnode,
        oldDom = vnode._dom,
        parentDom = component._parentDom;

    if (parentDom) {
      var commitQueue = [];
      var oldVNode = assign({}, vnode);
      oldVNode._original = vnode._original + 1;
      diff(parentDom, vnode, oldVNode, component._globalContext, parentDom.ownerSVGElement !== undefined, vnode._hydrating != null ? [oldDom] : null, commitQueue, oldDom == null ? getDomSibling(vnode) : oldDom, vnode._hydrating);
      commitRoot(commitQueue, vnode);

      if (vnode._dom != oldDom) {
        updateParentDomPointers(vnode);
      }
    }
  }
  /**
   * @param {import('./internal').VNode} vnode
   */


  function updateParentDomPointers(vnode) {
    if ((vnode = vnode._parent) != null && vnode._component != null) {
      vnode._dom = vnode._component.base = null;

      for (var i = 0; i < vnode._children.length; i++) {
        var child = vnode._children[i];

        if (child != null && child._dom != null) {
          vnode._dom = vnode._component.base = child._dom;
          break;
        }
      }

      return updateParentDomPointers(vnode);
    }
  }
  /**
   * The render queue
   * @type {Array<import('./internal').Component>}
   */


  var rerenderQueue = [];
  /**
   * Asynchronously schedule a callback
   * @type {(cb: () => void) => void}
   */

  /* istanbul ignore next */
  // Note the following line isn't tree-shaken by rollup cuz of rollup/rollup#2566

  var defer = typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
  /*
   * The value of `Component.debounce` must asynchronously invoke the passed in callback. It is
   * important that contributors to Preact can consistently reason about what calls to `setState`, etc.
   * do, and when their effects will be applied. See the links below for some further reading on designing
   * asynchronous APIs.
   * * [Designing APIs for Asynchrony](https://blog.izs.me/2013/08/designing-apis-for-asynchrony)
   * * [Callbacks synchronous and asynchronous](https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/)
   */

  var prevDebounce;
  /**
   * Enqueue a rerender of a component
   * @param {import('./internal').Component} c The component to rerender
   */

  function enqueueRender(c) {
    if (!c._dirty && (c._dirty = true) && rerenderQueue.push(c) && !process._rerenderCount++ || prevDebounce !== options$1.debounceRendering) {
      prevDebounce = options$1.debounceRendering;
      (prevDebounce || defer)(process);
    }
  }
  /** Flush the render queue by rerendering all queued components */

  function process() {
    var queue;

    while (process._rerenderCount = rerenderQueue.length) {
      queue = rerenderQueue.sort(function (a, b) {
        return a._vnode._depth - b._vnode._depth;
      });
      rerenderQueue = []; // Don't update `renderCount` yet. Keep its value non-zero to prevent unnecessary
      // process() calls from getting scheduled while `queue` is still being consumed.

      queue.some(function (c) {
        if (c._dirty) renderComponent(c);
      });
    }
  }

  process._rerenderCount = 0;

  /**
   * Diff the children of a virtual node
   * @param {import('../internal').PreactElement} parentDom The DOM element whose
   * children are being diffed
   * @param {import('../internal').ComponentChildren[]} renderResult
   * @param {import('../internal').VNode} newParentVNode The new virtual
   * node whose children should be diff'ed against oldParentVNode
   * @param {import('../internal').VNode} oldParentVNode The old virtual
   * node whose children should be diff'ed against newParentVNode
   * @param {object} globalContext The current context object - modified by getChildContext
   * @param {boolean} isSvg Whether or not this DOM node is an SVG node
   * @param {Array<import('../internal').PreactElement>} excessDomChildren
   * @param {Array<import('../internal').Component>} commitQueue List of components
   * which have callbacks to invoke in commitRoot
   * @param {import('../internal').PreactElement} oldDom The current attached DOM
   * element any new dom elements should be placed around. Likely `null` on first
   * render (except when hydrating). Can be a sibling DOM element when diffing
   * Fragments that have siblings. In most cases, it starts out as `oldChildren[0]._dom`.
   * @param {boolean} isHydrating Whether or not we are in hydration
   */

  function diffChildren(parentDom, renderResult, newParentVNode, oldParentVNode, globalContext, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating) {
    var i, j, oldVNode, childVNode, newDom, firstChildDom, refs; // This is a compression of oldParentVNode!=null && oldParentVNode != EMPTY_OBJ && oldParentVNode._children || EMPTY_ARR
    // as EMPTY_OBJ._children should be `undefined`.

    var oldChildren = oldParentVNode && oldParentVNode._children || EMPTY_ARR;
    var oldChildrenLength = oldChildren.length;
    newParentVNode._children = [];

    for (i = 0; i < renderResult.length; i++) {
      childVNode = renderResult[i];

      if (childVNode == null || typeof childVNode == 'boolean') {
        childVNode = newParentVNode._children[i] = null;
      } // If this newVNode is being reused (e.g. <div>{reuse}{reuse}</div>) in the same diff,
      // or we are rendering a component (e.g. setState) copy the oldVNodes so it can have
      // it's own DOM & etc. pointers
      else if (typeof childVNode == 'string' || typeof childVNode == 'number' || // eslint-disable-next-line valid-typeof
      typeof childVNode == 'bigint') {
        childVNode = newParentVNode._children[i] = createVNode(null, childVNode, null, null, childVNode);
      } else if (Array.isArray(childVNode)) {
        childVNode = newParentVNode._children[i] = createVNode(Fragment, {
          children: childVNode
        }, null, null, null);
      } else if (childVNode._depth > 0) {
        // VNode is already in use, clone it. This can happen in the following
        // scenario:
        //   const reuse = <div />
        //   <div>{reuse}<span />{reuse}</div>
        childVNode = newParentVNode._children[i] = createVNode(childVNode.type, childVNode.props, childVNode.key, null, childVNode._original);
      } else {
        childVNode = newParentVNode._children[i] = childVNode;
      } // Terser removes the `continue` here and wraps the loop body
      // in a `if (childVNode) { ... } condition


      if (childVNode == null) {
        continue;
      }

      childVNode._parent = newParentVNode;
      childVNode._depth = newParentVNode._depth + 1; // Check if we find a corresponding element in oldChildren.
      // If found, delete the array item by setting to `undefined`.
      // We use `undefined`, as `null` is reserved for empty placeholders
      // (holes).

      oldVNode = oldChildren[i];

      if (oldVNode === null || oldVNode && childVNode.key == oldVNode.key && childVNode.type === oldVNode.type) {
        oldChildren[i] = undefined;
      } else {
        // Either oldVNode === undefined or oldChildrenLength > 0,
        // so after this loop oldVNode == null or oldVNode is a valid value.
        for (j = 0; j < oldChildrenLength; j++) {
          oldVNode = oldChildren[j]; // If childVNode is unkeyed, we only match similarly unkeyed nodes, otherwise we match by key.
          // We always match by type (in either case).

          if (oldVNode && childVNode.key == oldVNode.key && childVNode.type === oldVNode.type) {
            oldChildren[j] = undefined;
            break;
          }

          oldVNode = null;
        }
      }

      oldVNode = oldVNode || EMPTY_OBJ; // Morph the old element into the new one, but don't append it to the dom yet

      diff(parentDom, childVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating);
      newDom = childVNode._dom;

      if ((j = childVNode.ref) && oldVNode.ref != j) {
        if (!refs) refs = [];
        if (oldVNode.ref) refs.push(oldVNode.ref, null, childVNode);
        refs.push(j, childVNode._component || newDom, childVNode);
      }

      if (newDom != null) {
        if (firstChildDom == null) {
          firstChildDom = newDom;
        }

        if (typeof childVNode.type == 'function' && childVNode._children != null && // Can be null if childVNode suspended
        childVNode._children === oldVNode._children) {
          childVNode._nextDom = oldDom = reorderChildren(childVNode, oldDom, parentDom);
        } else {
          oldDom = placeChild(parentDom, childVNode, oldVNode, oldChildren, newDom, oldDom);
        } // Browsers will infer an option's `value` from `textContent` when
        // no value is present. This essentially bypasses our code to set it
        // later in `diff()`. It works fine in all browsers except for IE11
        // where it breaks setting `select.value`. There it will be always set
        // to an empty string. Re-applying an options value will fix that, so
        // there are probably some internal data structures that aren't
        // updated properly.
        //
        // To fix it we make sure to reset the inferred value, so that our own
        // value check in `diff()` won't be skipped.


        if (!isHydrating && newParentVNode.type === 'option') {
          // @ts-ignore We have validated that the type of parentDOM is 'option'
          // in the above check
          parentDom.value = '';
        } else if (typeof newParentVNode.type == 'function') {
          // Because the newParentVNode is Fragment-like, we need to set it's
          // _nextDom property to the nextSibling of its last child DOM node.
          //
          // `oldDom` contains the correct value here because if the last child
          // is a Fragment-like, then oldDom has already been set to that child's _nextDom.
          // If the last child is a DOM VNode, then oldDom will be set to that DOM
          // node's nextSibling.
          newParentVNode._nextDom = oldDom;
        }
      } else if (oldDom && oldVNode._dom == oldDom && oldDom.parentNode != parentDom) {
        // The above condition is to handle null placeholders. See test in placeholder.test.js:
        // `efficiently replace null placeholders in parent rerenders`
        oldDom = getDomSibling(oldVNode);
      }
    }

    newParentVNode._dom = firstChildDom; // Remove remaining oldChildren if there are any.

    for (i = oldChildrenLength; i--;) {
      if (oldChildren[i] != null) {
        if (typeof newParentVNode.type == 'function' && oldChildren[i]._dom != null && oldChildren[i]._dom == newParentVNode._nextDom) {
          // If the newParentVNode.__nextDom points to a dom node that is about to
          // be unmounted, then get the next sibling of that vnode and set
          // _nextDom to it
          newParentVNode._nextDom = getDomSibling(oldParentVNode, i + 1);
        }

        unmount(oldChildren[i], oldChildren[i]);
      }
    } // Set refs only after unmount


    if (refs) {
      for (i = 0; i < refs.length; i++) {
        applyRef(refs[i], refs[++i], refs[++i]);
      }
    }
  }

  function reorderChildren(childVNode, oldDom, parentDom) {
    for (var tmp = 0; tmp < childVNode._children.length; tmp++) {
      var vnode = childVNode._children[tmp];

      if (vnode) {
        // We typically enter this code path on sCU bailout, where we copy
        // oldVNode._children to newVNode._children. If that is the case, we need
        // to update the old children's _parent pointer to point to the newVNode
        // (childVNode here).
        vnode._parent = childVNode;

        if (typeof vnode.type == 'function') {
          oldDom = reorderChildren(vnode, oldDom, parentDom);
        } else {
          oldDom = placeChild(parentDom, vnode, vnode, childVNode._children, vnode._dom, oldDom);
        }
      }
    }

    return oldDom;
  }

  function placeChild(parentDom, childVNode, oldVNode, oldChildren, newDom, oldDom) {
    var nextDom;

    if (childVNode._nextDom !== undefined) {
      // Only Fragments or components that return Fragment like VNodes will
      // have a non-undefined _nextDom. Continue the diff from the sibling
      // of last DOM child of this child VNode
      nextDom = childVNode._nextDom; // Eagerly cleanup _nextDom. We don't need to persist the value because
      // it is only used by `diffChildren` to determine where to resume the diff after
      // diffing Components and Fragments. Once we store it the nextDOM local var, we
      // can clean up the property

      childVNode._nextDom = undefined;
    } else if (oldVNode == null || newDom != oldDom || newDom.parentNode == null) {
      outer: if (oldDom == null || oldDom.parentNode !== parentDom) {
        parentDom.appendChild(newDom);
        nextDom = null;
      } else {
        // `j<oldChildrenLength; j+=2` is an alternative to `j++<oldChildrenLength/2`
        for (var sibDom = oldDom, j = 0; (sibDom = sibDom.nextSibling) && j < oldChildren.length; j += 2) {
          if (sibDom == newDom) {
            break outer;
          }
        }

        parentDom.insertBefore(newDom, oldDom);
        nextDom = oldDom;
      }
    } // If we have pre-calculated the nextDOM node, use it. Else calculate it now
    // Strictly check for `undefined` here cuz `null` is a valid value of `nextDom`.
    // See more detail in create-element.js:createVNode


    if (nextDom !== undefined) {
      oldDom = nextDom;
    } else {
      oldDom = newDom.nextSibling;
    }

    return oldDom;
  }

  /**
   * Diff the old and new properties of a VNode and apply changes to the DOM node
   * @param {import('../internal').PreactElement} dom The DOM node to apply
   * changes to
   * @param {object} newProps The new props
   * @param {object} oldProps The old props
   * @param {boolean} isSvg Whether or not this node is an SVG node
   * @param {boolean} hydrate Whether or not we are in hydration mode
   */

  function diffProps(dom, newProps, oldProps, isSvg, hydrate) {
    var i;

    for (i in oldProps) {
      if (i !== 'children' && i !== 'key' && !(i in newProps)) {
        setProperty(dom, i, null, oldProps[i], isSvg);
      }
    }

    for (i in newProps) {
      if ((!hydrate || typeof newProps[i] == 'function') && i !== 'children' && i !== 'key' && i !== 'value' && i !== 'checked' && oldProps[i] !== newProps[i]) {
        setProperty(dom, i, newProps[i], oldProps[i], isSvg);
      }
    }
  }

  function setStyle(style, key, value) {
    if (key[0] === '-') {
      style.setProperty(key, value);
    } else if (value == null) {
      style[key] = '';
    } else if (typeof value != 'number' || IS_NON_DIMENSIONAL.test(key)) {
      style[key] = value;
    } else {
      style[key] = value + 'px';
    }
  }
  /**
   * Set a property value on a DOM node
   * @param {import('../internal').PreactElement} dom The DOM node to modify
   * @param {string} name The name of the property to set
   * @param {*} value The value to set the property to
   * @param {*} oldValue The old value the property had
   * @param {boolean} isSvg Whether or not this DOM node is an SVG node or not
   */


  function setProperty(dom, name, value, oldValue, isSvg) {
    var useCapture;

    o: if (name === 'style') {
      if (typeof value == 'string') {
        dom.style.cssText = value;
      } else {
        if (typeof oldValue == 'string') {
          dom.style.cssText = oldValue = '';
        }

        if (oldValue) {
          for (name in oldValue) {
            if (!(value && name in value)) {
              setStyle(dom.style, name, '');
            }
          }
        }

        if (value) {
          for (name in value) {
            if (!oldValue || value[name] !== oldValue[name]) {
              setStyle(dom.style, name, value[name]);
            }
          }
        }
      }
    } // Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
    else if (name[0] === 'o' && name[1] === 'n') {
      useCapture = name !== (name = name.replace(/Capture$/, '')); // Infer correct casing for DOM built-in events:

      if (name.toLowerCase() in dom) name = name.toLowerCase().slice(2);else name = name.slice(2);
      if (!dom._listeners) dom._listeners = {};
      dom._listeners[name + useCapture] = value;

      if (value) {
        if (!oldValue) {
          var handler = useCapture ? eventProxyCapture : eventProxy;
          dom.addEventListener(name, handler, useCapture);
        }
      } else {
        var _handler = useCapture ? eventProxyCapture : eventProxy;

        dom.removeEventListener(name, _handler, useCapture);
      }
    } else if (name !== 'dangerouslySetInnerHTML') {
      if (isSvg) {
        // Normalize incorrect prop usage for SVG:
        // - xlink:href / xlinkHref --> href (xlink:href was removed from SVG and isn't needed)
        // - className --> class
        name = name.replace(/xlink[H:h]/, 'h').replace(/sName$/, 's');
      } else if (name !== 'href' && name !== 'list' && name !== 'form' && // Default value in browsers is `-1` and an empty string is
      // cast to `0` instead
      name !== 'tabIndex' && name !== 'download' && name in dom) {
        try {
          dom[name] = value == null ? '' : value; // labelled break is 1b smaller here than a return statement (sorry)

          break o;
        } catch (e) {}
      } // ARIA-attributes have a different notion of boolean values.
      // The value `false` is different from the attribute not
      // existing on the DOM, so we can't remove it. For non-boolean
      // ARIA-attributes we could treat false as a removal, but the
      // amount of exceptions would cost us too many bytes. On top of
      // that other VDOM frameworks also always stringify `false`.


      if (typeof value === 'function') ; else if (value != null && (value !== false || name[0] === 'a' && name[1] === 'r')) {
        dom.setAttribute(name, value);
      } else {
        dom.removeAttribute(name);
      }
    }
  }
  /**
   * Proxy an event to hooked event handlers
   * @param {Event} e The event object from the browser
   * @private
   */

  function eventProxy(e) {
    this._listeners[e.type + false](options$1.event ? options$1.event(e) : e);
  }

  function eventProxyCapture(e) {
    this._listeners[e.type + true](options$1.event ? options$1.event(e) : e);
  }

  /**
   * Diff two virtual nodes and apply proper changes to the DOM
   * @param {import('../internal').PreactElement} parentDom The parent of the DOM element
   * @param {import('../internal').VNode} newVNode The new virtual node
   * @param {import('../internal').VNode} oldVNode The old virtual node
   * @param {object} globalContext The current context object. Modified by getChildContext
   * @param {boolean} isSvg Whether or not this element is an SVG node
   * @param {Array<import('../internal').PreactElement>} excessDomChildren
   * @param {Array<import('../internal').Component>} commitQueue List of components
   * which have callbacks to invoke in commitRoot
   * @param {import('../internal').PreactElement} oldDom The current attached DOM
   * element any new dom elements should be placed around. Likely `null` on first
   * render (except when hydrating). Can be a sibling DOM element when diffing
   * Fragments that have siblings. In most cases, it starts out as `oldChildren[0]._dom`.
   * @param {boolean} [isHydrating] Whether or not we are in hydration
   */

  function diff(parentDom, newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating) {
    var tmp,
        newType = newVNode.type; // When passing through createElement it assigns the object
    // constructor as undefined. This to prevent JSON-injection.

    if (newVNode.constructor !== undefined) return null; // If the previous diff bailed out, resume creating/hydrating.

    if (oldVNode._hydrating != null) {
      isHydrating = oldVNode._hydrating;
      oldDom = newVNode._dom = oldVNode._dom; // if we resume, we want the tree to be "unlocked"

      newVNode._hydrating = null;
      excessDomChildren = [oldDom];
    }

    if (tmp = options$1._diff) tmp(newVNode);

    try {
      outer: if (typeof newType == 'function') {
        var c, isNew, oldProps, oldState, snapshot, clearProcessingException;
        var newProps = newVNode.props; // Necessary for createContext api. Setting this property will pass
        // the context value as `this.context` just for this component.

        tmp = newType.contextType;
        var provider = tmp && globalContext[tmp._id];
        var componentContext = tmp ? provider ? provider.props.value : tmp._defaultValue : globalContext; // Get component and set it to `c`

        if (oldVNode._component) {
          c = newVNode._component = oldVNode._component;
          clearProcessingException = c._processingException = c._pendingError;
        } else {
          // Instantiate the new component
          if ('prototype' in newType && newType.prototype.render) {
            // @ts-ignore The check above verifies that newType is suppose to be constructed
            newVNode._component = c = new newType(newProps, componentContext); // eslint-disable-line new-cap
          } else {
            // @ts-ignore Trust me, Component implements the interface we want
            newVNode._component = c = new Component(newProps, componentContext);
            c.constructor = newType;
            c.render = doRender;
          }

          if (provider) provider.sub(c);
          c.props = newProps;
          if (!c.state) c.state = {};
          c.context = componentContext;
          c._globalContext = globalContext;
          isNew = c._dirty = true;
          c._renderCallbacks = [];
        } // Invoke getDerivedStateFromProps


        if (c._nextState == null) {
          c._nextState = c.state;
        }

        if (newType.getDerivedStateFromProps != null) {
          if (c._nextState == c.state) {
            c._nextState = assign({}, c._nextState);
          }

          assign(c._nextState, newType.getDerivedStateFromProps(newProps, c._nextState));
        }

        oldProps = c.props;
        oldState = c.state; // Invoke pre-render lifecycle methods

        if (isNew) {
          if (newType.getDerivedStateFromProps == null && c.componentWillMount != null) {
            c.componentWillMount();
          }

          if (c.componentDidMount != null) {
            c._renderCallbacks.push(c.componentDidMount);
          }
        } else {
          if (newType.getDerivedStateFromProps == null && newProps !== oldProps && c.componentWillReceiveProps != null) {
            c.componentWillReceiveProps(newProps, componentContext);
          }

          if (!c._force && c.shouldComponentUpdate != null && c.shouldComponentUpdate(newProps, c._nextState, componentContext) === false || newVNode._original === oldVNode._original) {
            c.props = newProps;
            c.state = c._nextState; // More info about this here: https://gist.github.com/JoviDeCroock/bec5f2ce93544d2e6070ef8e0036e4e8

            if (newVNode._original !== oldVNode._original) c._dirty = false;
            c._vnode = newVNode;
            newVNode._dom = oldVNode._dom;
            newVNode._children = oldVNode._children;

            newVNode._children.forEach(function (vnode) {
              if (vnode) vnode._parent = newVNode;
            });

            if (c._renderCallbacks.length) {
              commitQueue.push(c);
            }

            break outer;
          }

          if (c.componentWillUpdate != null) {
            c.componentWillUpdate(newProps, c._nextState, componentContext);
          }

          if (c.componentDidUpdate != null) {
            c._renderCallbacks.push(function () {
              c.componentDidUpdate(oldProps, oldState, snapshot);
            });
          }
        }

        c.context = componentContext;
        c.props = newProps;
        c.state = c._nextState;
        if (tmp = options$1._render) tmp(newVNode);
        c._dirty = false;
        c._vnode = newVNode;
        c._parentDom = parentDom;
        tmp = c.render(c.props, c.state, c.context); // Handle setState called in render, see #2553

        c.state = c._nextState;

        if (c.getChildContext != null) {
          globalContext = assign(assign({}, globalContext), c.getChildContext());
        }

        if (!isNew && c.getSnapshotBeforeUpdate != null) {
          snapshot = c.getSnapshotBeforeUpdate(oldProps, oldState);
        }

        var isTopLevelFragment = tmp != null && tmp.type === Fragment && tmp.key == null;
        var renderResult = isTopLevelFragment ? tmp.props.children : tmp;
        diffChildren(parentDom, Array.isArray(renderResult) ? renderResult : [renderResult], newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating);
        c.base = newVNode._dom; // We successfully rendered this VNode, unset any stored hydration/bailout state:

        newVNode._hydrating = null;

        if (c._renderCallbacks.length) {
          commitQueue.push(c);
        }

        if (clearProcessingException) {
          c._pendingError = c._processingException = null;
        }

        c._force = false;
      } else if (excessDomChildren == null && newVNode._original === oldVNode._original) {
        newVNode._children = oldVNode._children;
        newVNode._dom = oldVNode._dom;
      } else {
        newVNode._dom = diffElementNodes(oldVNode._dom, newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, isHydrating);
      }

      if (tmp = options$1.diffed) tmp(newVNode);
    } catch (e) {
      newVNode._original = null; // if hydrating or creating initial tree, bailout preserves DOM:

      if (isHydrating || excessDomChildren != null) {
        newVNode._dom = oldDom;
        newVNode._hydrating = !!isHydrating;
        excessDomChildren[excessDomChildren.indexOf(oldDom)] = null; // ^ could possibly be simplified to:
        // excessDomChildren.length = 0;
      }

      options$1._catchError(e, newVNode, oldVNode);
    }
  }
  /**
   * @param {Array<import('../internal').Component>} commitQueue List of components
   * which have callbacks to invoke in commitRoot
   * @param {import('../internal').VNode} root
   */

  function commitRoot(commitQueue, root) {
    if (options$1._commit) options$1._commit(root, commitQueue);
    commitQueue.some(function (c) {
      try {
        // @ts-ignore Reuse the commitQueue variable here so the type changes
        commitQueue = c._renderCallbacks;
        c._renderCallbacks = [];
        commitQueue.some(function (cb) {
          // @ts-ignore See above ts-ignore on commitQueue
          cb.call(c);
        });
      } catch (e) {
        options$1._catchError(e, c._vnode);
      }
    });
  }
  /**
   * Diff two virtual nodes representing DOM element
   * @param {import('../internal').PreactElement} dom The DOM element representing
   * the virtual nodes being diffed
   * @param {import('../internal').VNode} newVNode The new virtual node
   * @param {import('../internal').VNode} oldVNode The old virtual node
   * @param {object} globalContext The current context object
   * @param {boolean} isSvg Whether or not this DOM node is an SVG node
   * @param {*} excessDomChildren
   * @param {Array<import('../internal').Component>} commitQueue List of components
   * which have callbacks to invoke in commitRoot
   * @param {boolean} isHydrating Whether or not we are in hydration
   * @returns {import('../internal').PreactElement}
   */

  function diffElementNodes(dom, newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, isHydrating) {
    var oldProps = oldVNode.props;
    var newProps = newVNode.props;
    var nodeType = newVNode.type;
    var i = 0; // Tracks entering and exiting SVG namespace when descending through the tree.

    if (nodeType === 'svg') isSvg = true;

    if (excessDomChildren != null) {
      for (; i < excessDomChildren.length; i++) {
        var child = excessDomChildren[i]; // if newVNode matches an element in excessDomChildren or the `dom`
        // argument matches an element in excessDomChildren, remove it from
        // excessDomChildren so it isn't later removed in diffChildren

        if (child && (child === dom || (nodeType ? child.localName == nodeType : child.nodeType == 3))) {
          dom = child;
          excessDomChildren[i] = null;
          break;
        }
      }
    }

    if (dom == null) {
      if (nodeType === null) {
        // @ts-ignore createTextNode returns Text, we expect PreactElement
        return document.createTextNode(newProps);
      }

      if (isSvg) {
        dom = document.createElementNS('http://www.w3.org/2000/svg', // @ts-ignore We know `newVNode.type` is a string
        nodeType);
      } else {
        dom = document.createElement( // @ts-ignore We know `newVNode.type` is a string
        nodeType, newProps.is && newProps);
      } // we created a new parent, so none of the previously attached children can be reused:


      excessDomChildren = null; // we are creating a new node, so we can assume this is a new subtree (in case we are hydrating), this deopts the hydrate

      isHydrating = false;
    }

    if (nodeType === null) {
      // During hydration, we still have to split merged text from SSR'd HTML.
      if (oldProps !== newProps && (!isHydrating || dom.data !== newProps)) {
        dom.data = newProps;
      }
    } else {
      // If excessDomChildren was not null, repopulate it with the current element's children:
      excessDomChildren = excessDomChildren && EMPTY_ARR.slice.call(dom.childNodes);
      oldProps = oldVNode.props || EMPTY_OBJ;
      var oldHtml = oldProps.dangerouslySetInnerHTML;
      var newHtml = newProps.dangerouslySetInnerHTML; // During hydration, props are not diffed at all (including dangerouslySetInnerHTML)
      // @TODO we should warn in debug mode when props don't match here.

      if (!isHydrating) {
        // But, if we are in a situation where we are using existing DOM (e.g. replaceNode)
        // we should read the existing DOM attributes to diff them
        if (excessDomChildren != null) {
          oldProps = {}; // NOTE: this is commented, because we need to keep the existing DOM attributes
          // See: https://github.com/preactjs/preact/issues/2449
          // for (let i = 0; i < dom.attributes.length; i++) {
          //	 oldProps[dom.attributes[i].name] = dom.attributes[i].value;
          // }
        }

        if (newHtml || oldHtml) {
          // Avoid re-applying the same '__html' if it did not changed between re-render
          if (!newHtml || (!oldHtml || newHtml.__html != oldHtml.__html) && newHtml.__html !== dom.innerHTML) {
            dom.innerHTML = newHtml && newHtml.__html || '';
          }
        }
      }

      diffProps(dom, newProps, oldProps, isSvg, isHydrating); // If the new vnode didn't have dangerouslySetInnerHTML, diff its children

      if (newHtml) {
        newVNode._children = [];
      } else {
        i = newVNode.props.children;
        diffChildren(dom, Array.isArray(i) ? i : [i], newVNode, oldVNode, globalContext, isSvg && nodeType !== 'foreignObject', excessDomChildren, commitQueue, dom.firstChild, isHydrating); // Remove children that are not part of any vnode.

        if (excessDomChildren != null) {
          for (i = excessDomChildren.length; i--;) {
            if (excessDomChildren[i] != null) removeNode(excessDomChildren[i]);
          }
        }
      } // (as above, don't diff props during hydration)


      if (!isHydrating) {
        if ('value' in newProps && (i = newProps.value) !== undefined && ( // #2756 For the <progress>-element the initial value is 0,
        // despite the attribute not being present. When the attribute
        // is missing the progress bar is treated as indeterminate.
        // To fix that we'll always update it when it is 0 for progress elements
        i !== dom.value || nodeType === 'progress' && !i)) {
          setProperty(dom, 'value', i, oldProps.value, false);
        }

        if ('checked' in newProps && (i = newProps.checked) !== undefined && i !== dom.checked) {
          setProperty(dom, 'checked', i, oldProps.checked, false);
        }
      }
    }

    return dom;
  }
  /**
   * Invoke or update a ref, depending on whether it is a function or object ref.
   * @param {object|function} ref
   * @param {any} value
   * @param {import('../internal').VNode} vnode
   */


  function applyRef(ref, value, vnode) {
    try {
      if (typeof ref == 'function') ref(value);else ref.current = value;
    } catch (e) {
      options$1._catchError(e, vnode);
    }
  }
  /**
   * Unmount a virtual node from the tree and apply DOM changes
   * @param {import('../internal').VNode} vnode The virtual node to unmount
   * @param {import('../internal').VNode} parentVNode The parent of the VNode that
   * initiated the unmount
   * @param {boolean} [skipRemove] Flag that indicates that a parent node of the
   * current element is already detached from the DOM.
   */

  function unmount(vnode, parentVNode, skipRemove) {
    var r;
    if (options$1.unmount) options$1.unmount(vnode);

    if (r = vnode.ref) {
      if (!r.current || r.current === vnode._dom) applyRef(r, null, parentVNode);
    }

    var dom;

    if (!skipRemove && typeof vnode.type != 'function') {
      skipRemove = (dom = vnode._dom) != null;
    } // Must be set to `undefined` to properly clean up `_nextDom`
    // for which `null` is a valid value. See comment in `create-element.js`


    vnode._dom = vnode._nextDom = undefined;

    if ((r = vnode._component) != null) {
      if (r.componentWillUnmount) {
        try {
          r.componentWillUnmount();
        } catch (e) {
          options$1._catchError(e, parentVNode);
        }
      }

      r.base = r._parentDom = null;
    }

    if (r = vnode._children) {
      for (var i = 0; i < r.length; i++) {
        if (r[i]) unmount(r[i], parentVNode, skipRemove);
      }
    }

    if (dom != null) removeNode(dom);
  }
  /** The `.render()` method for a PFC backing instance. */

  function doRender(props, state, context) {
    return this.constructor(props, context);
  }

  /**
   * Render a Preact virtual node into a DOM element
   * @param {import('./internal').ComponentChild} vnode The virtual node to render
   * @param {import('./internal').PreactElement} parentDom The DOM element to
   * render into
   * @param {import('./internal').PreactElement | object} [replaceNode] Optional: Attempt to re-use an
   * existing DOM tree rooted at `replaceNode`
   */

  function render(vnode, parentDom, replaceNode) {
    if (options$1._root) options$1._root(vnode, parentDom); // We abuse the `replaceNode` parameter in `hydrate()` to signal if we are in
    // hydration mode or not by passing the `hydrate` function instead of a DOM
    // element..

    var isHydrating = typeof replaceNode === 'function'; // To be able to support calling `render()` multiple times on the same
    // DOM node, we need to obtain a reference to the previous tree. We do
    // this by assigning a new `_children` property to DOM nodes which points
    // to the last rendered tree. By default this property is not present, which
    // means that we are mounting a new tree for the first time.

    var oldVNode = isHydrating ? null : replaceNode && replaceNode._children || parentDom._children;
    vnode = (!isHydrating && replaceNode || parentDom)._children = createElement(Fragment, null, [vnode]); // List of effects that need to be called after diffing.

    var commitQueue = [];
    diff(parentDom, // Determine the new vnode tree and store it on the DOM element on
    // our custom `_children` property.
    vnode, oldVNode || EMPTY_OBJ, EMPTY_OBJ, parentDom.ownerSVGElement !== undefined, !isHydrating && replaceNode ? [replaceNode] : oldVNode ? null : parentDom.firstChild ? EMPTY_ARR.slice.call(parentDom.childNodes) : null, commitQueue, !isHydrating && replaceNode ? replaceNode : oldVNode ? oldVNode._dom : parentDom.firstChild, isHydrating); // Flush all queued effects

    commitRoot(commitQueue, vnode);
  }

  var i = 0;
  function createContext(defaultValue, contextId) {
    contextId = '__cC' + i++;
    var context = {
      _id: contextId,
      _defaultValue: defaultValue,

      /** @type {import('./internal').FunctionComponent} */
      Consumer: function Consumer(props, contextValue) {
        // return props.children(
        // 	context[contextId] ? context[contextId].props.value : defaultValue
        // );
        return props.children(contextValue);
      },

      /** @type {import('./internal').FunctionComponent} */
      Provider: function Provider(props) {
        if (!this.getChildContext) {
          var subs = [];
          var ctx = {};
          ctx[contextId] = this;

          this.getChildContext = function () {
            return ctx;
          };

          this.shouldComponentUpdate = function (_props) {
            if (this.props.value !== _props.value) {
              // I think the forced value propagation here was only needed when `options.debounceRendering` was being bypassed:
              // https://github.com/preactjs/preact/commit/4d339fb803bea09e9f198abf38ca1bf8ea4b7771#diff-54682ce380935a717e41b8bfc54737f6R358
              // In those cases though, even with the value corrected, we're double-rendering all nodes.
              // It might be better to just tell folks not to use force-sync mode.
              // Currently, using `useContext()` in a class component will overwrite its `this.context` value.
              // subs.some(c => {
              // 	c.context = _props.value;
              // 	enqueueRender(c);
              // });
              // subs.some(c => {
              // 	c.context[contextId] = _props.value;
              // 	enqueueRender(c);
              // });
              subs.some(enqueueRender);
            }
          };

          this.sub = function (c) {
            subs.push(c);
            var old = c.componentWillUnmount;

            c.componentWillUnmount = function () {
              subs.splice(subs.indexOf(c), 1);
              if (old) old.call(c);
            };
          };
        }

        return props.children;
      }
    }; // Devtools needs access to the context object when it
    // encounters a Provider. This is necessary to support
    // setting `displayName` on the context object instead
    // of on the component itself. See:
    // https://reactjs.org/docs/context.html#contextdisplayname

    return context.Provider._contextRef = context.Consumer.contextType = context;
  }

  var PureComponent = /*#__PURE__*/ (function (_super) {
      __extends(PureComponent, _super);
      function PureComponent() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      PureComponent.prototype.render = function () {
          return;
      };
      PureComponent.prototype.shouldComponentUpdate = function (props, state) {
          return shallowDiffers(props, this.props) || shallowDiffers(state, this.state);
      };
      return PureComponent;
  }(Component));
  function shallowDiffers(a, b) {
      for (var key in a) {
          if (a[key] !== b[key]) {
              return true;
          }
      }
      for (var key in b) {
          if (!(key in a)) {
              return true;
          }
      }
      return false;
  }

  var ON_ANIMATION_END = 'onAnimationEnd';
  var ON_CONTEXT_MENU = 'onContextMenu';
  var ON_KEY_DOWN = 'onKeyDown';
  var ON_MOUSE_DOWN = 'onMouseDown';
  options$1.vnode = function (vnode) {
      var props = vnode.props;
      var normalizedProps = {};
      // Only check props on Element nodes
      if (isString(vnode.type)) {
          // tslint:disable-next-line: forin
          for (var i in props) {
              var value = props[i];
              // Alter preact behavior to modify onAnimationEnd to onanimationend,
              // to make it work on older Edge versions.
              if (/^onAni/.test(i)) {
                  i = i.toLowerCase();
              }
              else if (/ondoubleclick/i.test(i)) {
                  i = 'ondblclick';
              }
              normalizedProps[i] = value;
          }
          vnode.props = normalizedProps;
      }
  };
  var components = {};
  var guid = 0;
  function initComponents(target, selector, Component, renderOptions, opt) {
      if (matches(target, selector)) {
          if (!target.__mbscFormInst) {
              createComponent(Component, target, opt, renderOptions, true);
          }
      }
      else {
          var elements = target.querySelectorAll(selector);
          forEach(elements, function (elm) {
              if (!elm.__mbscFormInst) {
                  createComponent(Component, elm, opt, renderOptions, true);
              }
          });
      }
  }
  /**
   * Creates and renders a Preact component for/inside the specified element.
   * @param Component The component which needs to be created.
   * @param elm The element for which the component is needed.
   * @param initOpt Init options for the component.
   * @param renderOptions Render options for the component.
   */
  function createComponent(Component, elm, initOpt, renderOptions, formControl) {
      var _a;
      var inst;
      var children = [];
      var allChildren = [];
      var slotElms = {};
      var renderOpt = renderOptions || {};
      var replaceNode = renderOpt.renderToParent ? elm.parentNode : elm;
      var renderTo = replaceNode.parentNode;
      var childrenNode = renderOpt.useOwnChildren ? elm : replaceNode;
      var elmClass = elm.getAttribute('class');
      var value = elm.value;
      var opt = __assign({ className: replaceNode.getAttribute('class') }, elm.dataset, initOpt, { ref: function (c) {
              inst = c;
          } });
      if (renderOpt.readProps) {
          renderOpt.readProps.forEach(function (prop) {
              var v = elm[prop];
              if (v !== UNDEFINED) {
                  opt[prop] = v;
              }
          });
      }
      if (renderOpt.readAttrs) {
          renderOpt.readAttrs.forEach(function (prop) {
              var v = elm.getAttribute(prop);
              if (v !== null) {
                  opt[prop] = v;
              }
          });
      }
      var slots = renderOpt.slots;
      if (slots) {
          for (var _i = 0, _b = Object.keys(slots); _i < _b.length; _i++) {
              var key = _b[_i];
              var slot = slots[key];
              var slotElm = replaceNode.querySelector('[mbsc-' + slot + ']');
              if (slotElm) {
                  slotElms[key] = slotElm;
                  slotElm.parentNode.removeChild(slotElm);
                  // Create a virtual node placeholder element
                  opt[key] = createElement('span', { className: 'mbsc-slot-' + slot });
              }
          }
      }
      if (renderOpt.hasChildren) {
          // Remove existing children
          forEach(childrenNode.childNodes, function (child) {
              if (child !== elm && child.nodeType !== 8 && (child.nodeType !== 3 || (child.nodeType === 3 && /\S/.test(child.nodeValue)))) {
                  children.push(child);
              }
              allChildren.push(child);
          });
          forEach(children, function (child) {
              childrenNode.removeChild(child);
          });
          if (children.length) {
              opt.hasChildren = true;
              // opt.children = createElement('span', { className: 'mbsc-slot-children' });
          }
      }
      // Generate an id for the element, if there's none
      if (!elm.id) {
          elm.id = 'mbsc-control-' + guid++;
      }
      if (renderOpt.before) {
          renderOpt.before(elm, opt, children);
      }
      // Render the element
      render(createElement(Component, opt), renderTo, replaceNode);
      if (elmClass && renderOpt.renderToParent) {
          (_a = elm.classList).add.apply(_a, elmClass
              .replace(/^\s+|\s+$/g, '')
              .replace(/\s+|^\s|\s$/g, ' ')
              .split(' '));
      }
      if (renderOpt.hasChildren) {
          var selector = '.' + renderOpt.parentClass;
          var placeholder_1 = matches(replaceNode, selector) ? replaceNode : replaceNode.querySelector(selector);
          // const placeholder = replaceNode.querySelector('.mbsc-slot-children');
          // Add back existing children
          if (placeholder_1) {
              forEach(children, function (child) {
                  placeholder_1.appendChild(child);
              });
          }
      }
      if (renderOpt.hasValue) {
          elm.value = value;
      }
      if (slots) {
          var _loop_1 = function (key) {
              var slot = slots[key];
              var slotElm = slotElms[key];
              var placeholders = replaceNode.querySelectorAll('.mbsc-slot-' + slot);
              forEach(placeholders, function (placeholder, i) {
                  var child = i > 0 ? slotElm.cloneNode(true) : slotElm;
                  placeholder.appendChild(child);
              });
          };
          for (var _c = 0, _d = Object.keys(slotElms); _c < _d.length; _c++) {
              var key = _d[_c];
              _loop_1(key);
          }
      }
      // Create a destroy function
      inst.destroy = function () {
          var parent = replaceNode.parentNode;
          var placeholder = doc.createComment('');
          parent.insertBefore(placeholder, replaceNode);
          render(null, replaceNode);
          delete elm.__mbscInst;
          delete elm.__mbscFormInst;
          replaceNode.innerHTML = '';
          // Restore css class
          replaceNode.setAttribute('class', opt.className);
          // Put back the original element
          parent.replaceChild(replaceNode, placeholder);
          // Restore children and slots
          if (renderOpt.hasChildren) {
              // Add back existing children
              forEach(allChildren, function (child) {
                  childrenNode.appendChild(child);
              });
          }
          // Restore css class on the element
          if (renderOpt.renderToParent) {
              elm.setAttribute('class', elmClass || '');
          }
      };
      // Store the instance on the element
      if (formControl) {
          if (!elm.__mbscInst) {
              elm.__mbscInst = inst;
          }
          elm.__mbscFormInst = inst;
      }
      else {
          elm.__mbscInst = inst;
      }
      return inst;
  }
  function getInst(elm, formControl) {
      return formControl ? elm.__mbscFormInst : elm.__mbscInst;
  }
  function registerComponent(Component) {
      components[Component._name] = Component;
  }
  /**
   * Will auto-init the registered components inside the provided element.
   * @param elm The element in which the components should be enhanced.
   */
  function enhance(elm, opt) {
      if (elm) {
          for (var _i = 0, _a = Object.keys(components); _i < _a.length; _i++) {
              var name_1 = _a[_i];
              var Component = components[name_1];
              var selector = Component._selector;
              var renderOpt = Component._renderOpt;
              initComponents(elm, selector, Component, renderOpt, opt);
          }
      }
  }

  function createComponentFactory(Component, renderOptions) {
      return function (selector, options) {
          var ret = {};
          if (isString(selector)) {
              var elements = doc.querySelectorAll(selector);
              var first_1;
              forEach(elements, function (elm) {
                  var inst = createComponent(Component, elm, options, renderOptions);
                  ret[elm.id] = inst;
                  if (!first_1) {
                      first_1 = inst;
                  }
              });
              return elements.length === 1 ? first_1 : ret;
          }
          else {
              return createComponent(Component, selector, options, renderOptions);
          }
      };
  }
  if (isBrowser) {
      doc.addEventListener('DOMContentLoaded', function () {
          enhance(doc);
      });
      doc.addEventListener('mbsc-enhance', function (ev) {
          enhance(ev.target);
      });
  }

  // Arabic
  function intPart(floatNum) {
      if (floatNum < -0.0000001) {
          return Math.ceil(floatNum - 0.0000001);
      }
      return Math.floor(floatNum + 0.0000001);
  }
  function hijriToGregorian(hY, hM, hD) {
      var l;
      var j;
      var n;
      var i;
      var k;
      var gregDate = new Array(3);
      var jd = intPart((11 * hY + 3) / 30) + 354 * hY + 30 * hM - intPart((hM - 1) / 2) + hD + 1948440 - 385;
      if (jd > 2299160) {
          l = jd + 68569;
          n = intPart((4 * l) / 146097);
          l = l - intPart((146097 * n + 3) / 4);
          i = intPart((4000 * (l + 1)) / 1461001);
          l = l - intPart((1461 * i) / 4) + 31;
          j = intPart((80 * l) / 2447);
          hD = l - intPart((2447 * j) / 80);
          l = intPart(j / 11);
          hM = j + 2 - 12 * l;
          hY = 100 * (n - 49) + i + l;
      }
      else {
          j = jd + 1402;
          k = intPart((j - 1) / 1461);
          l = j - 1461 * k;
          n = intPart((l - 1) / 365) - intPart(l / 1461);
          i = l - 365 * n + 30;
          j = intPart((80 * i) / 2447);
          hD = i - intPart((2447 * j) / 80);
          i = intPart(j / 11);
          hM = j + 2 - 12 * i;
          hY = 4 * k + n + i - 4716;
      }
      gregDate[2] = hD;
      gregDate[1] = hM;
      gregDate[0] = hY;
      return gregDate;
  }
  function gregorianToHijri(gY, gM, gD) {
      var jd;
      var l;
      var hijriDate = [0, 0, 0];
      if (gY > 1582 || (gY === 1582 && gM > 10) || (gY === 1582 && gM === 10 && gD > 14)) {
          jd =
              intPart((1461 * (gY + 4800 + intPart((gM - 14) / 12))) / 4) +
                  intPart((367 * (gM - 2 - 12 * intPart((gM - 14) / 12))) / 12) -
                  intPart((3 * intPart((gY + 4900 + intPart((gM - 14) / 12)) / 100)) / 4) +
                  gD -
                  32075;
      }
      else {
          jd = 367 * gY - intPart((7 * (gY + 5001 + intPart((gM - 9) / 7))) / 4) + intPart((275 * gM) / 9) + gD + 1729777;
      }
      l = jd - 1948440 + 10632;
      var n = intPart((l - 1) / 10631);
      l = l - 10631 * n + 354;
      var j = intPart((10985 - l) / 5316) * intPart((50 * l) / 17719) + intPart(l / 5670) * intPart((43 * l) / 15238);
      l = l - intPart((30 - j) / 15) * intPart((17719 * j) / 50) - intPart(j / 16) * intPart((15238 * j) / 43) + 29;
      gM = intPart((24 * l) / 709);
      gD = l - intPart((709 * gM) / 24);
      gY = 30 * n + j - 30;
      hijriDate[2] = gD;
      hijriDate[1] = gM;
      hijriDate[0] = gY;
      return hijriDate;
  }
  /** @hidden */
  var hijriCalendar = {
      getYear: function (date) {
          return gregorianToHijri(date.getFullYear(), date.getMonth() + 1, date.getDate())[0];
      },
      getMonth: function (date) {
          return --gregorianToHijri(date.getFullYear(), date.getMonth() + 1, date.getDate())[1];
      },
      getDay: function (date) {
          return gregorianToHijri(date.getFullYear(), date.getMonth() + 1, date.getDate())[2];
      },
      getDate: function (y, m, d, h, i, s, u) {
          if (m < 0) {
              y += Math.floor(m / 12);
              m = m % 12 ? 12 + (m % 12) : 0;
          }
          if (m > 11) {
              y += Math.floor(m / 12);
              m = m % 12;
          }
          var gregorianDate = hijriToGregorian(y, +m + 1, d);
          return new Date(gregorianDate[0], gregorianDate[1] - 1, gregorianDate[2], h || 0, i || 0, s || 0, u || 0);
      },
      getMaxDayOfMonth: function (hY, hM) {
          if (hM < 0) {
              hY += Math.floor(hM / 12);
              hM = hM % 12 ? 12 + (hM % 12) : 0;
          }
          if (hM > 11) {
              hY += Math.floor(hM / 12);
              hM = hM % 12;
          }
          var daysPerMonth = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
          var leapYear = (hY * 11 + 14) % 30 < 11;
          return daysPerMonth[hM] + (hM === 11 && leapYear ? 1 : 0);
      },
  };

  // فارسی
  var gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  function jalaliToGregorian(jY, jM, jD) {
      var i;
      var jy = jY - 979;
      var jm = jM - 1;
      var jd = jD - 1;
      var jDayNo = 365 * jy + floor(jy / 33) * 8 + floor(((jy % 33) + 3) / 4);
      for (i = 0; i < jm; ++i) {
          jDayNo += jDaysInMonth[i];
      }
      jDayNo += jd;
      var gDayNo = jDayNo + 79;
      var gy = 1600 + 400 * floor(gDayNo / 146097);
      gDayNo = gDayNo % 146097;
      var leap = true;
      if (gDayNo >= 36525) {
          gDayNo--;
          gy += 100 * floor(gDayNo / 36524);
          gDayNo = gDayNo % 36524;
          if (gDayNo >= 365) {
              gDayNo++;
          }
          else {
              leap = false;
          }
      }
      gy += 4 * floor(gDayNo / 1461);
      gDayNo %= 1461;
      if (gDayNo >= 366) {
          leap = false;
          gDayNo--;
          gy += floor(gDayNo / 365);
          gDayNo = gDayNo % 365;
      }
      for (i = 0; gDayNo >= gDaysInMonth[i] + (i === 1 && leap ? 1 : 0); i++) {
          gDayNo -= gDaysInMonth[i] + (i === 1 && leap ? 1 : 0);
      }
      var gm = i + 1;
      var gd = gDayNo + 1;
      return [gy, gm, gd];
  }
  function checkDate(jY, jM, jD) {
      return !(jY < 0 ||
          jY > 32767 ||
          jM < 1 ||
          jM > 12 ||
          jD < 1 ||
          jD > jDaysInMonth[jM - 1] + (jM === 12 && ((jY - 979) % 33) % 4 === 0 ? 1 : 0));
  }
  function gregorianToJalali(gY, gM, gD) {
      var i;
      var gy = gY - 1600;
      var gm = gM - 1;
      var gd = gD - 1;
      var gDayNo = 365 * gy + floor((gy + 3) / 4) - floor((gy + 99) / 100) + floor((gy + 399) / 400);
      for (i = 0; i < gm; ++i) {
          gDayNo += gDaysInMonth[i];
      }
      if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) {
          ++gDayNo;
      }
      gDayNo += gd;
      var jDayNo = gDayNo - 79;
      var jNp = floor(jDayNo / 12053);
      jDayNo %= 12053;
      var jy = 979 + 33 * jNp + 4 * floor(jDayNo / 1461);
      jDayNo %= 1461;
      if (jDayNo >= 366) {
          jy += floor((jDayNo - 1) / 365);
          jDayNo = (jDayNo - 1) % 365;
      }
      for (i = 0; i < 11 && jDayNo >= jDaysInMonth[i]; ++i) {
          jDayNo -= jDaysInMonth[i];
      }
      var jm = i + 1;
      var jd = jDayNo + 1;
      return [jy, jm, jd];
  }
  /** @hidden */
  var jalaliCalendar = {
      getYear: function (date) {
          return gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())[0];
      },
      getMonth: function (date) {
          return --gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())[1];
      },
      getDay: function (date) {
          return gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())[2];
      },
      getDate: function (y, m, d, h, i, s, u) {
          if (m < 0) {
              y += floor(m / 12);
              m = m % 12 ? 12 + (m % 12) : 0;
          }
          if (m > 11) {
              y += floor(m / 12);
              m = m % 12;
          }
          var gregorianDate = jalaliToGregorian(y, +m + 1, d);
          return new Date(gregorianDate[0], gregorianDate[1] - 1, gregorianDate[2], h || 0, i || 0, s || 0, u || 0);
      },
      getMaxDayOfMonth: function (y, m) {
          var maxdays = 31;
          if (m < 0) {
              y += floor(m / 12);
              m = m % 12 ? 12 + (m % 12) : 0;
          }
          if (m > 11) {
              y += floor(m / 12);
              m = m % 12;
          }
          while (!checkDate(y, m + 1, maxdays) && maxdays > 29) {
              maxdays--;
          }
          return maxdays;
      },
  };

  // ar import localeAr from '../i18n/ar';
  // bg import localeBg from '../i18n/bg';
  // ca import localeCa from '../i18n/ca';
  // cs import localeCs from '../i18n/cs';
  // da import localeDa from '../i18n/da';
  // de import localeDe from '../i18n/de';
  // el import localeEl from '../i18n/el';
  // engb import localeEnGB from '../i18n/en-GB';
  // es import localeEs from '../i18n/es';
  // fa import localeFa from '../i18n/fa';
  // fi import localeFi from '../i18n/fi';
  // fr import localeFr from '../i18n/fr';
  // he import localeHe from '../i18n/he';
  // hi import localeHi from '../i18n/hi';
  // hr import localeHr from '../i18n/hr';
  // hu import localeHu from '../i18n/hu';
  // it import localeIt from '../i18n/it';
  // ja import localeJa from '../i18n/ja';
  // ko import localeKo from '../i18n/ko';
  // lt import localeLt from '../i18n/lt';
  // nl import localeNl from '../i18n/nl';
  // no import localeNo from '../i18n/no';
  // pl import localePl from '../i18n/pl';
  // ptbr import localePtBR from '../i18n/pt-BR';
  // ptpt import localePtPT from '../i18n/pt-PT';
  // ro import localeRo from '../i18n/ro';
  // ru import localeRu from '../i18n/ru';
  // ruua import localeRuUA from '../i18n/ru-UA';
  // sk import localeSk from '../i18n/sk';
  // sr import localeSr from '../i18n/sr';
  // sv import localeSv from '../i18n/sv';
  // th import localeTh from '../i18n/th';
  // tr import localeTr from '../i18n/tr';
  // ua import localeUa from '../i18n/ua';
  // vi import localeVi from '../i18n/vi';
  // zh import localeZh from '../i18n/zh';




  var localeEn = {};



  var locale = {

  // ar   ar: localeAr,
  // bg   bg: localeBg,
  // ca   ca: localeCa,
  // cs   cs: localeCs,
  // da   da: localeDa,
  // de   de: localeDe,
  // el   el: localeEl,
    en: localeEn,
  // engb   'en-GB': localeEnGB,
  // es   es: localeEs,
  // fa   fa: localeFa,
  // fi   fi: localeFi,
  // fr   fr: localeFr,
  // he   he: localeHe,
  // hi   hi: localeHi,
  // hr   hr: localeHr,
  // hu   hu: localeHu,
  // it   it: localeIt,
  // ja   ja: localeJa,
  // ko   ko: localeKo,
  // lt   lt: localeLt,
  // nl   nl: localeNl,
  // no   no: localeNo,
  // pl   pl: localePl,
  // ptbr   'pt-BR': localePtBR,
  // ptpt   'pt-PT': localePtPT,
  // ro   ro: localeRo,
  // ru   ru: localeRu,
  // ruua   'ru-UA': localeRuUA,
  // sk   sk: localeSk,
  // sr   sr: localeSr,
  // sv   sv: localeSv,
  // th   th: localeTh,
  // tr   tr: localeTr,
  // ua   ua: localeUa,
  // vi   vi: localeVi,
  // zh   zh: localeZh,
  };

  // tslint:disable no-non-null-assertion
  // TODO: Add types and descriptions
  var REF_DATE = new Date(1970, 0, 1);
  var ONE_MIN = 60000;
  var ONE_HOUR = 60 * ONE_MIN;
  var ONE_DAY = 24 * ONE_HOUR;
  /**
   * Returns if a date object is a pseudo-date object
   * Pseudo-date objects are our implementation of a Date interface
   */
  function isMBSCDate(d) {
      return !!d._mbsc;
  }
  /**
   * Returns an ISO8601 date string in data timezone, if it's a timezoned date, otherwise the original date.
   * @param d The date to check.
   * @param s Options object containing timezone options.
   */
  function convertTimezone(d, s) {
      var timezone = s.dataTimezone || s.displayTimezone;
      var timezonePlugin = s.timezonePlugin;
      if (timezone && timezonePlugin && isMBSCDate(d)) {
          var clone = d.clone();
          clone.setTimezone(timezone);
          return clone.toISOString();
      }
      return d;
  }
  /** @hidden */
  var dateTimeLocale = {
      amText: 'am',
      dateFormat: 'MM/DD/YYYY',
      dateFormatLong: 'D DDD MMM YYYY',
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      daySuffix: '',
      firstDay: 0,
      fromText: 'Start',
      getDate: adjustedDate,
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      monthSuffix: '',
      pmText: 'pm',
      separator: ' ',
      shortYearCutoff: '+10',
      timeFormat: 'h:mm A',
      toText: 'End',
      todayText: 'Today',
      weekText: 'Week {count}',
      yearSuffix: '',
      getMonth: function (d) {
          return d.getMonth();
      },
      getDay: function (d) {
          return d.getDate();
      },
      getYear: function (d) {
          return d.getFullYear();
      },
      getMaxDayOfMonth: function (y, m) {
          return 32 - new Date(y, m, 32, 12).getDate();
      },
      getWeekNumber: function (dt) {
          // Copy date so don't modify original
          var d = new Date(+dt);
          d.setHours(0, 0, 0);
          // Set to nearest Thursday: current date + 4 - current day number
          // Make Sunday's day number 7
          d.setDate(d.getDate() + 4 - (d.getDay() || 7));
          // Get first day of year
          var yearStart = new Date(d.getFullYear(), 0, 1);
          // Calculate full weeks to nearest Thursday
          return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      },
  };
  // tslint:disable-next-line max-line-length
  var ISO_8601_FULL = /^(\d{4}|[+-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[T\s](\d{2}):?(\d{2})(?::?(\d{2})(?:\.(\d{3}))?)?((Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/;
  var ISO_8601_TIME = /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/;
  /** @hidden */
  function setISOParts(parsed, offset, parts) {
      var part;
      var v;
      var p = { y: 1, m: 2, d: 3, h: 4, i: 5, s: 6, u: 7, tz: 8 };
      if (parts) {
          for (var _i = 0, _a = Object.keys(p); _i < _a.length; _i++) {
              part = _a[_i];
              v = parsed[p[part] - offset];
              if (v) {
                  parts[part] = part === 'tz' ? v : 1;
              }
          }
      }
  }
  /** @hidden */
  function getISOString(d, parts) {
      var ret = '';
      var time = '';
      if (d) {
          if (parts.h) {
              time += pad(d.getHours()) + ':' + pad(d.getMinutes());
              if (parts.s) {
                  time += ':' + pad(d.getSeconds());
              }
              if (parts.u) {
                  time += '.' + pad(d.getMilliseconds(), 3);
              }
              if (parts.tz) {
                  time += parts.tz; // Just put what we got
              }
          }
          if (parts.y) {
              ret += d.getFullYear();
              if (parts.m) {
                  ret += '-' + pad(d.getMonth() + 1);
                  if (parts.d) {
                      ret += '-' + pad(d.getDate());
                  }
                  if (parts.h) {
                      ret += 'T' + time;
                  }
              }
          }
          else if (parts.h) {
              ret = time;
          }
      }
      return ret;
  }
  /**
   * Returns the starting point of a day in display timezone
   * @param s
   * @param d
   * @returns
   */
  function getDayStart(s, d) {
      var newDate = createDate(s, d);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
  }
  /**
   * Returns the last point of a day in display timezone
   * @param s
   * @param d
   * @returns
   */
  function getDayEnd(s, d) {
      var newDate = createDate(s, d);
      newDate.setHours(23, 59, 59, 999);
      return newDate;
  }
  /** @hidden */
  function getEndDate(s, allDay, start, end, isList) {
      var exclusive = allDay || isList ? s.exclusiveEndDates : true;
      var tzOpt = allDay ? UNDEFINED : s;
      return exclusive && start && end && start < end ? createDate(tzOpt, +end - 1) : end;
  }
  /** @hidden */
  function getDateStr(d) {
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  /** @hidden */
  function getDateOnly(d, nativeDate) {
      if (isMBSCDate(d) && !nativeDate) {
          return d.createDate(d.getFullYear(), d.getMonth(), d.getDate());
      }
      else {
          return adjustedDate(d.getFullYear(), d.getMonth(), d.getDate());
      }
  }
  /** @hidden */
  function getUTCDateOnly(d) {
      return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  }
  /**
   * Returns the difference in days for two dates
   * @hidden
   * @param d1 First date
   * @param d2 Second date
   * @returns Difference in days
   */
  function getDayDiff(d1, d2) {
      return round((getUTCDateOnly(d2) - getUTCDateOnly(d1)) / ONE_DAY);
  }
  /**
   * Returns the date of the first day of the week for a given date
   * @hidden
   */
  function getFirstDayOfWeek(d, s, w) {
      var y = d.getFullYear(); // s.getYear(d);
      var m = d.getMonth(); // s.getMonth(d);
      var weekDay = d.getDay();
      var firstWeekDay = w === UNDEFINED ? s.firstDay : w;
      var offset = firstWeekDay - weekDay > 0 ? 7 : 0;
      return new Date(y, m, firstWeekDay - offset - weekDay + d.getDate());
  }
  /**
   * Checks if two dates are on the same date
   * @hidden
   * @param d1 First date
   * @param d2 Second date
   * @returns True or false
   */
  function isSameDay(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }
  /**
   * Check if 2 dates are in the same month (depends on the calendar system).
   * @param d1 First date.
   * @param d2 Second date.
   * @param s Settings containing the calendar system functions.
   */
  function isSameMonth(d1, d2, s) {
      return s.getYear(d1) === s.getYear(d2) && s.getMonth(d1) === s.getMonth(d2);
  }
  /** @hidden */
  function adjustedDate(y, m, d, h, i, s, u) {
      var date = new Date(y, m, d, h || 0, i || 0, s || 0, u || 0);
      if (date.getHours() === 23 && (h || 0) === 0) {
          date.setHours(date.getHours() + 2);
      }
      return date;
  }
  function isDate(d) {
      return d.getTime;
  }
  /**
   * When timezoneplugin is specified, return a date with the same parts as the passed date (year, month, day, hour)
   * only with a timezone specified to display timezone
   * Otherwise it returns the same thing in the local timezone
   * @param s Settings object
   * @param d Date object
   * @returns
   */
  function addTimezone(s, d) {
      return createDate(s, d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
  }
  /**
   * Returns a local date with the same year/monthday/hours/minutes... as the original date in the parameter
   * It does not convert to any timezone, it just takes the date/hour/minute and creates a new local date from that
   * @param d Date with or without timezone data or null/undefined
   * @returns A new local Date object or undefined/null when nothing is pass as param
   */
  function removeTimezone(d) {
      if (!d) {
          return d;
      }
      else {
          return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
      }
  }
  function createDate(s, yearOrStamp, month, date, h, min, sec, ms) {
      if (yearOrStamp === null) {
          return null;
      }
      if (yearOrStamp && (isNumber(yearOrStamp) || isString(yearOrStamp)) && isUndefined(month)) {
          return makeDate(yearOrStamp, s);
      }
      if (s && s.timezonePlugin) {
          return s.timezonePlugin.createDate(s, yearOrStamp, month, date, h, min, sec, ms);
      }
      if (isObject(yearOrStamp)) {
          return new Date(yearOrStamp);
      }
      if (isUndefined(yearOrStamp)) {
          return new Date();
      }
      return new Date(yearOrStamp, month || 0, date || 1, h || 0, min || 0, sec || 0, ms || 0);
  }
  /** @hidden */
  // this should return a Date type or null, but it's fucking hard to make this work, so I give up
  // re: nice comment, but tslint gave an error about the line lenght, so I moved it above the function (@dioslaska).
  function makeDate(d, s, format, parts, skipTimezone) {
      var parse;
      if (isString(d)) {
          d = d.trim();
      }
      if (!d) {
          return null;
      }
      var plugin = s && s.timezonePlugin;
      if (plugin && !skipTimezone) {
          var parsedDate = isMBSCDate(d) ? d : plugin.parse(d, s);
          parsedDate.setTimezone(s.displayTimezone);
          return parsedDate;
      }
      // If already date object
      if (isDate(d)) {
          return d;
      }
      // Moment object
      if (d._isAMomentObject) {
          return d.toDate();
      }
      // timestamp
      if (isNumber(d)) {
          return new Date(d);
      }
      parse = ISO_8601_TIME.exec(d);
      // If ISO 8601 time string
      if (parse) {
          setISOParts(parse, 2, parts);
          return new Date(1970, 0, 1, parse[2] ? +parse[2] : 0, parse[3] ? +parse[3] : 0, parse[4] ? +parse[4] : 0, parse[5] ? +parse[5] : 0);
      }
      parse = ISO_8601_FULL.exec(d);
      // If ISO 8601 date string
      if (parse) {
          setISOParts(parse, 0, parts);
          return new Date(parse[1] ? +parse[1] : 1970, parse[2] ? parse[2] - 1 : 0, parse[3] ? +parse[3] : 1, parse[4] ? +parse[4] : 0, parse[5] ? +parse[5] : 0, parse[6] ? +parse[6] : 0, parse[7] ? +parse[7] : 0);
      }
      // Parse date based on format
      return parseDate(format, d, s);
  }
  /** @hidden */
  function returnDate(d, s, displayFormat, isoParts, hasTimePart) {
      var moment = (isBrowser && window.moment) || s.moment;
      var timezone = s.timezonePlugin && (s.dataTimezone || s.displayTimezone);
      var format = timezone ? 'iso8601' : s.returnFormat;
      if (timezone && hasTimePart) {
          return convertTimezone(d, s);
      }
      if (d) {
          if (format === 'moment' && moment) {
              return moment(d);
          }
          if (format === 'locale') {
              return formatDate(displayFormat, d, s);
          }
          if (format === 'iso8601') {
              return getISOString(d, isoParts);
          }
      }
      return d;
  }
  /**
   * Format a date into a string value with a specified format.
   * @param {string} format - Output format.
   * @param {Date} date - Date to format.
   * @param {IDatetimeProps} options - Locale options.
   * @returns {string} The formatted date string.
   */
  function formatDatePublic(format, date, options$1) {
      var s = __assign({}, dateTimeLocale, options.locale, options$1);
      return formatDate(format, date, s);
  }
  /**
   * Format a date into a string value with a specified format.
   * This is for inner usage, and it's faster than the one above, because it skips the option merge.
   * @param {string} format - Output format.
   * @param {Date} date - Date to format.
   * @param {IDatetimeProps} options - Locale options.
   * @returns {string} The formatted date string.
   */
  function formatDate(format, date, s) {
      // if (!date) {
      //   return null;
      // }
      var i;
      var year;
      var output = '';
      var literal = false;
      var c;
      // Counts how many times a symbol is repeated (0 if not repeated, 1 if its doubled, etc...)
      var peekAhead = function (symbol) {
          var nr = 0;
          var j = i;
          while (j + 1 < format.length && format.charAt(j + 1) === symbol) {
              nr++;
              j++;
          }
          return nr;
      };
      // Check whether a format character is doubled
      var lookAhead = function (symbol) {
          var nr = peekAhead(symbol);
          i += nr;
          return nr;
      };
      // Format a number, with leading zero if necessary
      var formatNumber = function (symbol, val, len) {
          var ret = '' + val;
          if (lookAhead(symbol)) {
              while (ret.length < len) {
                  ret = '0' + ret;
              }
          }
          return ret;
      };
      // Format a name, short or long as requested
      var formatName = function (symbol, val, short, long) {
          return lookAhead(symbol) === 3 ? long[val] : short[val];
      };
      for (i = 0; i < format.length; i++) {
          if (literal) {
              if (format.charAt(i) === "'" && !lookAhead("'")) {
                  literal = false;
              }
              else {
                  output += format.charAt(i);
              }
          }
          else {
              switch (format.charAt(i)) {
                  case 'D':
                      c = peekAhead('D');
                      if (c > 1) {
                          output += formatName('D', date.getDay(), s.dayNamesShort, s.dayNames);
                      }
                      else {
                          output += formatNumber('D', s.getDay(date), 2);
                      }
                      break;
                  case 'M':
                      c = peekAhead('M');
                      if (c > 1) {
                          output += formatName('M', s.getMonth(date), s.monthNamesShort, s.monthNames);
                      }
                      else {
                          output += formatNumber('M', s.getMonth(date) + 1, 2);
                      }
                      break;
                  case 'Y':
                      year = s.getYear(date);
                      output += lookAhead('Y') === 3 ? year : (year % 100 < 10 ? '0' : '') + (year % 100);
                      break;
                  case 'h': {
                      var h = date.getHours();
                      output += formatNumber('h', h > 12 ? h - 12 : h === 0 ? 12 : h, 2);
                      break;
                  }
                  case 'H':
                      output += formatNumber('H', date.getHours(), 2);
                      break;
                  case 'm':
                      output += formatNumber('m', date.getMinutes(), 2);
                      break;
                  case 's':
                      output += formatNumber('s', date.getSeconds(), 2);
                      break;
                  case 'a':
                      output += date.getHours() > 11 ? s.pmText : s.amText;
                      break;
                  case 'A':
                      output += date.getHours() > 11 ? s.pmText.toUpperCase() : s.amText.toUpperCase();
                      break;
                  case "'":
                      if (lookAhead("'")) {
                          output += "'";
                      }
                      else {
                          literal = true;
                      }
                      break;
                  default:
                      output += format.charAt(i);
              }
          }
      }
      return output;
  }
  /**
   * Extract a date from a string value with a specified format.
   * @param {string} format Input format.
   * @param {string} value String to parse.
   * @param {IDatetimeProps} options Locale options
   * @return {Date} Returns the extracted date or defaults to now if no format or no value is given
   */
  function parseDate(format, value, options) {
      var s = __assign({}, dateTimeLocale, options);
      var def = makeDate(s.defaultValue || new Date());
      if (!value) {
          return def;
      }
      if (!format) {
          format = s.dateFormat + s.separator + s.timeFormat;
      }
      var shortYearCutoff = s.shortYearCutoff;
      var year = s.getYear(def);
      var month = s.getMonth(def) + 1;
      // let doy = -1,
      var day = s.getDay(def);
      var hours = def.getHours();
      var minutes = def.getMinutes();
      var seconds = 0; // def.getSeconds()
      var ampm = -1;
      var literal = false;
      var iValue = 0;
      var iFormat;
      /**
       * Counts how many times a symbol is repeated (0 if not repeated, 1 if its doubled, etc...)
       * without moving the index forward
       */
      var peekAhead = function (symbol) {
          var nr = 0;
          var j = iFormat;
          while (j + 1 < format.length && format.charAt(j + 1) === symbol) {
              nr++;
              j++;
          }
          return nr;
      };
      /**
       * Check whether a format character is doubled
       * Check how many times a format character is repeated. Also move the index forward.
       */
      var lookAhead = function (match) {
          var matches = peekAhead(match);
          iFormat += matches;
          return matches;
      };
      /**
       * Extract a number from the string value
       * @param {string} match The current symbol in the format string
       * @returns {number} The extracted number
       */
      var getNumber = function (match) {
          var count = lookAhead(match);
          // const size = count === 3 ? 4 : 2; // size is either 4 digit (year) or a maximum 2 digit number
          var size = count >= 2 ? 4 : 2;
          var digits = new RegExp('^\\d{1,' + size + '}');
          var num = value.substr(iValue).match(digits);
          if (!num) {
              return 0;
          }
          iValue += num[0].length;
          return parseInt(num[0], 10);
      };
      /**
       * Extracts a name from the string value and converts to an index
       * @param {string} match The symbol we are looking at in the format string
       * @param {Array<string>} shortNames Short names array
       * @param {Array<string>} longNames Long names array
       * @returns {number} Returns the index + 1 of the name in the names array if found, 0 otherwise
       */
      var getName = function (match, shortNames, longNames) {
          var count = lookAhead(match);
          var names = count === 3 ? longNames : shortNames;
          for (var i = 0; i < names.length; i++) {
              if (value.substr(iValue, names[i].length).toLowerCase() === names[i].toLowerCase()) {
                  iValue += names[i].length;
                  return i + 1;
              }
          }
          return 0;
      };
      var checkLiteral = function () {
          iValue++;
      };
      for (iFormat = 0; iFormat < format.length; iFormat++) {
          if (literal) {
              if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                  literal = false;
              }
              else {
                  checkLiteral();
              }
          }
          else {
              switch (format.charAt(iFormat)) {
                  case 'Y':
                      year = getNumber('Y');
                      break;
                  case 'M': {
                      var p = peekAhead('M');
                      if (p < 2) {
                          month = getNumber('M');
                      }
                      else {
                          month = getName('M', s.monthNamesShort, s.monthNames);
                      }
                      break;
                  }
                  case 'D': {
                      var p = peekAhead('D');
                      if (p < 2) {
                          day = getNumber('D');
                      }
                      else {
                          getName('D', s.dayNamesShort, s.dayNames);
                      }
                      break;
                  }
                  case 'H':
                      hours = getNumber('H');
                      break;
                  case 'h':
                      hours = getNumber('h');
                      break;
                  case 'm':
                      minutes = getNumber('m');
                      break;
                  case 's':
                      seconds = getNumber('s');
                      break;
                  case 'a':
                      ampm = getName('a', [s.amText, s.pmText], [s.amText, s.pmText]) - 1;
                      break;
                  case 'A':
                      ampm = getName('A', [s.amText, s.pmText], [s.amText, s.pmText]) - 1;
                      break;
                  case "'":
                      if (lookAhead("'")) {
                          checkLiteral();
                      }
                      else {
                          literal = true;
                      }
                      break;
                  default:
                      checkLiteral();
              }
          }
      }
      if (year < 100) {
          var cutoffYear = void 0;
          // cutoffyear setting supports string and number. When string, it is considered relative to the current year.
          // otherwise it is the year number in the current century
          if (!isString(shortYearCutoff)) {
              cutoffYear = +shortYearCutoff;
          }
          else {
              cutoffYear = (new Date().getFullYear() % 100) + parseInt(shortYearCutoff, 10);
          }
          var addedCentury = void 0;
          if (year <= cutoffYear) {
              addedCentury = 0;
          }
          else {
              addedCentury = -100;
          }
          year += new Date().getFullYear() - (new Date().getFullYear() % 100) + addedCentury;
      }
      hours = ampm === -1 ? hours : ampm && hours < 12 ? hours + 12 : !ampm && hours === 12 ? 0 : hours;
      var date = s.getDate(year, month - 1, day, hours, minutes, seconds);
      if (s.getYear(date) !== year || s.getMonth(date) + 1 !== month || s.getDay(date) !== day) {
          return def; // Invalid date
      }
      return date;
  }
  /** Value Equality function for Date and Array of Date types
   * Checks if two dates or two array of dates are the same.
   * NOTE: empty Arrays are treated the same way as null values because,
   * when parsing a null value, the returned value representation is an empty object (datepicker),
   * which when turned back, won't be null, but rather an empty array
   */
  function dateValueEquals(v1, v2, s) {
      // null | DateType | DateType[]
      if (v1 === v2) {
          // shortcut for reference equaliy
          return true;
      }
      // Empty Arrays are treated the same way as null values
      if ((isArray(v1) && !v1.length && v2 === null) || (isArray(v2) && !v2.length && v1 === null)) {
          return true;
      }
      if (v1 === null || v2 === null || v1 === UNDEFINED || v2 === UNDEFINED) {
          return false;
      }
      // compare strings
      if (isString(v1) && isString(v2)) {
          // shortcut for strings
          return v1 === v2;
      }
      var dateFormat = s && s.dateFormat;
      // if one of them is an array compare each items
      if (isArray(v1) || isArray(v2)) {
          if (v1.length !== v2.length) {
              // if one of them is not an array, or the lengths are not the same
              return false;
          }
          for (var i = 0; i < v1.length; i++) {
              var eq = true;
              var a = v1[i];
              var b = v2[i];
              if (isString(a) && isString(b)) {
                  eq = a === b;
              }
              else {
                  eq = +makeDate(a, s, dateFormat) === +makeDate(b, s, dateFormat);
              }
              if (!eq) {
                  return false;
              }
          }
          return true;
      }
      return +makeDate(v1, s, dateFormat) === +makeDate(v2, s, dateFormat);
  }
  /**
   * Clones a date object (native or custom mbsc date).
   * @param date The date to clone.
   */
  function cloneDate(date) {
      return isMBSCDate(date) ? date.clone() : new Date(date);
  }
  /**
   * Adds the sepcified number of days to a date. Returns a new date object.
   * @param date The date.
   * @param days Days to add.
   */
  function addDays(date, days) {
      var copy = cloneDate(date);
      copy.setDate(copy.getDate() + days);
      return copy;
  }
  /** Constrains a date to min and max */
  function constrainDate(date, min, max) {
      return min && date < min ? new Date(min) : max && date > max ? new Date(max) : date;
  }
  // Symbol dummy for IE11
  if (isBrowser && typeof Symbol === 'undefined') {
      window.Symbol = {
          toPrimitive: 'toPrimitive',
      };
  }
  util.datetime = {
      formatDate: formatDatePublic,
      parseDate: parseDate,
  };

  // tslint:disable no-non-null-assertion
  var labelGuid = 1;
  var MONTH_VIEW = 'month';
  var YEAR_VIEW = 'year';
  var MULTI_YEAR_VIEW = 'multi-year';
  var PAGE_WIDTH = 296;
  var calendarViewDefaults = __assign({}, dateTimeLocale, { dateText: 'Date', eventText: 'event', eventsText: 'events', moreEventsText: '{count} more', nextPageText: 'Next page', prevPageText: 'Previous page', showEventTooltip: true, showToday: true, timeText: 'Time' });
  /**
   * @hidden
   * Returns the first date of the given page.
   * The pages are defined by the eventRange and eventRangeSize props.
   */
  function getFirstPageDay(pageIndex, s) {
      var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
      var pageType = s.showCalendar ? s.calendarType : s.eventRange;
      var pageSize = (s.showCalendar ? (pageType === 'year' ? 1 : pageType === 'week' ? s.weeks : s.size) : s.eventRangeSize) || 1;
      var getDate = s.getDate;
      var ref = pageType === 'week' ? getFirstDayOfWeek(refDate, s) : refDate;
      var year = s.getYear(ref);
      var month = s.getMonth(ref);
      var day = s.getDay(ref);
      switch (pageType) {
          case 'year':
              return getDate(year + pageIndex * pageSize, 0, 1);
          case 'week':
              return getDate(year, month, day + 7 * pageSize * pageIndex);
          case 'day':
              return getDate(year, month, day + pageSize * pageIndex);
          default:
              return getDate(year, month + pageIndex * pageSize, 1);
      }
  }
  /** @hidden */
  function getPageIndex(d, s) {
      var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
      var getYear = s.getYear;
      var getMonth = s.getMonth;
      var pageType = s.showCalendar ? s.calendarType : s.eventRange;
      var pageSize = (s.showCalendar ? (pageType === 'year' ? 1 : pageType === 'week' ? s.weeks : s.size) : s.eventRangeSize) || 1;
      var diff;
      switch (pageType) {
          case 'year':
              diff = getYear(d) - getYear(refDate);
              break;
          case 'week':
              diff = getDayDiff(getFirstDayOfWeek(refDate, s), getFirstDayOfWeek(d, s)) / 7;
              break;
          case 'day':
              diff = getDayDiff(refDate, d);
              break;
          case 'month':
              diff = getMonth(d) - getMonth(refDate) + (getYear(d) - getYear(refDate)) * 12;
              break;
          default:
              return UNDEFINED;
      }
      return floor(diff / pageSize);
  }
  /** @hidden */
  function getYearsIndex(d, s) {
      var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
      return floor((s.getYear(d) - s.getYear(refDate)) / 12);
  }
  /** @hidden */
  function getYearIndex(d, s) {
      var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
      return s.getYear(d) - s.getYear(refDate);
  }
  /** @hidden */
  function compareEvents(a, b) {
      var start1 = makeDate(a.start || a.date);
      var start2 = makeDate(b.start || a.date);
      var text1 = a.title || a.text;
      var text2 = b.title || b.text;
      // For non all-day events we multiply the timestamp by 10 to make sure they appear under the all-day events
      var weight1 = !start1 ? 0 : +start1 * (a.allDay ? 1 : 10);
      var weight2 = !start2 ? 0 : +start2 * (b.allDay ? 1 : 10);
      // In case of same weights, order by event title
      if (weight1 === weight2) {
          return text1 > text2 ? 1 : -1;
      }
      return weight1 - weight2;
  }
  /** @hidden */
  function getPageNr(pages, width) {
      return pages === 'auto' // Exact month number from setting
          ? Math.max(1, // Min 1 month
          Math.min(3, // Max 3 months
          Math.floor(width ? width / PAGE_WIDTH : 1)))
          : pages
              ? +pages
              : 1;
  }
  /** @hidden */
  function getLabels(s, labelsObj, start, end, maxLabels, days, allDayOnly, firstWeekDay, isMultiRow, eventOrder, noOuterDays, showLabelCount, moreEventsText, moreEventsPluralText) {
      labelsObj = labelsObj || {};
      var dayLabels = {};
      var eventDays = new Map();
      var eventRows = {};
      var day = start;
      var uid = 0;
      var max = maxLabels;
      var rowEnd = end;
      while (day < end) {
          var dateKey = getDateStr(day);
          var weekDay = day.getDay();
          var monthDay = s.getDay(day);
          var lastDayOfMonth = noOuterDays && s.getDate(s.getYear(day), s.getMonth(day) + 1, 0);
          var isRowStart = (isMultiRow && (weekDay === firstWeekDay || (monthDay === 1 && noOuterDays))) || +day === +start;
          var firstDay = getFirstDayOfWeek(day, s);
          var events = sortEvents(labelsObj[dateKey] || [], eventOrder);
          var prevEvent = void 0;
          var prevEventDays = void 0;
          var prevIndex = void 0;
          var row = 0;
          var displayed = 0;
          var i = 0;
          if (isRowStart) {
              eventRows = {};
              rowEnd = isMultiRow ? addDays(firstDay, days) : end;
          }
          if (allDayOnly) {
              events = events.filter(function (ev) { return ev.allDay; });
          }
          // maxLabels -1 means to display all labels
          if (maxLabels === -1) {
              max = events.length + 1;
          }
          var eventsNr = events.length;
          var data = [];
          if (showLabelCount) {
              data.push({ id: 'count_' + +day, count: eventsNr, placeholder: eventsNr === 0 });
              row = max;
          }
          while (eventsNr && row < max) {
              prevEvent = null;
              // Check  if there are any events already in this row
              for (var j = 0; j < events.length; j++) {
                  if (eventRows[row] === events[j]) {
                      prevEvent = events[j];
                      prevIndex = j;
                  }
              }
              prevEventDays = prevEvent ? eventDays.get(prevEvent) || [] : [];
              if (row === max - 1 && (displayed < eventsNr - 1 || (i === eventsNr && !prevEvent)) && maxLabels !== -1) {
                  var nr = eventsNr - displayed;
                  var moreText = moreEventsText || '';
                  var text = (nr > 1 ? moreEventsPluralText || moreText : moreText).replace(/{count}/, nr);
                  if (nr) {
                      data.push({ id: 'more_' + ++uid, more: text, label: text });
                  }
                  // Remove event from previous days and replace it with more label
                  if (prevEvent) {
                      eventRows[row] = null;
                      for (var _i = 0, prevEventDays_1 = prevEventDays; _i < prevEventDays_1.length; _i++) {
                          var d = prevEventDays_1[_i];
                          var t = moreText.replace(/{count}/, '1');
                          dayLabels[getDateStr(d)].data[row] = { id: 'more_' + ++uid, more: t, label: t };
                      }
                  }
                  displayed++;
                  row++;
              }
              else if (prevEvent) {
                  if (prevIndex === i) {
                      i++;
                  }
                  if (isSameDay(day, makeDate(prevEvent.end, prevEvent.allDay ? UNDEFINED : s))) {
                      eventRows[row] = null;
                  }
                  data.push({ id: prevEvent.occurrenceId || prevEvent.id, event: prevEvent });
                  row++;
                  displayed++;
                  prevEventDays.push(day);
              }
              else if (i < eventsNr) {
                  var event_1 = events[i];
                  var allDay = event_1.allDay;
                  var startTime = event_1.start && makeDate(event_1.start, allDay ? UNDEFINED : s);
                  if (!startTime || // all day event
                      isSameDay(day, startTime) || // event start day
                      isRowStart // event started previously, but continues in this row as well
                  ) {
                      var eventEnd = event_1.end && makeDate(event_1.end, allDay ? UNDEFINED : s);
                      var endTime = getEndDate(s, allDay, startTime, eventEnd, true);
                      var multiDay = endTime && !isSameDay(startTime, endTime);
                      var labelEnd = lastDayOfMonth && lastDayOfMonth < endTime ? lastDayOfMonth : endTime;
                      var startStr = startTime ? ', ' + s.fromText + ': ' + formatDate('DDDD, MMMM D, YYYY', startTime, s) : '';
                      var endStr = endTime ? ', ' + s.toText + ': ' + formatDate('DDDD, MMMM D, YYYY', endTime, s) : '';
                      if (event_1.id === UNDEFINED) {
                          event_1.id = 'mbsc_' + labelGuid++;
                      }
                      if (multiDay) {
                          eventRows[row] = event_1;
                      }
                      eventDays.set(event_1, [day]);
                      data.push({
                          event: event_1,
                          id: event_1.occurrenceId || event_1.id,
                          label: (event_1.title || event_1.text || '') + startStr + endStr,
                          lastDay: lastDayOfMonth ? addDays(lastDayOfMonth, 1) : UNDEFINED,
                          multiDay: multiDay,
                          showText: true,
                          width: multiDay ? Math.min(getDayDiff(day, labelEnd) + 1, getDayDiff(day, rowEnd)) * 100 : 100,
                      });
                      row++;
                      displayed++;
                  }
                  i++;
              }
              else {
                  if (displayed < eventsNr) {
                      data.push({ id: 'ph_' + ++uid, placeholder: true });
                  }
                  row++;
              }
          }
          dayLabels[dateKey] = { data: data, events: events };
          day = getDateOnly(addDays(day, 1));
      }
      return dayLabels;
  }
  /** @hidden */
  function sortEvents(events, eventOrder) {
      return events && events.slice(0).sort(eventOrder || compareEvents);
  }

  var Base = /*#__PURE__*/ (function (_super) {
      __extends(Base, _super);
      function Base() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._newProps = {};
          // tslint:disable-next-line: variable-name
          _this._setEl = function (el) {
              _this._el = el ? el._el || el : null;
          };
          return _this;
      }
      Object.defineProperty(Base.prototype, "value", {
          get: function () {
              return this.__value;
          },
          set: function (v) {
              this.__value = v;
          },
          enumerable: true,
          configurable: true
      });
      // tslint:enable variable-name
      Base.prototype.componentDidMount = function () {
          this.__init(); // For base class
          this._init();
          this._mounted();
          // this._hook('onMarkupReady', { target: this.base });
          this._updated();
          this._enhance();
      };
      Base.prototype.componentDidUpdate = function () {
          this._updated();
          this._enhance();
      };
      Base.prototype.componentWillUnmount = function () {
          this._destroy();
          this.__destroy(); // For base class
      };
      Base.prototype.render = function () {
          this._willUpdate();
          return this._template(this.s, this.state);
      };
      Base.prototype.getInst = function () {
          return this;
      };
      Base.prototype.setOptions = function (opt) {
          // this._newProps = {
          //   ...this._newProps as any,
          //   ...opt as any,
          // };
          // tslint:disable-next-line: forin
          for (var prop in opt) {
              this.props[prop] = opt[prop];
          }
          this.forceUpdate();
      };
      Base.prototype._safeHtml = function (html) {
          return { __html: html };
      };
      Base.prototype._init = function () { };
      Base.prototype.__init = function () { };
      Base.prototype._emit = function (name, args) { };
      Base.prototype._template = function (s, state) { };
      Base.prototype._mounted = function () { };
      Base.prototype._updated = function () { };
      Base.prototype._destroy = function () { };
      Base.prototype.__destroy = function () { };
      Base.prototype._willUpdate = function () { };
      Base.prototype._enhance = function () {
          var shouldEnhance = this._shouldEnhance;
          if (shouldEnhance) {
              enhance(shouldEnhance === true ? this._el : shouldEnhance);
              this._shouldEnhance = false;
          }
      };
      return Base;
  }(PureComponent));

  var guid$1 = 0;
  var BREAKPOINTS = {
      large: 992,
      medium: 768,
      small: 576,
      xlarge: 1200,
      xsmall: 0,
  };
  var isDark;
  if (isDarkQuery) {
      isDark = isDarkQuery.matches;
      // addListener is deprecated, however addEventListener does not have the necessary browser support
      // tslint:disable-next-line:deprecation
      isDarkQuery.addListener(function (ev) {
          isDark = ev.matches;
          globalChanges.next();
      });
  }
  /** @hidden */
  var BaseComponent = /*#__PURE__*/ (function (_super) {
      __extends(BaseComponent, _super);
      function BaseComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /** @hidden */
          _this.s = {};
          /** @hidden */
          _this.state = {};
          /**
           * Used to identify if it's a mobiscroll component
           * @hidden
           */
          _this._mbsc = true;
          /** @hidden */
          _this._v = {
              version: '5.23.2',
          };
          _this._uid = ++guid$1;
          return _this;
      }
      Object.defineProperty(BaseComponent.prototype, "nativeElement", {
          /** @hidden */
          get: function () {
              return this._el;
          },
          enumerable: true,
          configurable: true
      });
      /* TRIALFUNC */
      /** @hidden */
      // tslint:enable variable-name
      BaseComponent.prototype.destroy = function () { };
      /** @hidden */
      BaseComponent.prototype._hook = function (name, args) {
          var s = this.s;
          args.inst = this;
          args.type = name;
          if (s[name]) {
              return s[name](args, this);
          }
          this._emit(name, args);
      };
      BaseComponent.prototype.__init = function () {
          var _this = this;
          var self = this.constructor;
          // Subscribe only for top level components. Subcomponents get their settings from the top.
          // Checking the top level by the existence of static defaults property
          if (self.defaults) {
              this._optChange = globalChanges.subscribe(function () {
                  _this.forceUpdate();
              });
              // this.s.modules is not ready yet bc ngOnInit is called before ngDoCheck (when the first _merge is)
              var modules = this.props.modules;
              if (modules) {
                  for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
                      var module = modules_1[_i];
                      if (module.init) {
                          module.init(this);
                      }
                  }
              }
          }
          this._hook('onInit', {});
      };
      BaseComponent.prototype.__destroy = function () {
          if (this._optChange !== UNDEFINED) {
              globalChanges.unsubscribe(this._optChange);
          }
          this._hook('onDestroy', {});
      };
      BaseComponent.prototype._render = function (s, state) {
          return;
      };
      BaseComponent.prototype._willUpdate = function () {
          this._merge();
          this._render(this.s, this.state);
      };
      BaseComponent.prototype._resp = function (s) {
          var resp = s.responsive;
          var ret;
          var br = -1;
          var width = this.state.width;
          // Default to 375 (a standard mobile view), if width is not yet calculated
          if (width === UNDEFINED) {
              width = 375;
          }
          if (resp && width) {
              for (var _i = 0, _a = Object.keys(resp); _i < _a.length; _i++) {
                  var key = _a[_i];
                  var value = resp[key];
                  var breakpoint = value.breakpoint || BREAKPOINTS[key];
                  if (width >= breakpoint && breakpoint > br) {
                      ret = value;
                      br = breakpoint;
                  }
              }
          }
          return ret;
      };
      BaseComponent.prototype._merge = function () {
          var self = this.constructor;
          var defaults = self.defaults;
          var context = this._opt || {};
          var props = {};
          var s;
          var themeDef;
          this._prevS = this.s || {};
          // TODO: don't merge if setState call
          if (defaults) {
              // Filter undefined values
              for (var prop in this.props) {
                  if (this.props[prop] !== UNDEFINED) {
                      props[prop] = this.props[prop];
                  }
              }
              // if (this._newProps) {
              //   for (const prop in this._newProps) {
              //     if (this._newProps[prop] !== UNDEFINED) {
              //       props[prop] = this._newProps[prop];
              //     }
              //   }
              // }
              // Load locale options
              var locale = props.locale || context.locale || options.locale || {};
              var calendarSystem = props.calendarSystem || locale.calendarSystem || context.calendarSystem || options.calendarSystem;
              // Load theme options
              var themeName = props.theme || context.theme || options.theme;
              var themeVariant = props.themeVariant || context.themeVariant || options.themeVariant;
              if (themeName === 'auto' || !themeName) {
                  themeName = autoDetect.theme || '';
              }
              // Set dark theme if:
              // - themeVariant is explicitly set to dark OR
              // - themeVariant is auto or not set, and system theme is dark
              // Also check if the theme exists in the themes object
              if ((themeVariant === 'dark' || (isDark && (themeVariant === 'auto' || !themeVariant))) && themes[themeName + '-dark']) {
                  themeName += '-dark';
              }
              // Write back the auto-detected theme
              props.theme = themeName;
              themeDef = themes[themeName];
              var theme = themeDef && themeDef[self._name];
              // Merge everything together
              s = __assign({}, defaults, theme, locale, options, context, calendarSystem, props);
              // Merge responsive options
              var resp = this._resp(s);
              this._respProps = resp;
              if (resp) {
                  s = __assign({}, s, resp);
              }
          }
          else {
              s = __assign({}, this.props);
              themeDef = themes[s.theme];
          }
          var baseTheme = themeDef && themeDef.baseTheme;
          s.baseTheme = baseTheme;
          this.s = s;
          this._className = s.cssClass || s.class || s.className || '';
          this._rtl = ' mbsc-' + (s.rtl ? 'rtl' : 'ltr');
          this._theme = ' mbsc-' + s.theme + (baseTheme ? ' mbsc-' + baseTheme : '');
          this._touchUi = s.touchUi === 'auto' || s.touchUi === UNDEFINED ? touchUi : s.touchUi;
          this._hb = os === 'ios' && (s.theme === 'ios' || baseTheme === 'ios') ? ' mbsc-hb' : '';
      };
      // tslint:disable variable-name
      /** @hidden */
      BaseComponent.defaults = UNDEFINED;
      BaseComponent._name = '';
      return BaseComponent;
  }(Base));

  var ANIMATION_START = 'animationstart';
  var BLUR = 'blur';
  var CHANGE = 'change';
  var CLICK = 'click';
  var CONTEXTMENU = 'contextmenu';
  var DOUBLE_CLICK = 'dblclick';
  var FOCUS = 'focus';
  var FOCUS_IN = 'focusin';
  var INPUT = 'input';
  var KEY_DOWN = 'keydown';
  var MOUSE_DOWN = 'mousedown';
  var MOUSE_MOVE = 'mousemove';
  var MOUSE_UP = 'mouseup';
  var MOUSE_OVER = 'mousedown';
  var MOUSE_ENTER = 'mouseenter';
  var MOUSE_LEAVE = 'mouseleave';
  var MOUSE_WHEEL = 'mousewheel';
  var RESIZE = 'resize';
  var SCROLL = 'scroll';
  var TOUCH_START = 'touchstart';
  var TOUCH_MOVE = 'touchmove';
  var TOUCH_END = 'touchend';
  var TOUCH_CANCEL = 'touchcancel';
  var WHEEL = 'wheel';

  var BACKSPACE = 8;
  var TAB = 9;
  var ENTER = 13;
  var ESC = 27;
  var SPACE = 32;
  var PAGE_UP = 33;
  var PAGE_DOWN = 34;
  var END = 35;
  var HOME = 36;
  var LEFT_ARROW = 37;
  var UP_ARROW = 38;
  var RIGHT_ARROW = 39;
  var DOWN_ARROW = 40;
  var DELETE = 46;

  var markup = '<div class="mbsc-resize"><div class="mbsc-resize-i mbsc-resize-x"></div></div>' +
      '<div class="mbsc-resize"><div class="mbsc-resize-i mbsc-resize-y"></div></div>';
  var observer;
  var count = 0;
  function resizeObserver(el, callback, zone) {
      var expand;
      var expandChild;
      var helper;
      var hiddenRafId;
      var rafId;
      var shrink;
      var stopCheck;
      var lastCheck = 0;
      function reset() {
          expandChild.style.width = '100000px';
          expandChild.style.height = '100000px';
          expand.scrollLeft = 100000;
          expand.scrollTop = 100000;
          shrink.scrollLeft = 100000;
          shrink.scrollTop = 100000;
      }
      function checkHidden() {
          var now = +new Date();
          hiddenRafId = 0;
          if (!stopCheck) {
              if (now - lastCheck > 200 && !expand.scrollTop && !expand.scrollLeft) {
                  lastCheck = now;
                  reset();
              }
              if (!hiddenRafId) {
                  hiddenRafId = raf(checkHidden);
              }
          }
      }
      function onScroll() {
          if (!rafId) {
              rafId = raf(onResize);
          }
      }
      function onResize() {
          rafId = 0;
          reset();
          callback();
      }
      if (win && win.ResizeObserver) {
          if (!observer) {
              observer = new win.ResizeObserver(function (entries) {
                  if (!rafId) {
                      rafId = raf(function () {
                          for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                              var entry = entries_1[_i];
                              // Sometimes this fires after unobserve has been called,
                              // so we need to check if the callback function is still there
                              if (entry.target.__mbscResize) {
                                  entry.target.__mbscResize();
                              }
                          }
                          rafId = 0;
                      });
                  }
              });
          }
          count++;
          el.__mbscResize = function () {
              if (zone) {
                  zone.run(callback);
              }
              else {
                  callback();
              }
          };
          observer.observe(el);
      }
      else {
          helper = doc && doc.createElement('div');
      }
      if (helper) {
          helper.innerHTML = markup;
          helper.dir = 'ltr'; // Need this to work in rtl as well;
          shrink = helper.childNodes[1];
          expand = helper.childNodes[0];
          expandChild = expand.childNodes[0];
          el.appendChild(helper);
          listen(expand, 'scroll', onScroll);
          listen(shrink, 'scroll', onScroll);
          if (zone) {
              zone.runOutsideAngular(function () {
                  raf(checkHidden);
              });
          }
          else {
              raf(checkHidden);
          }
      }
      return {
          detach: function () {
              if (observer) {
                  count--;
                  delete el.__mbscResize;
                  observer.unobserve(el);
                  if (!count) {
                      observer = UNDEFINED;
                  }
              }
              else {
                  if (helper) {
                      unlisten(expand, 'scroll', onScroll);
                      unlisten(shrink, 'scroll', onScroll);
                      el.removeChild(helper);
                      rafc(rafId);
                      helper = UNDEFINED;
                  }
                  stopCheck = true;
              }
          },
      };
  }

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  var activeModal;
  var EDITABLE = 'input,select,textarea,button';
  var ALLOW_ENTER = 'textarea,button,input[type="button"],input[type="submit"]';
  var FOCUSABLE = EDITABLE + ',[tabindex="0"]';
  var MAX_WIDTH = 600;
  var KEY_CODES = {
      enter: ENTER,
      esc: ESC,
      space: SPACE,
  };
  var needsFixed = isBrowser && /(iphone|ipod)/i.test(userAgent) && majorVersion >= 7 && majorVersion < 15;
  /** @hidden */
  function processButtons(inst, buttons) {
      var s = inst.s; // needed for localization settings
      var processedButtons = [];
      var predefinedButtons = {
          cancel: {
              cssClass: 'mbsc-popup-button-close',
              name: 'cancel',
              text: s.cancelText,
          },
          close: {
              cssClass: 'mbsc-popup-button-close',
              name: 'close',
              text: s.closeText,
          },
          ok: {
              cssClass: 'mbsc-popup-button-primary',
              keyCode: ENTER,
              name: 'ok',
              text: s.okText,
          },
          set: {
              cssClass: 'mbsc-popup-button-primary',
              keyCode: ENTER,
              name: 'set',
              text: s.setText,
          },
      };
      if (buttons && buttons.length) {
          buttons.forEach(function (btn) {
              var button = isString(btn) ? predefinedButtons[btn] || { text: btn } : btn;
              if (!button.handler || isString(button.handler)) {
                  if (isString(button.handler)) {
                      button.name = button.handler;
                  }
                  button.handler = function (domEvent) {
                      inst._onButtonClick({ domEvent: domEvent, button: button });
                  };
              }
              processedButtons.push(button);
          });
          return processedButtons;
      }
      return UNDEFINED;
  }
  function getPrevActive(modal, i) {
      if (i === void 0) { i = 0; }
      var prevModal = modal._prevModal;
      if (prevModal && prevModal !== modal && i < 10) {
          if (prevModal.isVisible()) {
              return prevModal;
          }
          return getPrevActive(prevModal, i + 1);
      }
      return UNDEFINED;
  }
  /**
   * @hidden
   */
  var PopupBase = /*#__PURE__*/ (function (_super) {
      __extends(PopupBase, _super);
      function PopupBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._lastFocus = +new Date();
          _this._setActive = function (el) {
              _this._active = el;
          };
          _this._setContent = function (el) {
              _this._content = el;
          };
          _this._setLimitator = function (el) {
              _this._limitator = el;
          };
          _this._setPopup = function (el) {
              _this._popup = el;
          };
          _this._setWrapper = function (el) {
              _this._wrapper = el;
          };
          _this._onOverlayClick = function () {
              if (_this._isOpen && _this.s.closeOnOverlayClick && !_this._preventClose) {
                  _this._close('overlay');
              }
              _this._preventClose = false;
          };
          _this._onDocClick = function (ev) {
              if (!_this.s.showOverlay && ev.target !== _this.s.focusElm && activeModal === _this) {
                  _this._onOverlayClick();
              }
          };
          _this._onMouseDown = function (ev) {
              if (!_this.s.showOverlay) {
                  _this._target = ev.target;
              }
          };
          _this._onMouseUp = function (ev) {
              if (_this._target && _this._popup && _this._popup.contains(_this._target) && !_this._popup.contains(ev.target)) {
                  _this._preventClose = true;
              }
              _this._target = false;
          };
          _this._onPopupClick = function () {
              if (!_this.s.showOverlay) {
                  _this._preventClose = true;
              }
          };
          _this._onAnimationEnd = function (ev) {
              if (ev.target === _this._popup) {
                  if (_this._isClosing) {
                      _this._onClosed();
                      _this._isClosing = false;
                      if (_this.state.isReady) {
                          _this.setState({ isReady: false });
                      }
                      else {
                          _this.forceUpdate();
                      }
                  }
                  if (_this._isOpening) {
                      _this._onOpened();
                      _this._isOpening = false;
                      _this.forceUpdate();
                  }
              }
          };
          _this._onButtonClick = function (_a) {
              var domEvent = _a.domEvent, button = _a.button;
              _this._hook('onButtonClick', { domEvent: domEvent, button: button });
              if (/cancel|close|ok|set/.test(button.name)) {
                  _this._close(button.name);
              }
          };
          _this._onFocus = function (ev) {
              var now = +new Date();
              // If an element outside of the modal is focused, put the focus back inside the modal
              // Last focus time is tracked, to avoid infinite loop for focus,
              // if there's another modal present on page, e.g. Ionic or Bootstrap
              // https://github.com/acidb/mobiscroll/issues/341
              if (activeModal === _this &&
                  ev.target.nodeType &&
                  _this._ctx.contains(ev.target) &&
                  _this._popup &&
                  !_this._popup.contains(ev.target) &&
                  now - _this._lastFocus > 100 &&
                  ev.target !== _this.s.focusElm) {
                  _this._lastFocus = now;
                  _this._active.focus();
              }
          };
          _this._onKeyDown = function (ev) {
              var s = _this.s;
              var keyCode = ev.keyCode;
              var focusElm = s.focusElm && !s.focusOnOpen ? s.focusElm : UNDEFINED;
              // Prevent scroll on Space key
              if ((keyCode === SPACE && !matches(ev.target, EDITABLE)) || (_this._lock && (keyCode === UP_ARROW || keyCode === DOWN_ARROW))) {
                  ev.preventDefault();
              }
              // Trap the focus inside the modal
              if (s.focusTrap && keyCode === TAB) {
                  var all = _this._popup.querySelectorAll(FOCUSABLE);
                  var focusable_1 = [];
                  var end_1 = -1;
                  var target = 0;
                  var current_1 = -1;
                  var targetElm = UNDEFINED;
                  // Filter truly focusable elements
                  forEach(all, function (elm) {
                      if (!elm.disabled && (elm.offsetHeight || elm.offsetWidth)) {
                          focusable_1.push(elm);
                          end_1++;
                          // Save the index of the currently focused element
                          if (elm === _this._doc.activeElement) {
                              current_1 = end_1;
                          }
                      }
                  });
                  // If shift is also pressed, means we're going backwards,
                  // so we target the last focusable element if the current active is the first
                  if (ev.shiftKey) {
                      target = end_1;
                      end_1 = 0;
                  }
                  // If current active is first or last, move focus to last or first focusable element
                  if (current_1 === end_1) {
                      targetElm = focusElm || focusable_1[target];
                  }
                  else if (ev.target === focusElm) {
                      targetElm = focusable_1[target];
                  }
                  if (targetElm) {
                      targetElm.focus();
                      ev.preventDefault();
                  }
              }
          };
          _this._onContentScroll = function (ev) {
              if (_this._lock && (ev.type !== TOUCH_MOVE || ev.touches[0].touchType !== 'stylus')) {
                  ev.preventDefault();
              }
          };
          _this._onScroll = function (ev) {
              var s = _this.s;
              if (s.closeOnScroll) {
                  _this._close('scroll');
              }
              else if (_this._hasContext || s.display === 'anchored') {
                  _this.position();
              }
          };
          _this._onWndKeyDown = function (ev) {
              var s = _this.s;
              var keyCode = ev.keyCode;
              // keyCode is not defined if Chrome triggers keydown when a field is autofilled
              if (activeModal === _this && keyCode !== UNDEFINED) {
                  _this._hook('onKeyDown', { keyCode: keyCode });
                  if (s.closeOnEsc && keyCode === ESC) {
                      _this._close('esc');
                  }
                  if (keyCode === ENTER && matches(ev.target, ALLOW_ENTER) && !ev.shiftKey) {
                      return;
                  }
                  if (_this._buttons) {
                      for (var _i = 0, _a = _this._buttons; _i < _a.length; _i++) {
                          var button = _a[_i];
                          var buttonKeyCodes = isArray(button.keyCode) ? button.keyCode : [button.keyCode];
                          for (var _b = 0, buttonKeyCodes_1 = buttonKeyCodes; _b < buttonKeyCodes_1.length; _b++) {
                              var key = buttonKeyCodes_1[_b];
                              if (!button.disabled && key !== UNDEFINED && (key === keyCode || KEY_CODES[key] === keyCode)) {
                                  button.handler(ev);
                                  return;
                              }
                          }
                      }
                  }
              }
          };
          _this._onResize = function () {
              var wrapper = _this._wrapper;
              var hasContext = _this._hasContext;
              if (!wrapper) {
                  return;
              }
              _this._vpWidth = Math.min(wrapper.clientWidth, hasContext ? Infinity : _this._win.innerWidth);
              _this._vpHeight = Math.min(wrapper.clientHeight, hasContext ? Infinity : _this._win.innerHeight);
              _this._maxWidth = _this._limitator.offsetWidth;
              _this._maxHeight = _this.s.maxHeight !== UNDEFINED || _this._vpWidth < 768 || _this._vpHeight < 650 ? _this._limitator.offsetHeight : 600;
              _this._round = _this.s.touchUi === false || (_this._popup.offsetWidth < _this._vpWidth && _this._vpWidth > _this._maxWidth);
              var args = {
                  isLarge: _this._round,
                  maxPopupHeight: _this._maxHeight,
                  maxPopupWidth: _this._maxWidth,
                  target: wrapper,
                  windowHeight: _this._vpHeight,
                  windowWidth: _this._vpWidth,
              };
              if (_this._hook('onResize', args) !== false && !args.cancel) {
                  _this.position();
              }
          };
          return _this;
      }
      // tslint:enable variable-name
      // ---
      /**
       * Open
       */
      PopupBase.prototype.open = function () {
          if (!this._isOpen) {
              this.setState({
                  isOpen: true,
              });
          }
      };
      /**
       * Close
       */
      PopupBase.prototype.close = function () {
          this._close();
      };
      /**
       * Is open?
       */
      PopupBase.prototype.isVisible = function () {
          return !!this._isOpen;
      };
      PopupBase.prototype.position = function () {
          if (!this._isOpen) {
              return;
          }
          var s = this.s;
          var state = this.state;
          var wrapper = this._wrapper;
          var popup = this._popup;
          var hasContext = this._hasContext;
          var anchor = s.anchor;
          var anchorAlign = s.anchorAlign;
          var rtl = s.rtl;
          var scrollTop = getScrollTop(this._scrollCont);
          var scrollLeft = getScrollLeft(this._scrollCont);
          var viewportWidth = this._vpWidth;
          var viewportHeight = this._vpHeight;
          var maxWidth = this._maxWidth;
          var maxHeight = this._maxHeight;
          var popupWidth = Math.min(popup.offsetWidth, maxWidth);
          var popupHeight = Math.min(popup.offsetHeight, maxHeight);
          var showArrow = s.showArrow;
          this._lock = s.scrollLock && this._content.scrollHeight <= this._content.clientHeight;
          // this._short = popupHeight >= (viewportHeight - 50);
          if (hasContext) {
              wrapper.style.top = scrollTop + 'px';
              wrapper.style.left = scrollLeft + 'px';
          }
          var skip = this._hook('onPosition', {
              isLarge: this._round,
              maxPopupHeight: maxHeight,
              maxPopupWidth: maxWidth,
              target: this._wrapper,
              windowHeight: viewportHeight,
              windowWidth: viewportWidth,
          }) === false;
          if (s.display === 'anchored' && !skip) {
              var ctxLeft = 0;
              var ctxTop = 0;
              var left = constrain(state.modalLeft || 0, 8, viewportWidth - popupWidth - 8);
              var top_1 = state.modalTop || 8;
              var bubblePos = 'bottom';
              var arrowPos = {};
              var arrowHeight = showArrow ? 16 : 4;
              var fullWidth = wrapper.offsetWidth;
              var fullHeight = wrapper.offsetHeight;
              var widthOffset = (fullWidth - viewportWidth) / 2;
              var heightOffset = (fullHeight - viewportHeight) / 2;
              if (hasContext) {
                  var ctxBox = this._ctx.getBoundingClientRect();
                  ctxTop = ctxBox.top;
                  ctxLeft = ctxBox.left;
              }
              // Check if anchor exists and it's inside the context
              if (anchor && this._ctx.contains(anchor)) {
                  var box = anchor.getBoundingClientRect();
                  var anchorTop = box.top - ctxTop;
                  var anchorLeft = box.left - ctxLeft;
                  var anchorWidth = anchor.offsetWidth;
                  var anchorHeight = anchor.offsetHeight;
                  if ((anchorAlign === 'start' && !rtl) || (anchorAlign === 'end' && rtl)) {
                      // Position to the left of the anchor
                      left = anchorLeft;
                  }
                  else if ((anchorAlign === 'end' && !rtl) || (anchorAlign === 'start' && rtl)) {
                      // Position to the right of the anchor
                      left = anchorLeft + anchorWidth - popupWidth;
                  }
                  else {
                      // Position to the center of the anchor
                      left = anchorLeft - (popupWidth - anchorWidth) / 2;
                  }
                  // Make sure to remain in the viewport
                  left = constrain(left, 8, viewportWidth - popupWidth - 8);
                  // By default position the popup to the bottom of the anchor
                  top_1 = anchorTop + anchorHeight + arrowHeight;
                  arrowPos = {
                      left: constrain(anchorLeft + anchorWidth / 2 - left - widthOffset, 30, popupWidth - 30) + 'px',
                  };
                  // if there's no space below
                  if (top_1 + popupHeight + arrowHeight > viewportHeight) {
                      if (anchorTop - popupHeight - arrowHeight > 0) {
                          // check if above the anchor is enough space
                          bubblePos = 'top';
                          top_1 = anchorTop - popupHeight - arrowHeight;
                      }
                      else if (!s.disableLeftRight) {
                          var leftPos = anchorLeft - popupWidth - 8 > 0; // check if there's space on the left
                          var rightPos = anchorLeft + anchorWidth + popupWidth + 8 <= viewportWidth; // check if there's space on the right
                          // calculations are almost the same for the left and right position, so we group them toghether
                          if (leftPos || rightPos) {
                              top_1 = constrain(anchorTop - (popupHeight - anchorHeight) / 2, 8, viewportHeight - popupHeight - 8);
                              // Make sure it stays in the viewport
                              if (top_1 + popupHeight + 8 > viewportHeight) {
                                  // the top position can be negative because of the -16px spacing
                                  top_1 = Math.max(viewportHeight - popupHeight - 8, 0);
                              }
                              arrowPos = {
                                  top: constrain(anchorTop + anchorHeight / 2 - top_1 - heightOffset, 30, popupHeight - 30) + 'px',
                              };
                              bubblePos = leftPos ? 'left' : 'right';
                              left = leftPos ? anchorLeft - popupWidth : anchorLeft + anchorWidth;
                          }
                      }
                  }
              }
              if (bubblePos === 'top' || bubblePos === 'bottom') {
                  // Make sure it stays in the viewport
                  if (top_1 + popupHeight + arrowHeight > viewportHeight) {
                      // the top position can be negative because of the -16px spacing
                      top_1 = Math.max(viewportHeight - popupHeight - arrowHeight, 0);
                      showArrow = false;
                  }
              }
              this.setState({
                  arrowPos: arrowPos,
                  bubblePos: bubblePos,
                  height: viewportHeight,
                  isReady: true,
                  modalLeft: left,
                  modalTop: top_1,
                  showArrow: showArrow,
                  width: viewportWidth,
              });
          }
          else {
              this.setState({
                  height: viewportHeight,
                  isReady: true,
                  showArrow: showArrow,
                  width: viewportWidth,
              });
          }
      };
      PopupBase.prototype._render = function (s, state) {
          // 'bubble' is deprecated, renamed to 'anchored'
          if (s.display === 'bubble') {
              s.display = 'anchored';
          }
          var animation = s.animation;
          var display = s.display;
          var prevProps = this._prevS;
          var hasPos = display === 'anchored';
          var isModal = display !== 'inline';
          var isFullScreen = s.fullScreen && isModal;
          var isOpen = isModal ? (s.isOpen === UNDEFINED ? state.isOpen : s.isOpen) : false;
          if (isOpen &&
              (s.windowWidth !== prevProps.windowWidth ||
                  s.display !== prevProps.display ||
                  s.showArrow !== prevProps.showArrow ||
                  (s.anchor !== prevProps.anchor && s.display === 'anchored'))) {
              this._shouldPosition = true;
          }
          this._limits = {
              maxHeight: addPixel(s.maxHeight),
              maxWidth: addPixel(s.maxWidth),
          };
          this._style = {
              height: isFullScreen ? '100%' : addPixel(s.height),
              left: hasPos && state.modalLeft ? state.modalLeft + 'px' : '',
              maxHeight: addPixel(this._maxHeight || s.maxHeight),
              maxWidth: addPixel(this._maxWidth || s.maxWidth),
              top: hasPos && state.modalTop ? state.modalTop + 'px' : '',
              width: isFullScreen ? '100%' : addPixel(s.width),
          };
          this._hasContext = s.context !== 'body' && s.context !== UNDEFINED;
          this._needsLock = needsFixed && !this._hasContext && display !== 'anchored' && s.scrollLock;
          this._isModal = isModal;
          this._flexButtons = display === 'center' || (!this._touchUi && !isFullScreen && (display === 'top' || display === 'bottom'));
          if (animation !== UNDEFINED && animation !== true) {
              this._animation = isString(animation) ? animation : '';
          }
          else {
              switch (display) {
                  case 'bottom':
                      this._animation = 'slide-up';
                      break;
                  case 'top':
                      this._animation = 'slide-down';
                      break;
                  default:
                      this._animation = 'pop';
              }
          }
          if (s.buttons) {
              if (s.buttons !== prevProps.buttons) {
                  this._buttons = processButtons(this, s.buttons);
              }
          }
          else {
              this._buttons = UNDEFINED;
          }
          if (s.headerText !== prevProps.headerText) {
              this._headerText = s.headerText ? this._safeHtml(s.headerText) : UNDEFINED;
          }
          // Will open
          if (isOpen && !this._isOpen) {
              this._onOpen();
          }
          // Will close
          if (!isOpen && this._isOpen) {
              this._onClose();
          }
          this._isOpen = isOpen;
          this._isVisible = isOpen || this._isClosing;
      };
      PopupBase.prototype._updated = function () {
          var _this = this;
          var s = this.s;
          var wrapper = this._wrapper;
          if (doc && (s.context !== this._prevS.context || !this._ctx)) {
              // TODO: refactor for React Native
              var ctx = isString(s.context) ? doc.querySelector(s.context) : s.context;
              if (!ctx) {
                  ctx = doc.body;
              }
              ctx.__mbscLock = ctx.__mbscLock || 0;
              ctx.__mbscIOSLock = ctx.__mbscIOSLock || 0;
              ctx.__mbscModals = ctx.__mbscModals || 0;
              this._ctx = ctx;
              // If we just got the context and at the same time the popup was opened,
              // we need an update for the Portal to render the content of the popup
              if (this._justOpened) {
                  ngSetTimeout(this, function () {
                      _this.forceUpdate();
                  });
                  return;
              }
          }
          if (!wrapper) {
              return;
          }
          if (this._justOpened) {
              var ctx = this._ctx;
              var hasContext = this._hasContext;
              var doc_1 = (this._doc = getDocument(wrapper));
              var win = (this._win = getWindow(wrapper));
              var activeElm_1 = doc_1.activeElement;
              // If we have responsive setting, we need to make sure to pass the width to the state,
              // and re-render so we have the correct calculated settings, which is based on the width.
              if (!this._hasWidth && s.responsive) {
                  var viewportWidth_1 = Math.min(wrapper.clientWidth, hasContext ? Infinity : win.innerWidth);
                  var viewportHeight_1 = Math.min(wrapper.clientHeight, hasContext ? Infinity : win.innerHeight);
                  this._hasWidth = true;
                  if (viewportWidth_1 !== this.state.width || viewportHeight_1 !== this.state.height) {
                      ngSetTimeout(this, function () {
                          _this.setState({
                              height: viewportHeight_1,
                              width: viewportWidth_1,
                          });
                      });
                      return;
                  }
              }
              this._scrollCont = hasContext ? ctx : win;
              this._observer = resizeObserver(wrapper, this._onResize, this._zone);
              this._prevFocus = s.focusElm || activeElm_1;
              ctx.__mbscModals++;
              if (s.focusOnOpen && activeElm_1) {
                  setTimeout(function () {
                      // TODO investigate on this
                      activeElm_1.blur();
                  });
              }
              // Scroll locking
              if (this._needsLock) {
                  if (!ctx.__mbscIOSLock) {
                      var scrollTop = getScrollTop(this._scrollCont);
                      var scrollLeft = getScrollLeft(this._scrollCont);
                      ctx.style.left = -scrollLeft + 'px';
                      ctx.style.top = -scrollTop + 'px';
                      ctx.__mbscScrollLeft = scrollLeft;
                      ctx.__mbscScrollTop = scrollTop;
                      ctx.classList.add('mbsc-popup-open-ios');
                      ctx.parentNode.classList.add('mbsc-popup-open-ios');
                  }
                  ctx.__mbscIOSLock++;
              }
              if (hasContext) {
                  ctx.classList.add('mbsc-popup-ctx');
              }
              if (s.focusTrap) {
                  listen(win, FOCUS_IN, this._onFocus);
              }
              if (s.focusElm && !s.focusOnOpen) {
                  listen(s.focusElm, KEY_DOWN, this._onKeyDown);
              }
              listen(this._scrollCont, TOUCH_MOVE, this._onContentScroll, { passive: false });
              listen(this._scrollCont, WHEEL, this._onContentScroll, { passive: false });
              listen(this._scrollCont, MOUSE_WHEEL, this._onContentScroll, { passive: false });
              // Need setTimeout to prevent immediate close
              // TODO: use touch events here
              setTimeout(function () {
                  listen(doc_1, MOUSE_DOWN, _this._onMouseDown);
                  listen(doc_1, MOUSE_UP, _this._onMouseUp);
                  listen(doc_1, CLICK, _this._onDocClick);
              });
              this._hook('onOpen', { target: this._wrapper });
          }
          if (this._shouldPosition) {
              ngSetTimeout(this, function () {
                  // this.position();
                  _this._onResize();
              });
          }
          this._justOpened = false;
          this._justClosed = false;
          this._shouldPosition = false;
      };
      PopupBase.prototype._destroy = function () {
          if (this._isOpen) {
              this._onClosed();
              this._unlisten();
              if (activeModal === this) {
                  activeModal = getPrevActive(this);
              }
          }
      };
      PopupBase.prototype._onOpen = function () {
          var _this = this;
          if (hasAnimation && this._animation) {
              this._isOpening = true;
              this._isClosing = false;
          }
          else {
              this._onOpened();
          }
          this._justOpened = true;
          this._preventClose = false;
          if (this.s.setActive && activeModal !== this) {
              // Wait for the click to propagate,
              // because if another popup needs to be closed on doc click, we don't want to override
              // the activeModal variable.
              setTimeout(function () {
                  _this._prevModal = activeModal;
                  activeModal = _this;
              });
          }
      };
      PopupBase.prototype._onClose = function () {
          var _this = this;
          // const activeElm = this._doc!.activeElement as HTMLElement;
          // if (activeElm) {
          // There's a weird issue on Safari, where the page scrolls up when
          // 1) A readonly input inside the popup has the focus
          // 2) The popup is closed by clicking on a `button` element (built in popup buttons, or a button in the popup content)
          // To prevent this, blur the active element when closing the popup.
          // setTimeout is needed to prevent to avoid the "Cannot flush updates when React is already rendering" error in React
          // setTimeout(() => {
          // activeElm.blur();
          // });
          // }
          if (hasAnimation && this._animation) {
              this._isClosing = true;
              this._isOpening = false;
          }
          else {
              setTimeout(function () {
                  _this._onClosed();
                  _this.setState({ isReady: false });
              });
          }
          this._hasWidth = false;
          this._unlisten();
      };
      PopupBase.prototype._onOpened = function () {
          var s = this.s;
          if (s.focusOnOpen) {
              var activeElm = s.activeElm;
              var active = activeElm
                  ? isString(activeElm)
                      ? this._popup.querySelector(activeElm) || this._active
                      : activeElm
                  : this._active;
              if (active && active.focus) {
                  active.focus();
              }
          }
          listen(this._win, KEY_DOWN, this._onWndKeyDown);
          listen(this._scrollCont, SCROLL, this._onScroll);
      };
      PopupBase.prototype._onClosed = function () {
          var _this = this;
          var ctx = this._ctx;
          var prevFocus = this._prevFocus;
          // 'as any' is needed for Typescript 4 - we do want to check the existence of the focus method because of IE11
          var shouldFocus = this.s.focusOnClose && prevFocus && prevFocus.focus && prevFocus !== this._doc.activeElement;
          ctx.__mbscModals--;
          this._justClosed = true;
          if (this._needsLock) {
              ctx.__mbscIOSLock--;
              if (!ctx.__mbscIOSLock) {
                  ctx.classList.remove('mbsc-popup-open-ios');
                  ctx.parentNode.classList.remove('mbsc-popup-open-ios');
                  ctx.style.left = '';
                  ctx.style.top = '';
                  setScrollLeft(this._scrollCont, ctx.__mbscScrollLeft);
                  setScrollTop(this._scrollCont, ctx.__mbscScrollTop);
              }
          }
          if (this._hasContext && !ctx.__mbscModals) {
              ctx.classList.remove('mbsc-popup-ctx');
          }
          this._hook('onClosed', { focus: shouldFocus });
          if (shouldFocus) {
              prevFocus.focus();
          }
          setTimeout(function () {
              if (activeModal === _this) {
                  activeModal = getPrevActive(_this);
              }
          });
      };
      PopupBase.prototype._unlisten = function () {
          unlisten(this._win, KEY_DOWN, this._onWndKeyDown);
          unlisten(this._scrollCont, SCROLL, this._onScroll);
          unlisten(this._scrollCont, TOUCH_MOVE, this._onContentScroll, { passive: false });
          unlisten(this._scrollCont, WHEEL, this._onContentScroll, { passive: false });
          unlisten(this._scrollCont, MOUSE_WHEEL, this._onContentScroll, { passive: false });
          unlisten(this._doc, MOUSE_DOWN, this._onMouseDown);
          unlisten(this._doc, MOUSE_UP, this._onMouseUp);
          unlisten(this._doc, CLICK, this._onDocClick);
          if (this.s.focusTrap) {
              unlisten(this._win, FOCUS_IN, this._onFocus);
          }
          if (this.s.focusElm) {
              unlisten(this.s.focusElm, KEY_DOWN, this._onKeyDown);
          }
          if (this._observer) {
              this._observer.detach();
              this._observer = null;
          }
      };
      PopupBase.prototype._close = function (source) {
          if (this._isOpen) {
              if (this.s.isOpen === UNDEFINED) {
                  this.setState({
                      isOpen: false,
                  });
              }
              this._hook('onClose', { source: source });
          }
      };
      /** @hidden */
      PopupBase.defaults = {
          buttonVariant: 'flat',
          cancelText: 'Cancel',
          closeOnEsc: true,
          closeOnOverlayClick: true,
          closeText: 'Close',
          contentPadding: true,
          display: 'center',
          focusOnClose: true,
          focusOnOpen: true,
          focusTrap: true,
          maxWidth: MAX_WIDTH,
          okText: 'Ok',
          scrollLock: true,
          setActive: true,
          setText: 'Set',
          showArrow: true,
          showOverlay: true,
      };
      return PopupBase;
  }(BaseComponent));

  // tslint:disable no-non-null-assertion
  function getIonInput(el, cb, nr) {
      if (nr === void 0) { nr = 0; }
      // Give up after multiple tries, and return the ion-input element
      if (nr > 10) {
          delete el.__mbscTimer;
          cb(el);
      }
      else {
          clearTimeout(el.__mbscTimer);
          el.__mbscTimer = setTimeout(function () {
              // IonInput might not be fully read yet, so if getInputElement is not yet there, try once again
              if (el.getInputElement) {
                  el.getInputElement().then(function (inp) {
                      // In Safari the input element is sometimes not set on the first call, so try once again
                      if (inp) {
                          delete el.__mbscTimer;
                          cb(inp);
                      }
                      else {
                          getIonInput(el, cb, nr + 1);
                      }
                  });
              }
              else {
                  getIonInput(el, cb, nr + 1);
              }
          }, 10);
      }
  }
  function isIonInput(el) {
      return el.getInputElement || (el.tagName && el.tagName.toLowerCase() === 'ion-input');
  }
  function getNativeElement(input, callback) {
      if (input) {
          if (isIonInput(input)) {
              getIonInput(input, callback);
          }
          else if (input.vInput) {
              // if it's Mobiscroll Input (Angular)
              callback(input.vInput.nativeElement);
          }
          else if (input._el) {
              // if it's Mobiscroll Input (React)
              callback(input._el);
          }
          else if (input.instance && input.instance._el) {
              // if it's Mobiscroll Input (Vue)
              callback(input.instance._el);
          }
          else if (input.nodeType === 1) {
              // The element must be a HTMLElement
              callback(input);
          }
          else if (isString(input)) {
              // It's a query string
              var inputElement = doc.querySelector(input);
              if (inputElement) {
                  callback(inputElement);
              }
          }
      }
  }
  function initPickerElement(el, inst, handleChange, handleClick) {
      // The element must be a HTMLElement, but might be something else,
      // if a custom component was passed through the component option
      if (!el || el.nodeType !== 1) {
          return noop;
      }
      var setReadOnly = function () {
          if ((inst.s.showOnClick || inst.s.showOnFocus) && isInput && !inst._allowTyping) {
              // Set input to readonly
              input.readOnly = true;
          }
      };
      var onClick = function (ev) {
          var s = inst.s;
          // Needed if the label of the input was clicked
          setReadOnly();
          if (handleClick) {
              handleClick(ev);
          }
          if (s.showOnClick && !s.disabled && (!inst._popup._isVisible || el !== inst._popup._prevFocus)) {
              setTimeout(function () {
                  inst._focusElm = el;
                  inst._anchor = s.anchor || el;
                  inst.open();
              });
          }
      };
      var onMouseDown = function (ev) {
          if (inst.s.showOnClick) {
              if (inst.s.showOnFocus) {
                  // Delay showing on click instead of focus, otherwise the document click will not close any previous popup
                  inst._preventShow = true;
              }
              if (!inst._allowTyping) {
                  // Prevent input focus
                  ev.preventDefault();
              }
          }
      };
      var onKeyDown = function (ev) {
          if (inst.s.showOnClick) {
              if (inst._isOpen) {
                  // Prevent closing the picker on input enter key
                  if (ev.keyCode === ENTER && inst._allowTyping) {
                      ev.stopPropagation();
                  }
              }
              else {
                  if (ev.keyCode === SPACE) {
                      ev.preventDefault();
                  }
                  // Open the picker on space or enter
                  if (ev.keyCode === ENTER || ev.keyCode === SPACE) {
                      onClick(ev);
                  }
              }
          }
      };
      var onFocus = function (ev) {
          setReadOnly();
          if (inst.s.showOnFocus) {
              if (inst._preventShow) {
                  inst._preventShow = false;
              }
              else {
                  onClick(ev);
              }
          }
      };
      var onBlur = function () {
          if (isInput) {
              // Reset original readonly state
              input.readOnly = readOnly;
          }
      };
      var onChange = function (ev) {
          if (handleChange) {
              handleChange(ev);
          }
      };
      var onWinFocus = function () {
          if (win.document.activeElement === el) {
              setReadOnly();
              inst._preventShow = true;
          }
      };
      var win = getWindow(el);
      var isInput = matches(el, 'input,select');
      var input = el;
      var readOnly;
      if (isInput) {
          input.autocomplete = 'off';
          // Save original readony state
          readOnly = input.readOnly;
      }
      listen(el, CLICK, onClick);
      listen(el, MOUSE_DOWN, onMouseDown);
      listen(el, KEY_DOWN, onKeyDown);
      listen(el, FOCUS, onFocus);
      listen(el, BLUR, onBlur);
      listen(el, CHANGE, onChange);
      listen(win, FOCUS, onWinFocus);
      return function () {
          if (isInput) {
              // Reset original readonly state
              input.readOnly = readOnly;
          }
          unlisten(el, CLICK, onClick);
          unlisten(el, MOUSE_DOWN, onMouseDown);
          unlisten(el, KEY_DOWN, onKeyDown);
          unlisten(el, FOCUS, onFocus);
          unlisten(el, BLUR, onBlur);
          unlisten(el, CHANGE, onChange);
          unlisten(win, FOCUS, onWinFocus);
      };
  }

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  /** @hidden */
  var PickerBase = /*#__PURE__*/ (function (_super) {
      __extends(PickerBase, _super);
      function PickerBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /** Does the picker support the null value
           * If the null value is not supported by the picker, it will trigger a change when the value differs after parse.
           * If the null value is supported by the picker, it will not trigger a change when the tempValueRep changes after parse.
           */
          _this._nullSupport = true;
          _this._onInputChange = function (ev, val) {
              // In case of tag input the value will come in the event detail, when tag clear is clicked
              var value = ev.detail || (val !== UNDEFINED ? val : ev.target.value);
              if (value !== _this._tempValueText && !_this._preventChange) {
                  _this._readValue(value, true);
                  // Make sure to write the correct value to the input, if validation changed it
                  _this._valueTextChange = value !== _this._tempValueText;
                  var newValue = isEmpty(value) ? null : _this._get(_this._tempValueRep);
                  _this.value = newValue;
                  _this._valueChange(newValue);
              }
              _this._preventChange = false;
          };
          // tslint:disable-next-line: no-empty
          _this._onResize = function (args) {
              _this._hook('onResize', args);
          };
          _this._onWrapperResize = function () {
              if (_this._wrapper) {
                  _this._onResize({ windowWidth: _this._wrapper.offsetWidth });
              }
          };
          _this._onPopupClose = function (args) {
              // Trigger the onCancel event if close happened from Cancel button click,
              // Esc key, overlay click or page scroll
              if (/cancel|esc|overlay|scroll/.test(args.source)) {
                  _this._hook('onCancel', {
                      value: _this.value,
                      valueText: _this._valueText,
                  });
              }
              _this.close();
          };
          _this._onPopupClosed = function (args) {
              if (args.focus) {
                  _this._preventShow = true;
              }
              _this._hook('onClosed', args);
              _this._onClosed();
          };
          _this._onPopupKey = function (args) {
              if (args.keyCode === 13) {
                  _this._onEnterKey(args);
              }
          };
          _this._onPopupOpen = function (args) {
              args.value = _this.value;
              args.valueText = _this._valueText;
              _this._hook('onOpen', args);
          };
          _this._onButtonClick = function (_a) {
              var domEvent = _a.domEvent, button = _a.button;
              if (button.name === 'set') {
                  _this.set();
              }
              if (_this._popup) {
                  _this._popup._onButtonClick({ domEvent: domEvent, button: button });
              }
          };
          _this._setInput = function (inp) {
              _this._el = inp && inp.nativeElement ? inp.nativeElement : inp;
          };
          _this._setPopup = function (popup) {
              _this._popup = popup;
          };
          _this._setWrapper = function (wrapper) {
              _this._wrapper = wrapper;
          };
          return _this;
      }
      PickerBase.prototype.open = function () {
          if (this._inst) {
              this._inst.open();
              return;
          }
          if (this.s.isOpen === UNDEFINED) {
              this.setState({ isOpen: true });
          }
      };
      PickerBase.prototype.close = function () {
          if (this.s.display === 'inline') {
              return;
          }
          if (this._inst) {
              this._inst.close();
              return;
          }
          var args = {
              value: this.value,
              valueText: this._valueText,
          };
          if (this.s.isOpen === UNDEFINED) {
              this.setState({ isOpen: false });
          }
          this._hook('onClose', args);
      };
      PickerBase.prototype.set = function () {
          this._valueRep = this._copy(this._tempValueRep);
          this._valueText = this._tempValueText;
          this._value = this.value = this._get(this._valueRep);
          this._valueChange(this.value);
      };
      PickerBase.prototype.position = function () {
          if (this._inst) {
              this._inst.position();
              return;
          }
          if (this._popup) {
              this._popup.position();
          }
      };
      PickerBase.prototype.isVisible = function () {
          if (this._inst) {
              return this._inst.isVisible();
          }
          return !!this._popup && this._popup.isVisible();
      };
      PickerBase.prototype.getVal = function () {
          return this._get(this._valueRep);
      };
      PickerBase.prototype.setVal = function (value) {
          this.value = value;
          this.setState({ value: value });
      };
      /** Returns the temporary value selected on the picker. */
      PickerBase.prototype.getTempVal = function () {
          return this._get(this._tempValueRep);
      };
      /**
       * Sets the Picker temporary value. This temp value is shown on the picker until the selection.
       * In the case of inline mode or when the touchUi setting is false the value will be set to the Model as well,
       * since in these cases there's no temporary value.
       * @param value The value to set to the datepicker as temporary value
       */
      PickerBase.prototype.setTempVal = function (value) {
          this._tempValueSet = true;
          this._tempValueRep = this._parse(value);
          this._setOrUpdate(true);
      };
      PickerBase.prototype._shouldValidate = function (s, prevS) {
          return false;
      };
      PickerBase.prototype._valueEquals = function (v1, v2) {
          return v1 === v2;
      };
      // tslint:disable-next-line: no-empty
      PickerBase.prototype._change = function (value) { };
      // tslint:enable variable-name
      PickerBase.prototype._render = function (s, state) {
          var _this = this;
          var props = this.props || {};
          var resp = this._respProps || {};
          var prevS = this._prevS;
          if (!this._touchUi) {
              s.display = resp.display || props.display || options.display || 'anchored';
              s.showArrow = resp.showArrow || props.showArrow || false;
          }
          // 'bubble' is deprecated, renamed to 'anchored'
          if (s.display === 'bubble') {
              s.display = 'anchored';
          }
          this._scrollLock = s.scrollLock;
          var isOpen = s.isOpen !== UNDEFINED ? s.isOpen : state.isOpen;
          var modelValue = s.modelValue !== UNDEFINED ? s.modelValue : s.value;
          var value = modelValue !== UNDEFINED
              ? modelValue // Controlled
              : state.value === UNDEFINED
                  ? s.defaultValue
                  : state.value; // Uncontrolled
          this._showInput = s.showInput !== UNDEFINED ? s.showInput : s.display !== 'inline' && s.element === UNDEFINED;
          if (!this._buttons ||
              s.buttons !== prevS.buttons ||
              s.display !== prevS.display ||
              s.setText !== prevS.setText ||
              s.cancelText !== prevS.cancelText ||
              s.closeText !== prevS.closeText ||
              s.touchUi !== prevS.touchUi) {
              // If no buttons given, in inline mode and desktop anchored mode defaults to no buttons,
              // all other cases will have set and cancel by default
              this._buttons = processButtons(this, s.buttons || (s.display !== 'inline' && (s.display !== 'anchored' || this._touchUi) ? ['cancel', 'set'] : []));
              // If no set button is found, live mode is activated
              this._live = true;
              if (this._buttons && this._buttons.length) {
                  for (var _i = 0, _a = this._buttons; _i < _a.length; _i++) {
                      var b = _a[_i];
                      if (b.name === 'ok' || b.name === 'set') {
                          this._live = false;
                      }
                  }
              }
          }
          // Parse and validate the value when needed:
          // - when the value changed
          // - when there's no value yet
          // - when _shouldvalidate returns true, depending on the picker implementation,
          // e.g. in case of datetime scroller value should be parsed again if wheels are changed
          // - when invalid, valid, or defaultSelection options are changed
          // Skip parse if value is changed from the UI - e.g. wheel scroll,
          // in this case validation runs on change and the value representation is updated in place.
          var valueChange = !this._valueEquals(value, this._value);
          if (valueChange ||
              this._tempValueRep === UNDEFINED ||
              this._shouldValidate(s, prevS) ||
              s.defaultSelection !== prevS.defaultSelection ||
              s.invalid !== prevS.invalid ||
              s.valid !== prevS.valid) {
              // we need to save the tempValue, for later checks if the onTempValueChange should be raised
              // const oldTempValueRep = this._tempValueRep ? this._copy(this._tempValueRep) : null;
              // const oldTempValue = this._tempValueRep ? this._get(oldTempValueRep) : UNDEFINED;
              this._readValue(value);
              // Trigger onChange if validation changed the value again
              var newValue_1 = this._get(this._tempValueRep);
              var validationChange_1 = !this._valueEquals(value, newValue_1) && (!this._nullSupport || !isEmpty(value));
              this._setHeader();
              clearTimeout(this._handler);
              this._handler = setTimeout(function () {
                  _this.value = value;
                  if (validationChange_1) {
                      _this._valueChange(newValue_1);
                  }
                  // in the case of angular directives, there will be two value changes, one for the directive
                  // and one for the dynamically created component. Event emitters are forwarded from the dyn. component,
                  // so there's no need to trigger the onTempChange again for the directive
                  if (!_this._valueEquals(_this._tempValue, newValue_1) && _this._inst === UNDEFINED) {
                      _this._hook('onTempChange', { value: newValue_1 });
                  }
              });
          }
          if (s.headerText !== prevS.headerText) {
              this._setHeader();
          }
          if (isOpen && !this._isOpen) {
              if (!this._tempValueSet || this._live) {
                  var tempValue = this._get(this._tempValueRep);
                  var parsedValue_1 = this._get(this._valueRep);
                  this._tempValueRep = this._copy(this._valueRep);
                  this._tempValueText = this._format(this._tempValueRep); // this._valueText;
                  this._tempValue = tempValue;
                  this._setHeader();
                  if (!this._valueEquals(tempValue, parsedValue_1)) {
                      setTimeout(function () {
                          // we cannot make a hook in render
                          _this._hook('onTempChange', { value: parsedValue_1 });
                      });
                  }
              }
              this._onOpen();
          }
          this._allowTyping = s.inputTyping && !touchUi && !this._touchUi;
          this._anchorAlign = s.anchorAlign || (this._touchUi ? 'center' : 'start');
          this._cssClass = 'mbsc-picker ' + (s.cssClass || '');
          this._isOpen = isOpen;
          this._maxWidth = s.maxWidth;
          this._valueTextChange = this._valueTextChange || this._oldValueText !== this._valueText;
          this._oldValueText = this._valueText;
          this._value = value;
          this._shouldInitInput =
              this._shouldInitInput ||
                  prevS.display === UNDEFINED ||
                  (s.display === 'inline' && prevS.display !== 'inline') ||
                  (s.display !== 'inline' && prevS.display === 'inline') ||
                  s.element !== prevS.element;
      };
      PickerBase.prototype._updated = function () {
          var _this = this;
          var s = this.s;
          var input = this._input;
          // we should initialize the components on the given input only, the directives should initialize the inputs
          // otherwise a single input will have the event handlers twice
          // (once for the directive and once for the dyn. created component)
          if (this._shouldInitInput && !this._inst) {
              this._unlisten();
              if (this._wrapper && s.display === 'inline') {
                  this._observer = resizeObserver(this._wrapper, this._onWrapperResize, this._zone);
              }
              getNativeElement(s.element || this._el, function (el) {
                  _this._el = el;
                  if (s.display !== 'inline') {
                      _this._resetEl = initPickerElement(el, _this, _this._onInputChange);
                  }
                  if (matches(el, 'input,select')) {
                      _this._input = el;
                      // Write the value (needs to happen after the event listeners were added)
                      _this._write(el);
                  }
              });
          }
          // Write the value to the input
          if (this._valueTextChange && input) {
              this._write(input);
          }
          this._shouldInitInput = false;
          this._valueTextChange = false;
          this._anchor = s.anchor || this._focusElm || s.element || this._el;
      };
      /**
       * Writes the value to the element and returns if the value was changed
       * @param elm The HTML element the value should be written to
       * @param text The value text that's written into the element
       */
      PickerBase.prototype._writeValue = function (elm, text, value) {
          var oldValue = elm.value;
          elm.value = text;
          return oldValue !== text;
      };
      PickerBase.prototype._destroy = function () {
          this._unlisten();
          this._shouldInitInput = true; // to work in React strict mode
      };
      PickerBase.prototype._setHeader = function () {
          var headerText = this.s.headerText;
          this._headerText = headerText ? headerText.replace(/\{value\}/i, this._tempValueText || '&nbsp;') : UNDEFINED;
      };
      PickerBase.prototype._setOrUpdate = function (preventChange) {
          var value = this._get(this._tempValueRep);
          this._tempValue = value;
          this._tempValueText = this._format(this._tempValueRep);
          this._setHeader();
          if (!preventChange) {
              this._hook('onTempChange', { value: value });
          }
          if (this._live) {
              this.set();
          }
          else {
              this.forceUpdate();
          }
      };
      // tslint:disable variable-name
      /**
       * Returns a copy of the value representation.
       * Is used to copy the temporary value to the final value and vica versa.
       * @param value The value to copy.
       */
      PickerBase.prototype._copy = function (value) {
          return value;
      };
      /**
       * Formats the value representation into a string to display the selection.
       * @param value The value to format.
       */
      PickerBase.prototype._format = function (value) {
          return value;
      };
      /**
       * Transforms the value representation into the actual value.
       * E.g. in case of date scroller the value is represented as an array like [5, 28, 2020],
       * this function will transform it into a date object.
       * @param value The value to transform.
       */
      PickerBase.prototype._get = function (value) {
          return value;
      };
      /**
       * Parses a string or actual value into the value representation.
       * E.g. in case of the date scroller the '05/28/2020' string should be parsed into [5, 28, 2020].
       * @param valueText The value to parse.
       */
      PickerBase.prototype._parse = function (valueText, fromInput) {
          return valueText;
      };
      // tslint:disable-next-line: no-empty
      PickerBase.prototype._validate = function () { };
      // tslint:disable-next-line: no-empty
      PickerBase.prototype._onClosed = function () { };
      // tslint:disable-next-line: no-empty
      PickerBase.prototype._onOpen = function () { };
      // tslint:disable-next-line: no-empty
      PickerBase.prototype._onParse = function () { };
      /**
       * Default behavior for the enter key in a picker to set the selection and close the picker
       * @param args
       */
      PickerBase.prototype._onEnterKey = function (args) {
          this.set();
          this.close();
      };
      // tslint:enable variable-name
      PickerBase.prototype._valueChange = function (value) {
          if (this.s.value === UNDEFINED) {
              this.setState({ value: value });
          }
          this._change(value);
          this._hook('onChange', {
              value: value,
              valueText: this._tempValueText,
          });
      };
      PickerBase.prototype._readValue = function (value, fromInput) {
          this._tempValueRep = this._parse(value, fromInput);
          this._onParse();
          this._validate();
          this._tempValueText = this._format(this._tempValueRep);
          this._valueRep = this._copy(this._tempValueRep);
          this._valueText = !isEmpty(value) ? this._tempValueText : '';
      };
      PickerBase.prototype._unlisten = function () {
          if (this._resetEl) {
              this._resetEl();
              this._resetEl = UNDEFINED;
          }
          if (this._observer) {
              this._observer.detach();
              this._observer = UNDEFINED;
          }
      };
      PickerBase.prototype._write = function (input) {
          var _this = this;
          var value = this._value;
          var changed = this._writeValue(input, this._valueText || '', value);
          if (changed) {
              setTimeout(function () {
                  _this._preventChange = true;
                  trigger(input, INPUT);
                  trigger(input, CHANGE);
              });
          }
          // In case of jquery/js mobiscroll input, pass pickerMap and pickerValue to the input, needed for tags
          var mbscInput = input.__mbscFormInst;
          if (mbscInput) {
              mbscInput.setOptions({ pickerMap: this.s.valueMap, pickerValue: value });
          }
      };
      PickerBase.defaults = {
          cancelText: 'Cancel',
          closeText: 'Close',
          focusOnClose: os !== 'android',
          okText: 'Ok',
          setText: 'Set',
          showOnFocus: touchUi,
      };
      return PickerBase;
  }(BaseComponent));

  // tslint:disable no-non-null-assertion
  // tslint:disable no-inferrable-types
  var WEEK_DAYNAMES = { 0: 'SU', 1: 'MO', 2: 'TU', 3: 'WE', 4: 'TH', 5: 'FR', 6: 'SA' };
  var WEEK_DAYS = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
  var RULE_KEY_MAP = {
      byday: 'weekDays',
      bymonth: 'month',
      bymonthday: 'day',
      bysetpos: 'pos',
      dtstart: 'from',
      freq: 'repeat',
      wkst: 'weekStart',
  };
  /** @hidden */
  function addMultiDayEvent(obj, item, s, overwrite) {
      var start = makeDate(item.start, item.allDay ? UNDEFINED : s);
      var end = makeDate(item.end, item.allDay ? UNDEFINED : s);
      var duration = end - start;
      if (overwrite) {
          item.start = start;
          item.end = end;
      }
      start = getDateOnly(start);
      end = s.exclusiveEndDates ? end : getDateOnly(addDays(end, 1));
      // If event has no duration, it should still be added to the start day
      while (start < end || !duration) {
          addToList(obj, start, item);
          start = addDays(start, 1);
          duration = 1;
      }
  }
  /** @hidden */
  function addToList(obj, d, data) {
      var key = getDateStr(d);
      if (!obj[key]) {
          obj[key] = [];
          // Stored the date object on the array for performance reasons, so we don't have to parse it again later
          // TODO: do this with proper types
          obj[key].date = getDateOnly(d, true);
      }
      obj[key].push(data);
  }
  /** @hidden */
  function getExceptionDateMap(dtStart, start, end, s, exception, exceptionRule) {
      var map = {};
      if (exception) {
          var exceptionDates = getExceptionList(exception);
          for (var _i = 0, exceptionDates_1 = exceptionDates; _i < exceptionDates_1.length; _i++) {
              var e = exceptionDates_1[_i];
              map[getDateStr(makeDate(e))] = true;
          }
      }
      if (exceptionRule) {
          // Get exception date list from the rule
          var exceptionDateList = getOccurrences(exceptionRule, dtStart, start, end, s);
          for (var _a = 0, exceptionDateList_1 = exceptionDateList; _a < exceptionDateList_1.length; _a++) {
              var ex = exceptionDateList_1[_a];
              map[getDateStr(ex.d)] = true;
          }
      }
      return map;
  }
  /** @hidden */
  function getDateFromItem(item) {
      // If the item is a string, Date, or moment object, it's directly the date (e.g. in case of invalid setting),
      // otherwise check the d or start attributes
      return isString(item) || item.getTime || item.toDate ? item : item.start || item.date;
  }
  /** @hidden */
  function parseRule(ruleStr) {
      var rule = {};
      var pairs = ruleStr.split(';');
      for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
          var pair = pairs_1[_i];
          var values = pair.split('=');
          var key = values[0].trim().toLowerCase();
          var value = values[1].trim();
          rule[RULE_KEY_MAP[key] || key] = value;
      }
      return rule;
  }
  /**
   * @hidden
   * Returns the first date on which occurs something from the list of rules/dates
   * For example it returns the next invalid date from the list of invalid and a given start date
   */
  function getNextOccurrence(list, from, s, displayFormat) {
      // this will hold the next invalid date or null if none was found
      var closest = null;
      // loop through all the invalid entries to find the closest date to the starting point
      for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
          var item = list_1[_i];
          if (item.recurring) {
              // Recurring rule
              var dtStart = makeDate(item.start || item.date);
              var firstOccurrence = getOccurrences(item.recurring, dtStart, from, UNDEFINED, s, item.reccurringException, item.recurringExceptionRule, 'first');
              if (!closest || firstOccurrence < closest) {
                  closest = firstOccurrence;
              }
          }
          else if (item.start && item.end) {
              // Range with start/end
              var start = makeDate(item.start, s, displayFormat);
              var end = makeDate(item.end, s, displayFormat);
              if (end > from) {
                  if (start <= from) {
                      closest = from;
                  }
                  else {
                      closest = closest && closest < start ? closest : start;
                  }
              }
          }
          else {
              // Exact date
              var exactDate = makeDate(getDateFromItem(item), s, displayFormat);
              if (exactDate > from && (!closest || exactDate < closest)) {
                  closest = exactDate;
              }
          }
      }
      return closest;
  }
  /**
   * @hidden
   * Returns the latest possible date from a list without braking a consecutive day sequence.
   */
  function getLatestOccurrence(list, from, s, displayFormat) {
      var latest = from;
      // Sort entries by start date
      list.sort(function (a, b) {
          var d1 = makeDate(getDateFromItem(a), s, displayFormat);
          var d2 = makeDate(getDateFromItem(b), s, displayFormat);
          return d1 - d2;
      });
      // Loop through the list to find the latest entry
      for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
          var item = list_2[_i];
          if (item.recurring) {
              // Recurring rule
              var dtStart = makeDate(item.start || item.date);
              var latestOccurrence = getOccurrences(item.recurring, dtStart, from, UNDEFINED, s, item.reccurringException, item.recurringExceptionRule, 'last');
              if (latestOccurrence > latest) {
                  latest = latestOccurrence;
              }
          }
          else if (item.start && item.end) {
              // Range with start/end
              var start = makeDate(item.start, s, displayFormat);
              var end = makeDate(item.end, s, displayFormat);
              if (end > latest && getDayDiff(latest, start) <= 1) {
                  latest = end;
              }
          }
          else {
              // Exact date
              var exactDate = makeDate(getDateFromItem(item), s, displayFormat);
              if (exactDate > latest && getDayDiff(latest, exactDate) <= 1) {
                  latest = exactDate;
              }
          }
      }
      return latest;
  }
  /** @hidden */
  function getExceptionList(exception) {
      if (exception) {
          if (isArray(exception)) {
              return exception;
          }
          if (isString(exception)) {
              return exception.split(',');
          }
          return [exception];
      }
      return [];
  }
  /** @hidden */
  function getOccurrences(rule, dtStart, start, end, s, exception, exceptionRule, returnOccurrence) {
      if (isString(rule)) {
          rule = parseRule(rule);
      }
      var getYear = s.getYear;
      var getMonth = s.getMonth;
      var getDay = s.getDay;
      var getDate = s.getDate;
      var getMaxDays = s.getMaxDayOfMonth;
      var freq = (rule.repeat || '').toLowerCase();
      var interval = rule.interval || 1;
      var count = rule.count;
      // the staring point of the current rule
      var from = rule.from ? makeDate(rule.from) : dtStart || (interval !== 1 || count !== UNDEFINED ? new Date() : start);
      var fromDate = getDateOnly(from);
      var fromYear = getYear(from);
      var fromMonth = getMonth(from);
      var until = rule.until ? makeDate(rule.until) : Infinity;
      var occurredBefore = from < start;
      var rangeStart = occurredBefore ? start : getDateOnly(from);
      var firstOnly = returnOccurrence === 'first';
      var lastOnly = returnOccurrence === 'last';
      var rangeEnd = firstOnly || lastOnly || !end ? until : until < end ? until : end;
      var countOrInfinity = count === UNDEFINED ? Infinity : count;
      var weekDays = (rule.weekDays || WEEK_DAYNAMES[from.getDay()]).split(',');
      var weekStart = WEEK_DAYS[(rule.weekStart || 'MO').trim().toUpperCase()];
      var days = isArray(rule.day) ? rule.day : ((rule.day || getDay(from)) + '').split(',');
      var months = isArray(rule.month) ? rule.month : ((rule.month || getMonth(from) + 1) + '').split(',');
      var occurrences = [];
      var hasPos = rule.pos !== UNDEFINED;
      var pos = hasPos ? +rule.pos : 1;
      var weekDayValues = [];
      var exceptionDateMap = end ? getExceptionDateMap(dtStart, start, end, s, exception, exceptionRule) : {};
      var first;
      var iterator;
      var repeat = true;
      var i = 0;
      var nr = 0;
      var closest = null;
      var latest = start;
      for (var _i = 0, weekDays_1 = weekDays; _i < weekDays_1.length; _i++) {
          var weekDay = weekDays_1[_i];
          weekDayValues.push(WEEK_DAYS[weekDay.trim().toUpperCase()]);
      }
      var handleOccurrence = function () {
          // If end is not specified, get the exception dates for the current day
          if (!end) {
              exceptionDateMap = getExceptionDateMap(iterator, iterator, addDays(iterator, 1), s, exception, exceptionRule);
          }
          // Check that it's not an exception date and it's after the start of the range
          if (!exceptionDateMap[getDateStr(iterator)] && iterator >= rangeStart) {
              if (firstOnly) {
                  // if it is closer to the start than the current one, stop looking further
                  closest = !closest || iterator < closest ? iterator : closest;
                  repeat = false;
              }
              else if (lastOnly) {
                  var diff = getDayDiff(latest, iterator);
                  latest = iterator > latest && diff <= 1 ? iterator : latest;
                  repeat = diff <= 1;
              }
              else {
                  occurrences.push({ d: iterator, i: nr });
              }
          }
          nr++;
      };
      var handlePos = function (monthFirstDay, monthLastDay) {
          var matches = [];
          for (var _i = 0, weekDayValues_1 = weekDayValues; _i < weekDayValues_1.length; _i++) {
              var weekDay = weekDayValues_1[_i];
              var startWeekDay = getFirstDayOfWeek(monthFirstDay, { firstDay: weekDay });
              for (var d = startWeekDay; d < monthLastDay; d.setDate(d.getDate() + 7)) {
                  if (d.getMonth() === monthFirstDay.getMonth()) {
                      matches.push(+d);
                  }
              }
          }
          matches.sort();
          var match = matches[pos < 0 ? matches.length + pos : pos - 1];
          iterator = match ? new Date(match) : monthLastDay;
          if (iterator < rangeEnd) {
              if (match) {
                  handleOccurrence();
              }
          }
          else {
              repeat = false;
          }
      };
      switch (freq) {
          case 'daily':
              nr = count && occurredBefore ? floor(getDayDiff(from, start) / interval) : 0;
              while (repeat) {
                  iterator = getDate(getYear(from), getMonth(from), getDay(from) + nr * interval);
                  if (iterator < rangeEnd && nr < countOrInfinity) {
                      handleOccurrence();
                  }
                  else {
                      repeat = false;
                  }
              }
              break;
          case 'weekly': {
              // const nrByDay: { [key: number]: number } = {};
              var sortedDays = weekDayValues;
              var fromFirstWeekDay = getFirstDayOfWeek(from, { firstDay: weekStart });
              var fromWeekDay_1 = fromFirstWeekDay.getDay();
              // const startFirstWeekDay = getFirstDayOfWeek(start, { firstDay: weekStart });
              // Sort week day numbers to start with from day
              sortedDays.sort(function (a, b) {
                  a = a - fromWeekDay_1;
                  a = a < 0 ? a + 7 : a;
                  b = b - fromWeekDay_1;
                  b = b < 0 ? b + 7 : b;
                  return a - b;
              });
              // TODO: the calculation below is not always correct, and leads to skipping occurrences in the actual range
              // Calculate how many times the event occured before the start date of the range
              // if (occurredBefore && count === UNDEFINED) {
              //   const daysNr = floor(getDayDiff(fromFirstWeekDay, startFirstWeekDay));
              //   for (const weekDay of sortedDays) {
              //     let temp = floor(daysNr / (7 * interval));
              //     if (weekDay < from.getDay()) {
              //       temp--;
              //     }
              //     if (weekDay < start.getDay()) {
              //       temp++;
              //     }
              //     nrByDay[weekDay] = temp;
              //     nr += temp;
              //   }
              // }
              while (repeat) {
                  for (var _a = 0, sortedDays_1 = sortedDays; _a < sortedDays_1.length; _a++) {
                      var weekDay = sortedDays_1[_a];
                      first = addDays(fromFirstWeekDay, weekDay < weekStart ? weekDay - weekStart + 7 : weekDay - weekStart);
                      // iterator = getDate(getYear(first), getMonth(first), getDay(first) + ((nrByDay[weekDay] || 0) + i) * 7 * interval);
                      iterator = getDate(getYear(first), getMonth(first), getDay(first) + i * 7 * interval);
                      if (iterator < rangeEnd && nr < countOrInfinity) {
                          if (iterator >= fromDate) {
                              handleOccurrence();
                          }
                      }
                      else {
                          repeat = false;
                      }
                  }
                  i++;
              }
              break;
          }
          case 'monthly':
              // TODO: calculate occurences before start instead of iterating through all
              while (repeat) {
                  var maxDays = getMaxDays(fromYear, fromMonth + i * interval);
                  if (hasPos) {
                      var monthFirstDay = getDate(fromYear, fromMonth + i * interval, 1);
                      var monthLastDay = getDate(fromYear, fromMonth + i * interval + 1, 1);
                      handlePos(monthFirstDay, monthLastDay);
                  }
                  else {
                      for (var _b = 0, days_1 = days; _b < days_1.length; _b++) {
                          var d = days_1[_b];
                          var day = +d;
                          iterator = getDate(fromYear, fromMonth + i * interval, day < 0 ? maxDays + day + 1 : day);
                          if (iterator < rangeEnd && nr < countOrInfinity) {
                              if (maxDays >= d && iterator >= fromDate) {
                                  handleOccurrence();
                              }
                          }
                          else {
                              repeat = false;
                          }
                      }
                  }
                  i++;
              }
              break;
          case 'yearly':
              // TODO: calculate occurences before start instead of iterating through all
              while (repeat) {
                  for (var _c = 0, months_1 = months; _c < months_1.length; _c++) {
                      var m = months_1[_c];
                      var month = +m;
                      var maxDays = getMaxDays(fromYear + i * interval, month - 1);
                      if (hasPos) {
                          var monthFirstDay = getDate(fromYear + i * interval, month - 1, 1);
                          var monthLastDay = getDate(fromYear + i * interval, month, 1);
                          handlePos(monthFirstDay, monthLastDay);
                      }
                      else {
                          for (var _d = 0, days_2 = days; _d < days_2.length; _d++) {
                              var d = days_2[_d];
                              var day = +d;
                              iterator = getDate(fromYear + i * interval, month - 1, day < 0 ? maxDays + day + 1 : day);
                              if (iterator < rangeEnd && nr < countOrInfinity) {
                                  if (maxDays >= d && iterator >= fromDate) {
                                      handleOccurrence();
                                  }
                              }
                              else {
                                  repeat = false;
                              }
                          }
                      }
                  }
                  i++;
              }
              break;
      }
      return firstOnly ? closest : lastOnly ? latest : occurrences;
  }
  /** @hidden */
  function getEventMap(list, start, end, s, overwrite) {
      var obj = {};
      var tz = s.timezonePlugin;
      var dataTimezone = s.dataTimezone || s.displayTimezone;
      // We need to get the occurence start date in data timezone to make sure times are correct
      var tzOpt = tz ? { displayTimezone: dataTimezone, timezonePlugin: tz } : s;
      if (!list) {
          return UNDEFINED;
      }
      for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
          var item = list_3[_i];
          var d = getDateFromItem(item);
          var dt = makeDate(d, item.allDay ? UNDEFINED : s);
          if (item.recurring) {
              // Use a timezone-less start for getting the occurences, since getOccurrences does not use timezones
              var dtStart = ISO_8601_TIME.test(d) ? null : makeDate(d);
              // We need to extend the range with 1-1 days, because
              // start/end is in local timezone, but data is in data timezone.
              // We cannot convert start/end to data timezone, because the time part is not relevant here.
              var from = addDays(start, -1);
              var until = addDays(end, 1);
              var dates = getOccurrences(item.recurring, dtStart, from, until, s, item.recurringException, item.recurringExceptionRule);
              var origStart = createDate(item.allDay ? UNDEFINED : tzOpt, dt);
              var origEnd = item.end ? makeDate(item.end, item.allDay ? UNDEFINED : s) : origStart;
              var duration = +origEnd - +origStart;
              for (var _a = 0, dates_1 = dates; _a < dates_1.length; _a++) {
                  var occurrence = dates_1[_a];
                  var date = occurrence.d;
                  // For each occurrence create a clone of the event
                  var clone = __assign({}, item);
                  // Modify the start/end dates for the occurence
                  if (item.start) {
                      clone.start = createDate(item.allDay ? UNDEFINED : tzOpt, date.getFullYear(), date.getMonth(), date.getDate(), origStart.getHours(), origStart.getMinutes(), origStart.getSeconds());
                  }
                  else {
                      clone.allDay = true;
                      clone.start = createDate(UNDEFINED, date.getFullYear(), date.getMonth(), date.getDate());
                  }
                  if (item.end) {
                      if (item.allDay) {
                          // In case of all-day events keep the length in days, end set the original time for the end day
                          var endDay = addDays(date, getDayDiff(origStart, origEnd));
                          clone.end = new Date(endDay.getFullYear(), endDay.getMonth(), endDay.getDate(), origEnd.getHours(), origEnd.getMinutes(), origEnd.getSeconds());
                      }
                      else {
                          // In case of non all-day events keep the event duration
                          clone.end = createDate(tzOpt, +clone.start + duration);
                      }
                      if (item.end === '00:00') {
                          clone.end.setHours(23, 59, 59, 999);
                      }
                  }
                  // Save the occurrence number
                  clone.nr = occurrence.i;
                  // Set uid
                  clone.occurrenceId = clone.id + '_' + getDateStr(clone.start);
                  // Save reference to the original event
                  clone.original = item;
                  if (clone.start && clone.end) {
                      addMultiDayEvent(obj, clone, s, overwrite);
                  }
                  else {
                      addToList(obj, date, clone);
                  }
              }
          }
          else if (item.start && item.end) {
              addMultiDayEvent(obj, item, s, overwrite);
          }
          else if (dt) {
              // Exact date
              addToList(obj, dt, item);
          }
      }
      return obj;
  }

  // tslint:disable no-non-null-assertion
  /**
   * Checks if a date is invalid or not.
   * @param s Options object for the exclusiveEndDates and timezone options used
   * @param d The date to check.
   * @param invalids Object map containing the invalids.
   * @param valids Object map containing the valids.
   * @param min Timestamp of the min date.
   * @param max Timestamp of the max date.
   */
  function isInvalid(s, d, invalids, valids, min, max) {
      var key = getDateStr(d); // +getDateOnly(d);
      if ((min && +d < min) || (max && +d > max)) {
          return true;
      }
      if (valids && valids[key]) {
          return false;
      }
      var invalidsForDay = invalids && invalids[key];
      if (invalidsForDay) {
          for (var _i = 0, invalidsForDay_1 = invalidsForDay; _i < invalidsForDay_1.length; _i++) {
              var invalid = invalidsForDay_1[_i];
              var start = invalid.start, end = invalid.end, allDay = invalid.allDay;
              if (start && end && !allDay) {
                  var endDate = getEndDate(s, allDay, start, end);
                  var dayStart = getDayStart(s, d);
                  var dayEnd = getDayEnd(s, endDate);
                  if (!isSameDay(start, end) &&
                      (+start === +dayStart || +endDate === +dayEnd || (!isSameDay(d, start) && !isSameDay(d, end) && d > start && d < end))
                  // d <= end???
                  ) {
                      return invalid;
                  }
              }
              else {
                  return invalid;
              }
          }
      }
      return false;
  }
  /**
   * Returns the closest valid date. Actually gets the closest valid only if the next or the previous valid is in
   * the other month. Otherwise it gets the next valid (when not given direction), regardless if the previous valid is closer.
   * @param d Initial date.
   * @param s Date & time options.
   * @param min Timestamp of the min date.
   * @param max Timestamp of the max date.
   * @param invalids Object map containing the invalids.
   * @param valids Object map containing the valids.
   * @param dir Direction to find the next valid date. If 1, it will search forwards, if -1, backwards,
   * otherwise will search both directions and return the closest one.
   */
  function getClosestValidDate(d, s, min, max, invalids, valids, dir) {
      var next;
      var prev;
      var nextInvalid = true;
      var prevInvalid = true;
      var up = 0;
      var down = 0;
      if (+d < min) {
          d = createDate(s, min);
      }
      if (+d > max) {
          d = createDate(s, max);
      }
      var year = s.getYear(d);
      var month = s.getMonth(d);
      var start = s.getDate(year, month - 1, 1);
      var end = s.getDate(year, month + 2, 1);
      var from = +start > min ? +start : min;
      var until = +end < max ? +end : max;
      // If invalids are not passed we create the invalids map for +/- 1 month
      if (!invalids) {
          // Map the valids and invalids for prev and next months
          valids = getEventMap(s.valid, start, end, s, true);
          invalids = getEventMap(s.invalid, start, end, s, true);
      }
      if (!isInvalid(s, d, invalids, valids, min, max)) {
          return d;
      }
      next = d;
      prev = d;
      // Find next valid value
      while (nextInvalid && +next < until && up < 100) {
          next = addDays(next, 1);
          nextInvalid = isInvalid(s, next, invalids, valids, min, max);
          up++;
      }
      // Find previous valid value
      while (prevInvalid && +prev > from && down < 100) {
          prev = addDays(prev, -1);
          prevInvalid = isInvalid(s, prev, invalids, valids, min, max);
          down++;
      }
      // If no valid value found, return the invalid value
      if (nextInvalid && prevInvalid) {
          return d;
      }
      if (dir === 1 && !nextInvalid) {
          return next;
      }
      if (dir === -1 && !prevInvalid) {
          return prev;
      }
      // if (viewStart && viewEnd) {
      //   if (+next >= viewStart && +next < viewEnd) {
      //     return next;
      //   }
      //   if (+prev >= viewStart && +prev < viewEnd) {
      //     return prev;
      //   }
      // }
      if (isSameMonth(d, next, s) && !nextInvalid) {
          return next;
      }
      if (isSameMonth(d, prev, s) && !prevInvalid) {
          return prev;
      }
      return prevInvalid || (down >= up && !nextInvalid) ? next : prev;
  }

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  var modules = {};
  var RANGE_SEPARATOR = ' - ';
  var CALENDAR_CTRL = ['calendar'];
  var INVALID_ALL = [{ recurring: { repeat: 'daily' } }];
  function notActive(active) {
      return active === 'start' ? 'end' : 'start';
  }
  /**
   * Returns the range selection stard/end dates calculated from a date.
   * Takes into account the selectSize and firstSelectDay options and calculates the selection start/end dates
   * from the passed date.
   */
  function getPresetRange(timestamp, s) {
      var date = new Date(timestamp);
      var firstSelectDay = s.firstSelectDay !== UNDEFINED ? s.firstSelectDay : s.firstDay;
      var start = getFirstDayOfWeek(date, s, firstSelectDay);
      var end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + s.selectSize - 1);
      return { start: start, end: end };
  }
  /** @hidden */
  var DatepickerBase = /*#__PURE__*/ (function (_super) {
      __extends(DatepickerBase, _super);
      function DatepickerBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._iso = {};
          _this._onActiveChange = function (ev) {
              _this._active = ev.date;
              _this.forceUpdate();
          };
          _this._onResize = function (ev) {
              var viewportWidth = ev.windowWidth;
              // Will prevent the immediate positioning of the popup,
              // postponing it to the next cycle, with the potential new options (if responsive)
              ev.cancel = _this.state.width !== viewportWidth;
              _this.setState({
                  isLarge: ev.isLarge,
                  maxPopupWidth: ev.maxPopupWidth,
                  width: viewportWidth,
                  widthType: viewportWidth > 600 ? 'md' : 'sm',
              });
              // return this._hook('onPosition', ev);
          };
          _this._onDayHoverIn = function (_a) {
              var date = _a.date, hidden = _a.hidden;
              _this.setState({ hoverDate: hidden ? UNDEFINED : +date });
          };
          _this._onDayHoverOut = function (_a) {
              var date = _a.date;
              if (_this.state.hoverDate === +date) {
                  _this.setState({ hoverDate: UNDEFINED });
              }
          };
          /** Saves the last clicked date on the calendar */
          _this._onCellClick = function (args) {
              _this._lastSelected = addTimezone(_this.s, args.date);
              args.active = _this._activeSelect;
              _this._hook('onCellClick', args);
          };
          _this._onCalendarChange = function (ev) {
              _this._tempValueSet = false;
              var s = _this.s;
              var tempValueRep = _this._copy(_this._tempValueRep);
              var date = map(ev.value, function (item) { return addTimezone(s, item); });
              var isPreset = s.select === 'preset-range';
              var isRange = s.select === 'range';
              var newSelection = isRange && _this._newSelection;
              var slide = (isRange || isPreset) && s.exclusiveEndDates && !_this._hasTime;
              if (slide && tempValueRep.end) {
                  // tempValueRep.end = +getDayStart(s, addDays(createDate(s, tempValueRep.end), -1));
                  tempValueRep.end = +getDayStart(s, createDate(s, tempValueRep.end - 1));
              }
              // if time was set previosly set it to the new selected date as well
              if (_this._hasTime && _this._selectedTime && !isRange) {
                  if (_this.s.selectMultiple) {
                      var lastSelection = date[date.length - 1];
                      if (lastSelection) {
                          lastSelection.setHours(_this._selectedTime.getHours(), _this._selectedTime.getMinutes());
                      }
                  }
                  else {
                      date.setHours(_this._selectedTime.getHours(), _this._selectedTime.getMinutes());
                  }
              }
              if (isRange || isPreset) {
                  // get the newly selected value
                  var oldValue = _this._getDate(tempValueRep);
                  var oldRangeDate = oldValue.filter(function (v) { return v !== null; });
                  var oldRange = oldRangeDate.map(function (dateValue) { return +dateValue; });
                  var oldRangeCut_1 = oldRangeDate.map(function (v) { return +getDateOnly(v); });
                  var newValue = date.filter(function (v) { return oldRangeCut_1.indexOf(+v) < 0; })[0];
                  if (isPreset) {
                      // preset-range
                      if (newValue) {
                          // when no new value is selected, we shouldn't do anything
                          var _a = getPresetRange(+newValue, s), start = _a.start, end = _a.end;
                          tempValueRep.start = +start;
                          tempValueRep.end = +end;
                      }
                  }
                  else {
                      // range
                      var cycle = !_this._hasTime;
                      var cycleAndLabels = _this._renderControls;
                      var activeSelect = _this._activeSelect;
                      var notActiveSelect = notActive(activeSelect);
                      if (newValue) {
                          if (_this._hasTime && _this._selectedTime) {
                              newValue.setHours(_this._selectedTime.getHours(), _this._selectedTime.getMinutes(), _this._selectedTime.getSeconds(), _this._selectedTime.getMilliseconds());
                          }
                          switch (oldRange.length) {
                              case 0: {
                                  // simple start/end date selection
                                  tempValueRep = {};
                                  tempValueRep[activeSelect] = +newValue;
                                  break;
                              }
                              case 1: {
                                  if (cycleAndLabels) {
                                      // oneCycle selection
                                      tempValueRep[activeSelect] = +newValue;
                                      break;
                                  }
                                  if (oldRange[0] > +newValue || _this._activeSelect === 'start') {
                                      // new start date selection
                                      if (_this._hasTime) {
                                          tempValueRep[activeSelect] = +newValue;
                                      }
                                      else {
                                          tempValueRep = { start: +newValue };
                                          cycle = false;
                                      }
                                  }
                                  else {
                                      // simple end date selection
                                      tempValueRep.end = +newValue;
                                  }
                                  break;
                              }
                              case 2: {
                                  if (cycleAndLabels) {
                                      // oneCycle selection
                                      tempValueRep[activeSelect] = +newValue;
                                      break;
                                  }
                                  if (oldRange[0] > +newValue || _this._activeSelect === 'start') {
                                      if (_this._hasTime) {
                                          tempValueRep[activeSelect] = +newValue;
                                      }
                                      else {
                                          tempValueRep = { start: +newValue };
                                          if (_this._activeSelect === 'end') {
                                              cycle = false;
                                          }
                                      }
                                  }
                                  else if (_this._activeSelect === 'end') {
                                      // new end date selection
                                      tempValueRep.end = +newValue;
                                  }
                                  break;
                              }
                          }
                          // validate cross start/end (when the start is bigger than end)
                          if (cycleAndLabels && tempValueRep.start && tempValueRep.end && tempValueRep.start > tempValueRep.end) {
                              tempValueRep = {
                                  start: +newValue,
                              };
                              _this._setActiveSelect('end');
                          }
                      }
                      else {
                          // either the already selected start or end date were selected
                          var newDate = void 0;
                          if (oldRange.length === 1) {
                              // only the start date was selected
                              newDate = createDate(s, oldRange[0]);
                          }
                          else {
                              newDate = _this._lastSelected;
                          }
                          if (_this._hasTime && _this._selectedTime) {
                              newDate.setHours(_this._selectedTime.getHours(), _this._selectedTime.getMinutes(), _this._selectedTime.getSeconds(), _this._selectedTime.getMilliseconds());
                          }
                          else if (!s.exclusiveEndDates &&
                              !_this._hasTime &&
                              _this._activeSelect === 'end' &&
                              oldValue[0] &&
                              isSameDay(newDate, oldValue[0])) {
                              newDate.setHours(23, 59, 59, 999);
                          }
                          if (cycleAndLabels || _this._hasTime) {
                              // oneCycle selection
                              tempValueRep[activeSelect] = +newDate;
                          }
                          else if (_this._activeSelect === 'start') {
                              tempValueRep = { start: +newDate };
                          }
                          else {
                              // _activeSelect === 'end'
                              tempValueRep.end = +newDate;
                          }
                      }
                      // validate the new range
                      if (tempValueRep.start && tempValueRep.end) {
                          // this can occur if a time control is present and we change the start date to the same day the end is on,
                          // but the end date's time is am and the start date was pm
                          if (tempValueRep.start > tempValueRep.end) {
                              var st = createDate(s, tempValueRep.start);
                              var ed = createDate(s, tempValueRep.end);
                              if (isSameDay(st, ed)) {
                                  ed.setHours(st.getHours(), st.getMinutes(), st.getSeconds(), st.getMilliseconds());
                                  tempValueRep.end = +ed;
                              }
                              else {
                                  tempValueRep.end = UNDEFINED;
                              }
                          }
                          // validate the range for minRange
                          if (s.minRange && tempValueRep.end) {
                              var newEnd = _this._hasTime ? tempValueRep.start + s.minRange : +addDays(createDate(s, tempValueRep.start), s.minRange - 1);
                              // if we slide the selection to a lesser range than the minimum,
                              // (this can be done only when there's a time control and we change the date, not the time)
                              // we let the time control validate the time part = we don't clear the end
                              if (tempValueRep.end < newEnd && (!_this._hasTime || activeSelect === 'start')) {
                                  tempValueRep.end = UNDEFINED;
                              }
                          }
                          // validate the range for maxRange
                          if (s.maxRange && tempValueRep.end) {
                              // the end check is needed because the minRange could have cleared the end above
                              // if we slide the selection to a greater range than the maximum,
                              // (this can be done only when there's a time control and we change the date, not the time)
                              // we let the time control validate the time part = we don't clear the end
                              var newEnd = _this._hasTime ? tempValueRep.start + s.maxRange : +addDays(createDate(s, tempValueRep.start), s.maxRange) - 1;
                              if (tempValueRep.end > newEnd && (!_this._hasTime || activeSelect === 'start')) {
                                  tempValueRep.end = UNDEFINED;
                              }
                          }
                          // validate the range for inRangeInvalids
                          // we refine the selection and invalids are not allowed in the range
                          // then need to refine/clear the end date
                          if (tempValueRep.end && activeSelect === 'start' && !s.inRangeInvalid) {
                              var nextInvalid = s.valid
                                  ? addDays(getLatestOccurrence(s.valid, createDate(s, tempValueRep.start), s), 1)
                                  : getNextOccurrence(s.invalid || [], createDate(s, tempValueRep.start), s);
                              if (nextInvalid !== null && +nextInvalid < tempValueRep.end) {
                                  // there is an invalid date in the range
                                  tempValueRep.end = UNDEFINED;
                              }
                          }
                      }
                      // Cycling is based on whether we are refining the selection or creating a new selection.
                      // When we open the picker, we always start a new selection (no matter if there was already a selected date)
                      // Also sometimes the cycling is prevented, for example when the selection is forced to be the not active date
                      // (when selecting an end that is less than the start)
                      // Cycling is also prevented when the time control is shown. Then we need to manually switch the active date.
                      if (cycle && (_this._newSelection || !_this._renderControls || (_this._newSelection === UNDEFINED && _this.s.display === 'inline'))) {
                          _this._setActiveSelect(notActiveSelect);
                          _this._newSelection = false;
                      }
                  }
              }
              else {
                  // single or multiple date selection
                  tempValueRep = { date: {} };
                  if (_this.s.selectMultiple) {
                      for (var _i = 0, date_1 = date; _i < date_1.length; _i++) {
                          var dateVal = date_1[_i];
                          tempValueRep.date[+dateVal] = dateVal;
                      }
                  }
                  else {
                      if (_this._hasTime) {
                          var time = _this._selectedTime || new Date();
                          date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
                      }
                      tempValueRep.date[+date] = date;
                  }
              }
              _this._tempValueRep = tempValueRep;
              if (slide && tempValueRep.end) {
                  tempValueRep.end = +getDayStart(s, addDays(createDate(s, tempValueRep.end), 1));
              }
              _this._setOrUpdate();
              // In case of single live selection close the picker when a date is clicked
              if (_this._live &&
                  (!_this.s.selectMultiple || isRange) &&
                  !_this._hasTime &&
                  (!isRange || (tempValueRep.start && tempValueRep.end && !newSelection))) {
                  _this.close();
              }
          };
          _this._onDatetimeChange = function (ev) {
              var s = _this.s;
              var isRange = s.select === 'range';
              var value = addTimezone(s, ev.value);
              var date = _this._hasTime ? value : getDateOnly(value);
              var d = +date;
              _this._tempValueSet = false;
              var tempValueRep = _this._copy(_this._tempValueRep);
              var slide = isRange && s.exclusiveEndDates && !_this._hasTime;
              if (slide && tempValueRep.end) {
                  // tempValueRep.end = +getDayStart(s, addDays(createDate(s, tempValueRep.end), -1));
                  tempValueRep.end = +getDayStart(s, createDate(s, tempValueRep.end - 1));
              }
              if (isRange) {
                  if (_this._activeSelect === 'start') {
                      if (_this._hasTime && _this._selectedTime) {
                          date.setHours(_this._selectedTime.getHours(), _this._selectedTime.getMinutes(), _this._selectedTime.getSeconds(), _this._selectedTime.getMilliseconds());
                      }
                      tempValueRep.start = d;
                      if (tempValueRep.end) {
                          // validate the range for minRange
                          var minRange = s.minRange && !_this._hasTime ? (s.minRange - 1) * 24 * 60 * 60 * 1000 - 1 : s.minRange || 0;
                          var range = tempValueRep.end - tempValueRep.start;
                          if (range < minRange) {
                              tempValueRep.end = UNDEFINED;
                          }
                      }
                  }
                  else {
                      // end selection
                      if (_this._hasTime) {
                          if (_this._selectedTime) {
                              date.setHours(_this._selectedTime.getHours(), _this._selectedTime.getMinutes(), _this._selectedTime.getSeconds(), _this._selectedTime.getMilliseconds());
                          }
                      }
                      else if (tempValueRep.start === +getDateOnly(date) && !s.exclusiveEndDates) {
                          date.setHours(23, 59, 59, 999);
                      }
                      tempValueRep.end = +date;
                  }
              }
              else {
                  // single date selection (there's no multiselect in the case of the datetime scroller)
                  if (_this._hasTime && _this._hasDate && s.controls.indexOf('datetime') < 0) {
                      var time = _this._selectedTime || new Date();
                      date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
                  }
                  else {
                      _this._selectedTime = createDate(s, date);
                  }
                  tempValueRep = { date: {} };
                  tempValueRep.date[+date] = date;
              }
              _this._tempValueRep = tempValueRep;
              if (slide && tempValueRep.end) {
                  tempValueRep.end = +getDayStart(s, addDays(createDate(s, tempValueRep.end), 1));
              }
              _this._setOrUpdate();
          };
          _this._onTimePartChange = function (ev) {
              _this._tempValueSet = false;
              var s = _this.s;
              var isRange = s.select === 'range';
              var date = addTimezone(s, ev.value);
              _this._selectedTime = date; // save the time part selection - this is needed when there's no date part selection yet,
              // it will be added when the date is selected
              if (isRange) {
                  // range selection
                  var values = _this._getDate(_this._tempValueRep);
                  var valueIndex = _this._activeSelect === 'start' ? 0 : 1;
                  if (values[valueIndex]) {
                      var value = createDate(s, values[valueIndex]);
                      // update the time part in the active selection
                      value.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                      values[valueIndex] = value;
                      if (_this._activeSelect === 'start' && +value > +values[1]) {
                          values.length = 1;
                      }
                      _this._tempValueRep = _this._parse(values);
                  }
                  else {
                      _this._selectedTime.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                  }
              }
              else if (!s.selectMultiple) {
                  // single select either with calendar or date
                  var value = _this._getDate(_this._tempValueRep);
                  if (value) {
                      value.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                      _this._tempValueRep = { date: {} };
                      _this._tempValueRep.date[+value] = value;
                  }
                  else {
                      _this._selectedTime.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                      // In live mode, a set will be triggered later instead of the forceupdate, but no value change is happening until
                      // a date is also selected, so no update will happen to re-render the datepicker and pass the newly selected time
                      // to the time scroller. So we need to trigger an update here.
                      if (_this._live) {
                          _this.forceUpdate();
                      }
                  }
              }
              _this._setOrUpdate();
          };
          /** @hidden */
          _this._changeActiveTab = function (ev) {
              _this.setState({ activeTab: ev.target.value });
          };
          /** @hidden */
          _this._changeActiveSelect = function (ev) {
              var active = ev.target.value;
              _this._setActiveSelect(active);
              _this.setActiveDate(active);
          };
          _this._clearEnd = function () {
              _this._tempValueRep.end = UNDEFINED;
              // if there's a timegrid, we should also clear the time part of the selection
              if (_this._hasTimegrid) {
                  _this._selectedTime = UNDEFINED;
              }
              _this._setOrUpdate();
          };
          _this._clearStart = function () {
              _this._tempValueRep = {};
              _this._newSelection = true;
              // if there's a timegrid, we should also clear the time part of the selection
              if (_this._hasTimegrid) {
                  _this._selectedTime = UNDEFINED;
              }
              _this._setOrUpdate();
          };
          // tslint:disable-next-line: variable-name
          _this._proxy = function (args) {
              _this._hook(args.type, args);
          };
          // tslint:disable-next-line: variable-name
          _this._onInputClickRange = function (ev) {
              var inp = ev.target;
              var activate = inp === _this._startInput || _this._renderControls ? 'start' : 'end';
              _this._setActiveSelect(activate);
          };
          // tslint:disable-next-line: variable-name
          _this._onInputChangeRange = function (ev) {
              var startInput = _this._startInput;
              var endInput = _this._endInput;
              var value = (startInput ? startInput.value : '') + (endInput && endInput.value ? RANGE_SEPARATOR + endInput.value : '');
              _this._onInputChange(ev, value);
          };
          return _this;
      }
      /**
       * Sets which date or time is currently selected (start or end).
       * @param active Specifies which one should be active start or end selection.
       */
      DatepickerBase.prototype.setActiveDate = function (active) {
          var notActiveSelect = notActive(active);
          this._activeSelect = active;
          var activeValue = this._tempValueRep[active];
          var notActiveValue = this._tempValueRep[notActiveSelect];
          if ((this._tempValueRep.start && this._tempValueRep.end) || (!activeValue && notActiveValue)) {
              this._newSelection = false;
          }
          else if (activeValue && !notActiveValue) {
              this._newSelection = true;
          }
          if (activeValue) {
              this._active = activeValue;
          }
          // when switching the active selection in the case of the timegrid, we should clear the selected time
          if (!activeValue && this._hasTimegrid) {
              this._selectedTime = UNDEFINED;
          }
          this.forceUpdate();
      };
      /** Returns the temporary value selected on the datepicker. */
      DatepickerBase.prototype.getTempVal = function () {
          return _super.prototype.getTempVal.call(this);
      };
      /**
       * Sets the datepicker temporary value. This temp value is shown on the picker until the selection.
       * In the case of inline mode or when the touchUi setting is false the value will be set to the Model as well,
       * since in these cases there's no temporary value.
       * @param value The value to set to the datepicker as temporary value
       */
      DatepickerBase.prototype.setTempVal = function (value) {
          _super.prototype.setTempVal.call(this, value);
      };
      /**
       * Navigates the calendar to the specified date.
       * @param date
       */
      DatepickerBase.prototype.navigate = function (date) {
          this._active = +makeDate(date);
          this.forceUpdate();
      };
      DatepickerBase.prototype._shouldValidate = function (s, prevS) {
          return (s.controls !== prevS.controls ||
              s.dataTimezone !== prevS.dataTimezone ||
              s.displayTimezone !== prevS.displayTimezone ||
              s.dateFormat !== prevS.dateFormat ||
              s.timeFormat !== prevS.timeFormat ||
              s.locale !== prevS.locale ||
              s.min !== prevS.min ||
              s.max !== prevS.max);
      };
      DatepickerBase.prototype._valueEquals = function (v1, v2) {
          var side1 = (isArray(v1) && v1.length === 0) || v1 === UNDEFINED || v1 === null;
          var side2 = (isArray(v2) && v2.length === 0) || v2 === UNDEFINED || v2 === null;
          return (side1 && side1 === side2) || dateValueEquals(v1, v2, this.s);
      };
      DatepickerBase.prototype.setVal = function (value) {
          if (this.s.select === 'range' && value) {
              var start = value[0], end = value[1];
              this._savedStartValue = +makeDate(start, this.s, this._valueFormat);
              this._savedEndValue = +makeDate(end, this.s, this._valueFormat);
          }
          _super.prototype.setVal.call(this, value);
      };
      // tslint:enable variable-name
      DatepickerBase.prototype._init = function () {
          // Register the injected modules
          if (this.props.modules) {
              this.props.modules.forEach(function (module) {
                  modules[module._name] = module;
              });
          }
      };
      DatepickerBase.prototype._render = function (s, state) {
          var _this = this;
          // when invalids can be part of the range, we disregard the rangeEndInvalid option
          if (s.inRangeInvalid) {
              s.rangeEndInvalid = false;
          }
          // when using the 'preset-range' selection mode, we only support the calendar control, and we disregard the controls option
          // we need to overwrite the controls option because in angular the prevS is compared to it, and the controls are destroyed
          // and recreated base on the s.controls, and otherwise it results in an error.
          if (s.select === 'preset-range') {
              s.controls = CALENDAR_CTRL;
          }
          // If we have display timezone set, default to exclusive end dates
          if (s.exclusiveEndDates === UNDEFINED) {
              s.exclusiveEndDates = !!s.displayTimezone;
          }
          var hadTime = this._hasTime;
          var hasDate = (this._hasDate = !!find(s.controls, function (item) { return /date|calendar/.test(item); }));
          var hasTime = (this._hasTime = !!find(s.controls, function (item) { return /time/.test(item); }));
          // if there's no time control on the picker, we disregard the timezone options
          if (!hasTime) {
              s.timezonePlugin = s.dataTimezone = s.displayTimezone = UNDEFINED;
          }
          // invalidate all, when valid option is defined
          if (s.valid && (!s.invalid || hasTime)) {
              s.invalid = INVALID_ALL;
          }
          var prevS = this._prevS;
          s.buttons; // needed for decomposition - we should not pass this to the subcomponents in the `other` props
          var calendarSize = s.calendarSize; s.children; s.className; var controls = s.controls; s.cssClass; s.element; s.modelValue; s.onDestroy; s.onInit; 
          // onMarkupReady,
          s.onTempChange; // needed for decomposition
          s.responsive; // needed for decomposition
          var select = s.select, selectMultiple = s.selectMultiple, // needed for decomposition - only passed to the calendar when no range selection
          tabs = s.tabs, other = __rest(s, ["buttons", "calendarSize", "children", "className", "controls", "cssClass", "element", "modelValue", "onDestroy", "onInit", "onTempChange", "responsive", "select", "selectMultiple", "tabs"]);
          var widthType = state.widthType || 'sm';
          var isRange = select !== 'date';
          this._renderTabs = controls.length > 1 && (tabs === 'auto' ? widthType === 'sm' : tabs);
          // Switching between range and date selection
          // When there are already selected values, then we try to move them between selections
          if (select !== prevS.select && this._tempValueRep) {
              if (isRange && this._tempValueRep.date) {
                  var _a = Object.keys(this._tempValueRep.date)
                      .map(function (v) { return +v; })
                      .sort(), start = _a[0], end = _a[1];
                  this._tempValueRep.start = start;
                  this._tempValueRep.end = end;
                  this._tempValueRep.date = UNDEFINED;
                  this._tempValueText = this._format(this._tempValueRep);
                  setTimeout(function () {
                      // timeout needed because we can't call set in render directly
                      _this.set();
                  });
              }
              else if (!isRange && (this._tempValueRep.start || this._tempValueRep.end)) {
                  if (!this._tempValueRep.date) {
                      this._tempValueRep.date = {};
                  }
                  var first = (this._tempValueRep.start || this._tempValueRep.end);
                  this._tempValueRep.date[first] = new Date(first);
                  var second = (this._tempValueRep.end || this._tempValueRep.start);
                  if (second !== first && s.selectMultiple) {
                      this._tempValueRep.date[second] = new Date(second);
                  }
                  this._tempValueRep.start = UNDEFINED;
                  this._tempValueRep.end = UNDEFINED;
                  this._tempValueText = this._format(this._tempValueRep);
                  setTimeout(function () {
                      // timeout needed because we can't call set in render directly
                      _this.set();
                  });
              }
          }
          if (s.min !== prevS.min) {
              this._min = isEmpty(s.min) ? UNDEFINED : makeDate(s.min, s, s.dateFormat);
          }
          if (s.max !== prevS.max) {
              this._max = isEmpty(s.max) ? UNDEFINED : makeDate(s.max, s, s.dateFormat);
          }
          if (s.minTime !== prevS.minTime) {
              this._minTime = isEmpty(s.minTime) ? UNDEFINED : makeDate(s.minTime, s, s.timeFormat);
          }
          if (s.maxTime !== prevS.maxTime) {
              this._maxTime = isEmpty(s.maxTime) ? UNDEFINED : makeDate(s.maxTime, s, s.timeFormat);
          }
          var tempValueRepEnd = this._tempValueRep && this._tempValueRep.end;
          var tempValueRepStart = this._tempValueRep && this._tempValueRep.start;
          var format = (hasDate ? s.dateFormat : '') + (hasTime ? (hasDate ? s.separator : '') + s.timeFormat : '');
          var controlsChanged = controls !== prevS.controls;
          // Process the controls
          if (controlsChanged) {
              this._controls = [];
              this._controlsClass = '';
              this._hasCalendar = false;
              this._hasTimegrid = false;
              for (var _i = 0, _b = controls; _i < _b.length; _i++) {
                  var control = _b[_i];
                  if (control === 'timegrid') {
                      this._hasTimegrid = true;
                  }
                  if (control === 'calendar') {
                      this._hasCalendar = true;
                  }
                  this._controls.push({
                      Component: modules[control === 'calendar' ? 'Calendar' : control === 'timegrid' ? 'Timegrid' : 'Datetime'],
                      name: control,
                      title: control === 'time' || control === 'timegrid' ? s.timeText : s.dateText,
                  });
                  this._controlsClass += ' mbsc-datepicker-control-' + control;
              }
              // when changing from a distinct time picker to a datetime the selected time will be tracked
              // by the datetime control, so the _selectedTime should be undefined
              if (!hasTime) {
                  this._selectedTime = UNDEFINED;
              }
          }
          this._renderControls = isRange && select !== 'preset-range' && (s.showRangeLabels !== UNDEFINED ? s.showRangeLabels : true);
          this._nullSupport = s.display !== 'inline' || select !== 'date' || s.selectMultiple === true;
          this._valueFormat = format;
          this._activeTab = state.activeTab || controls[0];
          _super.prototype._render.call(this, s, state); // TODO _valueFormat is undefined at initial load if this is on the top check if there's any other way
          // When controls change, it triggers a readValue() in the base render.
          // It will also trigger a change with a setTimeout if the value changed during this readValue.
          // The following setTimeout should come after the setTimeout of the picker base, so the picker base won't override
          // the value. (The parsed one - from the picker base - will not have time info)
          if (controlsChanged && isRange && s.exclusiveEndDates && hasTime !== hadTime && (tempValueRepEnd || tempValueRepStart)) {
              // needed for the setTimeout clojure to save these values,
              // because sometimes a (strict) render cycle again before the setTimeout
              // runs and the _savedStartValue's are overwritten with undefined before it gets restored
              var savedStart_1 = this._savedStartValue;
              var savedEnd_1 = this._savedEndValue;
              setTimeout(function () {
                  if (hasTime) {
                      // from date to datetime
                      _this._tempValueRep.start = savedStart_1 || tempValueRepStart;
                      _this._tempValueRep.end = savedEnd_1 || tempValueRepEnd;
                  }
                  else {
                      // from datetime to date
                      _this._savedStartValue = tempValueRepStart;
                      _this._savedEndValue = tempValueRepEnd;
                      _this._clearSaved = false;
                      var ss = __assign({}, s, { dataTimezone: _this.props.dataTimezone, displayTimezone: _this.props.displayTimezone, timezonePlugin: _this.props.timezonePlugin });
                      if (tempValueRepStart) {
                          // might be empty
                          _this._tempValueRep.start = +removeTimezone(getDayStart(ss, createDate(ss, tempValueRepStart)));
                      }
                      if (tempValueRepEnd) {
                          var tzonedEnd = createDate(ss, tempValueRepEnd - 1);
                          _this._tempValueRep.end = +removeTimezone(createDate(ss, +getDayEnd(ss, tzonedEnd) + 1));
                      }
                  }
                  _this._valueText = _this._tempValueText = _this._format(_this._tempValueRep);
                  _this._valueTextChange = true;
                  _this.set();
              });
              // prevent the output of the text in the input to prevent flickering, because
              // we rewrite the value in the next cycle anyway
              this._valueTextChange = false;
          }
          // if the value changes between date/datetime switches, we should reset the saved times
          var controlled = s.value !== UNDEFINED;
          var valueChanged = controlled ? s.value !== prevS.value : state.value !== this._prevStateValue;
          if (isRange && this._clearSaved && valueChanged) {
              this._savedEndValue = this._savedStartValue = UNDEFINED;
          }
          this._clearSaved = true;
          if (s.headerText !== prevS.headerText || s.selectCounter !== prevS.selectCounter || s.selectMultiple !== prevS.selectMultiple) {
              this._setHeader();
          }
          /** In the case of the timegrid control, we need to turn off the scrollLock,
           * otherwise the control is not scrollable
           */
          this._scrollLock = s.scrollLock !== UNDEFINED ? s.scrollLock : !this._hasTimegrid;
          // overwrite showinput based on start/end input in range
          // we only show the input when not in inline mode and if there are no custom inputs passed in range mode
          this._showInput = s.showInput !== UNDEFINED ? s.showInput : this._showInput && (!isRange || (!s.startInput && !s.endInput));
          // overwrite the initialization of inputs - take into account the start and end inputs
          this._shouldInitInputs =
              this._shouldInitInputs || select !== prevS.select || s.startInput !== prevS.startInput || s.endInput !== prevS.endInput;
          this._shouldInitInput = this._shouldInitInput || this._shouldInitInputs;
          /* Determine the ISO parts from format */
          if (controlsChanged ||
              s.dateWheels !== prevS.dateWheels ||
              s.timeWheels !== prevS.timeWheels ||
              s.dateFormat !== prevS.dateFormat ||
              s.timeFormat !== prevS.timeFormat) {
              var dateParts = s.dateWheels || s.dateFormat;
              var timeParts = s.timeWheels || s.timeFormat;
              var isoParts = (this._iso = {});
              if (hasDate) {
                  if (/y/i.test(dateParts)) {
                      isoParts.y = 1;
                  }
                  if (/M/.test(dateParts)) {
                      isoParts.y = 1;
                      isoParts.m = 1;
                  }
                  if (/d/i.test(dateParts)) {
                      isoParts.y = 1;
                      isoParts.m = 1;
                      isoParts.d = 1;
                  }
              }
              if (hasTime) {
                  if (/h/i.test(timeParts)) {
                      isoParts.h = 1;
                  }
                  if (/m/.test(timeParts)) {
                      isoParts.i = 1;
                  }
                  if (/s/i.test(timeParts)) {
                      isoParts.s = 1;
                  }
              }
          }
          var setButtonDisabled;
          if (isRange) {
              // Set active selection
              if (this._activeSelect === UNDEFINED) {
                  this._setActiveSelect('start', true);
              }
              // Disable the set button if the selection is not ready
              setButtonDisabled = this._selectionNotReady();
          }
          else {
              this._activeSelect = UNDEFINED;
              // enable the set button - when switching between range and date select, the set button can be stuck otherwise
              setButtonDisabled = false;
          }
          if (this._buttons) {
              // find the set button
              var setBtn = find(this._buttons, function (btn) { return btn.name === 'set'; });
              if (setBtn && setBtn.disabled !== setButtonDisabled) {
                  setBtn.disabled = setButtonDisabled;
                  // Forces re-render
                  this._buttons = this._buttons.slice();
              }
          }
          var activeSelect = this._activeSelect; // saved for optimization
          this._needsWidth =
              (s.display === 'anchored' ||
                  s.display === 'center' ||
                  (s.display !== 'inline' && state.isLarge) ||
                  (controls.length > 1 && !tabs)) &&
                  s.width === UNDEFINED;
          // limit selection range based on invalids and min/max range options
          var maxDate = s.max !== UNDEFINED ? makeDate(s.max, s, format) : UNDEFINED;
          var minDate = s.min !== UNDEFINED ? makeDate(s.min, s, format) : UNDEFINED;
          this._maxLimited = maxDate;
          this._minLimited = minDate;
          // get the next invalid date from the selected start date and cache it
          // only calculate if the start date or the invalids changed
          var selectedStart = this._tempValueRep.start;
          if (selectedStart && (this._prevStart !== selectedStart || prevS.valid !== s.valid || prevS.invalid !== s.invalid)) {
              var startDate = createDate(s, selectedStart);
              this._nextInvalid = s.valid
                  ? addDays(getLatestOccurrence(s.valid, startDate, s), 1)
                  : getNextOccurrence(s.invalid || [], startDate, s);
          }
          var endSelection = activeSelect === 'end' && selectedStart;
          if (endSelection) {
              if (!s.inRangeInvalid) {
                  var nextInvalid = this._nextInvalid;
                  if (nextInvalid) {
                      // in case the range end can occur on an invalid date, we need to allow that date to be selected
                      // so we need to extend the _maxLimited with an addition day
                      // we also need to add it as a valid date late on when we pass the options to the controls
                      if (s.rangeEndInvalid) {
                          this._maxLimited = createDate(s, +addDays(nextInvalid, 1) - 1);
                      }
                      else {
                          this._maxLimited = createDate(s, +nextInvalid - 1);
                      }
                  }
              }
              if (!this._hasCalendar || hasTime) {
                  if (!this._minLimited || makeDate(this._minLimited, s, format) < createDate(s, selectedStart)) {
                      this._minLimited = createDate(s, this._tempValueRep.start);
                  }
              }
          }
          this._minTimeLimited = this._minLimited;
          if (endSelection) {
              if (s.minRange) {
                  // we take out the 0 range as well by not comparing to UNDEFINED
                  var minLimited = hasTime
                      ? this._tempValueRep.start + s.minRange
                      : +addDays(createDate(s, this._tempValueRep.start), s.minRange) - 1;
                  if (!this._minLimited || +makeDate(this._minLimited, s, format) < minLimited) {
                      this._minLimited = createDate(s, minLimited);
                      this._minTimeLimited = this._minLimited;
                  }
              }
              if (this._minTimeLimited === UNDEFINED && this._tempValueRep.start && this._tempValueRep.end) {
                  this._minTimeLimited = createDate(s, +this._tempValueRep.start);
              }
              if (s.maxRange !== UNDEFINED) {
                  var maxLimited = hasTime
                      ? this._tempValueRep.start + s.maxRange
                      : +addDays(createDate(s, this._tempValueRep.start), s.maxRange) - 1;
                  if (!this._maxLimited || +makeDate(this._maxLimited, s, format) > maxLimited) {
                      this._maxLimited = createDate(s, maxLimited);
                  }
              }
          }
          // Set control options
          for (var _c = 0, _d = this._controls; _c < _d.length; _c++) {
              var control = _d[_c];
              var options = __assign({}, other, { display: 'inline', isOpen: s.isOpen || state.isOpen, max: this._maxLimited, min: this._minLimited });
              // in case the range end can occur on an invalid date, and we are selecting the end date of the range
              // we need to allow that date to be selected
              // so we need to add it as a valid date to overwrite the invalid option for that day
              // we also need to extend the _maxLimited with an addition day since the inRangeInvalid option is also false
              // this is done above when we calculate the _maxLimited
              if (s.rangeEndInvalid && endSelection && this._nextInvalid) {
                  options.valid = (options.valid || []).concat([this._nextInvalid]);
              }
              if (control.name === 'calendar') {
                  options.min = this._minLimited ? getDateOnly(this._minLimited) : UNDEFINED;
                  options.max = this._maxLimited ? getDateOnly(this._maxLimited) : UNDEFINED;
                  options.selectRange = isRange;
                  options.width = this._needsWidth ? PAGE_WIDTH * getPageNr(s.pages, state.maxPopupWidth) : UNDEFINED;
                  if (s.calendarType === 'week' && calendarSize) {
                      options.weeks = calendarSize;
                  }
                  else {
                      options.size = calendarSize;
                  }
                  // If we have more than 2 pages, increase the max width of the popup (which defaults to 600px)
                  var pages = s.pages === 'auto' ? 3 : s.pages || 1;
                  this._maxWidth = s.maxWidth || (pages > 2 ? PAGE_WIDTH * pages : UNDEFINED);
                  if (isRange) {
                      var valueDate = this._getDate(this._tempValueRep);
                      var endDate = valueDate[1];
                      if (endDate && s.exclusiveEndDates && !hasTime) {
                          valueDate[1] = createDate(s, +endDate - 1);
                      }
                      var values = valueDate
                          .filter(function (v) { return v !== null; }) // filter out null values
                          .map(function (v) { return +getDateOnly(v); }) // cut the time part and turn into timestamp (number) - for the distinct filter to work
                          .filter(function (v, ind, arr) { return arr.indexOf(v) === ind; }) // keep only distinct values
                          // always pass date objects to subcomponents
                          .map(function (v) { return new Date(v); });
                      options.value = values;
                      // Highlighted and hovered days
                      if (s.rangeHighlight) {
                          options.rangeStart = valueDate[0] && +getDateOnly(removeTimezone(valueDate[0]));
                          options.rangeEnd = valueDate[1] && +getDateOnly(removeTimezone(valueDate[1]));
                          options.onDayHoverIn = this._onDayHoverIn;
                          options.onDayHoverOut = this._onDayHoverOut;
                          if (select === 'preset-range') {
                              if (state.hoverDate) {
                                  var _e = getPresetRange(state.hoverDate, s), start = _e.start, end = _e.end;
                                  options.hoverStart = +start;
                                  options.hoverEnd = +end;
                              }
                          }
                          else {
                              if (activeSelect === 'end' && valueDate[0]) {
                                  options.hoverStart = options.rangeEnd || options.rangeStart;
                                  options.hoverEnd = state.hoverDate;
                              }
                              if (activeSelect === 'start' && valueDate[1] && this._renderControls) {
                                  options.hoverStart = state.hoverDate;
                                  options.hoverEnd = options.rangeStart || options.rangeEnd;
                              }
                          }
                      }
                  }
                  else {
                      options.selectMultiple = selectMultiple; // this should not be passed to the calendar in the case of the range
                      options.value = this._getDate(this._tempValueRep);
                  }
                  var vals = isArray(options.value) ? options.value : [options.value];
                  var min = options.min ? +options.min : -Infinity;
                  var max = options.max ? +options.max : Infinity;
                  var selected = void 0;
                  for (var _f = 0, vals_1 = vals; _f < vals_1.length; _f++) {
                      var val = vals_1[_f];
                      // Find first value between min and max
                      if (!selected && val >= min && val <= max) {
                          selected = +val;
                      }
                  }
                  if (!selected && isRange && vals.length) {
                      selected = +vals[0];
                  }
                  if (selected !== this._selectedDate || this._active === UNDEFINED || s.min !== prevS.min || s.max !== prevS.max) {
                      this._selectedDate = selected;
                      this._active = selected ? +getDateOnly(new Date(selected)) : constrain(this._active || +getDateOnly(new Date()), min, max);
                  }
                  var viewFormat = s.dateWheels || s.dateFormat;
                  var selectedView = /d/i.test(viewFormat)
                      ? MONTH_VIEW
                      : /m/i.test(viewFormat)
                          ? YEAR_VIEW
                          : /y/i.test(viewFormat)
                              ? MULTI_YEAR_VIEW
                              : MONTH_VIEW;
                  options.active = this._active;
                  options.onActiveChange = this._onActiveChange;
                  options.onChange = this._onCalendarChange;
                  options.onCellClick = this._onCellClick;
                  options.onCellHoverIn = this._proxy;
                  options.onCellHoverOut = this._proxy;
                  options.onLabelClick = this._proxy;
                  options.onPageChange = this._proxy;
                  options.onPageLoaded = this._proxy;
                  options.onPageLoading = this._proxy;
                  options.selectView = selectedView;
              }
              else {
                  var tempValueKeys = Object.keys(this._tempValueRep.date || {});
                  // In case of the iOS theme we need the center color styling (light gray instead of darker gray),
                  // if tabs are displayed or calendar is present (in top & bottom mode)
                  options.displayStyle =
                      (s.display === 'bottom' || s.display === 'top') && (this._hasCalendar || this._renderTabs) ? 'center' : s.display;
                  options.mode = control.name; // date, time or datetime
                  if ((control.name === 'time' || control.name === 'timegrid') && hasDate) {
                      options.onChange = this._onTimePartChange;
                      if (isRange) {
                          // selectedTime needs to be set only initially, when there's no selection yet
                          // it is updated from the change event in the _onTimePartChange
                          var alreadySelectedOne = this._tempValueRep[activeSelect];
                          // we need to update the date part of the passed value, because the datetime validation
                          // will take into account the date part as well (even if the control is time)
                          var selectedTime = void 0;
                          if (this._selectedTime) {
                              if (!this._minTimeLimited || this._selectedTime > this._minTimeLimited) {
                                  selectedTime = this._selectedTime;
                              }
                              else {
                                  selectedTime = createDate(s, this._minTimeLimited);
                                  selectedTime.setHours(this._selectedTime.getHours(), this._selectedTime.getMinutes(), this._selectedTime.getSeconds(), this._selectedTime.getMilliseconds());
                              }
                          }
                          // the current datetime is passed without the seconds and milliseconds,
                          // so it won't stick into the time scroller innerParts variable
                          var nowTrimmed = createDate(s);
                          nowTrimmed.setSeconds(0, 0);
                          this._selectedTime = alreadySelectedOne
                              ? createDate(s, alreadySelectedOne)
                              : selectedTime || (control.name === 'time' ? nowTrimmed : UNDEFINED);
                          options.value = this._selectedTime;
                      }
                      else if (!s.selectMultiple) {
                          var alreadyDate = (this._tempValueRep.date && this._tempValueRep.date[tempValueKeys[0]]) || this._selectedTime;
                          this._selectedTime = options.value = alreadyDate;
                      }
                      options.min = this._minTimeLimited;
                      options.max = this._maxLimited;
                  }
                  else {
                      options.onChange = this._onDatetimeChange;
                      if (isRange) {
                          var n = this._tempValueRep[activeSelect];
                          var m = this._tempValueRep[notActive(activeSelect)];
                          options.value = n ? createDate(s, n) : m ? createDate(s, m) : null; // if there is already a selection of the not active,
                          // we should start with that value
                          // ^ Why? because when there is only the time picker the passed date object might have a different date than today.
                          // But this will default to today in the Date component, so if you selected 8 PM yesterday on a only time picker, it
                          // will allow to select the 7 PM as end time (which is not valid, bc. we should not take into account the Date only the time)
                          if (activeSelect === 'end' && s.exclusiveEndDates && !hasTime) {
                              options.value = createDate(s, +options.value - 1);
                          }
                      }
                      else {
                          var value = this._tempValueRep.date && this._tempValueRep.date[tempValueKeys[0]];
                          var passed = value;
                          if (value) {
                              if (!hasTime) {
                                  passed = getDateOnly(value);
                              }
                          }
                          options.value = passed || null;
                      }
                  }
                  if (control.name === 'time' || control.name === 'timegrid') {
                      // get the selected date or default
                      var selectedOrDefault = options.value || constrainDate(new Date(), options.min, options.max);
                      if (this._minTime) {
                          // construct a minimum date from given time part and selected date's date part
                          var minTime = this._minTime;
                          var min = new Date(selectedOrDefault.getFullYear(), selectedOrDefault.getMonth(), selectedOrDefault.getDate(), minTime.getHours(), minTime.getMinutes(), minTime.getSeconds(), minTime.getMilliseconds());
                          // override min option passed to the time control if bigger (more constraining) than already specified min option
                          // Note: already specified min might be calculated from other factors like the range selection
                          // end date can't be lass than the start and so on...
                          if (!options.min || min > options.min) {
                              options.min = min;
                          }
                      }
                      if (this._maxTime) {
                          // construct a maximum date from given time part and selected date's date part
                          var maxTime = this._maxTime;
                          var max = new Date(selectedOrDefault.getFullYear(), selectedOrDefault.getMonth(), selectedOrDefault.getDate(), maxTime.getHours(), maxTime.getMinutes(), maxTime.getSeconds(), maxTime.getMilliseconds());
                          // override max option passed to the time control if smaller (more constraining) than already specified max option
                          // Note: already specified max might be calculated from other factors like the range selection
                          // maxRange option that limits the maximum value
                          if (!options.max || max < options.max) {
                              options.max = max;
                          }
                      }
                  }
              }
              control.options = options;
          }
          this._prevStart = this._tempValueRep.start;
          this._prevStateValue = state.value;
      };
      DatepickerBase.prototype._updated = function () {
          var _this = this;
          var s = this.s;
          if (this._shouldInitInputs) {
              this._resetInputs();
              if (s.select === 'range') {
                  var startInput = s.startInput;
                  if (startInput) {
                      this._setupInput('start', startInput);
                  }
                  var endInput = s.endInput;
                  if (endInput) {
                      this._setupInput('end', endInput);
                  }
                  if (s.element && (this._startInput === s.element || this._endInput === s.element)) {
                      this._shouldInitInput = false;
                      clearTimeout(s.element.__mbscTimer);
                  }
              }
              this._shouldInitInputs = false;
          }
          // we save the valueTextChange bc the base overwrites it and we won't know if there
          // was a value change or not. We need to populate the start/end inputs after the base _updated() call,
          // to overwrite the start value if the same input is used for the start and the initial input
          var valueTextChange = this._valueTextChange;
          _super.prototype._updated.call(this);
          if (s.select === 'range' && valueTextChange) {
              var triggerChange = function (inp, val) {
                  inp.value = val;
                  setTimeout(function () {
                      _this._preventChange = true;
                      trigger(inp, INPUT);
                      trigger(inp, CHANGE);
                  });
              };
              if (this._startInput) {
                  triggerChange(this._startInput, this._getValueText('start'));
              }
              if (this._endInput) {
                  triggerChange(this._endInput, this._getValueText('end'));
              }
          }
      };
      DatepickerBase.prototype._onEnterKey = function (args) {
          if (!this._selectionNotReady()) {
              // if selection is ready do the default behavior
              _super.prototype._onEnterKey.call(this, args);
          }
      };
      DatepickerBase.prototype._setupInput = function (i, input) {
          var _this = this;
          getNativeElement(input, function (inp) {
              var resetElement = initPickerElement(inp, _this, _this._onInputChangeRange, _this._onInputClickRange);
              if (i === 'start') {
                  _this._startInput = inp;
                  _this._resetStartInput = resetElement;
              }
              else {
                  _this._endInput = inp;
                  _this._resetEndInput = resetElement;
              }
              var val = _this._getValueText(i);
              var changed = val !== inp.value;
              inp.value = val;
              if (changed) {
                  setTimeout(function () {
                      _this._preventChange = true;
                      trigger(inp, INPUT);
                      trigger(inp, CHANGE);
                  });
              }
          });
      };
      DatepickerBase.prototype._destroy = function () {
          // clean up after start/end inputs
          this._resetInputs();
          _super.prototype._destroy.call(this);
      };
      DatepickerBase.prototype._setHeader = function () {
          var s = this.s;
          if (s.selectCounter && s.selectMultiple) {
              var count = Object.keys((this._tempValueRep && this._tempValueRep.date) || {}).length;
              this._headerText = (count > 1 ? s.selectedPluralText || s.selectedText : s.selectedText).replace(/{count}/, '' + count);
          }
          else {
              _super.prototype._setHeader.call(this);
          }
      };
      // TODO: check if common parts with date scroller validation could be extracted
      DatepickerBase.prototype._validate = function () {
          if (this._max <= this._min) {
              return;
          }
          var s = this.s;
          var min = this._min ? +this._min : -Infinity;
          var max = this._max ? +this._max : Infinity;
          if (s.select === 'date') {
              var values = this._tempValueRep.date;
              // In case of multiple select we don't validate the values
              if (!s.selectMultiple) {
                  // Iterate through all selected dates and validate them
                  for (var _i = 0, _a = Object.keys(values); _i < _a.length; _i++) {
                      var key = _a[_i];
                      var d = values[key];
                      var validated = getClosestValidDate(d, s, min, max);
                      if (+validated !== +d) {
                          delete values[key];
                          values[+getDateOnly(validated)] = validated;
                      }
                  }
              }
          }
          else {
              // range
              var range = this._getDate(this._tempValueRep);
              // Constrain the range between the min and max values
              var startDate = range[0], endDate = range[1];
              if (startDate) {
                  startDate = getClosestValidDate(startDate, s, min, max);
                  // also get the next invalid date in case there can't be any invalids in the range
                  // for later validating the endDate
                  if (!s.inRangeInvalid && (!this._prevStart || this._prevStart !== +startDate)) {
                      this._nextInvalid = s.valid
                          ? addDays(getLatestOccurrence(s.valid, startDate, s), 1)
                          : getNextOccurrence(s.invalid || [], startDate, s);
                  }
              }
              if (endDate) {
                  // validate the end using the inRangeInvalid an the rangeEndInvalid options
                  if (!s.inRangeInvalid && this._nextInvalid && this._nextInvalid <= endDate) {
                      endDate = s.rangeEndInvalid ? this._nextInvalid : addDays(this._nextInvalid, -1);
                  }
                  else {
                      endDate = getClosestValidDate(endDate, s, min, max); // otherwise get the next valid date
                  }
              }
              if (startDate && endDate && startDate > endDate) {
                  if (this._activeSelect === 'end') {
                      startDate = endDate;
                  }
                  else {
                      endDate = startDate;
                  }
              }
              if (startDate) {
                  this._prevStart = this._tempValueRep.start = +startDate;
              }
              if (endDate) {
                  this._tempValueRep.end = +endDate;
              }
          }
      };
      DatepickerBase.prototype._copy = function (value) {
          var date = value.date ? __assign({}, value.date) : value.date;
          return __assign({}, value, { date: date });
      };
      /**
       * Formats the value representation to a string
       * IMPORTANT: The order of the dates in the formatted string is definition order!
       * @param valueRep The value representation object
       */
      DatepickerBase.prototype._format = function (valueRep) {
          var s = this.s;
          var ret = [];
          if (!s) {
              return '';
          }
          if (s.select === 'date') {
              var vRep = valueRep.date;
              for (var i in vRep) {
                  if (vRep[i] !== UNDEFINED && vRep[i] !== null) {
                      ret.push(formatDate(this._valueFormat, vRep[i], s));
                  }
              }
              return s.selectMultiple ? ret.join(', ') : ret[0];
          }
          else {
              // range selection
              if (valueRep.start) {
                  ret.push(formatDate(this._valueFormat, createDate(s, valueRep.start), s));
              }
              if (valueRep.end) {
                  if (!ret.length) {
                      // only end date is selected
                      ret.push('');
                  }
                  var end = createDate(s, valueRep.end - (s.exclusiveEndDates && !this._hasTime ? 1 : 0));
                  ret.push(formatDate(this._valueFormat, end, s));
              }
              this._tempStartText = ret[0] || '';
              this._tempEndText = ret[1] || '';
              return ret.join(RANGE_SEPARATOR);
          }
      };
      // tslint:disable-next-line: variable-name
      DatepickerBase.prototype._parse = function (value, fromInput) {
          var s = this.s;
          var ret = {};
          var isRange = s.select !== 'date';
          var isMultiple = s.selectMultiple;
          var values = [];
          if (isEmpty(value)) {
              var def = s.defaultSelection;
              value =
                  isMultiple || isRange
                      ? // Range & multiple select
                          def
                      : // Single selection, only allow explicit null, otherwise default to now
                          // Also in live mode when, the value is empty, we parse to NULL, and pass the defaultSelection
                          // to the inner controls, so they make the decision on what to show to the user.
                          // Otherwise the current value can't be set by clicking on it.
                          // def === null || !this._hasCalendar || (this._live && s.display !== 'inline') ? null : (def || new Date());
                          def === null || (this._live && s.display !== 'inline')
                              ? null
                              : def || new Date();
          }
          if (isString(value) && (isRange || isMultiple)) {
              values = value.split(isRange ? RANGE_SEPARATOR : ',');
          }
          else if (isArray(value)) {
              values = value;
          }
          else if (value && !isArray(value)) {
              values = [value];
          }
          if (isRange) {
              var start = values[0], end = values[1];
              var startDate = makeDate(start, s, this._valueFormat, this._iso);
              var endDate = makeDate(end, s, this._valueFormat, this._iso);
              ret.start = startDate ? +startDate : UNDEFINED;
              ret.end = endDate ? +endDate : UNDEFINED;
          }
          else {
              ret.date = {};
              for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                  var val = values_1[_i];
                  if (!isEmpty(val)) {
                      var date = makeDate(val, s, this._valueFormat, this._iso, fromInput);
                      if (date) {
                          if (fromInput) {
                              date = addTimezone(s, date);
                          }
                          var key = +getDateOnly(date); // we need this for ranges that are less or equal to one day
                          ret.date[key] = date;
                          if (this._hasTime) {
                              this._selectedTime = new Date(date);
                          }
                      }
                  }
              }
          }
          return ret;
      };
      DatepickerBase.prototype._getDate = function (value) {
          var s = this.s;
          var isRange = s.select !== 'date';
          // range picker
          if (isRange) {
              var start = value.start ? createDate(s, value.start) : null;
              var end = value.end ? createDate(s, value.end) : null;
              if (!start && !end) {
                  return [];
              }
              return [start, end];
          }
          // multi-select date
          if (s.selectMultiple) {
              var valueArray = [];
              var dates = value.date;
              if (dates) {
                  for (var _i = 0, _a = Object.keys(dates); _i < _a.length; _i++) {
                      var v = _a[_i];
                      valueArray.push(createDate(s, +v));
                  }
              }
              return valueArray;
          }
          // single-select date
          var valueKeys = Object.keys(value.date || {});
          if (!valueKeys.length) {
              return null;
          }
          return createDate(s, value.date[valueKeys[0]]);
      };
      /**
       * Returns the value from the value representation
       * NOTE: In the case of the range, if the start date is selected only, the end will be null
       * @param value The value representation for the datepicker
       */
      DatepickerBase.prototype._get = function (value) {
          var _this = this;
          var s = this.s;
          var valueFormat = this._valueFormat;
          var isoParts = this._iso;
          var valueDate = this._getDate(value);
          if (isArray(valueDate)) {
              return valueDate.map(function (date) { return (date ? returnDate(date, s, valueFormat, isoParts, _this._hasTime) : null); });
          }
          if (valueDate === null) {
              return null;
          }
          return returnDate(valueDate, s, valueFormat, isoParts, this._hasTime);
      };
      DatepickerBase.prototype._onClosed = function () {
          this._active = this._activeSelect = UNDEFINED;
          // if there's a timegrid, we should also clear the time part of the selection
          if (this._hasTimegrid) {
              this._selectedTime = UNDEFINED;
          }
      };
      DatepickerBase.prototype._onOpen = function () {
          this._newSelection = true; // used by the range selection only
      };
      DatepickerBase.prototype._resetInputs = function () {
          if (this._resetStartInput) {
              this._resetStartInput();
              this._resetStartInput = UNDEFINED;
          }
          if (this._resetEndInput) {
              this._resetEndInput();
              this._resetEndInput = UNDEFINED;
          }
      };
      /** The formatted end value in the case of the range picker */
      DatepickerBase.prototype._getValueText = function (input) {
          return this._valueText.split(RANGE_SEPARATOR)[input === 'start' ? 0 : 1] || '';
      };
      /**
       * Checks if the temp selection is NOT ready yet for set
       * In the case of the range picker the selection is not ready when
       *  - no value is selected OR
       *  - only one value is selected and the labels are shown
       *    if the labels are not shown, we allow the selection in the case of date control or the calendar together with
       *    time - there's no way to switch to second value otherwise
       */
      DatepickerBase.prototype._selectionNotReady = function () {
          var notReady = false;
          if (this.s.select === 'range') {
              var val = (this._get(this._tempValueRep || {}) || []).filter(function (v) { return v; }); // filter out null/undefined
              notReady = !val.length; // no value selected
              if (!notReady) {
                  if (this._hasCalendar && !this._hasTime) {
                      notReady = val.length < 2; // using the calendar - both values have to be selected
                  }
                  else {
                      if (this._renderControls) {
                          // start/end selection labels shown - both values have to be selected
                          notReady = val.length < 2;
                      }
                      else {
                          // start/end selection labels hidden - we let only one value to be selected if it's the active selection
                          notReady = !this._tempValueRep[this._activeSelect];
                      }
                  }
              }
          }
          return notReady;
      };
      /** Sets the _activeSelect property and triggers the 'onActiveDateChange' event if the active select changed */
      DatepickerBase.prototype._setActiveSelect = function (active, timeout) {
          var _this = this;
          if (this._activeSelect !== active) {
              if (timeout) {
                  // TODO: What if we always do it with timeout?
                  setTimeout(function () { return _this._hook('onActiveDateChange', { active: active }); });
              }
              else {
                  this._hook('onActiveDateChange', { active: active });
              }
          }
          this._activeSelect = active;
      };
      /** @hidden */
      DatepickerBase.defaults = __assign({}, dateTimeLocale, PickerBase.defaults, { activeElm: '.mbsc-calendar-cell[tabindex="0"]', controls: CALENDAR_CTRL, dateText: 'Date', inRangeInvalid: false, inputTyping: true, rangeEndHelp: 'Please select', rangeEndLabel: 'End', rangeHighlight: true, rangeStartHelp: 'Please select', rangeStartLabel: 'Start', select: 'date', selectSize: 7, selectedText: '{count} selected', showOnClick: true, 
          // showOnFocus: true,
          timeText: 'Time' });
      // tslint:disable variable-name
      DatepickerBase._name = 'Datepicker';
      return DatepickerBase;
  }(PickerBase));

  // tslint:disable no-non-null-assertion
  var MbscCalendarNavService = /*#__PURE__*/ (function () {
      function MbscCalendarNavService() {
          this.pageSize = 0;
          // tslint:disable-next-line: variable-name
          this._prevS = {};
          // tslint:disable-next-line: variable-name
          this._s = {};
      }
      MbscCalendarNavService.prototype.options = function (news, forcePageLoading) {
          var s = (this._s = __assign({}, this._s, news));
          var prevS = this._prevS;
          var getDate = s.getDate;
          var getYear = s.getYear;
          var getMonth = s.getMonth;
          var showCalendar = s.showCalendar;
          var calendarType = s.calendarType;
          var startDay = s.startDay;
          var endDay = s.endDay;
          var firstWeekDay = s.firstDay;
          var isWeekView = calendarType === 'week';
          var weeks = showCalendar ? (isWeekView ? s.weeks : 6) : 0;
          var minDate = s.min !== prevS.min || !this.minDate ? (!isEmpty(s.min) ? makeDate(s.min) : -Infinity) : this.minDate;
          var maxDate = s.max !== prevS.max || !this.maxDate ? (!isEmpty(s.max) ? makeDate(s.max) : Infinity) : this.maxDate;
          var initialActive = s.activeDate || +new Date();
          var activeDate = constrain(initialActive, +minDate, +maxDate);
          var forcePageChange = this.forcePageChange || activeDate !== initialActive;
          var d = new Date(activeDate);
          var activeChanged = activeDate !== prevS.activeDate;
          var viewChanged = s.calendarType !== prevS.calendarType ||
              s.eventRange !== prevS.eventRange ||
              s.firstDay !== prevS.firstDay ||
              s.eventRangeSize !== prevS.eventRangeSize ||
              s.refDate !== prevS.refDate ||
              showCalendar !== prevS.showCalendar ||
              s.size !== prevS.size ||
              s.weeks !== prevS.weeks;
          var pageIndex = forcePageChange ||
              this.pageIndex === UNDEFINED ||
              viewChanged ||
              (!this.preventPageChange && activeChanged && (activeDate < +this.firstDay || activeDate >= +this.lastDay))
              ? getPageIndex(d, s)
              : this.pageIndex;
          var size = calendarType === 'year' ? 12 : s.size || 1;
          var isGrid = size > 1 && !isWeekView;
          var pageNr = isGrid ? 1 : getPageNr(s.pages, this.pageSize);
          var isVertical = s.calendarScroll === 'vertical' && s.pages !== 'auto' && (s.pages === UNDEFINED || s.pages === 1);
          var showOuter = s.showOuterDays !== UNDEFINED ? s.showOuterDays : !isVertical && pageNr < 2 && (isWeekView || !size || size < 2);
          var pageBuffer = isGrid ? 0 : 1;
          var firstDay = getFirstPageDay(pageIndex, s);
          var lastDay = getFirstPageDay(pageIndex + pageNr, s);
          // In case of scheduler and timeline, if startDay & endDay is specified, calculate first and last days based on that
          if (!showCalendar && s.eventRange === 'week' && startDay !== UNDEFINED && endDay !== UNDEFINED) {
              firstDay = addDays(firstDay, startDay - firstWeekDay + (startDay < firstWeekDay ? 7 : 0));
              lastDay = addDays(firstDay, 7 * s.eventRangeSize + endDay - startDay + 1 - (endDay < startDay ? 0 : 7));
          }
          var firstPageDay = showCalendar && showOuter ? getFirstDayOfWeek(firstDay, s) : firstDay;
          var lastPage = isGrid ? getDate(getYear(lastDay), getMonth(lastDay) - 1, 1) : getFirstPageDay(pageIndex + pageNr - 1, s);
          var lastPageDay = showCalendar && showOuter ? addDays(getFirstDayOfWeek(lastPage, s), weeks * 7) : lastDay;
          var start = showCalendar ? getFirstDayOfWeek(getFirstPageDay(pageIndex - pageBuffer, s), s) : firstDay;
          var last = showCalendar ? getFirstDayOfWeek(getFirstPageDay(pageIndex + pageNr + pageBuffer - 1, s), s) : lastDay;
          var end = showCalendar ? addDays(isGrid ? getFirstDayOfWeek(lastPage, s) : last, weeks * 7) : lastDay;
          var initialRun = this.pageIndex === UNDEFINED;
          var viewStart = start;
          var viewEnd = end;
          if (!showCalendar && s.resolution === 'week' && (s.eventRange === 'year' || s.eventRange === 'month')) {
              var length_1 = endDay - startDay + 1 + (endDay < startDay ? 7 : 0);
              if (firstDay.getDay() !== startDay) {
                  var weekStart = getFirstDayOfWeek(firstDay, s, startDay);
                  var weekEnd = addDays(weekStart, length_1);
                  viewStart = weekEnd <= firstDay ? addDays(weekStart, 7) : weekStart;
              }
              if (lastDay.getDay() !== startDay) {
                  var weekStart = getFirstDayOfWeek(lastDay, s, startDay);
                  var weekEnd = addDays(weekStart, length_1);
                  viewEnd = weekStart > lastDay ? addDays(weekEnd, -7) : weekEnd;
              }
          }
          var pageChange = false;
          if (pageIndex !== UNDEFINED) {
              pageChange = +viewStart !== +this.viewStart || +viewEnd !== +this.viewEnd;
              this.pageIndex = pageIndex;
          }
          this.firstDay = firstDay;
          this.lastDay = lastDay;
          this.firstPageDay = firstPageDay;
          this.lastPageDay = lastPageDay;
          this.viewStart = viewStart;
          this.viewEnd = viewEnd;
          this.forcePageChange = false;
          this.preventPageChange = false;
          this.minDate = minDate;
          this.maxDate = maxDate;
          this._prevS = s;
          if (pageIndex !== UNDEFINED && (pageChange || forcePageLoading)) {
              if (pageChange && !initialRun) {
                  this.pageChange();
              }
              this.pageLoading(pageChange);
          }
      };
      MbscCalendarNavService.prototype.pageChange = function () {
          if (this._s.onPageChange) {
              this._s.onPageChange({
                  firstDay: this.firstPageDay,
                  lastDay: this.lastPageDay,
                  month: this._s.calendarType === 'month' ? this.firstDay : UNDEFINED,
                  type: 'onPageChange',
                  viewEnd: this.viewEnd,
                  viewStart: this.viewStart,
              }, null);
          }
      };
      MbscCalendarNavService.prototype.pageLoading = function (viewChanged) {
          if (this._s.onPageLoading) {
              this._s.onPageLoading({
                  firstDay: this.firstPageDay,
                  lastDay: this.lastPageDay,
                  month: this._s.calendarType === 'month' ? this.firstDay : UNDEFINED,
                  type: 'onPageLoading',
                  viewChanged: viewChanged,
                  viewEnd: this.viewEnd,
                  viewStart: this.viewStart,
              }, null);
          }
      };
      return MbscCalendarNavService;
  }());

  // TODO handle:
  //  1 headerText count
  /** @hidden */
  var CalendarBase = /*#__PURE__*/ (function (_super) {
      __extends(CalendarBase, _super);
      function CalendarBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /** @hidden */
          _this._navService = new MbscCalendarNavService();
          /** @hidden */
          _this._update = 0;
          // tslint:enable variable-name
          /** @hidden */
          // tslint:disable-next-line: variable-name
          _this._onDayClick = function (args) {
              var s = _this.s;
              var date = addTimezone(s, args.date);
              var d = +date;
              if (args.disabled) {
                  return;
              }
              // Update tempValueRep with the new selection
              if (s.selectMultiple) {
                  var tempValueRep = _this._tempValueRep;
                  if (tempValueRep[d]) {
                      delete tempValueRep[d];
                  }
                  else if (s.selectMax !== UNDEFINED ? Object.keys(tempValueRep).length < s.selectMax : true) {
                      tempValueRep[d] = date;
                  }
                  // Need a new object reference to always re-render the calendarview
                  _this._tempValueRep = __assign({}, tempValueRep);
              }
              else {
                  if (!s.selectRange) {
                      _this._tempValueRep = {};
                  }
                  _this._tempValueRep[d] = date;
              }
              _this._navService.preventPageChange = s.selectRange;
              _this._hook('onCellClick', args);
              _this._setOrUpdate();
          };
          /** @hidden */
          // tslint:disable-next-line: variable-name
          _this._onTodayClick = function () {
              var date = new Date();
              var d = +getDateOnly(date);
              if (!_this.s.selectRange && !_this.s.selectMultiple) {
                  _this._tempValueRep = {};
                  _this._tempValueRep[d] = date;
                  _this._setOrUpdate();
              }
          };
          /** @hidden */
          // tslint:disable-next-line: variable-name
          _this._onActiveChange = function (args) {
              _this._navService.forcePageChange = args.pageChange;
              // Force update if active date is the same as previous active date
              _this._update++;
              _this._hook('onActiveChange', args);
          };
          // tslint:disable-next-line: variable-name
          _this._setCal = function (cal) {
              _this._calendarView = cal;
              // this._instanceService.instance = this;
          };
          return _this;
      }
      /** @hidden */
      CalendarBase.prototype._valueEquals = function (v1, v2) {
          return dateValueEquals(v1, v2, this.s);
      };
      CalendarBase.prototype._shouldValidate = function (s, prevS) {
          return s.dataTimezone !== prevS.dataTimezone || s.displayTimezone !== prevS.displayTimezone;
      };
      CalendarBase.prototype._render = function (s, state) {
          _super.prototype._render.call(this, s, state);
          this._navService.options({
              activeDate: s.active,
              calendarType: s.calendarType,
              firstDay: s.firstDay,
              getDate: s.getDate,
              getDay: s.getDay,
              getMonth: s.getMonth,
              getYear: s.getYear,
              max: s.max,
              min: s.min,
              onPageChange: s.onPageChange,
              onPageLoading: s.onPageLoading,
              pages: s.pages,
              refDate: s.refDate,
              showCalendar: true,
              showOuterDays: s.showOuterDays,
              size: s.size,
              weeks: s.weeks,
          });
      };
      CalendarBase.prototype._copy = function (value) {
          return __assign({}, value);
      };
      CalendarBase.prototype._format = function (value) {
          var s = this.s;
          var ret = [];
          for (var i in value) {
              if (value[i] !== UNDEFINED && value[i] !== null) {
                  ret.push(formatDate(s.dateFormat, new Date(+value[i]), s));
              }
          }
          return s.selectMultiple || s.selectRange ? ret.join(', ') : ret[0];
      };
      CalendarBase.prototype._parse = function (value) {
          var s = this.s;
          var isRange = s.selectRange;
          var ret = {};
          var values = [];
          if (isString(value)) {
              values = value.split(',');
          }
          else if (isArray(value)) {
              values = value;
          }
          else if (value && !isArray(value)) {
              values = [value];
          }
          for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
              var val = values_1[_i];
              if (val !== null) {
                  var date = makeDate(val, s, s.dateFormat);
                  var key = isRange ? +date : +getDateOnly(date); // we need the time part for the same day ranges ex. [06.30 00:00 - 06.30 23:59]
                  ret[key] = date;
              }
          }
          return ret;
      };
      CalendarBase.prototype._get = function (value) {
          var s = this.s;
          var isRange = s.selectRange;
          if (this.s.selectMultiple || isRange) {
              var valueArray = [];
              for (var _i = 0, _a = Object.keys(value); _i < _a.length; _i++) {
                  var v = _a[_i];
                  valueArray.push(createDate(s, +value[v]));
              }
              return valueArray;
          }
          var valueKeys = Object.keys(value || {});
          if (!valueKeys.length) {
              return null;
          }
          return createDate(s, value[valueKeys[0]]);
      };
      /** @hidden */
      CalendarBase.defaults = __assign({}, calendarViewDefaults, { calendarScroll: 'horizontal', calendarType: 'month', selectedText: '{count} selected', showControls: true, showOnClick: true, weeks: 1 });
      // tslint:disable variable-name
      CalendarBase._name = 'Calendar';
      return CalendarBase;
  }(PickerBase));

  var InstanceServiceBase = /*#__PURE__*/ (function () {
      function InstanceServiceBase() {
          this.onInstanceReady = new Observable();
          this.onComponentChange = new Observable();
      }
      Object.defineProperty(InstanceServiceBase.prototype, "instance", {
          get: function () {
              return this.inst;
          },
          set: function (inst) {
              this.inst = inst;
              this.onInstanceReady.next(inst);
          },
          enumerable: true,
          configurable: true
      });
      return InstanceServiceBase;
  }());

  /** @hidden */
  var IconBase = /*#__PURE__*/ (function (_super) {
      __extends(IconBase, _super);
      function IconBase() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      // tslint:enable variable-name
      IconBase.prototype._render = function (s) {
          // The icon might be custom markup as well
          this._hasChildren = !isString(s.name);
          this._cssClass =
              this._className +
                  ' mbsc-icon' +
                  this._theme +
                  (s.name && !this._hasChildren
                      ? // If the icon name contains a space, we consider it as a 3rd party font icon,
                          // (e.g. FA: 'fas fa-camera', or Ionicon: 'icon ion-md-heart').
                          // Otherwas we add the 'mbsc-icon-' prefix to use our font.
                          s.name.indexOf(' ') !== -1
                              ? ' ' + s.name
                              : ' mbsc-font-icon mbsc-icon-' + s.name
                      : '');
          this._svg = s.svg ? this._safeHtml(s.svg) : UNDEFINED;
      };
      return IconBase;
  }(BaseComponent));

  function template(s, inst) {
      return (createElement("span", { onClick: s.onClick, className: inst._cssClass, dangerouslySetInnerHTML: inst._svg, "v-html": UNDEFINED }, inst._hasChildren && s.name));
  }
  /**
   * The Icon component.
   *
   * Usage:
   *
   * ```
   * <Icon name="home" />
   * ```
   */
  var Icon = /*#__PURE__*/ (function (_super) {
      __extends(Icon, _super);
      function Icon() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Icon.prototype._template = function (s) {
          return template(s, this);
      };
      return Icon;
  }(IconBase));

  // tslint:disable no-non-null-assertion
  var tapped = 0;
  var allowQuick;
  /**
   * Returns the X or Y coordinate from a touch or mouse event.
   * @hidden
   * @param ev
   * @param axis
   * @param page
   * @returns
   */
  function getCoord(ev, axis, page) {
      // const ev = e.originalEvent || e;
      var prop = (page ? 'page' : 'client') + axis;
      // Multi touch support
      if (ev.targetTouches && ev.targetTouches[0]) {
          return ev.targetTouches[0][prop];
      }
      if (ev.changedTouches && ev.changedTouches[0]) {
          return ev.changedTouches[0][prop];
      }
      return ev[prop];
  }
  /** @hidden */
  function preventClick() {
      // Prevent ghost click
      tapped++;
      setTimeout(function () {
          tapped--;
      }, 500);
  }
  /** @hidden */
  function triggerClick(ev, control) {
      // Prevent duplicate triggers on the same element
      // e.g. a form checkbox inside a listview item
      if (control.mbscClick) {
          return;
      }
      var touch = (ev.originalEvent || ev).changedTouches[0];
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
      evt.isMbscTap = true;
      // Prevent ionic to bust our click
      // This works for Ionic 1 - 3, not sure about 4
      evt.isIonicTap = true;
      // This will allow a click fired together with this click
      // We need this, because clicking on a label will trigger a click
      // on the associated input as well, which should not be busted
      allowQuick = true;
      control.mbscChange = true;
      control.mbscClick = true;
      control.dispatchEvent(evt);
      allowQuick = false;
      // Prevent ghost click
      preventClick();
      setTimeout(function () {
          delete control.mbscClick;
      });
  }
  /**
   * Prevent standard behaviour on click
   * @hidden
   * @param ev
   */
  function bustClick(ev) {
      // Textarea needs the mousedown event
      if (tapped && !allowQuick && !ev.isMbscTap && !(ev.target.nodeName === 'TEXTAREA' && ev.type === MOUSE_DOWN)) {
          ev.stopPropagation();
          ev.preventDefault();
      }
  }
  if (isBrowser) {
      [MOUSE_OVER, MOUSE_ENTER, MOUSE_DOWN, MOUSE_UP, CLICK].forEach(function (ev) {
          doc.addEventListener(ev, bustClick, true);
      });
      if (os === 'android' && majorVersion < 5) {
          doc.addEventListener(CHANGE, function (ev) {
              var target = ev.target;
              if (tapped && target.type === 'checkbox' && !target.mbscChange) {
                  ev.stopPropagation();
                  ev.preventDefault();
              }
              delete target.mbscChange;
          }, true);
      }
  }

  // tslint:disable no-non-null-assertion
  var wasTouched;
  /** @hidden */
  function setFocusInvisible(ev) {
      var win = getWindow(ev.target);
      win.__mbscFocusVisible = false;
  }
  /** @hidden */
  function setFocusVisible(ev) {
      var win = getWindow(ev.target);
      win.__mbscFocusVisible = true;
  }
  /** @hidden */
  function addRipple(elm, x, y) {
      var rect = elm.getBoundingClientRect();
      var left = x - rect.left;
      var top = y - rect.top;
      var width = Math.max(left, elm.offsetWidth - left);
      var height = Math.max(top, elm.offsetHeight - top);
      var size = 2 * Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      var ripple = doc.createElement('span');
      ripple.classList.add('mbsc-ripple');
      var style = ripple.style;
      style.backgroundColor = getComputedStyle(elm).color;
      style.width = size + 'px';
      style.height = size + 'px';
      style.top = y - rect.top - size / 2 + 'px';
      style.left = x - rect.left - size / 2 + 'px';
      elm.appendChild(ripple);
      // raf(() => {
      setTimeout(function () {
          style.opacity = '.2';
          style.transform = 'scale(1)';
          style.transition = 'opacity linear .1s, transform cubic-bezier(0, 0, 0.2, 1) .4s';
      }, 30);
      return ripple;
  }
  /** @hidden */
  function removeRipple(r) {
      if (r) {
          setTimeout(function () {
              r.style.opacity = '0';
              r.style.transition = 'opacity linear .4s';
              setTimeout(function () {
                  if (r && r.parentNode) {
                      r.parentNode.removeChild(r);
                  }
              }, 400);
          }, 200);
      }
  }
  /** @hidden */
  function gestureListener(elm, options) {
      var args = {};
      var win = getWindow(elm);
      var document = getDocument(elm);
      var active;
      var activeable;
      var activeTimer;
      var ripple;
      var hasFocus;
      var hasHover;
      var hasRipple;
      var moved;
      var startX;
      var startY;
      var endX;
      var endY;
      var deltaX;
      var deltaY;
      var started;
      function skipMouseEvent(ev) {
          if (ev.type === TOUCH_START) {
              wasTouched = true;
          }
          else if (wasTouched) {
              if (ev.type === MOUSE_DOWN) {
                  wasTouched = false;
              }
              return true;
          }
          return false;
      }
      function activate() {
          if (hasRipple) {
              removeRipple(ripple);
              ripple = addRipple(elm, endX, endY);
          }
          options.onPress();
          active = true;
      }
      function deactivate(r, time) {
          activeable = false;
          removeRipple(r);
          clearTimeout(activeTimer);
          activeTimer = setTimeout(function () {
              if (active) {
                  options.onRelease();
                  active = false;
              }
          }, time);
      }
      function onStart(ev) {
          // Skip if mouse down event was fired after touch
          if (skipMouseEvent(ev)) {
              return;
          }
          // Skip mousedown event if right click
          if (ev.type === MOUSE_DOWN && (ev.button !== 0 || ev.ctrlKey)) {
              return;
          }
          startX = getCoord(ev, 'X');
          startY = getCoord(ev, 'Y');
          endX = startX;
          endY = startY;
          active = false;
          activeable = false;
          moved = false;
          started = true;
          args.moved = moved;
          args.startX = startX;
          args.startY = startY;
          args.endX = endX;
          args.endY = endY;
          args.deltaX = 0;
          args.deltaY = 0;
          args.domEvent = ev;
          args.isTouch = wasTouched;
          removeRipple(ripple);
          if (options.onStart) {
              var ret = options.onStart(args);
              hasRipple = ret && ret.ripple;
          }
          if (options.onPress) {
              activeable = true;
              clearTimeout(activeTimer);
              activeTimer = setTimeout(activate, 50);
          }
          if (ev.type === MOUSE_DOWN) {
              listen(document, MOUSE_MOVE, onMove);
              listen(document, MOUSE_UP, onEnd);
          }
          listen(document, CONTEXTMENU, onContextMenu);
      }
      function onMove(ev) {
          if (!started) {
              return;
          }
          endX = getCoord(ev, 'X');
          endY = getCoord(ev, 'Y');
          deltaX = endX - startX;
          deltaY = endY - startY;
          if (!moved && (Math.abs(deltaX) > 9 || Math.abs(deltaY) > 9)) {
              moved = true;
              deactivate(ripple);
          }
          args.moved = moved;
          args.endX = endX;
          args.endY = endY;
          args.deltaX = deltaX;
          args.deltaY = deltaY;
          args.domEvent = ev;
          args.isTouch = ev.type === TOUCH_MOVE;
          if (options.onMove) {
              options.onMove(args);
          }
      }
      function onEnd(ev) {
          if (!started) {
              return;
          }
          if (activeable && !active) {
              clearTimeout(activeTimer);
              activate();
          }
          args.domEvent = ev;
          args.isTouch = ev.type === TOUCH_END;
          if (options.onEnd) {
              options.onEnd(args);
          }
          deactivate(ripple, 75);
          started = false;
          if (ev.type === TOUCH_END && options.click && hasGhostClick && !moved) {
              triggerClick(ev, ev.target);
          }
          if (ev.type === MOUSE_UP) {
              unlisten(document, MOUSE_MOVE, onMove);
              unlisten(document, MOUSE_UP, onEnd);
          }
          unlisten(document, CONTEXTMENU, onContextMenu);
      }
      function onHoverIn(ev) {
          if (skipMouseEvent(ev)) {
              return;
          }
          hasHover = true;
          options.onHoverIn(ev);
      }
      function onHoverOut(ev) {
          if (hasHover) {
              options.onHoverOut(ev);
          }
          hasHover = false;
      }
      function onKeyDown(ev) {
          options.onKeyDown(ev);
      }
      function onFocus(ev) {
          if (options.keepFocus || win.__mbscFocusVisible) {
              hasFocus = true;
              options.onFocus(ev);
          }
      }
      function onBlur(ev) {
          if (hasFocus) {
              options.onBlur(ev);
          }
          hasFocus = false;
      }
      function onChange(ev) {
          options.onChange(ev);
      }
      function onInput(ev) {
          options.onInput(ev);
      }
      function onDoubleClick(ev) {
          args.domEvent = ev;
          if (!wasTouched) {
              options.onDoubleClick(args);
          }
      }
      function onContextMenu(ev) {
          if (wasTouched) {
              ev.preventDefault();
          }
      }
      // Set up listeners
      listen(elm, MOUSE_DOWN, onStart);
      listen(elm, TOUCH_START, onStart, { passive: true });
      listen(elm, TOUCH_MOVE, onMove, { passive: false });
      listen(elm, TOUCH_END, onEnd);
      listen(elm, TOUCH_CANCEL, onEnd);
      if (options.onChange) {
          listen(elm, CHANGE, onChange);
      }
      if (options.onInput) {
          listen(elm, INPUT, onInput);
      }
      if (options.onHoverIn) {
          listen(elm, MOUSE_ENTER, onHoverIn);
      }
      if (options.onHoverOut) {
          listen(elm, MOUSE_LEAVE, onHoverOut);
      }
      if (options.onKeyDown) {
          listen(elm, KEY_DOWN, onKeyDown);
      }
      if (options.onFocus && win) {
          listen(elm, FOCUS, onFocus);
          if (!options.keepFocus) {
              var focusCount = win.__mbscFocusCount || 0;
              if (focusCount === 0) {
                  listen(win, MOUSE_DOWN, setFocusInvisible, true);
                  listen(win, KEY_DOWN, setFocusVisible, true);
              }
              win.__mbscFocusCount = ++focusCount;
          }
      }
      if (options.onBlur) {
          listen(elm, BLUR, onBlur);
      }
      if (options.onDoubleClick) {
          listen(elm, DOUBLE_CLICK, onDoubleClick);
      }
      return function () {
          clearTimeout(activeTimer);
          if (options.onFocus && win && !options.keepFocus) {
              var focusCount = win.__mbscFocusCount || 0;
              win.__mbscFocusCount = --focusCount;
              if (focusCount <= 0) {
                  unlisten(win, MOUSE_DOWN, setFocusInvisible);
                  unlisten(win, KEY_DOWN, setFocusVisible);
              }
          }
          unlisten(elm, INPUT, onInput);
          unlisten(elm, MOUSE_DOWN, onStart);
          unlisten(elm, TOUCH_START, onStart, { passive: true });
          unlisten(elm, TOUCH_MOVE, onMove, { passive: false });
          unlisten(elm, TOUCH_END, onEnd);
          unlisten(elm, TOUCH_CANCEL, onEnd);
          unlisten(document, MOUSE_MOVE, onMove);
          unlisten(document, MOUSE_UP, onEnd);
          unlisten(document, CONTEXTMENU, onContextMenu);
          unlisten(elm, CHANGE, onChange);
          unlisten(elm, MOUSE_ENTER, onHoverIn);
          unlisten(elm, MOUSE_LEAVE, onHoverOut);
          unlisten(elm, KEY_DOWN, onKeyDown);
          unlisten(elm, FOCUS, onFocus);
          unlisten(elm, BLUR, onBlur);
          unlisten(elm, DOUBLE_CLICK, onDoubleClick);
      };
  }

  /** @hidden */
  var ButtonBase = /*#__PURE__*/ (function (_super) {
      __extends(ButtonBase, _super);
      function ButtonBase() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      // tslint:enable variable-name
      ButtonBase.prototype._mounted = function () {
          var _this = this;
          this._unlisten = gestureListener(this._el, {
              click: true,
              onBlur: function () {
                  _this.setState({ hasFocus: false });
              },
              onFocus: function () {
                  _this.setState({ hasFocus: true });
              },
              onHoverIn: function () {
                  if (!_this.s.disabled) {
                      _this.setState({ hasHover: true });
                  }
              },
              onHoverOut: function () {
                  _this.setState({ hasHover: false });
              },
              onKeyDown: function (ev) {
                  switch (ev.keyCode) {
                      case ENTER:
                      case SPACE:
                          _this._el.click();
                          ev.preventDefault();
                          break;
                  }
              },
              onPress: function () {
                  _this.setState({ isActive: true });
              },
              onRelease: function () {
                  _this.setState({ isActive: false });
              },
              onStart: function () {
                  return { ripple: _this.s.ripple && !_this.s.disabled };
              },
          });
      };
      ButtonBase.prototype._render = function (s, state) {
          var _this = this;
          var disabled = s.disabled;
          this._isIconOnly = !!(s.icon || s.iconSvg);
          this._hasStartIcon = !!(s.startIcon || s.startIconSvg);
          this._hasEndIcon = !!(s.endIcon || s.endIconSvg);
          this._tabIndex = disabled ? UNDEFINED : s.tabIndex || 0;
          this._cssClass =
              this._className +
                  ' mbsc-reset mbsc-font mbsc-button' +
                  this._theme +
                  this._rtl +
                  ' mbsc-button-' +
                  s.variant +
                  (this._isIconOnly ? ' mbsc-icon-button' : '') +
                  (disabled ? ' mbsc-disabled' : '') +
                  (s.color ? ' mbsc-button-' + s.color : '') +
                  (state.hasFocus && !disabled ? ' mbsc-focus' : '') +
                  (state.isActive && !disabled ? ' mbsc-active' : '') +
                  (state.hasHover && !disabled ? ' mbsc-hover' : '');
          this._iconClass = 'mbsc-button-icon' + this._rtl;
          this._startIconClass = this._iconClass + ' mbsc-button-icon-start';
          this._endIconClass = this._iconClass + ' mbsc-button-icon-end';
          // Workaround for mouseleave not firing on disabled button
          if (s.disabled && state.hasHover) {
              setTimeout(function () {
                  _this.setState({ hasHover: false });
              });
          }
      };
      ButtonBase.prototype._destroy = function () {
          if (this._unlisten) {
              this._unlisten();
          }
      };
      // tslint:disable variable-name
      ButtonBase.defaults = {
          ripple: false,
          role: 'button',
          tag: 'button',
          variant: 'standard',
      };
      ButtonBase._name = 'Button';
      return ButtonBase;
  }(BaseComponent));

  function template$1(s, inst, content) {
      var _a = inst.props, ariaLabel = _a.ariaLabel; _a.children; _a.className; _a.color; var endIcon = _a.endIcon; _a.endIconSrc; var endIconSvg = _a.endIconSvg; _a.hasChildren; var icon = _a.icon; _a.iconSrc; var iconSvg = _a.iconSvg; _a.ripple; _a.rtl; var role = _a.role, startIcon = _a.startIcon; _a.startIconSrc; var startIconSvg = _a.startIconSvg; _a.tag; _a.tabIndex; _a.theme; _a.themeVariant; _a.variant; var other = __rest(_a, ["ariaLabel", "children", "className", "color", "endIcon", "endIconSrc", "endIconSvg", "hasChildren", "icon", "iconSrc", "iconSvg", "ripple", "rtl", "role", "startIcon", "startIconSrc", "startIconSvg", "tag", "tabIndex", "theme", "themeVariant", "variant"]);
      // Need to use props here, otherwise all inherited settings will be included in ...other,
      // which will end up on the native element, resulting in invalid DOM
      var props = __assign({ 'aria-label': ariaLabel, className: inst._cssClass, ref: inst._setEl }, other);
      var inner = (createElement(Fragment, null,
          inst._isIconOnly && createElement(Icon, { className: inst._iconClass, name: icon, svg: iconSvg, theme: s.theme }),
          inst._hasStartIcon && createElement(Icon, { className: inst._startIconClass, name: startIcon, svg: startIconSvg, theme: s.theme }),
          content,
          inst._hasEndIcon && createElement(Icon, { className: inst._endIconClass, name: endIcon, svg: endIconSvg, theme: s.theme })));
      if (s.tag === 'span') {
          return (createElement("span", __assign({ role: role, "aria-disabled": s.disabled, tabIndex: inst._tabIndex }, props), inner));
      }
      if (s.tag === 'a') {
          return (createElement("a", __assign({ "aria-disabled": s.disabled, tabIndex: inst._tabIndex }, props), inner));
      }
      return (createElement("button", __assign({ role: role, tabIndex: inst._tabIndex }, props), inner));
  }
  /**
   * The Button component.
   *
   * Usage:
   *
   * ```
   * <Button icon="home">A button</Button>
   * ```
   */
  var Button = /*#__PURE__*/ (function (_super) {
      __extends(Button, _super);
      function Button() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Button.prototype._template = function (s) {
          return template$1(s, this, s.children);
      };
      return Button;
  }(ButtonBase));

  var CalendarContext = createContext({});
  var InstanceSubscriber = /*#__PURE__*/ (function (_super) {
      __extends(InstanceSubscriber, _super);
      function InstanceSubscriber() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      // tslint:enable: variable-name
      InstanceSubscriber.prototype.componentWillUnmount = function () {
          if (this._changes) {
              this._changes.unsubscribe(this._handler);
          }
      };
      InstanceSubscriber.prototype.render = function () {
          var _this = this;
          var _a = this.props, host = _a.host, component = _a.component, view = _a.view, other = __rest(_a, ["host", "component", "view"]);
          var calView = view || (host && host._calendarView);
          if (calView && !this._changes) {
              this._changes = calView.s.instanceService.onComponentChange;
              this._handler = this._changes.subscribe(function () {
                  _this.forceUpdate();
              });
          }
          return createElement(CalendarContext.Consumer, null, function (_a) {
              var instance = _a.instance;
              var inst = instance || view || (host && host._calendarView);
              return inst && createElement(component, __assign({ inst: inst }, other));
          });
      };
      return InstanceSubscriber;
  }(PureComponent));
  var CalendarPrevButton = function (_a) {
      var inst = _a.inst, className = _a.className;
      return (createElement(Button, { ariaLabel: inst.s.prevPageText, className: 'mbsc-calendar-button ' + (className || ''), disabled: inst._isPrevDisabled(), iconSvg: inst._prevIcon, onClick: inst.prevPage, theme: inst.s.theme, themeVariant: inst.s.themeVariant, type: "button", variant: "flat" }));
  };
  var CalendarNextButton = function (_a) {
      var inst = _a.inst, className = _a.className;
      return (createElement(Button, { ariaLabel: inst.s.nextPageText, disabled: inst._isNextDisabled(), className: 'mbsc-calendar-button ' + (className || ''), iconSvg: inst._nextIcon, onClick: inst.nextPage, theme: inst.s.theme, themeVariant: inst.s.themeVariant, type: "button", variant: "flat" }));
  };
  var CalendarTodayButton = function (_a) {
      var inst = _a.inst, className = _a.className;
      return (createElement(Button, { className: 'mbsc-calendar-button mbsc-calendar-button-today ' + (className || ''), onClick: inst._onTodayClick, theme: inst.s.theme, themeVariant: inst.s.themeVariant, type: "button", variant: "flat" }, inst.s.todayText));
  };
  var CalendarTitleButton = function (_a) {
      var inst = _a.inst, className = _a.className;
      var s = inst.s;
      var theme = inst._theme;
      var view = inst._view;
      return (createElement("div", { "aria-live": "polite", className: (className || '') + theme }, inst._title.map(function (val, index) {
          return ((inst._pageNr === 1 || index === 0 || inst._hasPicker || view === MONTH_VIEW) && (createElement(Button, { className: 'mbsc-calendar-button' + (inst._pageNr > 1 ? ' mbsc-flex-1-1' : ''), "data-index": index, onClick: inst._onPickerBtnClick, key: index, theme: s.theme, themeVariant: s.themeVariant, type: "button", variant: "flat" },
              (inst._hasPicker || view === MONTH_VIEW) &&
                  (val.title ? (createElement("span", { className: 'mbsc-calendar-title' + theme }, val.title)) : (createElement(Fragment, null,
                      inst._yearFirst && createElement("span", { className: 'mbsc-calendar-title mbsc-calendar-year' + theme }, val.yearTitle),
                      createElement("span", { className: 'mbsc-calendar-title mbsc-calendar-month' + theme }, val.monthTitle),
                      !inst._yearFirst && createElement("span", { className: 'mbsc-calendar-title mbsc-calendar-year' + theme }, val.yearTitle)))),
              !inst._hasPicker && view !== MONTH_VIEW && createElement("span", { className: 'mbsc-calendar-title' + theme }, inst._viewTitle),
              s.downIcon && inst._pageNr === 1 ? createElement(Icon, { svg: view === MONTH_VIEW ? s.downIcon : s.upIcon, theme: s.theme }) : null)));
      })));
  };
  var CalendarPrev = function (_a) {
      var calendar = _a.calendar, view = _a.view, others = __rest(_a, ["calendar", "view"]);
      return createElement(InstanceSubscriber, __assign({ component: CalendarPrevButton, host: calendar, view: view }, others));
  };
  CalendarPrev._name = 'CalendarPrev';
  var CalendarNext = function (_a) {
      var calendar = _a.calendar, view = _a.view, others = __rest(_a, ["calendar", "view"]);
      return createElement(InstanceSubscriber, __assign({ component: CalendarNextButton, host: calendar, view: view }, others));
  };
  CalendarNext._name = 'CalendarNext';
  var CalendarToday = function (_a) {
      var calendar = _a.calendar, view = _a.view, others = __rest(_a, ["calendar", "view"]);
      return createElement(InstanceSubscriber, __assign({ component: CalendarTodayButton, host: calendar, view: view }, others));
  };
  CalendarToday._name = 'CalendarToday';
  var CalendarNav = function (_a) {
      var calendar = _a.calendar, view = _a.view, others = __rest(_a, ["calendar", "view"]);
      return createElement(InstanceSubscriber, __assign({ component: CalendarTitleButton, host: calendar, view: view }, others));
  };
  CalendarNav._name = 'CalendarNav';

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  /** @hidden */
  var CalendarViewBase = /*#__PURE__*/ (function (_super) {
      __extends(CalendarViewBase, _super);
      function CalendarViewBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.state = {
              height: 'sm',
              // maxLabels: 0,
              pageSize: 0,
              pickerSize: 0,
              // view: MONTH_VIEW,
              width: 'sm',
          };
          _this._dim = {};
          _this._months = [1, 2, 3]; // TODO: this is crap
          _this._title = [];
          _this.MONTH_VIEW = MONTH_VIEW;
          _this.YEAR_VIEW = YEAR_VIEW;
          _this.MULTI_YEAR_VIEW = MULTI_YEAR_VIEW;
          // tslint:enable variable-name
          // ---
          /**
           * Navigates to next page
           */
          _this.nextPage = function () {
              _this._prevDocClick();
              switch (_this._view) {
                  case MULTI_YEAR_VIEW:
                      _this._activeYearsChange(1);
                      break;
                  case YEAR_VIEW:
                      _this._activeYearChange(1);
                      break;
                  default:
                      _this._activeChange(1);
              }
          };
          /**
           * Navigates to previous page
           */
          _this.prevPage = function () {
              _this._prevDocClick();
              switch (_this._view) {
                  case MULTI_YEAR_VIEW:
                      _this._activeYearsChange(-1);
                      break;
                  case YEAR_VIEW:
                      _this._activeYearChange(-1);
                      break;
                  default:
                      _this._activeChange(-1);
              }
          };
          // These are public because of the angular template only
          // ---
          // tslint:disable variable-name
          _this._changeView = function (newView) {
              var s = _this.s;
              var view = _this._view;
              var hasPicker = _this._hasPicker;
              var selectView = s.selectView;
              var isYearView = (s.showCalendar ? s.calendarType : s.eventRange) === 'year';
              if (!newView) {
                  switch (view) {
                      case MONTH_VIEW:
                          newView = MULTI_YEAR_VIEW;
                          break;
                      case MULTI_YEAR_VIEW:
                          newView = YEAR_VIEW;
                          break;
                      default:
                          newView = hasPicker || selectView === YEAR_VIEW ? MULTI_YEAR_VIEW : MONTH_VIEW;
                  }
                  if (view === MULTI_YEAR_VIEW && isYearView) {
                      newView = MONTH_VIEW;
                  }
              }
              var skipAnimation = hasPicker && newView === selectView;
              _this.setState({
                  view: newView,
                  viewClosing: skipAnimation ? UNDEFINED : view,
                  viewOpening: skipAnimation ? UNDEFINED : newView,
              });
          };
          _this._onDayHoverIn = function (ev) {
              if (!_this._disableHover) {
                  _this._hook('onDayHoverIn', ev);
                  _this._hoverTimer = setTimeout(function () {
                      var key = getDateStr(ev.date);
                      if (_this._labels) {
                          ev.labels = _this._labels[key];
                      }
                      if (_this._marked) {
                          ev.marked = _this._marked[key];
                      }
                      _this._isHover = true;
                      _this._hook('onCellHoverIn', ev);
                  }, 150);
              }
          };
          _this._onDayHoverOut = function (ev) {
              if (!_this._disableHover) {
                  _this._hook('onDayHoverOut', ev);
                  clearTimeout(_this._hoverTimer);
                  if (_this._isHover) {
                      var key = getDateStr(ev.date);
                      if (_this._labels) {
                          ev.labels = _this._labels[key];
                      }
                      if (_this._marked) {
                          ev.marked = _this._marked[key];
                      }
                      _this._isHover = false;
                      _this._hook('onCellHoverOut', ev);
                  }
              }
          };
          _this._onLabelClick = function (args) {
              _this._isLabelClick = true;
              _this._hook('onLabelClick', args);
          };
          _this._onDayClick = function (args) {
              _this._shouldFocus = !_this._isLabelClick;
              _this._prevAnim = false;
              _this._isLabelClick = false;
              _this._hook('onDayClick', args);
          };
          _this._onTodayClick = function (args) {
              _this._prevAnim = false;
              _this._hook('onActiveChange', {
                  date: +removeTimezone(createDate(_this.s)),
                  today: true,
              });
              _this._hook('onTodayClick', {});
          };
          _this._onMonthClick = function (args) {
              if (args.disabled) {
                  return;
              }
              var d = args.date;
              var s = _this.s;
              if (s.selectView === YEAR_VIEW) {
                  _this._hook('onDayClick', args);
              }
              else {
                  var newIndex = getPageIndex(d, s);
                  _this._prevDocClick();
                  _this._changeView(MONTH_VIEW);
                  _this._shouldFocus = true;
                  _this._prevAnim = !_this._hasPicker;
                  _this._hook('onActiveChange', {
                      date: +d,
                      // it is used for scrolling to the first day of the selected month in case of quick navigation
                      nav: true,
                      pageChange: newIndex !== _this._pageIndex,
                  });
              }
          };
          _this._onYearClick = function (args) {
              if (args.disabled) {
                  return;
              }
              var d = args.date;
              var s = _this.s;
              var view = s.selectView;
              if (view === MULTI_YEAR_VIEW) {
                  _this._hook('onDayClick', args);
              }
              else {
                  _this._shouldFocus = true;
                  _this._prevAnim = view === YEAR_VIEW;
                  _this._activeMonth = +d;
                  _this._prevDocClick();
                  _this._changeView();
                  if ((s.showCalendar ? s.calendarType : s.eventRange) === 'year') {
                      var newIndex = getPageIndex(d, s);
                      _this._hook('onActiveChange', {
                          date: +d,
                          pageChange: newIndex !== _this._pageIndex,
                      });
                  }
              }
          };
          _this._onPageChange = function (args) {
              _this._isSwipeChange = true;
              _this._activeChange(args.diff);
          };
          _this._onYearPageChange = function (args) {
              _this._activeYearChange(args.diff);
          };
          _this._onYearsPageChange = function (args) {
              _this._activeYearsChange(args.diff);
          };
          _this._onAnimationEnd = function (args) {
              _this._disableHover = false;
              if (_this._isIndexChange) {
                  _this._pageLoaded();
                  _this._isIndexChange = false;
              }
          };
          _this._onStart = function () {
              clearTimeout(_this._hoverTimer);
          };
          _this._onGestureStart = function (args) {
              _this._disableHover = true;
              _this._hook('onGestureStart', args);
          };
          _this._onGestureEnd = function (args) {
              _this._prevDocClick();
          };
          _this._onPickerClose = function () {
              _this.setState({ view: MONTH_VIEW });
          };
          _this._onPickerOpen = function () {
              var pageHeight = _this._pickerCont.clientHeight;
              var pageWidth = _this._pickerCont.clientWidth;
              _this.setState({ pickerSize: _this._isVertical ? pageHeight : pageWidth });
          };
          _this._onPickerBtnClick = function (ev) {
              if (_this._view === MONTH_VIEW) {
                  _this._pickerBtn = ev.currentTarget;
              }
              _this._prevDocClick();
              _this._changeView();
          };
          _this._onDocClick = function () {
              var view = _this.s.selectView;
              if (!_this._prevClick && !_this._hasPicker && _this._view !== view) {
                  _this._changeView(view);
              }
          };
          _this._onViewAnimationEnd = function () {
              if (_this.state.viewClosing) {
                  _this.setState({ viewClosing: UNDEFINED });
              }
              if (_this.state.viewOpening) {
                  _this.setState({ viewOpening: UNDEFINED });
              }
          };
          _this._onResize = function () {
              if (!_this._body || !isBrowser) {
                  return;
              }
              var s = _this.s;
              var state = _this.state;
              var showCalendar = s.showCalendar;
              // In Chrome, if _body has a size in subpixels, the inner element will still have rounded pixel values,
              // so we calculate with the size of the inner element.
              var body = showCalendar /* TRIALCOND */ ? _this._body.querySelector('.mbsc-calendar-body-inner') : _this._body;
              // We need to use getBoundingClientRect to get the subpixel values if that's the case,
              // otherwise after multiple navigations the transform will be off
              // const rect = body.getBoundingClientRect();
              // const pageHeight = rect.height; // this._body.clientHeight;
              // const pageWidth = rect.width; // this._body.clientWidth;
              var totalWidth = _this._el.offsetWidth;
              var totalHeight = _this._el.offsetHeight;
              var pageHeight = body.clientHeight;
              var pageWidth = body.clientWidth;
              var pageSize = _this._isVertical ? pageHeight : pageWidth;
              var pickerSize = _this._hasPicker ? state.pickerSize : pageSize;
              var ready = showCalendar !== UNDEFINED;
              var width = 'sm';
              var height = 'sm';
              var maxLabels = 1;
              var hasScrollY = false;
              var cellTextHeight = 0;
              var labelHeight = 0;
              if (s.responsiveStyle && !_this._isGrid) {
                  if (pageHeight > 300) {
                      height = 'md';
                  }
                  if (pageWidth > 767) {
                      width = 'md';
                  }
              }
              if (width !== state.width || height !== state.height) {
                  // Switch between mobile and desktop styling.
                  // After the new classes are applied, labels and page sizes needs re-calculation
                  _this._shouldCheckSize = true;
                  _this.setState({ width: width, height: height });
              }
              else {
                  if (_this._labels && showCalendar /* TRIALCOND */) {
                      // Check how many labels can we display on a day
                      // TODO: this must be refactored for React Native
                      var placeholder = body.querySelector('.mbsc-calendar-text');
                      var cell = body.querySelector('.mbsc-calendar-day-inner');
                      var labelsCont = cell.querySelector('.mbsc-calendar-labels');
                      var txtMargin = placeholder ? getDimension(placeholder, 'marginBottom') : 2;
                      var txtHeight = placeholder ? placeholder.offsetHeight : 18;
                      cellTextHeight = labelsCont.offsetTop;
                      hasScrollY = body.scrollHeight > body.clientHeight;
                      labelHeight = txtHeight + txtMargin;
                      maxLabels = Math.max(1, floor((cell.clientHeight - cellTextHeight) / labelHeight));
                  }
                  _this._hook('onResize', {
                      height: totalHeight,
                      target: _this._el,
                      width: totalWidth,
                  });
                  s.navigationService.pageSize = pageSize;
                  // Force update if page loaded needs to be triggered
                  var update = _this._shouldPageLoad ? (state.update || 0) + 1 : state.update;
                  _this.setState({ cellTextHeight: cellTextHeight, hasScrollY: hasScrollY, labelHeight: labelHeight, maxLabels: maxLabels, pageSize: pageSize, pickerSize: pickerSize, ready: ready, update: update });
              }
          };
          _this._onKeyDown = function (ev) {
              var s = _this.s;
              var view = _this._view;
              var active = view === MONTH_VIEW ? _this._active : _this._activeMonth;
              var activeDate = new Date(active);
              var year = s.getYear(activeDate);
              var month = s.getMonth(activeDate);
              var day = s.getDay(activeDate);
              var getDate = s.getDate;
              var weeks = s.weeks;
              var isMonthView = s.calendarType === 'month';
              var newDate;
              if (view === MULTI_YEAR_VIEW) {
                  var newYear = void 0;
                  switch (ev.keyCode) {
                      case LEFT_ARROW:
                          newYear = year - 1 * _this._rtlNr;
                          break;
                      case RIGHT_ARROW:
                          newYear = year + 1 * _this._rtlNr;
                          break;
                      case UP_ARROW:
                          newYear = year - 3;
                          break;
                      case DOWN_ARROW:
                          newYear = year + 3;
                          break;
                      case HOME:
                          newYear = _this._getPageYears(_this._yearsIndex);
                          break;
                      case END:
                          newYear = _this._getPageYears(_this._yearsIndex) + 11;
                          break;
                      case PAGE_UP:
                          newYear = year - 12;
                          break;
                      case PAGE_DOWN:
                          newYear = year + 12;
                          break;
                  }
                  if (newYear && _this._minYears <= newYear && _this._maxYears >= newYear) {
                      ev.preventDefault();
                      _this._shouldFocus = true;
                      _this._prevAnim = false;
                      _this._activeMonth = +getDate(newYear, 0, 1);
                      _this.forceUpdate();
                  }
              }
              else if (view === YEAR_VIEW) {
                  switch (ev.keyCode) {
                      case LEFT_ARROW:
                          newDate = getDate(year, month - 1 * _this._rtlNr, 1);
                          break;
                      case RIGHT_ARROW:
                          newDate = getDate(year, month + 1 * _this._rtlNr, 1);
                          break;
                      case UP_ARROW:
                          newDate = getDate(year, month - 3, 1);
                          break;
                      case DOWN_ARROW:
                          newDate = getDate(year, month + 3, 1);
                          break;
                      case HOME:
                          newDate = getDate(year, 0, 1);
                          break;
                      case END:
                          newDate = getDate(year, 11, 1);
                          break;
                      case PAGE_UP:
                          newDate = getDate(year - 1, month, 1);
                          break;
                      case PAGE_DOWN:
                          newDate = getDate(year + 1, month, 1);
                          break;
                  }
                  if (newDate && _this._minYear <= newDate && _this._maxYear >= newDate) {
                      ev.preventDefault();
                      _this._shouldFocus = true;
                      _this._prevAnim = false;
                      _this._activeMonth = +newDate;
                      _this.forceUpdate();
                  }
              }
              else if (view === MONTH_VIEW) {
                  switch (ev.keyCode) {
                      case LEFT_ARROW:
                          newDate = getDate(year, month, day - 1 * _this._rtlNr);
                          break;
                      case RIGHT_ARROW:
                          newDate = getDate(year, month, day + 1 * _this._rtlNr);
                          break;
                      case UP_ARROW:
                          newDate = getDate(year, month, day - 7);
                          break;
                      case DOWN_ARROW:
                          newDate = getDate(year, month, day + 7);
                          break;
                      case HOME:
                          newDate = getDate(year, month, 1);
                          break;
                      case END:
                          newDate = getDate(year, month + 1, 0);
                          break;
                      case PAGE_UP:
                          newDate = ev.altKey
                              ? getDate(year - 1, month, day)
                              : isMonthView
                                  ? getDate(year, month - 1, day)
                                  : getDate(year, month, day - weeks * 7);
                          break;
                      case PAGE_DOWN:
                          newDate = ev.altKey
                              ? getDate(year + 1, month, day)
                              : isMonthView
                                  ? getDate(year, month + 1, day)
                                  : getDate(year, month, day + weeks * 7);
                          break;
                  }
                  if (newDate && _this._minDate <= newDate && _this._maxDate >= newDate) {
                      ev.preventDefault();
                      var newIndex = getPageIndex(newDate, s);
                      _this._shouldFocus = true;
                      _this._prevAnim = false;
                      _this._pageChange = s.noOuterChange && newIndex !== _this._pageIndex;
                      _this._hook('onActiveChange', {
                          date: +newDate,
                          pageChange: _this._pageChange,
                      });
                  }
              }
          };
          _this._setHeader = function (el) {
              _this._headerElement = el;
          };
          _this._setBody = function (el) {
              _this._body = el;
          };
          _this._setPickerCont = function (el) {
              _this._pickerCont = el;
          };
          return _this;
      }
      CalendarViewBase.prototype._getPageDay = function (pageIndex) {
          return +getFirstPageDay(pageIndex, this.s);
      };
      CalendarViewBase.prototype._getPageStyle = function (index, offset, pageNr) {
          var _a;
          return _a = {},
              _a[(jsPrefix ? jsPrefix + 'T' : 't') + 'ransform'] = 'translate' + this._axis + '(' + (index - offset) * 100 * this._rtlNr + '%)',
              _a.width = 100 / (pageNr || 1) + '%',
              _a;
      };
      CalendarViewBase.prototype._getPageYear = function (pageIndex) {
          var s = this.s;
          var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
          var year = s.getYear(refDate);
          return year + pageIndex;
      };
      CalendarViewBase.prototype._getPageYears = function (pageIndex) {
          var s = this.s;
          var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
          var year = s.getYear(refDate);
          return year + pageIndex * 12;
      };
      CalendarViewBase.prototype._getPickerClass = function (view) {
          var animName;
          var pickerName = view === this.s.selectView ? ' mbsc-calendar-picker-main' : '';
          var baseName = 'mbsc-calendar-picker';
          var hasPicker = this._hasPicker;
          var _a = this.state, viewClosing = _a.viewClosing, viewOpening = _a.viewOpening;
          switch (view) {
              case MONTH_VIEW:
                  animName = hasPicker ? '' : (viewOpening === MONTH_VIEW ? 'in-down' : '') + (viewClosing === MONTH_VIEW ? 'out-down' : '');
                  break;
              case MULTI_YEAR_VIEW:
                  animName =
                      hasPicker && viewClosing === MONTH_VIEW
                          ? ''
                          : (viewOpening === MULTI_YEAR_VIEW ? 'in-up' : '') + (viewClosing === MULTI_YEAR_VIEW ? 'out-up' : '');
                  break;
              default:
                  animName =
                      hasPicker && viewOpening === MONTH_VIEW
                          ? ''
                          : (viewOpening === YEAR_VIEW ? (viewClosing === MULTI_YEAR_VIEW ? 'in-down' : 'in-up') : '') +
                              (viewClosing === YEAR_VIEW ? (viewOpening === MULTI_YEAR_VIEW ? 'out-down' : 'out-up') : '');
          }
          return baseName + pickerName + (hasAnimation && animName ? ' ' + baseName + '-' + animName : '');
      };
      CalendarViewBase.prototype._isNextDisabled = function (isModalPicker) {
          if (!this._hasPicker || isModalPicker) {
              var view = this._view;
              if (view === MULTI_YEAR_VIEW) {
                  return this._yearsIndex + 1 > this._maxYearsIndex;
              }
              if (view === YEAR_VIEW) {
                  return this._yearIndex + 1 > this._maxYearIndex;
              }
          }
          return this._pageIndex + 1 > this._maxIndex;
      };
      CalendarViewBase.prototype._isPrevDisabled = function (isModalPicker) {
          if (!this._hasPicker || isModalPicker) {
              var view = this._view;
              if (view === MULTI_YEAR_VIEW) {
                  return this._yearsIndex - 1 < this._minYearsIndex;
              }
              if (view === YEAR_VIEW) {
                  return this._yearIndex - 1 < this._minYearIndex;
              }
          }
          return this._pageIndex - 1 < this._minIndex;
      };
      // tslint:enable variable-name
      // ---
      CalendarViewBase.prototype._render = function (s, state) {
          var getDate = s.getDate;
          var getYear = s.getYear;
          var getMonth = s.getMonth;
          var showCalendar = s.showCalendar;
          var calendarType = s.calendarType;
          var eventRange = s.eventRange;
          var eventRangeSize = s.eventRangeSize || 1;
          var firstWeekDay = s.firstDay;
          var isWeekView = calendarType === 'week';
          var isMonthView = calendarType === 'month';
          var isYearView = calendarType === 'year';
          var size = isYearView ? 12 : +(s.size || 1);
          var isGrid = size > 1 && !isWeekView;
          var weeks = showCalendar ? (isWeekView ? s.weeks : 6) : 0;
          var active = s.activeDate || this._active || +new Date();
          var activeChanged = active !== this._active;
          var d = new Date(active);
          var prevProps = this._prevS;
          var dateFormat = s.dateFormat;
          var monthNames = s.monthNames;
          var yearSuffix = s.yearSuffix;
          var variableRow = isNumeric(s.labelList) ? +s.labelList + 1 : s.labelList === 'all' ? -1 : 0;
          var labelListingChanged = s.labelList !== prevProps.labelList;
          var navService = s.navigationService;
          var pageIndex = navService.pageIndex;
          var firstDay = navService.firstDay;
          var lastDay = navService.lastDay;
          var start = navService.viewStart;
          var end = navService.viewEnd;
          this._minDate = navService.minDate;
          this._maxDate = navService.maxDate;
          if (!isEmpty(s.min)) {
              var min = getDateOnly(this._minDate);
              this._minDate = getDateOnly(min);
              this._minYear = getDate(getYear(min), getMonth(min), 1);
              this._minYears = getYear(min);
              this._minIndex = getPageIndex(min, s);
              this._minYearIndex = getYearIndex(min, s);
              this._minYearsIndex = getYearsIndex(min, s);
          }
          else {
              this._minIndex = -Infinity;
              this._minYears = -Infinity;
              this._minYearsIndex = -Infinity;
              this._minYear = -Infinity;
              this._minYearIndex = -Infinity;
          }
          if (!isEmpty(s.max)) {
              var max = this._maxDate;
              this._maxYear = getDate(getYear(max), getMonth(max) + 1, 1);
              this._maxYears = getYear(max);
              this._maxIndex = getPageIndex(max, s);
              this._maxYearIndex = getYearIndex(max, s);
              this._maxYearsIndex = getYearsIndex(max, s);
          }
          else {
              this._maxIndex = Infinity;
              this._maxYears = Infinity;
              this._maxYearsIndex = Infinity;
              this._maxYear = Infinity;
              this._maxYearIndex = Infinity;
          }
          // We only recalculate the page index if the new active date is outside of the current view limits,
          // or page change is forced (swipe, or prev/next arrows), or the view is changed
          var viewChanged = calendarType !== prevProps.calendarType ||
              eventRange !== prevProps.eventRange ||
              firstWeekDay !== prevProps.firstDay ||
              s.eventRangeSize !== prevProps.eventRangeSize ||
              s.refDate !== prevProps.refDate ||
              s.showCalendar !== prevProps.showCalendar ||
              s.weeks !== prevProps.weeks;
          if (viewChanged && this._pageIndex !== UNDEFINED) {
              this._prevAnim = true;
          }
          if (activeChanged) {
              this._activeMonth = active;
          }
          this._view = state.view || s.selectView;
          this._yearsIndex = getYearsIndex(new Date(this._activeMonth), s);
          this._yearIndex = getYearIndex(new Date(this._activeMonth), s);
          if (this._view === YEAR_VIEW) {
              this._viewTitle = this._getPageYear(this._yearIndex) + '';
          }
          else if (this._view === MULTI_YEAR_VIEW) {
              var startYear = this._getPageYears(this._yearsIndex);
              this._viewTitle = startYear + ' - ' + (startYear + 11);
          }
          var pageNr = isGrid ? 1 : getPageNr(s.pages, state.pageSize);
          var isVertical = s.calendarScroll === 'vertical' && s.pages !== 'auto' && (s.pages === UNDEFINED || s.pages === 1);
          var showOuter = s.showOuterDays !== UNDEFINED ? s.showOuterDays : !isVertical && pageNr < 2 && (isWeekView || !size || size < 2);
          var monthIndex = dateFormat.search(/m/i);
          var yearIndex = dateFormat.search(/y/i);
          // Grid view
          if (isGrid) {
              this._monthsMulti = [];
              if (pageIndex !== UNDEFINED) {
                  // Multiplying with 0.96 and 1.1 needed, because margins and paddings are used on the month grid
                  var columns = floor((state.pageSize * 0.96) / (PAGE_WIDTH * 1.1)) || 1;
                  while (size % columns) {
                      columns--;
                  }
                  for (var i = 0; i < size / columns; ++i) {
                      var rowItems = [];
                      for (var j = 0; j < columns; ++j) {
                          rowItems.push(+getDate(getYear(firstDay), getMonth(firstDay) + i * columns + j, 1));
                      }
                      this._monthsMulti.push(rowItems);
                  }
              }
          }
          if (calendarType !== prevProps.calendarType ||
              s.theme !== prevProps.theme ||
              s.calendarScroll !== prevProps.calendarScroll ||
              s.hasContent !== prevProps.hasContent ||
              s.showCalendar !== prevProps.showCalendar ||
              s.showSchedule !== prevProps.showSchedule ||
              s.showWeekNumbers !== prevProps.showWeekNumbers ||
              s.weeks !== prevProps.weeks ||
              labelListingChanged) {
              this._shouldCheckSize = true;
          }
          if (prevProps.width !== s.width || prevProps.height !== s.height) {
              this._dim = {
                  height: addPixel(s.height),
                  width: addPixel(s.width),
              };
          }
          this._cssClass =
              'mbsc-calendar mbsc-font mbsc-flex-col' +
                  this._theme +
                  this._rtl +
                  (state.ready ? '' : ' mbsc-hidden') +
                  (isGrid ? ' mbsc-calendar-grid-view' : ' mbsc-calendar-height-' + state.height + ' mbsc-calendar-width-' + state.width) +
                  ' ' +
                  s.cssClass;
          this._dayNames = state.width === 'sm' || isGrid ? s.dayNamesMin : s.dayNamesShort;
          this._isSwipeChange = false;
          this._yearFirst = yearIndex < monthIndex;
          this._pageNr = pageNr;
          this._variableRow = variableRow;
          // Only calculate labels/marks/colors when needed
          var forcePageLoad = s.pageLoad !== prevProps.pageLoad;
          var pageChanged = +start !== +this._viewStart || +end !== +this._viewEnd;
          if (this._pageIndex !== UNDEFINED && pageChanged) {
              this._isIndexChange = !this._isSwipeChange && !viewChanged;
          }
          if (pageIndex !== UNDEFINED) {
              this._pageIndex = pageIndex;
          }
          if (pageIndex !== UNDEFINED &&
              (s.marked !== prevProps.marked ||
                  s.colors !== prevProps.colors ||
                  s.labels !== prevProps.labels ||
                  s.invalid !== prevProps.invalid ||
                  s.valid !== prevProps.valid ||
                  state.maxLabels !== this._maxLabels ||
                  pageChanged ||
                  labelListingChanged ||
                  forcePageLoad)) {
              this._maxLabels = state.maxLabels;
              this._viewStart = start;
              this._viewEnd = end;
              var labelsMap = s.labelsMap || getEventMap(s.labels, start, end, s);
              var labels = labelsMap &&
                  getLabels(s, labelsMap, start, end, this._variableRow || this._maxLabels || 1, 7, false, firstWeekDay, true, s.eventOrder, !showOuter, s.showLabelCount, s.moreEventsText, s.moreEventsPluralText);
              // If labels were not displayed previously, need to calculate how many labels can be placed
              if (labels && !this._labels) {
                  this._shouldCheckSize = true;
              }
              if ((labels && state.maxLabels) || !labels) {
                  this._shouldPageLoad = !this._isIndexChange || this._prevAnim || !showCalendar || forcePageLoad;
              }
              this._labelsLayout = labels;
              this._labels = labelsMap;
              this._marked = labelsMap ? UNDEFINED : s.marksMap || getEventMap(s.marked, start, end, s);
              this._colors = getEventMap(s.colors, start, end, s);
              this._valid = getEventMap(s.valid, start, end, s, true);
              this._invalid = getEventMap(s.invalid, start, end, s, true);
          }
          // Generate the header title
          if (pageChanged ||
              activeChanged ||
              eventRange !== prevProps.eventRange ||
              eventRangeSize !== prevProps.eventRangeSize ||
              s.monthNames !== prevProps.monthNames) {
              this._title = [];
              var lDay = addDays(lastDay, -1);
              var titleDate = pageIndex === UNDEFINED ? d : firstDay;
              // Check if a selected day is in the current view,
              // the title will be generated based on the selected day
              if (isWeekView) {
                  titleDate = d;
                  for (var _i = 0, _a = Object.keys(s.selectedDates); _i < _a.length; _i++) {
                      var key = _a[_i];
                      if (+key >= +firstDay && +key < +lastDay) {
                          titleDate = new Date(+key);
                          break;
                      }
                  }
              }
              if (this._pageNr > 1) {
                  for (var i = 0; i < pageNr; i++) {
                      var dt = getDate(getYear(firstDay), getMonth(firstDay) + i, 1);
                      var yt = getYear(dt) + yearSuffix;
                      var mt = monthNames[getMonth(dt)];
                      this._title.push({ yearTitle: yt, monthTitle: mt });
                  }
              }
              else {
                  var titleObj = { yearTitle: getYear(titleDate) + yearSuffix, monthTitle: monthNames[getMonth(titleDate)] };
                  var titleType = s.showSchedule && eventRangeSize === 1 ? eventRange : showCalendar ? calendarType : eventRange;
                  var agendaOnly = eventRange && !showCalendar && (!s.showSchedule || eventRangeSize > 1);
                  switch (titleType) {
                      case 'year': {
                          titleObj.title = getYear(firstDay) + yearSuffix;
                          if (eventRangeSize > 1) {
                              titleObj.title += ' - ' + (getYear(lDay) + yearSuffix);
                          }
                          break;
                      }
                      case 'month': {
                          if (eventRangeSize > 1 && !showCalendar) {
                              var monthStart = monthNames[getMonth(firstDay)];
                              var yearStart = getYear(firstDay) + yearSuffix;
                              var titleStart = this._yearFirst ? yearStart + ' ' + monthStart : monthStart + ' ' + yearStart;
                              var monthEnd = monthNames[getMonth(lDay)];
                              var yearEnd = getYear(lDay) + yearSuffix;
                              var titleEnd = this._yearFirst ? yearEnd + ' ' + monthEnd : monthEnd + ' ' + yearEnd;
                              titleObj.title = titleStart + ' - ' + titleEnd;
                          }
                          else if (isGrid) {
                              titleObj.title = getYear(firstDay) + yearSuffix;
                          }
                          break;
                      }
                      case 'day':
                      case 'week': {
                          if (agendaOnly) {
                              var dayIndex = dateFormat.search(/d/i);
                              var shortDateFormat = dayIndex < monthIndex ? 'D MMM, YYYY' : 'MMM D, YYYY';
                              titleObj.title = formatDate(shortDateFormat, firstDay, s);
                              if (titleType === 'week' || eventRangeSize > 1) {
                                  titleObj.title += ' - ' + formatDate(shortDateFormat, lDay, s);
                              }
                          }
                          break;
                      }
                      // case 'day': {
                      //   if (agendaOnly) {
                      //     titleObj.title = formatDate(dateFormat, firstDay, s);
                      //     if (eventRangeSize > 1) {
                      //       titleObj.title += ' - ' + formatDate(dateFormat, lDay, s);
                      //     }
                      //   }
                      // }
                  }
                  this._title.push(titleObj);
              }
          }
          this._active = active;
          this._hasPicker = s.hasPicker || isGrid || !isMonthView || !showCalendar || (state.width === 'md' && s.hasPicker !== false);
          this._axis = isVertical ? 'Y' : 'X';
          this._rtlNr = !isVertical && s.rtl ? -1 : 1;
          this._weeks = weeks;
          this._nextIcon = isVertical ? s.nextIconV : s.rtl ? s.prevIconH : s.nextIconH;
          this._prevIcon = isVertical ? s.prevIconV : s.rtl ? s.nextIconH : s.prevIconH;
          this._mousewheel = s.mousewheel === UNDEFINED ? isVertical : s.mousewheel;
          this._isGrid = isGrid;
          this._isVertical = isVertical;
          this._showOuter = showOuter;
          this._showDaysTop = isVertical || (!!variableRow && size === 1);
      };
      CalendarViewBase.prototype._mounted = function () {
          this._observer = resizeObserver(this._el, this._onResize, this._zone);
          this._doc = getDocument(this._el);
          listen(this._doc, CLICK, this._onDocClick);
      };
      CalendarViewBase.prototype._updated = function () {
          var _this = this;
          if (this._shouldCheckSize) {
              setTimeout(function () {
                  _this._onResize();
              });
              this._shouldCheckSize = false;
          }
          else if (this._shouldPageLoad) {
              // Trigger initial onPageLoaded if needed
              this._pageLoaded();
              this._shouldPageLoad = false;
          }
          if (this._shouldFocus) {
              // Angular needs setTimeout to wait for the next tick
              setTimeout(function () {
                  _this._focusActive();
                  _this._shouldFocus = false;
              });
          }
          if (this.s.instanceService) {
              this.s.instanceService.onComponentChange.next({});
          }
          this._pageChange = false;
          // TODO: why is this needed???
          if (this._variableRow && this.s.showCalendar) {
              var body = this._body.querySelector('.mbsc-calendar-body-inner');
              var hasScrollY = body.scrollHeight > body.clientHeight;
              if (hasScrollY !== this.state.hasScrollY) {
                  this._shouldCheckSize = true;
                  this.setState({ hasScrollY: hasScrollY });
              }
          }
      };
      CalendarViewBase.prototype._destroy = function () {
          if (this._observer) {
              this._observer.detach();
          }
          unlisten(this._doc, CLICK, this._onDocClick);
          clearTimeout(this._hoverTimer);
      };
      // ---
      CalendarViewBase.prototype._getActiveCell = function () {
          // TODO: get rid of direct DOM function
          var view = this._view;
          var cont = view === MONTH_VIEW ? this._body : this._pickerCont;
          var cell = view === MULTI_YEAR_VIEW ? 'year' : view === YEAR_VIEW ? 'month' : 'cell';
          return cont && cont.querySelector('.mbsc-calendar-' + cell + '[tabindex="0"]');
      };
      CalendarViewBase.prototype._focusActive = function () {
          var cell = this._getActiveCell();
          if (cell) {
              cell.focus();
          }
      };
      CalendarViewBase.prototype._pageLoaded = function () {
          var navService = this.s.navigationService;
          this._hook('onPageLoaded', {
              activeElm: this._getActiveCell(),
              firstDay: navService.firstPageDay,
              lastDay: navService.lastPageDay,
              month: this.s.calendarType === 'month' ? navService.firstDay : UNDEFINED,
              viewEnd: navService.viewEnd,
              viewStart: navService.viewStart,
          });
      };
      CalendarViewBase.prototype._activeChange = function (diff) {
          var nextIndex = this._pageIndex + diff;
          if (this._minIndex <= nextIndex && this._maxIndex >= nextIndex /* TRIALCOND */) {
              this._prevAnim = false;
              this._pageChange = true;
              this._hook('onActiveChange', {
                  date: this._getPageDay(nextIndex),
                  dir: diff,
                  pageChange: true,
              });
          }
      };
      CalendarViewBase.prototype._activeYearsChange = function (diff) {
          var nextIndex = this._yearsIndex + diff;
          if (this._minYearsIndex <= nextIndex && this._maxYearsIndex >= nextIndex) {
              var newYear = this._getPageYears(nextIndex);
              this._prevAnim = false;
              this._activeMonth = +this.s.getDate(newYear, 0, 1);
              this.forceUpdate();
          }
      };
      CalendarViewBase.prototype._activeYearChange = function (diff) {
          var nextIndex = this._yearIndex + diff;
          if (this._minYearIndex <= nextIndex && this._maxYearIndex >= nextIndex) {
              var newYear = this._getPageYear(nextIndex);
              this._prevAnim = false;
              this._activeMonth = +this.s.getDate(newYear, 0, 1);
              this.forceUpdate();
          }
      };
      CalendarViewBase.prototype._prevDocClick = function () {
          var _this = this;
          this._prevClick = true;
          setTimeout(function () {
              _this._prevClick = false;
          });
      };
      return CalendarViewBase;
  }(BaseComponent));

  /**
   * @param {import('../../src/index').RenderableProps<{ context: any }>} props
   */

  function ContextProvider(props) {
    this.getChildContext = function () {
      return props.context;
    };

    return props.children;
  }
  /**
   * Portal component
   * @this {import('./internal').Component}
   * @param {object | null | undefined} props
   *
   * TODO: use createRoot() instead of fake root
   */


  function Portal(props) {
    var _this = this;

    var container = props._container;

    _this.componentWillUnmount = function () {
      render(null, _this._temp);
      _this._temp = null;
      _this._container = null;
    }; // When we change container we should clear our old container and
    // indicate a new mount.


    if (_this._container && _this._container !== container) {
      _this.componentWillUnmount();
    } // When props.vnode is undefined/false/null we are dealing with some kind of
    // conditional vnode. This should not trigger a render.


    if (props._vnode) {
      if (!_this._temp) {
        _this._container = container; // Create a fake DOM parent node that manages a subset of `container`'s children:

        _this._temp = {
          nodeType: 1,
          parentNode: container,
          childNodes: [],
          appendChild: function appendChild(child) {
            this.childNodes.push(child);

            _this._container.appendChild(child);
          },
          insertBefore: function insertBefore(child, before) {
            this.childNodes.push(child);

            _this._container.appendChild(child);
          },
          removeChild: function removeChild(child) {
            this.childNodes.splice(this.childNodes.indexOf(child) >>> 1, 1);

            _this._container.removeChild(child);
          }
        };
      } // Render our wrapping element into temp.


      render(createElement(ContextProvider, {
        context: _this.context
      }, props._vnode), _this._temp);
    } // When we come from a conditional render, on a mounted
    // portal we should clear the DOM.
    else if (_this._temp) {
      _this.componentWillUnmount();
    }
  }
  /**
   * Create a `Portal` to continue rendering the vnode tree at a different DOM node
   * @param {import('./internal').VNode} vnode The vnode to render
   * @param {import('./internal').PreactElement} container The DOM node to continue rendering in to.
   */


  function createPortal(vnode, container) {
    return createElement(Portal, {
      _vnode: vnode,
      _container: container
    });
  }

  /** @hidden */
  var Portal$1 = /*#__PURE__*/ (function (_super) {
      __extends(Portal, _super);
      function Portal() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Portal.prototype.render = function () {
          var context = this.props.context;
          return context ? createPortal(this.props.children, context) : null;
      };
      return Portal;
  }(Component));

  var Portal$2 = Portal$1;
  function template$2(s, state, inst, content) {
      var _a, _b;
      var hb = inst._hb;
      var rtl = inst._rtl;
      var theme = inst._theme;
      var display = s.display;
      var keydown = (_a = {}, _a[ON_KEY_DOWN] = inst._onKeyDown, _a);
      var animationEnd = (_b = {}, _b[ON_ANIMATION_END] = inst._onAnimationEnd, _b);
      return inst._isModal ? (inst._isVisible ? (createElement(Portal$2, { context: inst._ctx },
          createElement("div", __assign({ className: 'mbsc-font mbsc-flex mbsc-popup-wrapper mbsc-popup-wrapper-' +
                  display +
                  theme +
                  rtl +
                  ' ' +
                  inst._className +
                  (s.fullScreen ? ' mbsc-popup-wrapper-' + display + '-full' : '') +
                  (inst._touchUi ? '' : ' mbsc-popup-pointer') +
                  (inst._round ? ' mbsc-popup-round' : '') +
                  (inst._hasContext ? ' mbsc-popup-wrapper-ctx' : '') +
                  (state.isReady ? '' : ' mbsc-popup-hidden'), ref: inst._setWrapper }, keydown),
              s.showOverlay && (createElement("div", { className: 'mbsc-popup-overlay mbsc-popup-overlay-' +
                      display +
                      theme +
                      (inst._isClosing ? ' mbsc-popup-overlay-out' : '') +
                      (inst._isOpening && state.isReady ? ' mbsc-popup-overlay-in' : ''), onClick: inst._onOverlayClick })),
              createElement("div", { className: 'mbsc-popup-limits mbsc-popup-limits-' + display, ref: inst._setLimitator, style: inst._limits }),
              createElement("div", __assign({ className: 'mbsc-flex-col mbsc-popup mbsc-popup-' +
                      display +
                      theme +
                      hb +
                      (s.fullScreen ? '-full' : '') +
                      // (this._short ? ' mbsc-popup-short' : '') +
                      (state.bubblePos && state.showArrow && display === 'anchored' ? ' mbsc-popup-anchored-' + state.bubblePos : '') +
                      (inst._isClosing ? ' mbsc-popup-' + inst._animation + '-out' : '') +
                      (inst._isOpening && state.isReady ? ' mbsc-popup-' + inst._animation + '-in' : ''), role: "dialog", "aria-modal": "true", ref: inst._setPopup, style: inst._style, onClick: inst._onPopupClick }, animationEnd),
                  display === 'anchored' && state.showArrow && (createElement("div", { className: 'mbsc-popup-arrow-wrapper mbsc-popup-arrow-wrapper-' + state.bubblePos + theme },
                      createElement("div", { className: 'mbsc-popup-arrow mbsc-popup-arrow-' + state.bubblePos + theme, style: state.arrowPos }))),
                  createElement("div", { className: "mbsc-popup-focus", tabIndex: -1, ref: inst._setActive }),
                  createElement("div", { className: 'mbsc-flex-col mbsc-flex-1-1 mbsc-popup-body mbsc-popup-body-' +
                          display +
                          theme +
                          hb +
                          (s.fullScreen ? ' mbsc-popup-body-' + display + '-full' : '') +
                          // (this._short ? ' mbsc-popup-short' : '') +
                          (inst._round ? ' mbsc-popup-body-round' : '') },
                      inst._headerText && (createElement("div", { className: 'mbsc-flex-none mbsc-popup-header mbsc-popup-header-' +
                              display +
                              theme +
                              hb +
                              (inst._buttons ? '' : ' mbsc-popup-header-no-buttons'), dangerouslySetInnerHTML: inst._headerText, "v-html": UNDEFINED })),
                      createElement("div", { className: 'mbsc-flex-1-1 mbsc-popup-content' + (s.contentPadding ? ' mbsc-popup-padding' : ''), ref: inst._setContent }, content),
                      inst._buttons && (createElement("div", { className: 'mbsc-flex-none mbsc-popup-buttons mbsc-popup-buttons-' +
                              display +
                              theme +
                              rtl +
                              hb +
                              (inst._flexButtons ? ' mbsc-popup-buttons-flex mbsc-flex' : '') +
                              (s.fullScreen ? ' mbsc-popup-buttons-' + display + '-full' : '') }, inst._buttons.map(function (btn, i) {
                          return (createElement(Button, { color: btn.color, className: 'mbsc-popup-button mbsc-popup-button-' +
                                  display +
                                  rtl +
                                  hb +
                                  (inst._flexButtons ? ' mbsc-popup-button-flex' : '') +
                                  ' ' +
                                  (btn.cssClass || ''), icon: btn.icon, disabled: btn.disabled, key: i, theme: s.theme, themeVariant: s.themeVariant, variant: btn.variant || s.buttonVariant, onClick: btn.handler }, btn.text));
                      })))))))) : null) : (createElement(Fragment, null, content));
  }
  var Popup = /*#__PURE__*/ (function (_super) {
      __extends(Popup, _super);
      function Popup() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Popup.prototype._template = function (s, state) {
          return template$2(s, state, this, s.children);
      };
      return Popup;
  }(PopupBase));

  var stateObservables = {};
  /** @hidden */
  var CalendarLabelBase = /*#__PURE__*/ (function (_super) {
      __extends(CalendarLabelBase, _super);
      function CalendarLabelBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          // tslint:enable variable-name
          // tslint:disable-next-line: variable-name
          _this._onClick = function (ev) {
              if (_this._isDrag) {
                  ev.stopPropagation();
              }
              else {
                  _this._triggerEvent('onClick', ev);
                  var s = _this.s;
                  var observable = stateObservables[s.id];
                  if (observable && s.selected) {
                      observable.next({ hasFocus: false });
                  }
              }
          };
          // tslint:disable-next-line: variable-name
          _this._onRightClick = function (ev) {
              _this._triggerEvent('onRightClick', ev);
          };
          // tslint:disable-next-line: variable-name
          _this._onDocTouch = function (ev) {
              unlisten(_this._doc, TOUCH_START, _this._onDocTouch);
              unlisten(_this._doc, MOUSE_DOWN, _this._onDocTouch);
              _this._isDrag = false;
              _this._hook('onDragModeOff', {
                  data: _this.s.event,
                  domEvent: ev,
              });
          };
          // tslint:disable-next-line: variable-name
          _this._updateState = function (args) {
              if (_this.s.showText) {
                  _this.setState(args);
              }
          };
          // tslint:disable-next-line: variable-name
          _this._triggerEvent = function (name, ev) {
              _this._hook(name, {
                  domEvent: ev,
                  label: _this.s.event,
                  target: _this._el,
              });
          };
          return _this;
      }
      CalendarLabelBase.prototype._mounted = function () {
          var _this = this;
          var opt = this.s;
          var id = opt.id;
          var isPicker = opt.isPicker;
          var resizeDir;
          var observable = stateObservables[id];
          if (!observable) {
              observable = new Observable();
              stateObservables[id] = observable;
          }
          this._unsubscribe = observable.subscribe(this._updateState);
          this._doc = getDocument(this._el);
          this._unlisten = gestureListener(this._el, {
              keepFocus: true,
              onBlur: function () {
                  if (!isPicker) {
                      observable.next({ hasFocus: false });
                  }
              },
              onDoubleClick: function (ev) {
                  // Prevent event creation on label double click
                  ev.domEvent.stopPropagation();
                  _this._hook('onDoubleClick', {
                      domEvent: ev.domEvent,
                      label: _this.s.event,
                      target: _this._el,
                  });
              },
              onEnd: function (ev) {
                  if (_this._isDrag) {
                      var s = _this.s;
                      var args = __assign({}, ev);
                      // Will prevent mousedown event on doc
                      args.domEvent.preventDefault();
                      args.data = s.event;
                      // args.target = this._el;
                      if (s.resize && resizeDir) {
                          args.resize = true;
                          args.direction = resizeDir;
                      }
                      else if (s.drag) {
                          args.drag = true;
                      }
                      _this._hook('onDragEnd', args);
                      // Turn off update, unless we're in touch update mode
                      if (!s.isUpdate) {
                          _this._isDrag = false;
                      }
                  }
                  clearTimeout(_this._touchTimer);
                  resizeDir = UNDEFINED;
              },
              onFocus: function () {
                  if (!isPicker) {
                      observable.next({ hasFocus: true });
                  }
              },
              onHoverIn: function (ev) {
                  if (_this._isDrag || isPicker) {
                      return;
                  }
                  observable.next({ hasHover: true });
                  _this._triggerEvent('onHoverIn', ev);
              },
              onHoverOut: function (ev) {
                  observable.next({ hasHover: false });
                  _this._triggerEvent('onHoverOut', ev);
              },
              onKeyDown: function (ev) {
                  var event = _this.s.event;
                  switch (ev.keyCode) {
                      case ENTER:
                      case SPACE:
                          _this._el.click();
                          ev.preventDefault();
                          break;
                      case BACKSPACE:
                      case DELETE:
                          if (event && event.editable !== false) {
                              _this._hook('onDelete', {
                                  domEvent: ev,
                                  event: event,
                                  source: 'calendar',
                              });
                          }
                          break;
                  }
              },
              onMove: function (ev) {
                  var s = _this.s;
                  var args = __assign({}, ev);
                  args.data = s.event;
                  if (resizeDir) {
                      args.resize = true;
                      args.direction = resizeDir;
                  }
                  else if (s.drag) {
                      args.drag = true;
                  }
                  else {
                      return;
                  }
                  if (!s.event || s.event.editable === false) {
                      return;
                  }
                  if (_this._isDrag) {
                      // Prevent page scroll
                      args.domEvent.preventDefault();
                      _this._hook('onDragMove', args);
                  }
                  else if (Math.abs(args.deltaX) > 7 || Math.abs(args.deltaY) > 7) {
                      clearTimeout(_this._touchTimer);
                      if (!args.isTouch) {
                          _this._isDrag = true;
                          _this._hook('onDragStart', args);
                      }
                  }
              },
              onStart: function (ev) {
                  var s = _this.s;
                  var args = __assign({}, ev);
                  var target = args.domEvent.target;
                  args.data = s.event;
                  if (s.resize && target.classList.contains('mbsc-calendar-label-resize')) {
                      resizeDir = target.classList.contains('mbsc-calendar-label-resize-start') ? 'start' : 'end';
                      args.resize = true;
                      args.direction = resizeDir;
                  }
                  else if (s.drag) {
                      args.drag = true;
                  }
                  else {
                      return;
                  }
                  if (!s.event || s.event.editable === false) {
                      return;
                  }
                  if (_this._isDrag || !args.isTouch) {
                      // Prevent exiting drag mode in case of touch,
                      // prevent calendar swipe in case of mouse drag
                      args.domEvent.stopPropagation();
                  }
                  if (_this._isDrag) {
                      _this._hook('onDragStart', args);
                  }
                  else if (args.isTouch) {
                      _this._touchTimer = setTimeout(function () {
                          _this._hook('onDragModeOn', args);
                          _this._hook('onDragStart', args);
                          _this._isDrag = true;
                      }, 350);
                  }
              },
          });
          if (this._isDrag) {
              listen(this._doc, TOUCH_START, this._onDocTouch);
              listen(this._doc, MOUSE_DOWN, this._onDocTouch);
          }
      };
      CalendarLabelBase.prototype._destroy = function () {
          if (this._unsubscribe) {
              var id = this.s.id;
              var observable = stateObservables[id];
              if (observable) {
                  observable.unsubscribe(this._unsubscribe);
                  if (!observable.nr) {
                      delete stateObservables[id];
                  }
              }
          }
          if (this._unlisten) {
              this._unlisten();
          }
          unlisten(this._doc, TOUCH_START, this._onDocTouch);
          unlisten(this._doc, MOUSE_DOWN, this._onDocTouch);
      };
      CalendarLabelBase.prototype._render = function (s, state) {
          var event = s.event;
          var d = new Date(s.date);
          var render = s.render || s.renderContent;
          var start;
          var end;
          var isMultiDay = false;
          var isStart;
          var isEnd;
          var isEndStyle;
          var text;
          this._isDrag = this._isDrag || s.isUpdate;
          this._content = UNDEFINED;
          this._title = s.more || s.count || !s.showEventTooltip ? UNDEFINED : htmlToText(event.tooltip || event.title || event.text);
          this._tabIndex = s.isActiveMonth && s.showText && !s.count && !s.isPicker ? 0 : -1;
          if (event) {
              var allDay = event.allDay;
              var tzOpt = allDay ? UNDEFINED : s;
              start = event.start ? makeDate(event.start, tzOpt) : null;
              end = event.end ? makeDate(event.end, tzOpt) : null;
              var endTime = start && end && getEndDate(s, allDay, start, end, true);
              var firstDayOfWeek = getFirstDayOfWeek(d, s);
              var lastDayOfWeek = addDays(firstDayOfWeek, 7);
              var lastDay = s.lastDay && s.lastDay < lastDayOfWeek ? s.lastDay : lastDayOfWeek;
              isMultiDay = start && endTime && !isSameDay(start, endTime);
              isStart = !isMultiDay || (start && isSameDay(start, d));
              isEnd = !isMultiDay || (endTime && isSameDay(endTime, d));
              isEndStyle = !isMultiDay || (s.showText ? endTime < lastDay : isEnd);
              this._hasResizeStart = s.resize && isStart;
              this._hasResizeEnd = s.resize && isEndStyle;
              var color = event.color;
              if (!color && event.resource && s.resourcesMap) {
                  var resource = s.resourcesMap[isArray(event.resource) ? event.resource[0] : event.resource];
                  color = resource && resource.color;
              }
              if (s.showText) {
                  this._textColor = color ? getTextColor(color) : UNDEFINED;
              }
              this._color = s.render || s.template ? UNDEFINED : event.textColor && !color ? 'transparent' : color;
          }
          if (event && s.showText && (render || s.contentTemplate || s.template)) {
              var fillsAllDay = event.allDay || !start || (isMultiDay && !isStart && !isEnd);
              this._data = {
                  end: !fillsAllDay && isEnd && end ? formatDate(s.timeFormat, end, s) : '',
                  id: event.id,
                  isMultiDay: isMultiDay,
                  original: event,
                  start: !fillsAllDay && isStart && start ? formatDate(s.timeFormat, start, s) : '',
                  title: this._title,
              };
              if (render) {
                  var content = render(this._data);
                  if (isString(content)) {
                      text = content;
                  }
                  else {
                      this._content = content;
                  }
              }
          }
          else {
              text = s.more || s.count || (s.showText ? event.title || event.text || '' : '');
          }
          if (text !== this._text) {
              this._text = text;
              this._html = text ? this._safeHtml(text) : UNDEFINED;
              this._shouldEnhance = text && event && s.showText && !!render;
          }
          this._cssClass =
              'mbsc-calendar-text' +
                  this._theme +
                  this._rtl +
                  ((state.hasFocus && !s.inactive && !s.selected) || (s.selected && s.showText) ? ' mbsc-calendar-label-active ' : '') +
                  (state.hasHover && !s.inactive && !this._isDrag ? ' mbsc-calendar-label-hover' : '') +
                  (s.more ? ' mbsc-calendar-text-more' : s.render || s.template ? ' mbsc-calendar-custom-label' : ' mbsc-calendar-label') +
                  (s.inactive ? ' mbsc-calendar-label-inactive' : '') +
                  (s.isUpdate ? ' mbsc-calendar-label-dragging' : '') +
                  (s.hidden ? ' mbsc-calendar-label-hidden' : '') +
                  (isStart ? ' mbsc-calendar-label-start' : '') +
                  (isEndStyle ? ' mbsc-calendar-label-end' : '') +
                  (event && event.editable === false ? ' mbsc-readonly-event' : '') +
                  (event && event.cssClass ? ' ' + event.cssClass : '');
      };
      return CalendarLabelBase;
  }(BaseComponent));

  function template$3(s, inst) {
      var _a;
      var editable = s.event && s.event.editable !== false;
      var rightClick = (_a = {}, _a[ON_CONTEXT_MENU] = inst._onRightClick, _a);
      return (createElement("div", __assign({ "aria-hidden": s.showText ? UNDEFINED : 'true', className: inst._cssClass, "data-id": s.showText && s.event ? s.event.id : null, onClick: inst._onClick, ref: inst._setEl, role: s.showText ? 'button' : UNDEFINED, style: { color: inst._color }, tabIndex: inst._tabIndex, title: inst._title }, rightClick),
          inst._hasResizeStart && editable && (createElement("div", { className: 'mbsc-calendar-label-resize mbsc-calendar-label-resize-start' +
                  inst._rtl +
                  (s.isUpdate ? ' mbsc-calendar-label-resize-start-touch' : '') })),
          inst._hasResizeEnd && editable && (createElement("div", { className: 'mbsc-calendar-label-resize mbsc-calendar-label-resize-end' +
                  inst._rtl +
                  (s.isUpdate ? ' mbsc-calendar-label-resize-end-touch' : '') })),
          s.showText && !s.more && !s.render && createElement("div", { className: 'mbsc-calendar-label-background' + inst._theme }),
          s.showText && !s.more && s.render ? (inst._html ? (
          // eslint-disable-next-line react/no-danger-with-children
          createElement("div", { dangerouslySetInnerHTML: inst._html }, UNDEFINED)) : (inst._content)) : (createElement("div", { className: 'mbsc-calendar-label-inner' + inst._theme, style: { color: inst._textColor } },
              createElement("div", { "aria-hidden": "true", className: 'mbsc-calendar-label-text' + inst._theme, dangerouslySetInnerHTML: inst._html, style: { color: s.event && s.event.textColor } }, inst._content),
              s.label && createElement("div", { className: "mbsc-hidden-content" }, s.label)))));
  }
  var CalendarLabel = /*#__PURE__*/ (function (_super) {
      __extends(CalendarLabel, _super);
      function CalendarLabel() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CalendarLabel.prototype._template = function (s) {
          return template$3(s, this);
      };
      return CalendarLabel;
  }(CalendarLabelBase));

  /** @hidden */
  var CalendarDayBase = /*#__PURE__*/ (function (_super) {
      __extends(CalendarDayBase, _super);
      function CalendarDayBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          // tslint:enable variable-name
          // tslint:disable-next-line variable-name
          _this._onClick = function (ev) {
              _this._cellClick('onDayClick', ev);
          };
          // tslint:disable-next-line variable-name
          _this._onRightClick = function (ev) {
              _this._cellClick('onDayRightClick', ev);
          };
          // tslint:disable-next-line variable-name
          _this._onLabelClick = function (args) {
              _this._labelClick('onLabelClick', args);
          };
          // tslint:disable-next-line variable-name
          _this._onLabelDoubleClick = function (args) {
              _this._labelClick('onLabelDoubleClick', args);
          };
          // tslint:disable-next-line variable-name
          _this._onLabelRightClick = function (args) {
              _this._labelClick('onLabelRightClick', args);
          };
          // tslint:disable-next-line variable-name
          _this._onLabelHoverIn = function (args) {
              _this._labelClick('onLabelHoverIn', args);
          };
          // tslint:disable-next-line variable-name
          _this._onLabelHoverOut = function (args) {
              _this._labelClick('onLabelHoverOut', args);
          };
          return _this;
      }
      CalendarDayBase.prototype._mounted = function () {
          var _this = this;
          var allowCreate;
          var allowStart;
          var touchTimer;
          this._unlisten = gestureListener(this._el, {
              click: true,
              onBlur: function () {
                  _this.setState({ hasFocus: false });
              },
              onDoubleClick: function (args) {
                  var s = _this.s;
                  if (s.clickToCreate && s.clickToCreate !== 'single' && s.labels && !s.disabled && s.display) {
                      _this._hook('onLabelUpdateStart', args);
                      _this._hook('onLabelUpdateEnd', args);
                  }
                  _this._cellClick('onDayDoubleClick', args.domEvent);
              },
              onEnd: function (args) {
                  if (allowCreate) {
                      // Will prevent mousedown event on doc, which would exit drag mode
                      args.domEvent.preventDefault();
                      // args.target = this._el;
                      _this._hook('onLabelUpdateEnd', args);
                      allowCreate = false;
                  }
                  clearTimeout(touchTimer);
                  allowCreate = false;
                  allowStart = false;
              },
              onFocus: function () {
                  _this.setState({ hasFocus: true });
              },
              onHoverIn: function (ev) {
                  var s = _this.s;
                  if (!s.disabled) {
                      _this.setState({ hasHover: true });
                  }
                  _this._hook('onHoverIn', {
                      date: new Date(s.date),
                      domEvent: ev,
                      hidden: !s.display,
                      outer: s.outer,
                      target: _this._el,
                  });
              },
              onHoverOut: function (ev) {
                  var s = _this.s;
                  _this.setState({ hasHover: false });
                  _this._hook('onHoverOut', {
                      date: new Date(s.date),
                      domEvent: ev,
                      hidden: !s.display,
                      outer: s.outer,
                      target: _this._el,
                  });
              },
              onKeyDown: function (ev) {
                  switch (ev.keyCode) {
                      case ENTER:
                      case SPACE:
                          ev.preventDefault();
                          _this._onClick(ev);
                          break;
                  }
              },
              onMove: function (args) {
                  if (allowCreate && _this.s.dragToCreate) {
                      args.domEvent.preventDefault();
                      _this._hook('onLabelUpdateMove', args);
                  }
                  else if (allowStart && _this.s.dragToCreate && (Math.abs(args.deltaX) > 7 || Math.abs(args.deltaY) > 7)) {
                      allowCreate = !args.isTouch;
                      _this._hook('onLabelUpdateStart', args);
                  }
                  else {
                      clearTimeout(touchTimer);
                  }
              },
              onStart: function (args) {
                  var s = _this.s;
                  args.create = true;
                  if (!s.disabled && (s.dragToCreate || s.clickToCreate) && s.labels && !allowCreate) {
                      // Check if we started on a label or not
                      var label = closest(args.domEvent.target, '.mbsc-calendar-text', _this._el);
                      if (!label) {
                          if (args.isTouch && s.dragToCreate) {
                              touchTimer = setTimeout(function () {
                                  _this._hook('onLabelUpdateStart', args);
                                  _this._hook('onLabelUpdateModeOn', args);
                                  allowCreate = true;
                              }, 350);
                          }
                          else if (s.clickToCreate === 'single') {
                              _this._hook('onLabelUpdateStart', args);
                              allowCreate = true;
                          }
                          else {
                              allowStart = !args.isTouch;
                          }
                      }
                  }
              },
          });
      };
      CalendarDayBase.prototype._render = function (s, state) {
          var now = createDate(s);
          var d = s.date;
          var colors = s.colors, display = s.display, dragData = s.dragData, hoverEnd = s.hoverEnd, hoverStart = s.hoverStart, labels = s.labels, rangeEnd = s.rangeEnd, rangeStart = s.rangeStart;
          var date = new Date(d);
          var dateKey = getDateStr(date);
          var isToday = isSameDay(now, date);
          var events = labels && labels.events;
          var color = colors && colors[0];
          var background = color && color.background;
          var highlight = color && color.highlight;
          var cellClass = '';
          var highlightClass = '';
          this._draggedLabel = dragData && dragData.draggedDates && dragData.draggedDates[dateKey];
          this._draggedLabelOrig = dragData && dragData.originDates && dragData.originDates[dateKey];
          this._todayClass = isToday ? ' mbsc-calendar-today' : '';
          this._cellStyles = background && display ? { backgroundColor: background, color: getTextColor(background) } : UNDEFINED;
          this._circleStyles = highlight ? { backgroundColor: highlight, color: getTextColor(color.highlight) } : UNDEFINED;
          this._ariaLabel =
              s.type === 'day'
                  ? (isToday ? s.todayText + ', ' : '') + s.day + ', ' + s.month + ' ' + s.text + ', ' + s.year
                  : s.type === 'month'
                      ? s.month
                      : '';
          // Only add highlight classes if the cell is actually displayed
          if (display) {
              // range selection can start with a rangeStart or with a rangeEnd without the other
              // the same classes are needed in both cases
              if ((rangeStart && d >= rangeStart && d <= (rangeEnd || rangeStart)) ||
                  (rangeEnd && d <= rangeEnd && d >= (rangeStart || rangeEnd))) {
                  highlightClass =
                      ' mbsc-range-day' +
                          (d === (rangeStart || rangeEnd) ? ' mbsc-range-day-start' : '') +
                          (d === (rangeEnd || rangeStart) ? ' mbsc-range-day-end' : '');
              }
              if (hoverStart && hoverEnd && d >= hoverStart && d <= hoverEnd) {
                  highlightClass +=
                      ' mbsc-range-hover' +
                          (d === hoverStart ? ' mbsc-range-hover-start mbsc-hover' : '') +
                          (d === hoverEnd ? ' mbsc-range-hover-end mbsc-hover' : '');
              }
          }
          if (s.marks) {
              s.marks.forEach(function (e) {
                  cellClass += e.cellCssClass ? ' ' + e.cellCssClass : '';
              });
          }
          if (colors) {
              colors.forEach(function (e) {
                  cellClass += e.cellCssClass ? ' ' + e.cellCssClass : '';
              });
          }
          if (events) {
              events.forEach(function (e) {
                  cellClass += e.cellCssClass ? ' ' + e.cellCssClass : '';
              });
          }
          this._cssClass =
              'mbsc-calendar-cell mbsc-flex-1-0-0 mbsc-calendar-' +
                  s.type +
                  this._theme +
                  this._rtl +
                  this._hb +
                  cellClass +
                  (labels ? ' mbsc-calendar-day-labels' : '') +
                  (colors ? ' mbsc-calendar-day-colors' : '') +
                  (s.outer ? ' mbsc-calendar-day-outer' : '') +
                  (s.hasMarks ? ' mbsc-calendar-day-marked' : '') +
                  (s.disabled ? ' mbsc-disabled' : '') +
                  (display ? '' : ' mbsc-calendar-day-empty') +
                  (s.selected ? ' mbsc-selected' : '') +
                  (state.hasFocus ? ' mbsc-focus' : '') +
                  // hover styling needed only on hoverStart and hoverEnd dates in the case of range hover
                  // we can tell if no range hover is in place when neither hoverStart nor hoverEnd is there
                  (state.hasHover && (d === hoverStart || d === hoverEnd || (!hoverStart && !hoverEnd)) ? ' mbsc-hover' : '') +
                  (this._draggedLabel ? ' mbsc-calendar-day-highlight' : '') +
                  highlightClass;
          this._data = {
              date: date,
              events: s.events || [],
              selected: s.selected,
          };
      };
      CalendarDayBase.prototype._destroy = function () {
          if (this._unlisten) {
              this._unlisten();
          }
      };
      CalendarDayBase.prototype._cellClick = function (name, domEvent) {
          var s = this.s;
          if (s.display) {
              this._hook(name, {
                  date: new Date(s.date),
                  disabled: s.disabled,
                  domEvent: domEvent,
                  outer: s.outer,
                  selected: s.selected,
                  source: 'calendar',
                  target: this._el,
              });
          }
      };
      CalendarDayBase.prototype._labelClick = function (name, args) {
          var s = this.s;
          args.date = new Date(s.date);
          args.labels = s.labels.events;
          this._hook(name, args);
      };
      return CalendarDayBase;
  }(BaseComponent));

  function renderEvent(inst, s, label, showText, hidden, isUpdate, key) {
      return (createElement(CalendarLabel, { key: key, amText: s.amText, count: label.count ? label.count + ' ' + (label.count > 1 ? s.eventsText : s.eventText) : UNDEFINED, date: s.date, dataTimezone: s.dataTimezone, displayTimezone: s.displayTimezone, drag: s.dragToMove, resize: s.dragToResize, event: label.event, exclusiveEndDates: s.exclusiveEndDates, firstDay: s.firstDay, hidden: hidden, id: label.id, inactive: !isUpdate && label.event && s.dragData && s.dragData.draggedEvent && label.event.id === s.dragData.draggedEvent.id, isActiveMonth: s.isActiveMonth, isPicker: s.isPicker, isUpdate: isUpdate, label: label.label, lastDay: label.lastDay, more: label.more, pmText: s.pmText, resourcesMap: s.resourcesMap, rtl: s.rtl, selected: label.event && s.selectedEventsMap && !!(s.selectedEventsMap[label.id] || s.selectedEventsMap[label.event.id]), showEventTooltip: s.showEventTooltip, showText: showText, theme: s.theme, timeFormat: s.timeFormat, timezonePlugin: s.timezonePlugin, render: s.renderLabel, renderContent: s.renderLabelContent, onClick: inst._onLabelClick, onDoubleClick: inst._onLabelDoubleClick, onRightClick: inst._onLabelRightClick, onHoverIn: inst._onLabelHoverIn, onHoverOut: inst._onLabelHoverOut, onDelete: s.onLabelDelete, onDragStart: s.onLabelUpdateStart, onDragMove: s.onLabelUpdateMove, onDragEnd: s.onLabelUpdateEnd, onDragModeOn: s.onLabelUpdateModeOn, onDragModeOff: s.onLabelUpdateModeOff }));
  }
  function renderLabel(inst, s, label) {
      var key = label.id;
      if (label.placeholder) {
          return createElement("div", { className: "mbsc-calendar-text mbsc-calendar-text-placeholder", key: key });
      }
      if (label.more || label.count) {
          return renderEvent(inst, s, label, true, false, false, key);
      }
      return label.multiDay
          ? [
              createElement("div", { className: "mbsc-calendar-label-wrapper", style: { width: label.width + '%' }, key: key }, renderEvent(inst, s, label, true)),
              renderEvent(inst, s, label, false, false, false, '-' + key),
          ]
          : renderEvent(inst, s, label, label.showText, false, false, key);
  }
  function template$4(s, inst) {
      var _a;
      var draggedLabel = inst._draggedLabel;
      var draggedLabelOrig = inst._draggedLabelOrig;
      var theme = inst._theme;
      var rightClick = (_a = {}, _a[ON_CONTEXT_MENU] = inst._onRightClick, _a);
      var content;
      if (s.renderDay) {
          content = s.renderDay(inst._data);
      }
      if (s.renderDayContent) {
          content = s.renderDayContent(inst._data);
      }
      if (isString(content)) {
          content = createElement("div", { dangerouslySetInnerHTML: inst._safeHtml(content) });
          inst._shouldEnhance = true;
      }
      return (createElement("div", __assign({ ref: inst._setEl, className: inst._cssClass, onClick: inst._onClick, style: inst._cellStyles, tabIndex: s.disabled ? UNDEFINED : s.active ? 0 : -1 }, rightClick),
          createElement("div", { className: 'mbsc-calendar-cell-inner mbsc-calendar-' +
                  s.type +
                  '-inner' +
                  theme +
                  (s.type === 'day' ? '' : inst._hb) +
                  (s.display ? '' : ' mbsc-calendar-day-hidden') },
              s.renderDay ? (content) : (createElement(Fragment, null,
                  s.text === 1 && (createElement("div", { "aria-hidden": "true", className: 'mbsc-calendar-month-name' + theme + inst._rtl }, s.monthShort)),
                  createElement("div", { "aria-label": inst._ariaLabel, role: "button", "aria-pressed": s.selected, className: 'mbsc-calendar-cell-text mbsc-calendar-' + s.type + '-text' + theme + inst._todayClass, style: inst._circleStyles }, s.text),
                  s.marks && ( // Extra div is needed in RTL, otherwise position is wrong in Chrome
                  createElement("div", null,
                      createElement("div", { className: 'mbsc-calendar-marks' + theme + inst._rtl }, s.marks.map(function (mark, k) { return (createElement("div", { className: 'mbsc-calendar-mark ' + (mark.markCssClass || '') + theme, key: k, style: { background: mark.color } })); })))),
                  s.renderDayContent && content)),
              s.labels && ( // Extra div is needed in RTL, otherwise position is wrong in Chrome
              createElement("div", null,
                  draggedLabelOrig && draggedLabelOrig.event && (createElement("div", { className: "mbsc-calendar-labels mbsc-calendar-labels-dragging" },
                      createElement("div", { style: { width: draggedLabelOrig.width + '%' || 100 + '%' } }, renderEvent(inst, s, { id: 0, event: draggedLabelOrig.event }, true, !!s.dragData.draggedDates, true)))),
                  draggedLabel && draggedLabel.event && (createElement("div", { className: "mbsc-calendar-labels mbsc-calendar-labels-dragging" },
                      createElement("div", { className: "mbsc-calendar-label-wrapper", style: { width: draggedLabel.width + '%' || 100 + '%' } }, renderEvent(inst, s, { id: 0, event: draggedLabel.event }, true, false, true)))),
                  createElement("div", { className: "mbsc-calendar-labels" }, s.labels.data.map(function (label) {
                      return renderLabel(inst, s, label);
                  })),
                  createElement("div", { className: "mbsc-calendar-text mbsc-calendar-text-placeholder" }))))));
  }
  var CalendarDay = /*#__PURE__*/ (function (_super) {
      __extends(CalendarDay, _super);
      function CalendarDay() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CalendarDay.prototype._template = function (s) {
          return template$4(s, this);
      };
      return CalendarDay;
  }(CalendarDayBase));

  /** @jsxRuntime classic */
  /** @hidden */
  var CalendarWeekDays = function (props) {
      var firstDay = props.firstDay, hidden = props.hidden, rtl = props.rtl, theme = props.theme, dayNamesShort = props.dayNamesShort, showWeekNumbers = props.showWeekNumbers, hasScroll = props.hasScroll;
      return (createElement("div", { "aria-hidden": "true", className: 'mbsc-calendar-week-days mbsc-flex' + (hidden ? ' mbsc-hidden' : '') },
          showWeekNumbers && createElement("div", { className: 'mbsc-calendar-week-day mbsc-flex-none mbsc-calendar-week-nr' + theme + rtl }),
          ARRAY7.map(function (x, i) { return (createElement("div", { className: 'mbsc-calendar-week-day mbsc-flex-1-0-0' + theme + rtl, key: i }, dayNamesShort[(i + firstDay) % 7])); }),
          hasScroll && createElement("div", { className: "mbsc-schedule-fake-scroll-y" })));
  };

  /** @hidden */
  var MonthViewBase = /*#__PURE__*/ (function (_super) {
      __extends(MonthViewBase, _super);
      function MonthViewBase() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      MonthViewBase.prototype._isActive = function (d) {
          return this.s.isActive && d === this.s.activeDate;
      };
      MonthViewBase.prototype._isInvalid = function (d) {
          var s = this.s;
          var localDate = new Date(d);
          var timezoneDate = addTimezone(s, localDate);
          return isInvalid(s, timezoneDate, s.invalid, s.valid, +s.min, +s.max);
      };
      MonthViewBase.prototype._isSelected = function (d) {
          var localDate = new Date(d);
          var timezoneDate = addTimezone(this.s, localDate);
          return !!this.s.selectedDates[+timezoneDate];
      };
      MonthViewBase.prototype._getWeekNr = function (s, date) {
          var d = new Date(date);
          return '' + s.getWeekNumber(s.getDate(d.getFullYear(), d.getMonth(), d.getDate() + ((7 - s.firstDay + 1) % 7)));
      };
      // tslint:enable variable-name
      MonthViewBase.prototype._render = function (s) {
          // TODO: optimize what to calculate on render
          var weeks = s.weeks;
          var firstWeekDay = s.firstDay;
          var firstDay = new Date(s.firstPageDay);
          var year = s.getYear(firstDay);
          var month = s.getMonth(firstDay);
          var day = s.getDay(firstDay);
          var weekDay = s.getDate(year, month, day).getDay();
          var offset = firstWeekDay - weekDay > 0 ? 7 : 0;
          var row = [];
          var maxLabels = 0;
          this._rowHeights = [];
          this._rows = [];
          this._days = ARRAY7;
          for (var i = 0; i < 7 * weeks; i++) {
              var curr = s.getDate(year, month, i + firstWeekDay - offset - weekDay + day);
              var key = getDateStr(curr);
              var displayMonth = s.getMonth(curr);
              // let y = curr.getFullYear();
              // let m = curr.getMonth();
              // let d = curr.getDate();
              var outer = displayMonth !== month && s.calendarType !== 'week';
              var marked = s.marked && s.marked[key];
              var marks = marked ? (s.showSingleMark ? [{}] : marked) : null;
              var labels = s.labels && s.labels[key];
              var labelCount = labels ? labels.data.length : 0;
              var isWeekStart = i % 7 === 0;
              if (s.variableRow) {
                  // Don't render rows containing fully outer days
                  if (isWeekStart && outer && i) {
                      break;
                  }
                  if (labelCount > maxLabels) {
                      maxLabels = labelCount;
                  }
                  // Row end
                  if (i % 7 === 6) {
                      this._rowHeights.push(maxLabels * (s.labelHeight || 20) + (s.cellTextHeight || 0) + 3);
                      maxLabels = 0;
                  }
              }
              if (isWeekStart) {
                  row = [];
                  this._rows.push(row);
              }
              row.push({
                  colors: s.colors && s.colors[key],
                  date: +curr,
                  day: s.dayNames[curr.getDay()],
                  display: outer ? s.showOuter : true,
                  events: s.events && s.events[key],
                  labels: labels,
                  marks: marks,
                  month: s.monthNames[displayMonth],
                  monthShort: s.monthNamesShort[displayMonth],
                  outer: outer,
                  text: s.getDay(curr),
                  year: s.getYear(curr),
              });
          }
      };
      return MonthViewBase;
  }(BaseComponent));

  function template$5(s, inst) {
      var showWeekNumbers = s.showWeekNumbers;
      var calWeekDays = s.showWeekDays ? (createElement(CalendarWeekDays, { dayNamesShort: s.dayNamesShort, firstDay: s.firstDay, rtl: inst._rtl, showWeekNumbers: showWeekNumbers, theme: inst._theme })) : null;
      return (createElement("div", { "aria-hidden": s.isActive ? UNDEFINED : 'true', className: 'mbsc-calendar-table mbsc-flex-col mbsc-flex-1-1' + (s.isActive ? ' mbsc-calendar-table-active' : '') },
          calWeekDays,
          inst._rows.map(function (row, i) {
              var weekNr = showWeekNumbers ? inst._getWeekNr(s, row[0].date) : '';
              return (createElement("div", { className: 'mbsc-calendar-row mbsc-flex mbsc-flex-1-0', key: i, style: { minHeight: inst._rowHeights[i] } },
                  showWeekNumbers && (createElement("div", { className: 'mbsc-calendar-cell mbsc-flex-none mbsc-calendar-day mbsc-calendar-week-nr' + inst._theme },
                      createElement("div", { "aria-hidden": "true" }, weekNr),
                      createElement("div", { className: "mbsc-hidden-content" }, s.weekText.replace('{count}', weekNr)))),
                  row.map(function (cell, j) { return (createElement(CalendarDay, { active: cell.display && inst._isActive(cell.date), amText: s.amText, clickToCreate: s.clickToCreate, colors: cell.colors, date: cell.date, day: cell.day, disabled: inst._isInvalid(cell.date), display: cell.display, dataTimezone: s.dataTimezone, displayTimezone: s.displayTimezone, dragData: s.dragData, dragToCreate: s.dragToCreate, dragToResize: s.dragToResize, dragToMove: s.dragToMove, eventText: s.eventText, events: cell.events, eventsText: s.eventsText, exclusiveEndDates: s.exclusiveEndDates, firstDay: s.firstDay, hasMarks: s.hasMarks, hoverEnd: s.hoverEnd, hoverStart: s.hoverStart, isActiveMonth: s.isActive, isPicker: s.isPicker, key: cell.date, labels: cell.labels, pmText: s.pmText, marks: cell.marks, month: cell.month, monthShort: cell.monthShort, onDayClick: s.onDayClick, onDayDoubleClick: s.onDayDoubleClick, onDayRightClick: s.onDayRightClick, onLabelClick: s.onLabelClick, onLabelDoubleClick: s.onLabelDoubleClick, onLabelRightClick: s.onLabelRightClick, onLabelHoverIn: s.onLabelHoverIn, onLabelHoverOut: s.onLabelHoverOut, onLabelDelete: s.onLabelDelete, onLabelUpdateStart: s.onLabelUpdateStart, onLabelUpdateMove: s.onLabelUpdateMove, onLabelUpdateEnd: s.onLabelUpdateEnd, onLabelUpdateModeOn: s.onLabelUpdateModeOn, onLabelUpdateModeOff: s.onLabelUpdateModeOff, outer: cell.outer, renderDay: s.renderDay, renderDayContent: s.renderDayContent, renderLabel: s.renderLabel, renderLabelContent: s.renderLabelContent, rangeEnd: s.rangeEnd, rangeStart: s.rangeStart, resourcesMap: s.resourcesMap, selectedEventsMap: s.selectedEventsMap, rtl: s.rtl, showEventTooltip: s.showEventTooltip, selected: inst._isSelected(cell.date), text: cell.text, theme: s.theme, timeFormat: s.timeFormat, timezonePlugin: s.timezonePlugin, todayText: s.todayText, type: "day", year: cell.year, 
                      // In case of Preact we need to force update by always passing a new object,
                      // otherwise sometimes DOM elements will mix up
                      // update={isPreact ? {} : 0}
                      onHoverIn: s.onDayHoverIn, onHoverOut: s.onDayHoverOut })); })));
          })));
  }
  /** @hidden */
  var MonthView = /*#__PURE__*/ (function (_super) {
      __extends(MonthView, _super);
      function MonthView() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      MonthView.prototype._template = function (s) {
          return template$5(s, this);
      };
      return MonthView;
  }(MonthViewBase));

  // TODO: snap points
  function getItem(items, i, min, max) {
      var item;
      if (i < min || i > max) {
          return;
      }
      if (isArray(items)) {
          var len = items.length;
          var index = i % len;
          item = items[index >= 0 ? index : index + len];
      }
      else {
          item = items(i);
      }
      return item;
  }
  /** @hidden */
  var ScrollviewBase = /*#__PURE__*/ (function (_super) {
      __extends(ScrollviewBase, _super);
      function ScrollviewBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._currPos = 0;
          _this._delta = 0;
          _this._endPos = 0;
          _this._lastRaf = 0;
          _this._maxSnapScroll = 0;
          _this._margin = 0;
          _this._scrollEnd = debounce(function () {
              rafc(_this._raf);
              _this._raf = false;
              _this._onEnd();
              _this._hasScrolled = false;
          }, 200);
          // tslint:enable variable-name
          // tslint:disable-next-line: variable-name
          _this._setInnerEl = function (el) {
              _this._innerEl = el;
          };
          // tslint:disable-next-line: variable-name
          _this._setScrollEl = function (el) {
              _this._scrollEl = el;
          };
          // tslint:disable-next-line: variable-name
          _this._setScrollEl3d = function (el) {
              _this._scrollEl3d = el;
          };
          // tslint:disable-next-line: variable-name
          _this._setScrollbarEl = function (el) {
              _this._scrollbarEl = el;
          };
          // tslint:disable-next-line: variable-name
          _this._setScrollbarContEl = function (el) {
              _this._scrollbarContEl = el;
          };
          // tslint:disable-next-line: variable-name
          _this._onStart = function (args) {
              // const ev = args.domEvent;
              var s = _this.s;
              _this._hook('onStart', {});
              // Don't allow new gesture if new items are only generated on animation end OR
              // mouse swipe is not enabled OR
              // swipe is completely disabled
              if ((s.changeOnEnd && _this._isScrolling) || (!s.mouseSwipe && !args.isTouch) || !s.swipe) {
                  return;
              }
              // Better performance if there are tap events on document
              // if (s.stopProp) {
              //   ev.stopPropagation();
              // }
              // TODO: check this, will prevent click on touch device
              // if (s.prevDef) {
              //   // Prevent touch highlight and focus
              //   ev.preventDefault();
              // }
              _this._started = true;
              _this._hasScrolled = _this._isScrolling;
              _this._currX = args.startX;
              _this._currY = args.startY;
              _this._delta = 0;
              _this._velocityX = 0;
              _this._velocityY = 0;
              _this._startPos = getPosition(_this._scrollEl, _this._isVertical);
              _this._timestamp = +new Date();
              if (_this._isScrolling) {
                  // Stop running movement
                  rafc(_this._raf);
                  _this._raf = false;
                  _this._scroll(_this._startPos);
              }
          };
          // tslint:disable-next-line: variable-name
          _this._onMove = function (args) {
              var ev = args.domEvent;
              var s = _this.s;
              if (_this._isVertical || s.scrollLock) {
                  // Always prevent native scroll, if vertical
                  if (ev.cancelable) {
                      ev.preventDefault();
                  }
              }
              else {
                  if (_this._hasScrolled) {
                      // Prevent native scroll
                      if (ev.cancelable) {
                          ev.preventDefault();
                      }
                  }
                  else if (ev.type === TOUCH_MOVE && (Math.abs(args.deltaY) > 7 || !s.swipe)) {
                      // It's a native scroll, stop listening
                      _this._started = false;
                  }
              }
              if (!_this._started) {
                  return;
              }
              _this._delta = _this._isVertical ? args.deltaY : args.deltaX;
              if (_this._hasScrolled || Math.abs(_this._delta) > _this._threshold) {
                  if (!_this._hasScrolled) {
                      _this._hook('onGestureStart', {});
                  }
                  _this._hasScrolled = true;
                  _this._isScrolling = true;
                  if (!_this._raf) {
                      _this._raf = raf(function () { return _this._move(args); });
                  }
              }
          };
          // tslint:disable-next-line: variable-name
          _this._onEnd = function () {
              _this._started = false;
              if (_this._hasScrolled) {
                  var s = _this.s;
                  var v = (_this._isVertical ? _this._velocityY : _this._velocityX) * 17;
                  var maxSnapScroll = _this._maxSnapScroll;
                  var delta = _this._delta;
                  var time = 0;
                  // Calculate stopping distance
                  // TODO: speedUnit
                  delta += v * v * 0.5 * (v < 0 ? -1 : 1);
                  // Allow only max snap
                  if (maxSnapScroll) {
                      delta = constrain(delta, -_this._round * maxSnapScroll, _this._round * maxSnapScroll);
                  }
                  // Round and limit between min/max
                  var pos = constrain(round((_this._startPos + delta) / _this._round) * _this._round, _this._min, _this._max);
                  var index = round((-pos * _this._rtlNr) / s.itemSize) + _this._offset;
                  var direction = delta > 0 ? (_this._isVertical ? 270 : 360) : _this._isVertical ? 90 : 180;
                  var diff = index - s.selectedIndex;
                  // Calculate animation time
                  // TODO: timeUnit
                  time = s.time || Math.max(1000, Math.abs(pos - _this._currPos) * 3);
                  _this._hook('onGestureEnd', { direction: direction, index: index });
                  // needed for the infinite scrollbar to be cleared at each end
                  _this._delta = 0;
                  // Set new position
                  _this._scroll(pos, time);
                  if (diff && !s.changeOnEnd) {
                      _this._hook('onIndexChange', { index: index, diff: diff });
                      // In case if the onIndexChange handler leaves the index at the previous position,
                      // we need a force update to move the wheel back to the correct position
                      if (s.selectedIndex === _this._prevIndex && s.selectedIndex !== index) {
                          _this.forceUpdate();
                      }
                  }
              }
          };
          // tslint:disable-next-line: variable-name
          _this._onClick = function (ev) {
              if (_this._hasScrolled) {
                  _this._hasScrolled = false;
                  ev.stopPropagation();
                  ev.preventDefault();
              }
          };
          // tslint:disable-next-line: variable-name
          _this._onScroll = function (ev) {
              ev.target.scrollTop = 0;
              ev.target.scrollLeft = 0;
          };
          // tslint:disable-next-line: variable-name
          _this._onMouseWheel = function (ev) {
              var delta = _this._isVertical ? (ev.deltaY === UNDEFINED ? ev.wheelDelta || ev.detail : ev.deltaY) : ev.deltaX;
              if (delta && _this.s.mousewheel) {
                  ev.preventDefault();
                  _this._hook('onStart', {});
                  if (!_this._started) {
                      _this._delta = 0;
                      _this._velocityX = 0;
                      _this._velocityY = 0;
                      _this._startPos = _this._currPos;
                      _this._hook('onGestureStart', {});
                  }
                  if (ev.deltaMode && ev.deltaMode === 1) {
                      delta *= 15;
                  }
                  delta = constrain(-delta, -_this._scrollSnap, _this._scrollSnap);
                  _this._delta += delta;
                  if (_this._maxSnapScroll && Math.abs(_this._delta) > _this._round * _this._maxSnapScroll) {
                      delta = 0;
                  }
                  if (_this._startPos + _this._delta < _this._min) {
                      _this._startPos = _this._min;
                      _this._delta = 0;
                      delta = 0;
                  }
                  if (_this._startPos + _this._delta > _this._max) {
                      _this._startPos = _this._max;
                      _this._delta = 0;
                      delta = 0;
                  }
                  if (!_this._raf) {
                      _this._raf = raf(function () { return _this._move(); });
                  }
                  if (!delta && _this._started) {
                      return;
                  }
                  _this._hasScrolled = true;
                  _this._isScrolling = true;
                  _this._started = true;
                  _this._scrollEnd();
              }
          };
          // tslint:disable-next-line: variable-name
          _this._onTrackStart = function (ev) {
              ev.stopPropagation();
              var args = {
                  domEvent: ev,
                  startX: getCoord(ev, 'X', true),
                  startY: getCoord(ev, 'Y', true),
              };
              _this._onStart(args);
              _this._trackStartX = args.startX;
              _this._trackStartY = args.startY;
              if (ev.target === _this._scrollbarEl) {
                  listen(_this._doc, MOUSE_UP, _this._onTrackEnd);
                  listen(_this._doc, MOUSE_MOVE, _this._onTrackMove);
              }
              else {
                  // this._trackStartY = getOffset(this._scrollbarEl).top;
                  var top_1 = getOffset(_this._scrollbarContEl).top;
                  var percent = (args.startY - top_1) / _this._barContSize;
                  _this._startPos = _this._currPos = _this._max + (_this._min - _this._max) * percent;
                  _this._hasScrolled = true;
                  _this._onEnd();
              }
          };
          // tslint:disable-next-line: variable-name
          _this._onTrackMove = function (ev) {
              var barContSize = _this._barContSize;
              var endX = getCoord(ev, 'X', true);
              var endY = getCoord(ev, 'Y', true);
              var trackDelta = _this._isVertical ? endY - _this._trackStartY : endX - _this._trackStartX;
              var percent = trackDelta / barContSize;
              if (_this._isInfinite) {
                  _this._delta = -(_this._maxSnapScroll * _this._round * 2 + barContSize) * percent;
              }
              else {
                  _this._delta = (_this._min - _this._max - barContSize) * percent;
              }
              if (_this._hasScrolled || Math.abs(_this._delta) > _this._threshold) {
                  if (!_this._hasScrolled) {
                      _this._hook('onGestureStart', {});
                  }
                  _this._hasScrolled = true;
                  _this._isScrolling = true;
                  if (!_this._raf) {
                      _this._raf = raf(function () { return _this._move({ endX: endX, endY: endY }, !_this._isInfinite); });
                  }
              }
          };
          // tslint:disable-next-line: variable-name
          _this._onTrackEnd = function () {
              _this._delta = 0;
              _this._startPos = _this._currPos;
              _this._onEnd();
              unlisten(_this._doc, MOUSE_UP, _this._onTrackEnd);
              unlisten(_this._doc, MOUSE_MOVE, _this._onTrackMove);
          };
          // tslint:disable-next-line: variable-name
          _this._onTrackClick = function (ev) {
              ev.stopPropagation();
          };
          return _this;
      }
      ScrollviewBase.prototype._render = function (s, state) {
          // console.log('scrollview render', s.selectedIndex);
          var prevS = this._prevS;
          var batchSize = s.batchSize;
          var batchSize3d = s.batchSize3d;
          var itemNr = s.itemNr || 1;
          var itemSize = s.itemSize;
          // Index of the selected item
          var selectedIndex = s.selectedIndex;
          // Index of the previously selected item;
          var prevIndex = prevS.selectedIndex;
          // Index of the actual middle item during animation
          var currIndex = state.index === UNDEFINED ? selectedIndex : state.index;
          var visibleItems = [];
          var visible3dItems = [];
          var diff = selectedIndex - prevIndex;
          var diff2 = currIndex - this._currIndex;
          var minIndex = s.minIndex;
          var maxIndex = s.maxIndex;
          var items = s.items;
          var offset = s.offset;
          this._currIndex = currIndex;
          this._isVertical = s.axis === 'Y';
          this._threshold = this._isVertical ? s.thresholdY : s.thresholdX;
          this._rtlNr = !this._isVertical && s.rtl ? -1 : 1;
          this._round = s.snap ? itemSize : 1;
          var scrollSnap = this._round;
          while (scrollSnap > 44) {
              scrollSnap /= 2;
          }
          this._scrollSnap = round(44 / scrollSnap) * scrollSnap;
          if (items) {
              for (var i = currIndex - batchSize; i < currIndex + itemNr + batchSize; i++) {
                  visibleItems.push({ key: i, data: getItem(items, i, minIndex, maxIndex) });
              }
              if (s.scroll3d) {
                  for (var i = currIndex - batchSize3d; i < currIndex + itemNr + batchSize3d; i++) {
                      visible3dItems.push({ key: i, data: getItem(items, i, minIndex, maxIndex) });
                  }
              }
              this.visibleItems = visibleItems;
              this.visible3dItems = visible3dItems;
              this._maxSnapScroll = batchSize;
              this._isInfinite = typeof items === 'function';
          }
          if (this._offset === UNDEFINED) {
              this._offset = selectedIndex;
          }
          var nextPos = -(selectedIndex - this._offset) * itemSize * this._rtlNr;
          if (Math.abs(diff) > batchSize && nextPos !== this._endPos) {
              var off = diff + batchSize * (diff > 0 ? -1 : 1);
              this._offset += off;
              this._margin -= off;
          }
          if (offset && offset !== prevS.offset) {
              this._offset += offset;
              this._margin -= offset;
          }
          if (diff2) {
              this._margin += diff2;
          }
          if (minIndex !== UNDEFINED) {
              this._max = -(minIndex - this._offset) * itemSize * this._rtlNr;
          }
          else {
              this._max = Infinity;
          }
          if (maxIndex !== UNDEFINED) {
              this._min = -(maxIndex - this._offset - (s.spaceAround ? 0 : itemNr - 1)) * itemSize * this._rtlNr;
          }
          else {
              this._min = -Infinity;
          }
          if (this._rtlNr === -1) {
              var temp = this._min;
              this._min = this._max;
              this._max = temp;
          }
          if (this._min > this._max) {
              this._min = this._max;
          }
          var visibleSize = s.visibleSize;
          var barContSize = visibleSize * itemSize;
          this._barContSize = barContSize;
          this._barSize = Math.max(20, (barContSize * barContSize) / (this._max - this._min + barContSize));
          this._cssClass = this._className + ' mbsc-ltr';
          // TODO: get rid of this:
          // (!s.scrollBar || this._barSize === this._barContSize ? ' mbsc-scroller-bar-none' : '');
      };
      ScrollviewBase.prototype._mounted = function () {
          // TODO: caluclate scroll sizes, if not infinite
          // const s = this.s;
          // this.size = this.isVertical ? this.cont.clientHeight : this.cont.clientWidth;
          // this.max = 0;
          // this.min = Math.min(this.max, Math.min(0, this.size - (this.isVertical ? this.el.offsetHeight : this.el.offsetWidth)));
          // this.max = Infinity;
          // this.min = -Infinity;
          this._doc = getDocument(this._el);
          listen(this.s.scroll3d ? this._innerEl : this._el, SCROLL, this._onScroll);
          listen(this._el, CLICK, this._onClick, true);
          listen(this._el, MOUSE_WHEEL, this._onMouseWheel, { passive: false });
          listen(this._el, WHEEL, this._onMouseWheel, { passive: false });
          listen(this._scrollbarContEl, MOUSE_DOWN, this._onTrackStart);
          listen(this._scrollbarContEl, CLICK, this._onTrackClick);
          this._unlisten = gestureListener(this._el, {
              onEnd: this._onEnd,
              onMove: this._onMove,
              onStart: this._onStart,
              prevDef: true,
          });
      };
      ScrollviewBase.prototype._updated = function () {
          var s = this.s;
          var batchSize = s.batchSize;
          var itemSize = s.itemSize;
          // const selectedIndex = s.selectedIndex! < s.minIndex! ? s.minIndex! : s.selectedIndex!;
          var selectedIndex = s.selectedIndex;
          var prevIndex = this._prevIndex;
          var shouldAnimate = !s.prevAnim && ((prevIndex !== UNDEFINED && prevIndex !== selectedIndex) || this._isAnimating);
          var newPos = -(selectedIndex - this._offset) * itemSize * this._rtlNr;
          if (s.margin) {
              this._scrollEl.style.marginTop = this._isVertical ? (this._margin - batchSize) * itemSize + 'px' : '';
          }
          // Scroll to the new position, but only if the view is not being moved currently
          // The _scroll function will call _infinite, so if the index is changed from outside
          // compared to the index stored in the state, this will ensure to update the index in the state,
          // to regenerate the visible items
          if (!this._started) {
              this._scroll(newPos, shouldAnimate ? this._isAnimating || s.time || 1000 : 0);
          }
          this._prevIndex = selectedIndex;
      };
      ScrollviewBase.prototype._destroy = function () {
          unlisten(this.s.scroll3d ? this._innerEl : this._el, SCROLL, this._onScroll);
          unlisten(this._el, CLICK, this._onClick, true);
          unlisten(this._el, MOUSE_WHEEL, this._onMouseWheel, { passive: false });
          unlisten(this._el, WHEEL, this._onMouseWheel, { passive: false });
          unlisten(this._scrollbarContEl, MOUSE_DOWN, this._onTrackStart);
          unlisten(this._scrollbarContEl, CLICK, this._onTrackClick);
          rafc(this._raf);
          this._raf = false;
          // Need to reset scroll because Preact recycles the DOM element
          this._scroll(0);
          this._unlisten();
      };
      /**
       * Maintains the current position during animation
       */
      ScrollviewBase.prototype._anim = function (dir) {
          var _this = this;
          return (this._raf = raf(function () {
              var s = _this.s;
              var now = +new Date();
              // Component was destroyed
              if (!_this._raf) {
                  return;
              }
              if ((_this._currPos - _this._endPos) * -dir < 4) {
                  _this._currPos = _this._endPos;
                  _this._raf = false;
                  _this._isAnimating = 0;
                  _this._isScrolling = false;
                  _this._infinite(_this._currPos);
                  _this._hook('onAnimationEnd', {});
                  _this._scrollbarContEl.classList.remove('mbsc-scroller-bar-started'); // hide scrollbar after animation finished
                  return;
              }
              if (now - _this._lastRaf > 100) {
                  _this._lastRaf = now;
                  _this._currPos = getPosition(_this._scrollEl, _this._isVertical);
                  if (!s.changeOnEnd) {
                      _this._infinite(_this._currPos);
                  }
              }
              _this._raf = _this._anim(dir);
          }));
      };
      ScrollviewBase.prototype._infinite = function (pos) {
          var s = this.s;
          if (s.itemSize) {
              var index = round((-pos * this._rtlNr) / s.itemSize) + this._offset;
              var diff = index - this._currIndex;
              if (diff) {
                  // this._margin += diff;
                  if (s.changeOnEnd) {
                      this._hook('onIndexChange', { index: index, diff: diff });
                  }
                  else {
                      this.setState({ index: index });
                  }
              }
          }
      };
      ScrollviewBase.prototype._scroll = function (pos, time) {
          var s = this.s;
          var itemSize = s.itemSize;
          var isVertical = this._isVertical;
          var style = this._scrollEl.style;
          var prefix = jsPrefix ? jsPrefix + 'T' : 't';
          var timing = time ? cssPrefix + 'transform ' + round(time) + 'ms ' + s.easing : '';
          style[prefix + 'ransform'] = 'translate3d(' + (isVertical ? '0,' + pos + 'px,' : pos + 'px,0,') + '0)';
          style[prefix + 'ransition'] = timing;
          this._endPos = pos;
          if (s.scroll3d) {
              var style3d = this._scrollEl3d.style;
              var angle = 360 / (s.batchSize3d * 2);
              style3d[prefix + 'ransform'] = 'translateY(-50%) rotateX(' + (-pos / itemSize) * angle + 'deg)';
              style3d[prefix + 'ransition'] = timing;
          }
          if (this._scrollbarEl) {
              var sbStyle = this._scrollbarEl.style;
              var percent = this._isInfinite
                  ? (this._maxSnapScroll * this._round - this._delta) / (this._maxSnapScroll * this._round * 2)
                  : (pos - this._max) / (this._min - this._max);
              var barPos = constrain((this._barContSize - this._barSize) * percent, 0, this._barContSize - this._barSize);
              sbStyle[prefix + 'ransform'] = 'translate3d(' + (isVertical ? '0,' + barPos + 'px,' : barPos + 'px,0,') + '0)';
              sbStyle[prefix + 'ransition'] = timing;
          }
          if (time) {
              rafc(this._raf);
              // Maintain position during animation
              this._isAnimating = time;
              this._scrollbarContEl.classList.add('mbsc-scroller-bar-started'); // show the scrollbar during animation
              this._raf = this._anim(pos > this._currPos ? 1 : -1);
          }
          else {
              this._currPos = pos;
              // Infinite
              if (!s.changeOnEnd) {
                  this._infinite(pos);
              }
          }
      };
      ScrollviewBase.prototype._move = function (args, preventMaxSnap) {
          var prevX = this._currX;
          var prevY = this._currY;
          var prevT = this._timestamp;
          var maxSnapScroll = this._maxSnapScroll;
          if (args) {
              this._currX = args.endX;
              this._currY = args.endY;
              this._timestamp = +new Date();
              var timeDelta = this._timestamp - prevT;
              if (timeDelta > 0 && timeDelta < 100) {
                  var velocityX = (this._currX - prevX) / timeDelta;
                  var velocityY = (this._currY - prevY) / timeDelta;
                  this._velocityX = velocityX * 0.7 + this._velocityX * 0.3;
                  this._velocityY = velocityY * 0.7 + this._velocityY * 0.3;
              }
          }
          if (maxSnapScroll && !preventMaxSnap) {
              this._delta = constrain(this._delta, -this._round * maxSnapScroll, this._round * maxSnapScroll);
          }
          this._scroll(constrain(this._startPos + this._delta, this._min - this.s.itemSize, this._max + this.s.itemSize));
          this._raf = false;
      };
      ScrollviewBase.defaults = {
          axis: 'Y',
          batchSize: 40,
          easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
          mouseSwipe: true,
          mousewheel: true,
          prevDef: true,
          selectedIndex: 0,
          spaceAround: true,
          stopProp: true,
          swipe: true,
          thresholdX: 10,
          thresholdY: 5,
      };
      return ScrollviewBase;
  }(BaseComponent));

  function template$6(s, inst, content) {
      var content3d;
      if (s.itemRenderer) {
          content = inst.visibleItems.map(function (item) { return s.itemRenderer(item, inst._offset); });
          if (s.scroll3d) {
              content3d = inst.visible3dItems.map(function (item) { return s.itemRenderer(item, inst._offset, true); });
          }
      }
      // TODO: forward other props as well
      return (createElement("div", { ref: inst._setEl, className: inst._cssClass, style: s.styles },
          createElement("div", { ref: inst._setInnerEl, className: s.innerClass, style: s.innerStyles },
              createElement("div", { ref: inst._setScrollEl, className: 'mbsc-scrollview-scroll' + inst._rtl }, content)),
          s.scroll3d && (createElement("div", { ref: inst._setScrollEl3d, style: { height: s.itemSize + 'px' }, className: 'mbsc-scroller-items-3d' }, content3d)),
          createElement("div", { ref: inst._setScrollbarContEl, className: 'mbsc-scroller-bar-cont ' +
                  inst._rtl +
                  (!s.scrollBar || inst._barSize === inst._barContSize ? ' mbsc-scroller-bar-hidden' : '') +
                  (inst._started ? ' mbsc-scroller-bar-started' : '') },
              createElement("div", { className: 'mbsc-scroller-bar' + inst._theme, ref: inst._setScrollbarEl, style: { height: inst._barSize + 'px' } }))));
  }
  var Scrollview = /*#__PURE__*/ (function (_super) {
      __extends(Scrollview, _super);
      function Scrollview() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Scrollview.prototype._template = function (s) {
          return template$6(s, this, s.children);
      };
      return Scrollview;
  }(ScrollviewBase));

  var update = 0;
  function template$7(s, state, inst, content) {
      var _a, _b;
      update++;
      var variableRow = inst._variableRow;
      var monthOrYearSelection = inst._view !== MONTH_VIEW;
      var animationEnd = (_a = {}, _a[ON_ANIMATION_END] = inst._onViewAnimationEnd, _a);
      var keydown = (_b = {}, _b[ON_KEY_DOWN] = inst._onKeyDown, _b);
      var renderMonthView = function (timestamp, props) {
          return (createElement(MonthView, __assign({}, props, { activeDate: inst._active, amText: s.amText, calendarType: s.calendarType, cellTextHeight: state.cellTextHeight, clickToCreate: s.clickToCreate, colors: inst._colors, dayNames: s.dayNames, dayNamesShort: inst._dayNames, dataTimezone: s.dataTimezone, displayTimezone: s.displayTimezone, eventText: s.eventText, events: s.eventMap, eventsText: s.eventsText, exclusiveEndDates: s.exclusiveEndDates, firstDay: s.firstDay, firstPageDay: timestamp, getDate: s.getDate, getDay: s.getDay, getMonth: s.getMonth, getWeekNumber: s.getWeekNumber, getYear: s.getYear, hasMarks: !!inst._marked, hoverEnd: s.hoverEnd, hoverStart: s.hoverStart, isPicker: s.isPicker, invalid: inst._invalid, labels: inst._labelsLayout, labelHeight: state.labelHeight, marked: inst._marked, max: inst._maxDate, min: inst._minDate, monthNames: s.monthNames, monthNamesShort: s.monthNamesShort, onDayClick: inst._onDayClick, onDayDoubleClick: s.onDayDoubleClick, onDayRightClick: s.onDayRightClick, onDayHoverIn: inst._onDayHoverIn, onDayHoverOut: inst._onDayHoverOut, onLabelClick: inst._onLabelClick, onLabelDoubleClick: s.onLabelDoubleClick, onLabelRightClick: s.onLabelRightClick, onLabelHoverIn: s.onLabelHoverIn, onLabelHoverOut: s.onLabelHoverOut, onLabelDelete: s.onLabelDelete, pmText: s.pmText, rangeEnd: s.rangeEnd, rangeStart: s.rangeStart, resourcesMap: s.resourcesMap, rtl: s.rtl, selectedDates: s.selectedDates, selectedEventsMap: s.selectedEventsMap, showEventTooltip: s.showEventTooltip, showOuter: inst._showOuter, showWeekDays: !inst._showDaysTop, showWeekNumbers: s.showWeekNumbers, showSingleMark: !!s.marksMap, todayText: s.todayText, theme: s.theme, timeFormat: s.timeFormat, timezonePlugin: s.timezonePlugin, valid: inst._valid, weeks: inst._weeks, weekText: s.weekText, renderDay: s.renderDay, renderDayContent: s.renderDayContent, renderLabel: s.renderLabel, renderLabelContent: s.renderLabelContent, variableRow: inst._variableRow })));
      };
      var renderMonth = function (item, offset) {
          var key = item.key;
          var isActive = key >= inst._pageIndex && key < inst._pageIndex + inst._pageNr && inst._view === MONTH_VIEW;
          var ownProps = {
              dragData: s.dragData,
              dragToCreate: s.dragToCreate,
              dragToMove: s.dragToMove,
              dragToResize: s.dragToResize,
              isActive: isActive,
              onLabelUpdateEnd: s.onLabelUpdateEnd,
              onLabelUpdateModeOff: s.onLabelUpdateModeOff,
              onLabelUpdateModeOn: s.onLabelUpdateModeOn,
              onLabelUpdateMove: s.onLabelUpdateMove,
              onLabelUpdateStart: s.onLabelUpdateStart,
          };
          return (createElement("div", { className: 'mbsc-calendar-slide' + (isActive ? ' mbsc-calendar-slide-active' : '') + inst._theme + inst._rtl, key: key, style: inst._getPageStyle(key, offset, inst._pageNr) }, renderMonthView(inst._getPageDay(key), ownProps)));
      };
      var renderYears = function (item, offset) {
          var index = item.key;
          var first = inst._getPageYears(index);
          var selectedYear = s.getYear(new Date(inst._active));
          var activeYear = s.getYear(new Date(inst._activeMonth));
          return (createElement("div", { "aria-hidden": inst._yearsIndex === index ? UNDEFINED : 'true', className: 'mbsc-calendar-picker-slide mbsc-calendar-slide' + inst._theme + inst._rtl, key: index, style: inst._getPageStyle(index, offset) },
              createElement("div", { className: "mbsc-calendar-table mbsc-flex-col" }, ARRAY4.map(function (x, i) { return (createElement("div", { className: "mbsc-calendar-row mbsc-flex mbsc-flex-1-0", key: i }, ARRAY3.map(function (y, j) {
                  var year = first + i * 3 + j;
                  var d = +s.getDate(year, 0, 1);
                  return (createElement(CalendarDay, { active: year === activeYear, date: d, display: true, selected: year === selectedYear, disabled: year < inst._minYears || year > inst._maxYears, rtl: s.rtl, text: year + s.yearSuffix, theme: s.theme, type: "year", onDayClick: inst._onYearClick, key: year }));
              }))); }))));
      };
      var renderYear = function (item, offset) {
          var index = item.key;
          var year = inst._getPageYear(index);
          var active = new Date(inst._activeMonth);
          var activeYear = s.getYear(active);
          var activeMonth = s.getMonth(active);
          var selected = new Date(inst._active);
          var selectedYear = s.getYear(selected);
          var selectedMonth = s.getMonth(selected);
          return (createElement("div", { "aria-hidden": inst._yearIndex === index ? UNDEFINED : 'true', className: 'mbsc-calendar-picker-slide mbsc-calendar-slide' + inst._theme + inst._rtl, key: index, style: inst._getPageStyle(index, offset) },
              createElement("div", { className: "mbsc-calendar-table mbsc-flex-col" }, ARRAY4.map(function (a, i) { return (createElement("div", { className: "mbsc-calendar-row mbsc-flex mbsc-flex-1-0", key: i }, ARRAY3.map(function (b, j) {
                  var d = s.getDate(year, i * 3 + j, 1);
                  var y = s.getYear(d);
                  var m = s.getMonth(d);
                  return (createElement(CalendarDay, { active: y === activeYear && m === activeMonth, date: +d, display: true, selected: y === selectedYear && m === selectedMonth, disabled: d < inst._minYear || d >= inst._maxYear, month: s.monthNames[m], rtl: s.rtl, text: s.monthNamesShort[m], theme: s.theme, type: "month", onDayClick: inst._onMonthClick, key: +d }));
              }))); }))));
      };
      var renderHeader = function () {
          var headerContent;
          var html;
          if (s.renderHeader) {
              headerContent = s.renderHeader();
              if (isString(headerContent)) {
                  if (headerContent !== inst._headerHTML) {
                      inst._headerHTML = headerContent;
                      inst._shouldEnhanceHeader = true;
                  }
                  html = inst._safeHtml(headerContent);
              }
          }
          else {
              var isMultiPage = inst._pageNr > 1;
              headerContent = (createElement(Fragment, null,
                  createElement(CalendarNav, { className: "mbsc-flex mbsc-flex-1-1 mbsc-calendar-title-wrapper" }),
                  createElement(CalendarPrev, { className: 'mbsc-calendar-button-prev' + (isMultiPage ? ' mbsc-calendar-button-prev-multi' : '') }),
                  s.showToday && createElement(CalendarToday, { className: "mbsc-calendar-header-today" }),
                  createElement(CalendarNext, { className: 'mbsc-calendar-button-next' + (isMultiPage ? ' mbsc-calendar-button-next-multi' : '') })));
          }
          var header = (createElement("div", { className: 'mbsc-calendar-controls mbsc-flex' + inst._theme, dangerouslySetInnerHTML: html }, headerContent));
          // We need to use the createElement for preact to work with context
          return createElement(CalendarContext.Provider, { children: header, value: { instance: inst } });
      };
      var calWeekDays = inst._showDaysTop && s.showCalendar ? (createElement(CalendarWeekDays, { dayNamesShort: inst._dayNames, rtl: inst._rtl, theme: inst._theme, firstDay: s.firstDay, hasScroll: state.hasScrollY, hidden: inst._view !== MONTH_VIEW && !inst._hasPicker, showWeekNumbers: s.showWeekNumbers })) : null;
      var pickerProps = {
          axis: inst._axis,
          batchSize: 1,
          changeOnEnd: true,
          className: 'mbsc-calendar-scroll-wrapper' + inst._theme,
          // Need to pass some random data to render month views inside the scrollview if something changed (other than scrollview props)
          data: update,
          easing: 'ease-out',
          itemSize: state.pickerSize,
          items: inst._months,
          mousewheel: inst._mousewheel,
          prevAnim: inst._prevAnim,
          rtl: s.rtl,
          snap: true,
          time: 200,
      };
      var monthYearPicker = (createElement("div", { ref: inst._setPickerCont, className: inst._hasPicker ? 'mbsc-calendar-picker-wrapper' : '' },
          (state.view === MULTI_YEAR_VIEW || state.viewClosing === MULTI_YEAR_VIEW || s.selectView === MULTI_YEAR_VIEW) && (createElement("div", __assign({ className: inst._getPickerClass(MULTI_YEAR_VIEW) }, animationEnd),
              createElement(Scrollview, __assign({ key: "years", itemRenderer: renderYears, maxIndex: inst._maxYearsIndex, minIndex: inst._minYearsIndex, onGestureEnd: inst._onGestureEnd, onIndexChange: inst._onYearsPageChange, selectedIndex: inst._yearsIndex }, pickerProps)))),
          (state.view === YEAR_VIEW || state.viewClosing === YEAR_VIEW || s.selectView === YEAR_VIEW) && (createElement("div", __assign({ className: inst._getPickerClass(YEAR_VIEW) }, animationEnd),
              createElement(Scrollview, __assign({ key: "year", itemRenderer: renderYear, maxIndex: inst._maxYearIndex, minIndex: inst._minYearIndex, onGestureEnd: inst._onGestureEnd, onIndexChange: inst._onYearPageChange, selectedIndex: inst._yearIndex }, pickerProps))))));
      return (createElement("div", { className: inst._cssClass, ref: inst._setEl, style: inst._dim, onClick: noop },
          createElement("div", { className: 'mbsc-calendar-wrapper mbsc-flex-col' +
                  inst._theme +
                  inst._hb +
                  (s.hasContent || !s.showCalendar ? ' mbsc-calendar-wrapper-fixed mbsc-flex-none' : ' mbsc-flex-1-1') },
              createElement("div", { className: 'mbsc-calendar-header' + inst._theme + inst._hb + (inst._showDaysTop ? ' mbsc-calendar-header-vertical' : ''), ref: inst._setHeader },
                  s.showControls && renderHeader(),
                  calWeekDays),
              createElement("div", __assign({ className: 'mbsc-calendar-body mbsc-flex-col mbsc-flex-1-1' + inst._theme, ref: inst._setBody }, keydown), s.showCalendar && (createElement("div", { className: 'mbsc-calendar-body-inner mbsc-flex-col mbsc-flex-1-1' + (variableRow ? ' mbsc-calendar-body-inner-variable' : '') },
                  inst._isGrid ? (createElement("div", { "aria-hidden": monthOrYearSelection ? 'true' : UNDEFINED, className: 'mbsc-calendar-grid mbsc-flex-1-1 mbsc-flex-col' + inst._theme + inst._hb }, inst._monthsMulti.map(function (row, i) {
                      return (createElement("div", { key: i, className: "mbsc-calendar-grid-row mbsc-flex mbsc-flex-1-1" }, row.map(function (item, j) {
                          return (createElement("div", { key: j, className: 'mbsc-calendar-grid-item mbsc-flex-col mbsc-flex-1-1' + inst._theme },
                              createElement("div", { className: 'mbsc-calendar-month-title' + inst._theme }, s.monthNames[new Date(item).getMonth()]),
                              renderMonthView(item, { isActive: true })));
                      })));
                  }))) : variableRow ? (createElement("div", { "aria-hidden": monthOrYearSelection ? 'true' : UNDEFINED, className: 'mbsc-calendar-slide mbsc-calendar-slide-active ' + inst._getPickerClass(MONTH_VIEW) }, renderMonthView(+s.navigationService.firstDay, {
                      dragData: s.dragData,
                      dragToCreate: s.dragToCreate,
                      dragToMove: s.dragToMove,
                      dragToResize: s.dragToResize,
                      isActive: true,
                      onLabelUpdateEnd: s.onLabelUpdateEnd,
                      onLabelUpdateModeOff: s.onLabelUpdateModeOff,
                      onLabelUpdateModeOn: s.onLabelUpdateModeOn,
                      onLabelUpdateMove: s.onLabelUpdateMove,
                      onLabelUpdateStart: s.onLabelUpdateStart,
                  }))) : (s.selectView === MONTH_VIEW && (createElement("div", __assign({ "aria-hidden": monthOrYearSelection ? 'true' : UNDEFINED, className: inst._getPickerClass(MONTH_VIEW) }, animationEnd),
                      createElement(Scrollview, __assign({}, pickerProps, { itemNr: inst._pageNr, itemSize: state.pageSize / inst._pageNr, itemRenderer: renderMonth, maxIndex: inst._maxIndex, minIndex: inst._minIndex, mouseSwipe: s.mouseSwipe, onAnimationEnd: inst._onAnimationEnd, onGestureStart: inst._onGestureStart, onIndexChange: inst._onPageChange, onStart: inst._onStart, selectedIndex: inst._pageIndex, swipe: s.swipe }))))),
                  !inst._hasPicker && monthYearPicker)))),
          content,
          inst._hasPicker && (createElement(Popup, { anchor: inst._pickerBtn, closeOnScroll: true, contentPadding: false, context: s.context, cssClass: "mbsc-calendar-popup", display: "anchored", isOpen: inst._view !== MONTH_VIEW, locale: s.locale, onClose: inst._onPickerClose, onOpen: inst._onPickerOpen, rtl: s.rtl, scrollLock: false, showOverlay: false, theme: s.theme, themeVariant: s.themeVariant },
              createElement("div", __assign({}, keydown),
                  createElement("div", { className: 'mbsc-calendar-controls mbsc-flex' + inst._theme },
                      createElement("div", { "aria-live": "polite", className: 'mbsc-calendar-picker-button-wrapper mbsc-calendar-title-wrapper mbsc-flex mbsc-flex-1-1' + inst._theme },
                          createElement(Button, { className: "mbsc-calendar-button", onClick: inst._onPickerBtnClick, theme: s.theme, themeVariant: s.themeVariant, type: "button", variant: "flat" },
                              inst._viewTitle,
                              s.downIcon && createElement(Icon, { svg: state.view === MULTI_YEAR_VIEW ? s.downIcon : s.upIcon, theme: s.theme }))),
                      createElement(Button, { className: "mbsc-calendar-button", ariaLabel: s.prevPageText, disabled: inst._isPrevDisabled(true), iconSvg: inst._prevIcon, onClick: inst.prevPage, theme: s.theme, themeVariant: s.themeVariant, type: "button", variant: "flat" }),
                      createElement(Button, { className: "mbsc-calendar-button", ariaLabel: s.nextPageText, disabled: inst._isNextDisabled(true), iconSvg: inst._nextIcon, onClick: inst.nextPage, theme: s.theme, themeVariant: s.themeVariant, type: "button", variant: "flat" })),
                  monthYearPicker)))));
  }
  var CalendarView = /*#__PURE__*/ (function (_super) {
      __extends(CalendarView, _super);
      function CalendarView() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CalendarView.prototype._template = function (s, state) {
          return template$7(s, state, this, s.children);
      };
      CalendarView.prototype._updated = function () {
          _super.prototype._updated.call(this);
          if (this._shouldEnhanceHeader) {
              enhance(this._headerElement, { view: this });
              this._shouldEnhanceHeader = false;
          }
      };
      return CalendarView;
  }(CalendarViewBase));

  function template$8(s, inst) {
      return (createElement(CalendarView, { ref: inst._setCal, refDate: s.refDate, activeDate: s.active, amText: s.amText, cssClass: inst._className + ' mbsc-flex-1-1 mbsc-calendar-' + s.display, calendarScroll: s.calendarScroll, calendarType: s.calendarType, colors: s.colors, context: s.context, dataTimezone: s.dataTimezone, displayTimezone: s.displayTimezone, timezonePlugin: s.timezonePlugin, downIcon: s.downIcon, exclusiveEndDates: s.exclusiveEndDates, hoverEnd: s.hoverEnd, hoverStart: s.hoverStart, invalid: s.invalid, instanceService: inst._instanceService, isPicker: true, labels: s.labels, marked: s.marked, max: s.max, min: s.min, mousewheel: s.mousewheel, navigationService: inst._navService, nextIconH: s.nextIconH, nextIconV: s.nextIconV, nextPageText: s.nextPageText, noOuterChange: s.selectRange, onActiveChange: inst._onActiveChange, onCellHoverIn: s.onCellHoverIn, onCellHoverOut: s.onCellHoverOut, onDayClick: inst._onDayClick, onDayHoverIn: s.onDayHoverIn, onDayHoverOut: s.onDayHoverOut, onLabelClick: s.onLabelClick, onPageChange: s.onPageChange, onPageLoaded: s.onPageLoaded, onPageLoading: s.onPageLoading, onTodayClick: inst._onTodayClick, pages: s.pages, pmText: s.pmText, prevIconH: s.prevIconH, prevIconV: s.prevIconV, prevPageText: s.prevPageText, renderDay: s.renderDay, renderDayContent: s.renderDayContent, renderHeader: s.renderCalendarHeader, rangeEnd: s.rangeEnd, rangeStart: s.rangeStart, rtl: s.rtl, selectedDates: inst._tempValueRep, selectView: s.selectView, showCalendar: true, showControls: s.showControls, showOuterDays: s.showOuterDays, showToday: false, showWeekNumbers: s.showWeekNumbers, size: s.size, theme: s.theme, themeVariant: s.themeVariant, update: inst._update, upIcon: s.upIcon, valid: s.valid, weeks: s.weeks, width: s.width, 
          // Calendar system
          getDate: s.getDate, getDay: s.getDay, getMaxDayOfMonth: s.getMaxDayOfMonth, getMonth: s.getMonth, getWeekNumber: s.getWeekNumber, getYear: s.getYear, 
          // Localization
          dateFormat: s.dateFormat, dayNames: s.dayNames, dayNamesMin: s.dayNamesMin, dayNamesShort: s.dayNamesShort, eventText: s.eventText, eventsText: s.eventsText, firstDay: s.firstDay, fromText: s.fromText, monthNames: s.monthNames, monthNamesShort: s.monthNamesShort, moreEventsPluralText: s.moreEventsPluralText, moreEventsText: s.moreEventsText, todayText: s.todayText, toText: s.toText, weekText: s.weekText, yearSuffix: s.yearSuffix }));
  }
  /**
   * The Calendar component.
   *
   * Usage:
   *
   * ```
   * <Calendar />
   * ```
   */
  var Calendar = /*#__PURE__*/ (function (_super) {
      __extends(Calendar, _super);
      function Calendar() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          // tslint:disable-next-line: variable-name
          _this._instanceService = new InstanceServiceBase();
          return _this;
      }
      Calendar.prototype._template = function (s) {
          return template$8(s, this);
      };
      return Calendar;
  }(CalendarBase));

  /**
   * Returns the closest valid value on a wheel.
   * @hidden
   * @param wheel The wheel object.
   * @param val The current value.
   * @param direction Direction of the wheel movement.
   * @param disabled Disabled values on the wheel.
   */
  function getValid(wheel, val, disabled, direction) {
      var min = wheel.min === UNDEFINED ? -Infinity : wheel.min;
      var max = wheel.max === UNDEFINED ? Infinity : wheel.max;
      var index = getIndex(wheel, val);
      var value = getValue(wheel, index);
      var value1 = value;
      var value2 = value;
      var dist1 = 0;
      var dist2 = 0;
      if (disabled && disabled.get(value)) {
          while (index - dist1 >= min && disabled.get(value1) && dist1 < 100) {
              dist1++;
              value1 = getValue(wheel, index - dist1);
          }
          while (index + dist2 < max && disabled.get(value2) && dist2 < 100) {
              dist2++;
              value2 = getValue(wheel, index + dist2);
          }
          // If no valid value found, return the invalid value
          if (disabled.get(value1) && disabled.get(value2)) {
              return value;
          }
          if (((dist2 < dist1 && dist2 && direction !== -1) || !dist1 || index - dist1 < 0 || direction === 1) && !disabled.get(value2)) {
              value = value2;
          }
          else {
              value = value1;
          }
      }
      return value;
  }
  /** @hidden */
  function getItemValue(item) {
      return item !== UNDEFINED ? (item.value !== UNDEFINED ? item.value : item.display !== UNDEFINED ? item.display : item) : item;
  }
  /** @hidden */
  function getItem$1(wheel, index) {
      if (wheel.getItem) {
          return wheel.getItem(index);
      }
      var data = wheel.data || [];
      var len = data.length;
      var i = index % len;
      return wheel._circular ? data[i >= 0 ? i : i + len] : data[constrain(index, 0, len - 1)];
      // if (i >= wheel.min && i <= wheel.max) {
      // }
  }
  /**
   * Returns the index of a value on a wheel
   * In case of Multi-Wheels (when multiselection is available),
   * returns the index of the first selected item
   * @hidden
   * @param wheel
   * @param value
   * @returns Returns the index of the value or the first value in case of multiple values
   */
  function getIndex(wheel, value) {
      var val = wheel.multiple ? (value && value.length && value[0]) || UNDEFINED : value;
      return (wheel.getIndex ? +wheel.getIndex(value) : wheel._map.get(val)) || 0;
  }
  /** @hidden */
  // This function returns the first index when circular data is provided on wheels.
  // Note: when there are circular wheels, the index can go past the data length or below 0.
  // In these cases we take the remainder as the index from the division by data length.
  function getFirstIndex(wheel, index) {
      if (wheel.getItem && wheel.getIndex) {
          return wheel.getIndex(getItemValue(wheel.getItem(index)));
      }
      var data = wheel.data || [];
      var len = data.length;
      var i = index % len;
      return !len ? 0 : i >= 0 ? i : i + len;
  }
  /** @hidden */
  function getValue(wheel, index) {
      return getItemValue(getItem$1(wheel, index));
  }
  /** @hidden */
  var ScrollerBase = /*#__PURE__*/ (function (_super) {
      __extends(ScrollerBase, _super);
      function ScrollerBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /** @hidden */
          _this._indexes = [];
          /** @hidden */
          _this._activeIndexes = [];
          /** @hidden */
          _this._wheels = [];
          _this._batches = [];
          /**
           * Stores the last index that was set when selecting a value
           * Check out the _setIndexes method for more explanations.
           */
          _this._lastIndexes = [];
          _this._onSet = function () {
              _this._setOrUpdate();
          };
          /**
           * Triggered when the active item is changed via keyboard navigation.
           * When the selectOnScroll is true the onWheelIndexChange is triggered instead,
           * because selection also happens.
           */
          _this._onActiveChange = function (_a) {
              var wheel = _a.wheel, index = _a.index;
              var wheelIndex = wheel._key;
              _this._activeIndexes[wheelIndex] = index; // set the active index
              // we need to update the current index if the active item is outside of the visible items
              // so the wheel is scrolled down/up to be visible
              var indexes = _this._indexes;
              var currentIndex = indexes[wheelIndex];
              if (_this._scroll3d) {
                  currentIndex = index;
              }
              else if (index - currentIndex >= _this._rows) {
                  currentIndex++;
              }
              else if (index < currentIndex) {
                  currentIndex--;
              }
              indexes[wheelIndex] = currentIndex; // update the index
              _this.forceUpdate();
          };
          _this._onWheelIndexChange = function (args) {
              var s = _this.s;
              var wheel = args.wheel;
              var key = wheel._key;
              var isMultiple = wheel.multiple;
              var newValue = getValue(wheel, args.index);
              var disabled = _this._disabled && _this._disabled[key] && _this._disabled[key].get(newValue);
              var lengths = [];
              var selectOnScroll = s.selectOnScroll;
              var updateIndex = selectOnScroll || !args.click;
              if (updateIndex) {
                  _this._lastIndexes[key] = _this._indexes[key] = args.index;
                  // update batches too
                  _this._indexes.forEach(function (val, i) {
                      var w = _this._wheelMap[i];
                      var len = w.data ? w.data.length : 0;
                      _this._batches[i] = len ? floor(val / len) : 0;
                      lengths[i] = len;
                  });
              }
              _this._activeIndexes[key] = args.index;
              var beforeTempValue = _this._get(_this._tempValueRep);
              var itemTap = !!args.click && !disabled;
              var scrollOrTapSelect = selectOnScroll || itemTap;
              // Update the Temp. Value Representation
              if (isMultiple) {
                  if (itemTap) {
                      var selectionArr = (_this._tempValueRep[key] || []).slice();
                      if (args.selected === false) {
                          // add
                          selectionArr.push(newValue);
                      }
                      else if (args.selected === true) {
                          selectionArr.splice(selectionArr.indexOf(newValue), 1);
                      }
                      _this._tempValueRep[key] = selectionArr;
                  }
              }
              else if (scrollOrTapSelect) {
                  _this._tempValueRep[key] = newValue;
              }
              if (s.onWheelMove && args.index !== UNDEFINED) {
                  var wheelRep = s.onWheelMove({
                      dataItem: getItem$1(wheel, args.index),
                      selection: scrollOrTapSelect,
                      wheelIndex: key,
                  });
                  if (wheelRep) {
                      wheelRep.forEach(function (v, i) {
                          if (v !== UNDEFINED) {
                              _this._tempValueRep[i] = v;
                          }
                          if (!scrollOrTapSelect) {
                              // there will be no validation in this case down the line, so we need to move the wheel to the new index
                              var w = _this._wheelMap[i];
                              var newIndex = getIndex(w, v);
                              _this._constrainIndex(newIndex, w);
                          }
                      });
                  }
              }
              // Run validation on the tempValue
              if (scrollOrTapSelect) {
                  _this._validate(key, args.diff > 0 ? 1 : -1);
              }
              // Update wheel offset with the new validated value
              // _offset is used to compensate for wheel length changes. For example changing the month from March to February
              // will change the days wheel length from 31 to 28-29, which equals 2-3 index difference for each circular batches
              // that are rendered. The index difference is added as the offset, and later used to compensate for this by adding
              // margins to the wheel (in the ScrollView).
              if (selectOnScroll) {
                  _this._tempValueRep.forEach(function (val, i) {
                      var w = _this._wheelMap[i];
                      var len = w.data ? w.data.length : 0;
                      var oldIndex = _this._indexes[i];
                      var newIndex = getIndex(w, val) + _this._batches[i] * len;
                      _this._activeIndexes[i] = _this._lastIndexes[i] = _this._indexes[i] = newIndex;
                      w._offset = len !== lengths[i] ? newIndex - oldIndex : 0;
                  });
              }
              // Update underlying components or set the new value
              var currentTempValue = _this._get(_this._tempValueRep);
              var tempValueChanged = !_this._valueEquals(beforeTempValue, currentTempValue);
              if (tempValueChanged || (args.click && _this._live && !_this._valueEquals(_this.value, currentTempValue))) {
                  // If the temp value changed, or in live mode we clicked the selected item
                  _this._setOrUpdate(!tempValueChanged);
              }
              else {
                  // In the case of tap select (multi select, and single select desktop mode) when we spin the wheel,
                  // or the temp value did not change, we need to propagate down the new index.
                  _this.forceUpdate();
              }
              if (_this._live && itemTap && wheel.closeOnTap) {
                  _this.close();
              }
          };
          return _this;
      }
      ScrollerBase.prototype._initWheels = function () {
          var _this = this;
          var key = 0;
          var wheels = this.s.wheels || [];
          this._wheelMap = [];
          wheels.forEach(function (wheelGroup) {
              wheelGroup.forEach(function (wheel) {
                  _this._initWheel(wheel, key);
                  _this._wheelMap[key] = wheel;
                  key++;
              });
          });
          this._wheels = wheels;
      };
      ScrollerBase.prototype._shouldValidate = function (s, prevS) {
          // TODO: wheel check is moved to the datetime currently, but it should be checked here
          // We removed it, because select filtering changes the wheel, but re-validation of the value should not happen in this case.
          // A possible solution would be that the select only changes the wheel data only, but in this case we need to force the
          // re-render of the scroller somehow
          // const superValidate = s.shouldValidate ? s.shouldValidate(s, prevS) : false;
          // return superValidate || s.wheels !== prevS.wheels;
          return s.shouldValidate ? s.shouldValidate(s, prevS) : false;
      };
      ScrollerBase.prototype._valueEquals = function (v1, v2) {
          if (this.s.valueEquality) {
              return this.s.valueEquality(v1, v2);
          }
          return v1 === v2;
      };
      // tslint:enable variable-name
      ScrollerBase.prototype._render = function (s, state) {
          var _this = this;
          var props = this.props || {};
          var resp = this._respProps || {};
          var prevS = this._prevS;
          var circular = this._touchUi ? s.circular : false;
          var rows = this._touchUi ? s.rows : resp.rows || props.rows || 7;
          this._displayStyle = s.displayStyle || s.display;
          this._scroll3d = s.scroll3d && this._touchUi && has3d;
          // this._nullSupport = this._displayStyle !== 'inline';
          if (s.itemHeight !== prevS.itemHeight || rows !== this._rows) {
              this._rows = rows;
              this._lineStyle = {
                  height: s.itemHeight + 'px',
              };
              if (this._scroll3d) {
                  var translateZ = 'translateZ(' + ((s.itemHeight * rows) / 2 + 3) + 'px';
                  this._overlayStyle = {};
                  this._overlayStyle[cssPrefix + 'transform'] = translateZ;
                  this._lineStyle[cssPrefix + 'transform'] = 'translateY(-50%) ' + translateZ;
              }
          }
          if (s.wheels !== prevS.wheels || circular !== this._circular) {
              this._batches = [];
              this._shouldSetIndex = true;
              this._circular = circular;
              this._initWheels();
          }
          _super.prototype._render.call(this, s, state);
          if (this._shouldSetIndex) {
              this._setIndexes();
              this._shouldSetIndex = this._indexFromValue = false;
          }
          if (s.wheels !== prevS.wheels && prevS.wheels !== UNDEFINED) {
              // Trigger wheel index change if wheels changed dynamically,
              // this will validate the values on each wheel
              // TODO: we need a better solution here, maybe this should be triggered from the wheel/scrollview somehow
              setTimeout(function () {
                  for (var _i = 0, _a = _this._wheelMap; _i < _a.length; _i++) {
                      var wheel = _a[_i];
                      _this._onWheelIndexChange({
                          diff: 0,
                          index: _this._indexes[wheel._key],
                          wheel: wheel,
                      });
                  }
              });
          }
      };
      ScrollerBase.prototype._writeValue = function (elm, text, value) {
          if (this.s.writeValue) {
              return this.s.writeValue(elm, text, value);
          }
          return _super.prototype._writeValue.call(this, elm, text, value);
      };
      // tslint:disable variable-name
      ScrollerBase.prototype._copy = function (value) {
          return value.slice(0);
      };
      ScrollerBase.prototype._format = function (value) {
          if (this.s.formatValue) {
              return this.s.formatValue(value);
          }
          return value.join(' ');
      };
      ScrollerBase.prototype._get = function (value) {
          if (this.s.getValue) {
              return this.s.getValue(value);
          }
          return value;
      };
      ScrollerBase.prototype._parse = function (valueStr) {
          if (this.s.parseValue) {
              return this.s.parseValue(valueStr);
          }
          var ret = [];
          var values = [];
          var i = 0;
          if (valueStr !== null && valueStr !== UNDEFINED) {
              values = (valueStr + '').split(' ');
          }
          this._wheels.forEach(function (wheelGroup) {
              wheelGroup.forEach(function (wheel) {
                  var data = wheel.data || [];
                  var len = data.length;
                  // Default to first wheel value if not found
                  var value = getItemValue(data[0]);
                  var j = 0;
                  // Don't do strict comparison, because the parsed value is always string,
                  // but the wheel value can be number as well
                  /* eslint-disable eqeqeq */
                  // tslint:disable-next-line: triple-equals
                  while (value != values[i] && j < len) {
                      value = getItemValue(data[j]);
                      j++;
                  }
                  /* eslint-enable eqeqeq */
                  ret.push(value);
                  i++;
              });
          });
          return ret;
      };
      /**
       * Does the validation
       * @param index Index of the wheel
       * @param direction Direction the wheel was moved
       */
      ScrollerBase.prototype._validate = function (index, direction) {
          var _this = this;
          if (this.s.validate) {
              var ret = this.s.validate.call(this._el, {
                  direction: direction,
                  index: index,
                  values: this._tempValueRep.slice(0),
                  wheels: this._wheelMap,
              });
              this._disabled = ret.disabled;
              if (ret.init) {
                  this._initWheels();
              }
              if (ret.indexes) {
                  ret.indexes.forEach(function (value, i) {
                      if (value !== UNDEFINED) {
                          var w = _this._wheelMap[i];
                          var newIndex = getIndex(w, value);
                          _this._constrainIndex(newIndex, w);
                      }
                  });
              }
              if (ret.valid) {
                  this._tempValueRep = ret.valid.slice(0);
              }
              else {
                  this._wheelMap.forEach(function (wheel, i) {
                      _this._tempValueRep[i] = getValid(wheel, _this._tempValueRep[i], _this._disabled && _this._disabled[i], direction);
                  });
              }
          }
      };
      ScrollerBase.prototype._onOpen = function () {
          this._batches = [];
          this._shouldSetIndex = true;
          this._indexFromValue = true;
      };
      ScrollerBase.prototype._onParse = function () {
          this._shouldSetIndex = true;
      };
      // tslint:enable variable-name
      ScrollerBase.prototype._initWheel = function (wheel, key) {
          var circular = this._circular;
          wheel._key = key;
          wheel._map = new Map();
          wheel._circular =
              circular === UNDEFINED
                  ? wheel.circular === UNDEFINED
                      ? wheel.data && wheel.data.length > this._rows
                      : wheel.circular
                  : isArray(circular)
                      ? circular[key]
                      : circular;
          if (wheel.data) {
              wheel.min = wheel._circular ? UNDEFINED : 0;
              wheel.max = wheel._circular ? UNDEFINED : wheel.data.length - 1;
              // Map keys to index
              wheel.data.forEach(function (item, i) {
                  wheel._map.set(getItemValue(item), i);
              });
          }
      };
      /** Indexes must be set in two occasions:
       * 1. When the picker is opened
       * 2. When the wheels are changed (ex. select filtering)
       *
       * The new index can come from the value (when opening the scroller), or from the currently scrolled to item
       */
      ScrollerBase.prototype._setIndexes = function () {
          var _this = this;
          var currentIndexes = this._indexes || [];
          this._indexes = [];
          this._activeIndexes = [];
          this._tempValueRep.forEach(function (val, i) {
              var w = _this._wheelMap[i];
              var len = w.data ? w.data.length : 0;
              var newIndex = getIndex(w, val);
              if (_this.s.selectOnScroll) {
                  _this._activeIndexes[i] = _this._indexes[i] = newIndex + (_this._batches[i] || 0) * len;
              }
              else {
                  var currentIndex = newIndex; // comes from the selected value
                  if (!_this._indexFromValue) {
                      // comes from the currently "scrolled to item"
                      currentIndex = currentIndexes[i];
                      if (currentIndex !== UNDEFINED) {
                          currentIndex = getFirstIndex(w, currentIndex) + (_this._batches[i] || 0) * len;
                      }
                  }
                  // the current index is the index of the topmost visible item on the scroller, but the selected item can be under that.
                  // So if the currentIndex comes from the selected value, the currentIndex can turn up greater than the topmost item's
                  // index. So we need to constrain the currentIndex in this case, otherwise at the end of the list, there will be an
                  // empty space
                  _this._constrainIndex(currentIndex, w);
              }
          });
      };
      /**
       * The newIndex is the index of the topmost visible item on the scroller, but the selected item can be under that.
       * So if the newIndex comes from the selected value, the newIndex can turn up greater than the topmost item's
       * index. So we need to constrain the newIndex in this case, otherwise at the end of the list, there will be an
       * empty space
       * @param newIndex
       * @param wheel
       */
      ScrollerBase.prototype._constrainIndex = function (newIndex, wheel) {
          var i = wheel._key;
          if (newIndex !== UNDEFINED && wheel.data) {
              // constrain so we don't get an empty space at the end of the list
              if (!wheel.spaceAround) {
                  // the index needs to be constraine only in case of desktop styling
                  newIndex = constrain(newIndex, 0, Math.max(wheel.data.length - this._rows, 0));
              }
              this._activeIndexes[i] = this._indexes[i] = newIndex;
          }
          else {
              this._activeIndexes[i] = this._indexes[i] = this._lastIndexes[i] || 0; // we use the last available index or default to zero
          }
      };
      /** @hidden */
      ScrollerBase.defaults = {
          itemHeight: 40,
          rows: 5,
          selectOnScroll: true,
          showOnClick: true,
      };
      // tslint:disable variable-name
      ScrollerBase._name = 'Scroller';
      return ScrollerBase;
  }(PickerBase));

  /** @hidden */
  var WheelItemBase = /*#__PURE__*/ (function (_super) {
      __extends(WheelItemBase, _super);
      function WheelItemBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          // tslint:enable variable-name
          // tslint:disable-next-line: variable-name
          _this._onClick = function () {
              var s = _this.s;
              if (s.text !== UNDEFINED && !s.isGroup) {
                  _this._hook('onClick', { index: s.index, selected: s.selected, disabled: s.disabled });
              }
          };
          return _this;
      }
      WheelItemBase.prototype._mounted = function () {
          var _this = this;
          this._unlisten = gestureListener(this._el, {
              click: true,
              keepFocus: false,
              onBlur: function () {
                  _this.setState({ hasFocus: false });
              },
              onFocus: function () {
                  _this.setState({ hasFocus: true });
              },
              onHoverIn: function () {
                  if (_this.s.text !== UNDEFINED) {
                      _this.setState({ hasHover: true });
                  }
              },
              onHoverOut: function () {
                  if (_this.s.text !== UNDEFINED) {
                      _this.setState({ hasHover: false });
                  }
              },
              onKeyDown: function (ev) {
                  if (ev.keyCode === SPACE || (!_this.s.multiple && ev.keyCode === ENTER)) {
                      _this._onClick();
                  }
              },
              onPress: function () {
                  if (_this.s.text !== UNDEFINED) {
                      _this.setState({ isActive: true });
                  }
              },
              onRelease: function () {
                  if (_this.s.text !== UNDEFINED) {
                      _this.setState({ isActive: false });
                  }
              },
          });
      };
      WheelItemBase.prototype._destroy = function () {
          this._unlisten();
      };
      WheelItemBase.prototype._render = function (s, state) {
          var height = s.height;
          this._cssClass =
              'mbsc-scroller-wheel-' +
                  (s.isGroup ? 'header' : 'item') +
                  this._theme +
                  this._rtl +
                  (s.checkmark && !s.isGroup ? ' mbsc-wheel-item-checkmark' : '') +
                  (s.is3d ? ' mbsc-scroller-wheel-item-3d' : '') +
                  (s.scroll3d && !s.is3d ? ' mbsc-scroller-wheel-item-2d' : '') +
                  (s.selected && !s.is3d ? ' mbsc-selected' : '') +
                  (s.selected && s.is3d ? ' mbsc-selected-3d' : '') +
                  (s.disabled ? ' mbsc-disabled' : '') +
                  (s.multiple && !s.isGroup ? ' mbsc-wheel-item-multi' : '') +
                  (state.hasHover ? ' mbsc-hover' : '') +
                  (state.hasFocus ? ' mbsc-focus' : '') +
                  (state.isActive ? ' mbsc-active' : '');
          this._style = {
              height: height + 'px',
              lineHeight: height + 'px',
          };
          this._checkmarkClass = this._theme + this._rtl + ' mbsc-wheel-checkmark' + (s.selected ? ' mbsc-selected' : '');
          if (s.is3d) {
              this._transform = 'rotateX(' + (((s.offset - s.index) * s.angle3d) % 360) + 'deg) translateZ(' + (height * s.rows) / 2 + 'px)';
              this._style[cssPrefix + 'transform'] = this._transform;
          }
      };
      return WheelItemBase;
  }(BaseComponent));

  /** @hidden */
  function template$9(s, inst) {
      var content;
      if (s.renderItem && s.data !== UNDEFINED) {
          var cont = s.renderItem(s.data);
          var contentHtml = isString(cont) ? { __html: cont } : UNDEFINED;
          content = contentHtml ? createElement("div", { dangerouslySetInnerHTML: contentHtml }) : createElement("div", null, cont);
      }
      else {
          content = s.text;
      }
      return (createElement("div", { "aria-disabled": s.disabled ? 'true' : UNDEFINED, "aria-hidden": content === UNDEFINED || s.is3d ? 'true' : UNDEFINED, "aria-selected": s.selected ? 'true' : UNDEFINED, ref: inst._setEl, tabIndex: s.active ? 0 : UNDEFINED, className: inst._cssClass, role: "option", style: inst._style, onClick: inst._onClick },
          s.checkmark && createElement("span", { className: inst._checkmarkClass }),
          content));
  }
  var WheelItem = /*#__PURE__*/ (function (_super) {
      __extends(WheelItem, _super);
      function WheelItem() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      WheelItem.prototype._template = function (s) {
          return template$9(s, this);
      };
      return WheelItem;
  }(WheelItemBase));

  /** @hidden */
  var WheelBase = /*#__PURE__*/ (function (_super) {
      __extends(WheelBase, _super);
      function WheelBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          // tslint:enable variable-name
          // tslint:disable-next-line: variable-name
          _this._onIndexChange = function (args) {
              args.wheel = _this.s.wheel;
              _this._hook('onIndexChange', args);
          };
          // tslint:disable-next-line: variable-name
          _this._onItemClick = function (args) {
              _this._hook('onIndexChange', { click: true, index: args.index, wheel: _this.s.wheel, selected: args.selected });
          };
          // tslint:disable-next-line: variable-name
          _this._onKeyDown = function (ev) {
              var dir = 0;
              if (ev.keyCode === UP_ARROW) {
                  dir = -1;
              }
              else if (ev.keyCode === DOWN_ARROW) {
                  dir = 1;
              }
              var s = _this.s;
              var newIndex = s.activeIndex + dir;
              // Only triggerd the hooks if there's a change in the index.
              // Compare using the ! operator, because min and max indexes might be undefined
              var change = !(newIndex < s.minIndex) && !(newIndex > s.maxIndex);
              if (dir) {
                  // Prevent content scroll on arrow keys
                  ev.preventDefault();
              }
              if (dir && change) {
                  var hook = s.selectOnScroll ? 'onIndexChange' : 'onActiveChange';
                  _this._shouldFocus = true;
                  _this._hook(hook, { diff: dir, index: newIndex, wheel: s.wheel });
              }
              else if (ev.keyCode === ENTER && s.multiple) {
                  _this._hook('onSet', {});
              }
          };
          return _this;
      }
      WheelBase.prototype._getText = function (data) {
          return data !== UNDEFINED ? (data.display !== UNDEFINED ? data.display : data) : UNDEFINED;
      };
      WheelBase.prototype._getValue = function (data) {
          return data ? (data.value !== UNDEFINED ? data.value : data.display !== UNDEFINED ? data.display : data) : data;
      };
      WheelBase.prototype._isActive = function (item, text, is3d) {
          var s = this.s;
          var d3 = s.scroll3d && s.multiple ? is3d : !is3d;
          return s.activeIndex === item.key && text && d3;
      };
      WheelBase.prototype._isSelected = function (item) {
          var s = this.s;
          var selectedValues = s.selectedValues;
          var value = this._getValue(item.data);
          return s.multiple
              ? !!(selectedValues && selectedValues.indexOf) && selectedValues.indexOf(value) >= 0
              : s.selectOnScroll
                  ? item.key === s.selectedIndex
                  : value !== UNDEFINED && value === selectedValues;
      };
      WheelBase.prototype._isDisabled = function (data) {
          var disabledMap = this.s.disabled;
          var disabledProp = data && data.disabled;
          var value = this._getValue(data);
          return !!(disabledProp || (disabledMap && disabledMap.get(value)));
      };
      WheelBase.prototype._render = function (s) {
          var rows = s.rows;
          var itemHeight = s.itemHeight;
          var key = s.wheel._key;
          var itemHeight3d = round((itemHeight - ((itemHeight * rows) / 2 + 3) * 0.03) / 2) * 2;
          this._items = s.wheel.getItem || s.wheel.data || [];
          this._batchSize3d = round(rows * 1.8);
          this._angle3d = 360 / (this._batchSize3d * 2);
          this._style = {
              height: round((rows * itemHeight * (s.scroll3d ? 1.1 : 1)) / 2) * 2 + 'px',
          };
          this._itemNr = s.wheel.spaceAround ? 1 : rows;
          this._innerStyle = {
              height: (s.scroll3d ? itemHeight3d : s.wheel.spaceAround ? itemHeight : itemHeight * rows) + 'px',
          };
          this._wheelStyle = s.wheelWidth
              ? {
                  width: (isArray(s.wheelWidth) ? s.wheelWidth[key] : s.wheelWidth) + 'px',
              }
              : {
                  maxWidth: (isArray(s.maxWheelWidth) ? s.maxWheelWidth[key] : s.maxWheelWidth) + 'px',
                  minWidth: (isArray(s.minWheelWidth) ? s.minWheelWidth[key] : s.minWheelWidth) + 'px',
              };
          if (s.scroll3d) {
              this._innerStyle[cssPrefix + 'transform'] = 'translateY(-50%) translateZ(' + ((itemHeight * rows) / 2 + 3) + 'px';
          }
      };
      WheelBase.prototype._updated = function () {
          if (this._shouldFocus) {
              var item_1 = this._el.querySelector('[tabindex="0"]');
              if (item_1) {
                  setTimeout(function () {
                      item_1.focus();
                  });
              }
              this._shouldFocus = false;
          }
      };
      return WheelBase;
  }(BaseComponent));

  function template$a(s, inst) {
      var _a;
      var keydown = (_a = {}, _a[ON_KEY_DOWN] = inst._onKeyDown, _a);
      var renderer = function (item, offset, is3d) {
          if (item !== UNDEFINED) {
              var text = inst._getText(item.data);
              return (createElement(WheelItem, { active: inst._isActive(item, text, is3d), angle3d: inst._angle3d, data: item.data, disabled: inst._isDisabled(item.data), height: s.itemHeight, index: item.key, is3d: is3d, isGroup: item.data && item.data.isGroup, key: item.key, multiple: s.multiple, onClick: inst._onItemClick, offset: offset, checkmark: s.wheel.checkmark, renderItem: s.renderItem, rows: s.rows, rtl: s.rtl, scroll3d: s.scroll3d, selected: inst._isSelected(item), text: text, theme: s.theme }));
          }
          return null;
      };
      return (createElement("div", __assign({ "aria-multiselectable": s.multiple ? 'true' : UNDEFINED, className: 'mbsc-scroller-wheel-wrapper mbsc-scroller-wheel-wrapper-' +
              s.wheel._key +
              ' ' +
              (s.wheel.cssClass || '') +
              (s.scroll3d ? ' mbsc-scroller-wheel-wrapper-3d' : '') +
              inst._theme +
              inst._rtl, ref: inst._setEl, role: "listbox", style: inst._wheelStyle }, keydown),
          createElement(Scrollview, { batchSize3d: inst._batchSize3d, className: 'mbsc-scroller-wheel' + (s.scroll3d ? ' mbsc-scroller-wheel-3d' : '') + inst._theme, innerClass: 'mbsc-scroller-wheel-cont mbsc-scroller-wheel-cont-' +
                  s.display +
                  (s.scroll3d ? ' mbsc-scroller-wheel-cont-3d' : '') +
                  (s.multiple ? ' mbsc-scroller-wheel-multi' : '') +
                  inst._theme, innerStyles: inst._innerStyle, items: inst._items, itemSize: s.itemHeight, itemRenderer: renderer, itemNr: inst._itemNr, margin: true, maxIndex: s.maxIndex, minIndex: s.minIndex, onIndexChange: inst._onIndexChange, offset: s.wheel._offset, rtl: s.rtl, scroll3d: s.scroll3d, scrollBar: !inst._touchUi, selectedIndex: s.selectedIndex, snap: true, spaceAround: s.wheel.spaceAround, styles: inst._style, visibleSize: s.rows })));
  }
  var Wheel = /*#__PURE__*/ (function (_super) {
      __extends(Wheel, _super);
      function Wheel() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Wheel.prototype._template = function (s) {
          return template$a(s, this);
      };
      return Wheel;
  }(WheelBase));

  // tslint:disable max-line-length
  var cloudUpload = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>';

  var resizeObservable = new Observable();
  var resizeSubscribers = 0;
  var resizeTimer;
  function onWindowResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
          resizeObservable.next();
      }, 100);
  }
  function subscribeResize(handler) {
      if (!resizeSubscribers) {
          listen(win, RESIZE, onWindowResize);
      }
      resizeSubscribers++;
      return resizeObservable.subscribe(handler);
  }
  function unsubscribeResize(id) {
      resizeSubscribers--;
      resizeObservable.unsubscribe(id);
      if (!resizeSubscribers) {
          unlisten(win, RESIZE, onWindowResize);
      }
  }
  function checkAutoFill(el) {
      try {
          return matches(el, '*:-webkit-autofill');
      }
      catch (ex) {
          return false;
      }
  }
  /**
   * @hidden
   */
  var InputBase = /*#__PURE__*/ (function (_super) {
      __extends(InputBase, _super);
      function InputBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._tag = 'input';
          // tslint:disable-next-line: variable-name
          _this._onClick = function () {
              _this._hidePass = !_this._hidePass;
          };
          // tslint:disable-next-line: variable-name
          _this._onMouseDown = function (ev) {
              if (_this.s.tags) {
                  _this._preventFocus = true;
              }
          };
          // tslint:disable-next-line: variable-name
          _this._onTagClear = function (ev, index) {
              ev.stopPropagation();
              ev.preventDefault();
              if (!_this.s.disabled) {
                  // if the component is disabled, we should change the value
                  var value = _this.s.pickerValue.slice();
                  value.splice(index, 1);
                  // Trigger change and pass the new value in event detail
                  trigger(_this._el, CHANGE, value);
              }
          };
          // tslint:disable-next-line: variable-name
          _this._sizeTextArea = function () {
              var input = _this._el;
              var rowNr = _this.s.rows;
              var lineHeight = 24;
              var height;
              var lineNr;
              var line;
              if (input.offsetHeight) {
                  input.style.height = '';
                  line = input.scrollHeight - input.offsetHeight;
                  height = input.offsetHeight + (line > 0 ? line : 0);
                  lineNr = Math.round(height / lineHeight);
                  if (lineNr > rowNr) {
                      height = lineHeight * rowNr + (height - lineNr * lineHeight);
                      input.style.overflow = 'auto';
                  }
                  else {
                      input.style.overflow = '';
                  }
                  if (height) {
                      input.style.height = height + 'px';
                  }
              }
          };
          // tslint:disable-next-line: variable-name
          _this._onAutoFill = function () {
              if (_this.s.labelStyle === 'floating' && checkAutoFill(_this._el)) {
                  _this.setState({ isFloatingActive: true });
              }
          };
          return _this;
      }
      // tslint:enable variable-name
      // tslint:disable-next-line: no-empty
      InputBase.prototype._change = function (val) { };
      InputBase.prototype._checkFloating = function () {
          var _this = this;
          var el = this._el;
          var s = this.s;
          var isAutoFill = checkAutoFill(el);
          var isFloatingActive = this.state.hasFocus || isAutoFill || !isEmpty(this.value);
          if (el && s.labelStyle === 'floating') {
              if (this._tag === 'select') {
                  var select = el;
                  var firstOption = select.options[0];
                  isFloatingActive = !!(isFloatingActive ||
                      select.multiple ||
                      select.value ||
                      (select.selectedIndex > -1 && firstOption && firstOption.label));
              }
              else if (this.value === UNDEFINED) {
                  var input = el;
                  isFloatingActive = !!(isFloatingActive || input.value);
              }
              this._valueChecked = true;
              ngSetTimeout(this, function () {
                  _this.setState({ isFloatingActive: isFloatingActive });
              });
          }
      };
      InputBase.prototype._mounted = function () {
          var _this = this;
          var s = this.s;
          var input = this._el;
          // In case of autofill in webkit browsers the animationstart event will fire
          // due to the empty animation added in the css,
          // because there's no other event in case of the initial autofill
          listen(input, ANIMATION_START, this._onAutoFill);
          if (this._tag === 'textarea') {
              listen(input, INPUT, this._sizeTextArea);
              this._unsubscribe = subscribeResize(this._sizeTextArea);
          }
          this._unlisten = gestureListener(input, {
              keepFocus: true,
              // click: true, // TODO: handle 300ms delay
              onBlur: function () {
                  _this.setState({
                      hasFocus: false,
                      isFloatingActive: !!input.value,
                  });
              },
              onChange: function (ev) {
                  // this._hook('onChange', ev);
                  if (s.type === 'file') {
                      // Copy value on file upload
                      var files = ev.target.files;
                      var names = [];
                      for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                          var file = files_1[_i];
                          names.push(file.name);
                      }
                      _this.setState({ files: names.join(', ') });
                  }
                  // TODO: we check defaultValue here not to be UNDEFINED, because the picker uses the defaultValue instead of value
                  if (s.tags && s.value === UNDEFINED && s.defaultValue === UNDEFINED) {
                      _this.setState({ value: ev.target.value });
                  }
                  _this._checkFloating();
                  _this._change(ev.target.value);
                  _this._emit('onChange', ev);
              },
              onFocus: function () {
                  if (!_this._preventFocus) {
                      _this.setState({
                          hasFocus: true,
                          isFloatingActive: true,
                      });
                  }
                  _this._preventFocus = false;
              },
              onHoverIn: function () {
                  if (!_this._disabled) {
                      _this.setState({ hasHover: true });
                  }
              },
              onHoverOut: function () {
                  _this.setState({ hasHover: false });
              },
              onInput: function (ev) {
                  _this._change(ev.target.value);
              },
          });
      };
      InputBase.prototype._render = function (s, state) {
          var hasEndIcon = !!(s.endIconSvg || s.endIcon);
          var pickerValue = s.pickerValue;
          var hasStartIcon = !!(s.startIconSvg || s.startIcon);
          var hasLabel = s.label !== UNDEFINED || s.hasChildren;
          var hasError = s.error;
          var iconStartPosition = s.rtl ? 'right' : 'left';
          var iconEndPosition = s.rtl ? 'left' : 'right';
          var inputType = s.inputStyle;
          var labelType = s.labelStyle;
          var isFloating = labelType === 'floating';
          var isFloatingActive = !!(isFloating && hasLabel && (state.isFloatingActive || !isEmpty(s.value)));
          var disabled = s.disabled === UNDEFINED ? state.disabled : s.disabled;
          var prevS = this._prevS;
          var modelValue = s.modelValue !== UNDEFINED ? s.modelValue : s.value;
          var value = modelValue !== UNDEFINED ? modelValue : state.value !== UNDEFINED ? state.value : s.defaultValue;
          var commonClasses = this._theme +
              this._rtl +
              (hasError ? ' mbsc-error' : '') +
              (disabled ? ' mbsc-disabled' : '') +
              (state.hasHover ? ' mbsc-hover' : '') +
              (state.hasFocus && !disabled ? ' mbsc-focus' : '');
          if (s.type === 'file' && !hasEndIcon) {
              s.endIconSvg = cloudUpload;
              hasEndIcon = true;
          }
          if (s.tags) {
              if (isEmpty(pickerValue)) {
                  pickerValue = [];
              }
              if (!isArray(pickerValue)) {
                  pickerValue = [pickerValue];
              }
              this._tagsArray = s.pickerMap
                  ? pickerValue.map(function (val) {
                      return s.pickerMap.get(val);
                  })
                  : isEmpty(value)
                      ? []
                      : value.split(', ');
          }
          if (s.passwordToggle) {
              hasEndIcon = true;
              this._passIconClass =
                  commonClasses +
                      ' mbsc-toggle-icon' +
                      (" mbsc-textfield-icon mbsc-textfield-icon-" + inputType + " mbsc-textfield-icon-" + iconEndPosition) +
                      (" mbsc-textfield-icon-" + inputType + "-" + iconEndPosition) +
                      (hasLabel ? " mbsc-textfield-icon-" + labelType : '');
              this._hidePass = this._hidePass === UNDEFINED ? s.type === 'password' : this._hidePass;
          }
          this._hasStartIcon = hasStartIcon;
          this._hasEndIcon = hasEndIcon;
          this._hasError = hasError;
          this._disabled = disabled;
          this._value = value;
          // Outer element classes
          this._cssClass =
              this._className +
                  this._hb +
                  commonClasses +
                  " mbsc-form-control-wrapper mbsc-textfield-wrapper mbsc-font" +
                  (" mbsc-textfield-wrapper-" + inputType) +
                  (disabled ? " mbsc-disabled" : '') +
                  (hasLabel ? " mbsc-textfield-wrapper-" + labelType : '') +
                  (hasStartIcon ? " mbsc-textfield-wrapper-has-icon-" + iconStartPosition + " " : '') +
                  (hasEndIcon ? " mbsc-textfield-wrapper-has-icon-" + iconEndPosition + " " : '');
          // Label classes
          if (hasLabel) {
              this._labelClass =
                  commonClasses +
                      (" mbsc-label mbsc-label-" + labelType + " mbsc-label-" + inputType + "-" + labelType) +
                      (hasStartIcon ? " mbsc-label-" + inputType + "-" + labelType + "-has-icon-" + iconStartPosition + " " : '') +
                      (hasEndIcon ? " mbsc-label-" + inputType + "-" + labelType + "-has-icon-" + iconEndPosition + " " : '') +
                      (isFloating && this._animateFloating ? ' mbsc-label-floating-animate' : '') +
                      (isFloatingActive ? ' mbsc-label-floating-active' : '');
          }
          // Inner element classes
          this._innerClass =
              commonClasses + (" mbsc-textfield-inner mbsc-textfield-inner-" + inputType) + (hasLabel ? " mbsc-textfield-inner-" + labelType : '');
          // Icon classes
          if (hasStartIcon) {
              this._startIconClass =
                  commonClasses +
                      (" mbsc-textfield-icon mbsc-textfield-icon-" + inputType + " mbsc-textfield-icon-" + iconStartPosition) +
                      (" mbsc-textfield-icon-" + inputType + "-" + iconStartPosition) +
                      (hasLabel ? " mbsc-textfield-icon-" + labelType : '');
          }
          if (hasEndIcon) {
              this._endIconClass =
                  commonClasses +
                      (" mbsc-textfield-icon mbsc-textfield-icon-" + inputType + " mbsc-textfield-icon-" + iconEndPosition) +
                      (" mbsc-textfield-icon-" + inputType + "-" + iconEndPosition) +
                      (hasLabel ? " mbsc-textfield-icon-" + labelType : '');
          }
          // Native element classes
          this._nativeElmClass =
              commonClasses +
                  ' ' +
                  (s.inputClass || '') +
                  (" mbsc-textfield mbsc-textfield-" + inputType) +
                  (s.dropdown ? ' mbsc-select' : '') +
                  (hasLabel ? " mbsc-textfield-" + labelType + " mbsc-textfield-" + inputType + "-" + labelType : '') +
                  (isFloatingActive ? ' mbsc-textfield-floating-active' : '') +
                  (hasStartIcon
                      ? " mbsc-textfield-has-icon-" + iconStartPosition + " mbsc-textfield-" + inputType + "-has-icon-" + iconStartPosition +
                          (hasLabel ? " mbsc-textfield-" + inputType + "-" + labelType + "-has-icon-" + iconStartPosition : '')
                      : '') +
                  (hasEndIcon
                      ? " mbsc-textfield-has-icon-" + iconEndPosition + " mbsc-textfield-" + inputType + "-has-icon-" + iconEndPosition +
                          (hasLabel ? " mbsc-textfield-" + inputType + "-" + labelType + "-has-icon-" + iconEndPosition : '')
                      : '');
          // Select
          if (this._tag === 'select' || s.dropdown) {
              this._selectIconClass =
                  "mbsc-select-icon mbsc-select-icon-" + inputType +
                      this._rtl +
                      this._theme +
                      (hasLabel ? " mbsc-select-icon-" + labelType : '') +
                      (hasStartIcon ? " mbsc-select-icon-" + iconStartPosition : '') +
                      (hasEndIcon ? " mbsc-select-icon-" + iconEndPosition : '');
          }
          // Textarea
          if (this._tag === 'textarea' || s.tags) {
              this._cssClass += ' mbsc-textarea-wrapper';
              this._innerClass += ' mbsc-textarea-inner';
              this._nativeElmClass += ' mbsc-textarea';
              // Update the size of the textarea on certain setting changes
              if (this._tag === 'textarea' &&
                  (value !== this._prevValue ||
                      s.inputStyle !== prevS.inputStyle ||
                      s.labelStyle !== prevS.labelStyle ||
                      s.rows !== prevS.rows ||
                      s.theme !== prevS.theme)) {
                  this._shouldSize = true;
              }
              this._prevValue = value;
          }
          if (s.tags) {
              this._innerClass += ' mbsc-textfield-tags-inner';
          }
          if (s.type === 'file') {
              this._dummyElmClass = this._nativeElmClass;
              this._nativeElmClass += ' mbsc-textfield-file';
          }
          // Error message classes
          this._errorClass =
              this._theme +
                  this._rtl +
                  (" mbsc-error-message mbsc-error-message-" + inputType) +
                  (hasLabel ? " mbsc-error-message-" + labelType : '') +
                  (hasStartIcon ? " mbsc-error-message-has-icon-" + iconStartPosition : '') +
                  (hasEndIcon ? " mbsc-error-message-has-icon-" + iconEndPosition : '');
          if (s.notch && inputType === 'outline') {
              this._fieldSetClass =
                  'mbsc-textfield-fieldset' +
                      commonClasses +
                      (hasStartIcon ? " mbsc-textfield-fieldset-has-icon-" + iconStartPosition : '') +
                      (hasEndIcon ? " mbsc-textfield-fieldset-has-icon-" + iconEndPosition : '');
              this._legendClass =
                  'mbsc-textfield-legend' +
                      this._theme +
                      (isFloatingActive || (hasLabel && labelType === 'stacked') ? ' mbsc-textfield-legend-active' : '');
          }
          if (s.ripple && s.inputStyle !== 'outline') {
              this._rippleClass =
                  'mbsc-textfield-ripple' + this._theme + (hasError ? ' mbsc-error' : '') + (state.hasFocus ? ' mbsc-textfield-ripple-active' : '');
          }
          if (this._valueChecked) {
              this._animateFloating = true;
          }
      };
      InputBase.prototype._updated = function () {
          var _this = this;
          // Update the size of the textarea on certain setting changes
          if (this._shouldSize) {
              this._shouldSize = false;
              ngSetTimeout(this, function () {
                  _this._sizeTextArea();
              });
          }
          this._checkFloating();
      };
      InputBase.prototype._destroy = function () {
          unlisten(this._el, ANIMATION_START, this._onAutoFill);
          unlisten(this._el, INPUT, this._sizeTextArea);
          if (this._unsubscribe) {
              unsubscribeResize(this._unsubscribe);
          }
          if (this._unlisten) {
              this._unlisten();
          }
      };
      // tslint:disable variable-name
      InputBase.defaults = {
          dropdown: false,
          dropdownIcon: arrowDown,
          hideIcon: 'eye-blocked',
          inputStyle: 'underline',
          labelStyle: 'stacked',
          placeholder: '',
          ripple: false,
          rows: 6,
          showIcon: 'eye',
          type: 'text',
      };
      InputBase._name = 'Input';
      return InputBase;
  }(BaseComponent));

  function template$b(s, state, inst, content) {
      var _a;
      var _b = inst.props; _b.children; var dropdown = _b.dropdown; _b.dropdownIcon; _b.endIcon; _b.endIconSrc; _b.endIconSvg; _b.error; var errorMessage = _b.errorMessage, hasChildren = _b.hasChildren; _b.hideIcon; _b.hideIconSvg; _b.inputClass; _b.inputStyle; _b.label; _b.labelStyle; _b.modelValue; _b.notch; _b.passwordToggle; _b.pickerMap; _b.pickerValue; _b.ripple; _b.rows; _b.rtl; _b.showIcon; _b.showIconSvg; _b.startIcon; _b.startIconSrc; _b.startIconSvg; var tags = _b.tags; _b.theme; _b.themeVariant; var type = _b.type, other = __rest(_b, ["children", "dropdown", "dropdownIcon", "endIcon", "endIconSrc", "endIconSvg", "error", "errorMessage", "hasChildren", "hideIcon", "hideIconSvg", "inputClass", "inputStyle", "label", "labelStyle", "modelValue", "notch", "passwordToggle", "pickerMap", "pickerValue", "ripple", "rows", "rtl", "showIcon", "showIconSvg", "startIcon", "startIconSrc", "startIconSvg", "tags", "theme", "themeVariant", "type"]);
      // Need to use props here, otherwise all inherited settings will be included in ...other,
      // which will end up on the native element, resulting in invalid DOM
      var lbl = s.label;
      var mousedown = (_a = {}, _a[ON_MOUSE_DOWN] = inst._onMouseDown, _a);
      return (createElement("label", __assign({ className: inst._cssClass }, mousedown),
          (lbl || hasChildren) && createElement("span", { className: inst._labelClass }, hasChildren ? '' : lbl),
          createElement("span", { className: inst._innerClass },
              inst._tag === 'input' && (createElement("input", __assign({}, other, { ref: inst._setEl, className: inst._nativeElmClass + (s.tags ? ' mbsc-textfield-hidden' : ''), disabled: inst._disabled, type: s.passwordToggle ? (inst._hidePass ? 'password' : 'text') : type }))),
              type === 'file' && (createElement("input", { className: inst._dummyElmClass, disabled: inst._disabled, placeholder: s.placeholder, readOnly: true, type: "text", value: state.files || '' })),
              inst._tag === 'select' && (createElement("select", __assign({}, other, { ref: inst._setEl, className: 'mbsc-select' + inst._nativeElmClass, disabled: inst._disabled }), content)),
              inst._tag === 'textarea' && createElement("textarea", __assign({}, other, { ref: inst._setEl, className: inst._nativeElmClass, disabled: inst._disabled })),
              tags && (createElement("span", { className: 'mbsc-textfield-tags' + inst._nativeElmClass }, inst._tagsArray.length ? (inst._tagsArray.map(function (v, i) {
                  return (v && (createElement("span", { key: i, className: 'mbsc-textfield-tag' + inst._theme + inst._rtl },
                      createElement("span", { className: 'mbsc-textfield-tag-text' + inst._theme }, v),
                      createElement(Icon, { className: "mbsc-textfield-tag-clear", 
                          // tslint:disable-next-line: jsx-no-lambda
                          onClick: function (ev) { return inst._onTagClear(ev, i); }, svg: s.clearIcon, theme: s.theme }))));
              })) : (createElement("span", { className: 'mbsc-textfield-tags-placeholder' + inst._theme }, s.placeholder)))),
              (inst._tag === 'select' || dropdown) && createElement(Icon, { className: inst._selectIconClass, svg: s.dropdownIcon, theme: s.theme }),
              inst._hasStartIcon && createElement(Icon, { className: inst._startIconClass, name: s.startIcon, svg: s.startIconSvg, theme: s.theme }),
              inst._hasEndIcon && !s.passwordToggle && (createElement(Icon, { className: inst._endIconClass, name: s.endIcon, svg: s.endIconSvg, theme: s.theme })),
              s.passwordToggle && (createElement(Icon, { onClick: inst._onClick, className: inst._passIconClass, name: inst._hidePass ? s.showIcon : s.hideIcon, svg: inst._hidePass ? s.showIconSvg : s.hideIconSvg, theme: s.theme })),
              inst._hasError && createElement("span", { className: inst._errorClass }, errorMessage),
              s.notch && s.inputStyle === 'outline' && (createElement("fieldset", { "aria-hidden": "true", className: inst._fieldSetClass },
                  createElement("legend", { className: inst._legendClass }, lbl && s.labelStyle !== 'inline' ? lbl : '&nbsp;'))),
              s.ripple && s.inputStyle !== 'outline' && createElement("span", { className: inst._rippleClass }))));
  }
  var Input = /*#__PURE__*/ (function (_super) {
      __extends(Input, _super);
      function Input() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(Input.prototype, "value", {
          get: function () {
              return this._el && this._el.value;
          },
          set: function (value) {
              this._el.value = value;
              this._checkFloating();
              if (this._tag === 'textarea') {
                  this._sizeTextArea();
              }
          },
          enumerable: true,
          configurable: true
      });
      Input.prototype._template = function (s, state) {
          return template$b(s, state, this, s.children);
      };
      return Input;
  }(InputBase));

  var inputRenderOptions = {
      hasChildren: true,
      parentClass: 'mbsc-label',
      readAttrs: ['placeholder', 'rows'],
      readProps: ['disabled', 'type'],
      renderToParent: true,
      slots: {
          endIcon: 'end-icon',
          label: 'label',
          startIcon: 'start-icon',
      },
      before: function (elm, options, children) {
          // Wrap input element (for proper merge)
          var parent = elm.parentNode;
          var wrap = doc.createElement('span');
          parent.insertBefore(wrap, elm);
          wrap.appendChild(elm);
          options.inputClass = elm.getAttribute('class') || '';
          // In case of the select the children are the options, NOT the label
          if (elm.nodeName === 'SELECT') {
              delete options.hasChildren;
          }
          // The first child will be the label element
          if (!options.label && options.hasChildren) {
              options.label = children[0].textContent;
          }
          // Create placeholder for label
          if (options.label) {
              var label = doc.createElement('span');
              parent.insertBefore(label, wrap);
          }
      },
  };
  __assign({}, inputRenderOptions, { hasValue: true, parentClass: 'mbsc-select', useOwnChildren: true });
  __assign({}, inputRenderOptions, { hasValue: true });

  function pickerTemplate(inst, s, content) {
      var comp = s.inputComponent;
      var props = __assign({ defaultValue: (inst._value && inst._valueText) || '', placeholder: s.placeholder, ref: inst._setInput }, s.inputProps);
      if (!s.inputComponent) {
          comp = Input;
          props = __assign({ 'aria-expanded': !!inst._isOpen, 'aria-haspopup': 'dialog', disabled: s.disabled, dropdown: s.dropdown, endIcon: s.endIcon, endIconSrc: s.endIconSrc, endIconSvg: s.endIconSvg, error: s.error, errorMessage: s.errorMessage, inputStyle: s.inputStyle, label: s.label, labelStyle: s.labelStyle, name: s.name, pickerMap: s.valueMap, pickerValue: inst._value, placeholder: s.placeholder, rtl: s.rtl, startIcon: s.startIcon, startIconSrc: s.startIconSrc, startIconSvg: s.startIconSvg, tags: s.tagInput === UNDEFINED ? s.selectMultiple : s.tagInput, theme: s.theme, themeVariant: s.themeVariant }, props);
      }
      var input = createElement(comp, props);
      return (createElement(Fragment, null,
          inst._showInput && input,
          createElement(Popup, { activeElm: s.activeElm, anchor: inst._anchor, anchorAlign: inst._anchorAlign, animation: s.animation, buttons: inst._buttons, cancelText: s.cancelText, closeOnEsc: s.closeOnEsc, closeOnOverlayClick: s.closeOnOverlayClick, closeOnScroll: s.closeOnScroll, closeText: s.closeText, contentPadding: false, context: s.context, cssClass: inst._cssClass, disableLeftRight: true, display: s.display, focusElm: inst._focusElm, focusOnClose: s.focusOnClose, focusOnOpen: !inst._allowTyping, focusTrap: s.focusTrap, fullScreen: s.fullScreen, headerText: inst._headerText, height: s.height, isOpen: inst._isOpen, maxHeight: s.maxHeight, maxWidth: inst._maxWidth, onClose: inst._onPopupClose, onClosed: inst._onPopupClosed, onKeyDown: inst._onPopupKey, onOpen: inst._onPopupOpen, onResize: inst._onResize, setText: s.setText, showArrow: s.showArrow, showOverlay: inst._allowTyping ? false : s.showOverlay, ref: inst._setPopup, rtl: s.rtl, scrollLock: inst._scrollLock, theme: s.theme, themeVariant: s.themeVariant, touchUi: inst._touchUi, windowWidth: inst.state.width, width: s.width }, content)));
  }

  function template$c(s, inst) {
      var preContent = s.renderPreContent ? s.renderPreContent(s.preContentData) : '';
      var inContent = s.renderInContent ? s.renderInContent(s.preContentData) : '';
      return (createElement(Fragment, null,
          preContent,
          createElement("div", { className: 'mbsc-scroller mbsc-scroller-' +
                  inst._displayStyle +
                  inst._theme +
                  inst._rtl +
                  (inst._touchUi ? ' mbsc-scroller-touch' : ' mbsc-scroller-pointer') +
                  (s.display === 'inline' ? ' mbsc-font ' : ' ') +
                  inst._className },
              inContent,
              inst._wheels.map(function (wheelGroup, i) {
                  return (createElement("div", { key: i, className: 'mbsc-scroller-wheel-group-cont' + (s.scroll3d ? ' mbsc-scroller-wheel-group-cont-3d' : '') + inst._theme },
                      s.selectOnScroll && createElement("div", { className: 'mbsc-scroller-wheel-line' + inst._theme, style: inst._lineStyle }),
                      createElement("div", { className: 'mbsc-flex mbsc-scroller-wheel-group' + (s.scroll3d ? ' mbsc-scroller-wheel-group-3d' : '') + inst._theme },
                          createElement("div", { className: 'mbsc-scroller-wheel-overlay mbsc-scroller-wheel-overlay-' + inst._displayStyle + inst._theme, style: inst._overlayStyle }),
                          wheelGroup.map(function (wheel, j) { return (createElement(Wheel, { activeIndex: inst._activeIndexes[wheel._key], disabled: inst._disabled && inst._disabled[wheel._key], display: inst._displayStyle, key: j, itemHeight: s.itemHeight, onActiveChange: inst._onActiveChange, onIndexChange: inst._onWheelIndexChange, onSet: inst._onSet, maxIndex: wheel.max, maxWheelWidth: s.maxWheelWidth, minIndex: wheel.min, minWheelWidth: s.minWheelWidth, multiple: wheel.multiple, renderItem: s.renderItem, rows: inst._rows, scroll3d: inst._scroll3d, selectedIndex: inst._indexes[wheel._key], selectedValues: inst._tempValueRep[wheel._key], selectOnScroll: s.selectOnScroll, theme: s.theme, touchUi: s.touchUi, rtl: s.rtl, wheel: wheel, wheelWidth: s.wheelWidth })); }))));
              }))));
  }
  /**
   * The Scroller component.
   *
   * Usage:
   *
   * ```
   * <Scroller />
   * ```
   */
  var Scroller = /*#__PURE__*/ (function (_super) {
      __extends(Scroller, _super);
      function Scroller() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Scroller.prototype._template = function (s) {
          return pickerTemplate(this, s, template$c(s, this));
      };
      return Scroller;
  }(ScrollerBase));

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  var WHEEL_WIDTHS = {
      ios: 50,
      material: 46,
      windows: 50,
  };
  var TIME_PARTS = ['a', 'h', 'i', 's', 'tt'];
  function validateTimes(s, hasAmPm, i, valid, wheelOrder, getDatePart, maxs, steps, key, disabled, order, validDate, startDate, endDate, isValid, exclusiveEndDates) {
      // Notes:
      // 1. in case of invalid rules that are limited to a single day (start and end is on same day)
      // we take the start and end of the rule
      // 2. in case of invalid rules that span across multple days, we need to take the start of the day
      // or end of the day depending on the current date we are validating ("validated")
      // if we are validating the "end of the rule" (the last date of the rule) - invalids will start at
      // the beginning of the day (bc invalids are coming from prev. day), and span until the end of the rule
      // if we are validating the "start of the rule" (the first date of the rule) - invalids will start at
      // the rule start and will span until the end of the day (bc. the rule spans to the next day...)
      var sameDayInvalid = isSameDay(startDate, endDate);
      var start = sameDayInvalid || !isSameDay(validDate, endDate) ? startDate : getDayStart(s, startDate);
      var end = sameDayInvalid || !isSameDay(validDate, startDate) ? endDate : getDayEnd(s, endDate);
      var startAmPm = getDatePart.a(start);
      var endAmPm = getDatePart.a(end);
      var startProp = true;
      var endProp = true;
      var all = false;
      var add = 0;
      var remove = 0;
      // Look behind to check if the invalid propagates down to the current wheel
      for (var j = 0; j < i; j++) {
          var k = TIME_PARTS[j];
          var validVal = valid[wheelOrder[k]];
          if (validVal !== UNDEFINED) {
              var startVal = startProp ? getDatePart[k](start) : 0;
              var endVal = endProp ? getDatePart[k](end) : maxs[k];
              if (hasAmPm && j === 1) {
                  // Adjust hours
                  startVal += startAmPm ? 12 : 0;
                  endVal += endAmPm ? 12 : 0;
                  validVal += valid[wheelOrder.a] ? 12 : 0;
              }
              if ((startProp || endProp) && startVal < validVal && validVal < endVal) {
                  all = true;
              }
              if (validVal !== startVal) {
                  startProp = false;
              }
              if (validVal !== endVal) {
                  endProp = false;
              }
          }
      }
      if (!isValid) {
          // Look ahead to see if there are any possible values on lower wheels,
          // if yes, don't disable the start and/or end value of the range.
          for (var j = i + 1; j < 4; j++) {
              var k = TIME_PARTS[j];
              if (wheelOrder[k] !== UNDEFINED) {
                  if (getDatePart[k](start) > 0 && startProp) {
                      add = steps[key];
                  }
                  if (getDatePart[k](end) < maxs[k] && endProp) {
                      remove = steps[key];
                  }
              }
          }
          if (endProp && exclusiveEndDates && !remove) {
              remove = end.getMilliseconds() !== 999 ? steps[key] : 0;
          }
      }
      // Set disabled values
      if (startProp || endProp || all) {
          var startVal = startProp && !all ? getDatePart[key](start) + add : 0;
          var endVal = endProp && !all ? getDatePart[key](end) - remove : maxs[key];
          for (var j = startVal; j <= endVal; j += steps[key]) {
              disabled[order].set(j, !isValid);
          }
      }
  }
  function getDateIndex(d, hasDay) {
      var dt = new Date(d);
      return hasDay
          ? // Number of days since 1970-01-01
              floor(+dt / 8.64e7)
          : // Number of month since 1970-01-01
              dt.getMonth() + 12 * (dt.getFullYear() - 1970);
  }
  function getFullDate(d) {
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function getMilliseconds(d) {
      return d.getMilliseconds();
  }
  function getAmPm(d) {
      return d.getHours() > 11 ? 1 : 0;
  }
  /**
   * @hidden
   */
  var DatetimeBase = /*#__PURE__*/ (function (_super) {
      __extends(DatetimeBase, _super);
      function DatetimeBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._preset = 'date';
          _this._innerValues = {};
          _this._onChange = function (args) {
              if (_this.s.value === UNDEFINED) {
                  _this.setState({ value: args.value });
              }
              _this._hook('onChange', args);
          };
          _this._parseDate = function (value) {
              var s = _this.s;
              if (!value) {
                  _this._innerValues = {};
              }
              return _this._getArray(makeDate(value || s.defaultSelection || new Date(), s, _this._format), !!value);
          };
          _this._formatDate = function (values) {
              var d = _this._getDate(values);
              return d ? formatDate(_this._format, d, _this.s) : '';
          };
          _this._getDate = function (values) {
              var s = _this.s;
              var getArrayPart = _this._getArrayPart;
              var wheelOrder = _this._wheelOrder;
              var today = new Date(new Date().setHours(0, 0, 0, 0));
              var d;
              var t;
              if (values === null || values === UNDEFINED) {
                  return null;
              }
              if (wheelOrder.dd !== UNDEFINED) {
                  var parts = values[wheelOrder.dd].split('-');
                  d = new Date(parts[0], parts[1] - 1, parts[2]);
              }
              if (wheelOrder.tt !== UNDEFINED) {
                  t = d || today;
                  t = new Date(t.getTime() + (values[wheelOrder.tt] % 86400) * 1000);
              }
              var year = getArrayPart(values, 'y', d, today);
              var month = getArrayPart(values, 'm', d, today);
              var day = Math.min(getArrayPart(values, 'd', d, today), s.getMaxDayOfMonth(year, month));
              var hour = getArrayPart(values, 'h', t, today);
              return s.getDate(year, month, day, _this._hasAmPm && getArrayPart(values, 'a', t, today) ? hour + 12 : hour, getArrayPart(values, 'i', t, today), getArrayPart(values, 's', t, today), getArrayPart(values, 'u', t, today));
          };
          _this._validate = function (_a) {
              var direction = _a.direction, index = _a.index, values = _a.values, wheels = _a.wheels;
              var disabled = [];
              var s = _this.s;
              var stepHour = s.stepHour;
              var stepMinute = s.stepMinute;
              var stepSecond = s.stepSecond;
              var preset = s.mode || _this._preset;
              var wheelOrder = _this._wheelOrder;
              var getDatePart = _this._getDatePart;
              var maxDate = _this._max;
              var minDate = _this._min;
              var current = addTimezone(s, _this._getDate(values));
              var currYear = s.getYear(current);
              var currMonth = s.getMonth(current);
              var from = s.getDate(currYear, currMonth - 1, 1);
              var until = s.getDate(currYear, currMonth + 2, 1);
              // Map the valids and invalids for prev and next months
              if (index === wheelOrder.y || index === wheelOrder.m || index === wheelOrder.d || index === wheelOrder.dd || index === UNDEFINED) {
                  _this._valids = getEventMap(s.valid, from, until, s, true);
                  _this._invalids = getEventMap(s.invalid, from, until, s, true);
              }
              var valids = _this._valids;
              var invalids = _this._invalids;
              // Normalize min and max dates for comparing later (set default values where there are no values from wheels)
              // const mind = this._min ? +this._getDate(this._getArray(this._min))! : -Infinity;
              // const maxd = this._max ? +this._getDate(this._getArray(this._max))! : Infinity;
              var mind = minDate ? +minDate : -Infinity;
              var maxd = maxDate ? +maxDate : Infinity;
              // Get the closest valid dates
              var validated = getClosestValidDate(current, s, mind, maxd, invalids, valids, direction);
              var valid = _this._getArray(validated);
              var dayWheel = _this._wheels && _this._wheels[0][wheelOrder.d];
              var y = getDatePart.y(validated);
              var m = getDatePart.m(validated);
              var maxDays = s.getMaxDayOfMonth(y, m);
              // tslint:disable object-literal-sort-keys
              var mins = {
                  y: minDate ? minDate.getFullYear() : -Infinity,
                  m: 0,
                  d: 1,
                  h: 0,
                  i: 0,
                  s: 0,
                  a: 0,
                  tt: 0,
              };
              var maxs = {
                  y: maxDate ? maxDate.getFullYear() : Infinity,
                  m: 11,
                  d: 31,
                  h: step(_this._hasAmPm ? 11 : 23, stepHour),
                  i: step(59, stepMinute),
                  s: step(59, stepSecond),
                  a: 1,
                  tt: 86400,
              };
              var steps = {
                  y: 1,
                  m: 1,
                  d: 1,
                  h: stepHour,
                  i: stepMinute,
                  s: stepSecond,
                  a: 1,
                  tt: _this._timeStep,
              };
              // tslint:enable object-literal-sort-keys
              var init = false;
              var minprop = true;
              var maxprop = true;
              ['dd', 'y', 'm', 'd', 'tt', 'a', 'h', 'i', 's'].forEach(function (key) {
                  var min = mins[key];
                  var max = maxs[key];
                  var val = getDatePart[key](validated);
                  var order = wheelOrder[key];
                  if (minprop && minDate) {
                      min = getDatePart[key](minDate);
                  }
                  if (maxprop && maxDate) {
                      max = getDatePart[key](maxDate);
                  }
                  if (val < min) {
                      val = min;
                  }
                  if (val > max) {
                      val = max;
                  }
                  // Skip full date, full time, and am/pm wheel (if not present)
                  if (key !== 'dd' && key !== 'tt' && !(key === 'a' && order === UNDEFINED)) {
                      if (minprop) {
                          minprop = val === min;
                      }
                      if (maxprop) {
                          maxprop = val === max;
                      }
                  }
                  if (order !== UNDEFINED) {
                      disabled[order] = new Map();
                      if (key !== 'y' && key !== 'dd') {
                          for (var i = mins[key]; i <= maxs[key]; i += steps[key]) {
                              if (i < min || i > max) {
                                  disabled[order].set(i, true);
                              }
                          }
                      }
                      // Validate dates
                      if (key === 'd' && invalids) {
                          for (var d in invalids) {
                              if (!valids || !valids[d]) {
                                  var dd = new Date(d); // d is a string here
                                  var yy = s.getYear(dd);
                                  var mm = s.getMonth(dd);
                                  // If invalid is in the currently displayed month, let's add it
                                  if (yy === y && mm === m && isInvalid(s, dd, invalids, valids)) {
                                      disabled[order].set(s.getDay(dd), true);
                                  }
                              }
                          }
                      }
                  }
              });
              // Validate times
              if (/time/i.test(preset)) {
                  // TODO: merge overlapping invalids
                  var invalidsForDay_1 = invalids && invalids[getDateStr(validated)];
                  var validsForDay_1 = valids && valids[getDateStr(validated)];
                  TIME_PARTS.forEach(function (key, i) {
                      var order = wheelOrder[key];
                      if (order !== UNDEFINED) {
                          var entries = s.valid ? validsForDay_1 : invalidsForDay_1;
                          if (entries) {
                              if (s.valid) {
                                  // Set everything to invalid
                                  for (var j = 0; j <= maxs[key]; j++) {
                                      disabled[order].set(j, true);
                                  }
                              }
                              for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                                  var entry = entries_1[_i];
                                  var start = entry.start;
                                  var end = entry.end;
                                  if (start && end) {
                                      validateTimes(s, _this._hasAmPm, i, valid, wheelOrder, getDatePart, maxs, steps, key, disabled, order, validated, start, end, !!s.valid, s.exclusiveEndDates);
                                  }
                              }
                          }
                          // Get valid wheel value
                          valid[order] = getValid(wheels[order], getDatePart[key](validated), disabled[order], direction);
                      }
                  });
              }
              // Regenerate day wheel if number of days in month changes
              // or if day names needs to be regenerated
              var dateDisplay = _this._dateDisplay;
              if (dayWheel && (dayWheel.data.length !== maxDays || /DDD/.test(dateDisplay))) {
                  var data = [];
                  var dayDisplay = dateDisplay
                      .replace(/[my|]/gi, '')
                      .replace(/DDDD/, '{dddd}')
                      .replace(/DDD/, '{ddd}')
                      .replace(/DD/, '{dd}')
                      .replace(/D/, '{d}');
                  for (var j = 1; j <= maxDays; j++) {
                      var weekDay = s.getDate(y, m, j).getDay();
                      var dayStr = dayDisplay
                          .replace(/{dddd}/, s.dayNames[weekDay])
                          .replace(/{ddd}/, s.dayNamesShort[weekDay])
                          .replace(/{dd}/, pad(j) + s.daySuffix)
                          .replace(/{d}/, j + s.daySuffix);
                      data.push({
                          display: dayStr,
                          value: j,
                      });
                  }
                  dayWheel.data = data;
                  // Will trigger wheel re-render
                  // this._wheels[0][wheelOrder.d] = { ...dayWheel };
                  // Will trigger wheel re-init in scroller validation
                  init = true;
              }
              return { disabled: disabled, init: init, valid: valid };
          };
          // public _shouldValidate = (s: MbscDatetimeOptions, prevS: MbscDatetimeOptions) => {
          // We're using any types here, since min/max are datetime options, and wheels are scroller options
          // This is a temporary solution, the wheels should be checked by the scroller
          _this._shouldValidate = function (s, prevS) {
              return (!!((s.min && +s.min !== +prevS.min) || (s.max && +s.max !== +prevS.max)) ||
                  s.wheels !== prevS.wheels ||
                  s.dataTimezone !== prevS.dataTimezone ||
                  s.displayTimezone !== prevS.displayTimezone);
          };
          _this._setScroller = function (scroller) {
              _this._scroller = scroller;
          };
          // tslint:disable variable-name
          _this._getYearValue = function (i) {
              return {
                  display: (/yy/i.test(_this._dateDisplay) ? i : (i + '').substr(2, 2)) + _this.s.yearSuffix,
                  value: i,
              };
          };
          _this._getYearIndex = function (i) {
              return +i;
          };
          _this._getDateIndex = function (i) {
              return getDateIndex(i, _this._hasDay);
          };
          _this._getDateItem = function (i) {
              var s = _this.s;
              var hasDay = _this._hasDay;
              var today = new Date(new Date().setHours(0, 0, 0, 0));
              var d = hasDay ? new Date(i * 8.64e7) : new Date(1970, i, 1);
              if (hasDay) {
                  d = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
              }
              return {
                  disabled: hasDay && isInvalid(s, d, _this._invalids, _this._valids),
                  display: today.getTime() === d.getTime() ? s.todayText : formatDate(_this._dateTemplate, d, s),
                  value: getFullDate(d),
              };
          };
          // tslint:disable-next-line: variable-name
          _this._getArrayPart = function (values, part, d, def) {
              var ret;
              if (_this._wheelOrder[part] !== UNDEFINED) {
                  ret = +values[_this._wheelOrder[part]];
                  if (!isNaN(ret)) {
                      return ret;
                  }
              }
              if (d) {
                  return _this._getDatePart[part](d);
              }
              if (_this._innerValues[part] !== UNDEFINED) {
                  return _this._innerValues[part];
              }
              return _this._getDatePart[part](def);
          };
          // tslint:disable-next-line: variable-name
          _this._getHours = function (d) {
              var hour = d.getHours();
              hour = _this._hasAmPm && hour >= 12 ? hour - 12 : hour;
              // TODO: check if min/max needed here
              // return step(hour, this.s.stepHour, minHour, maxHour);
              return step(hour, _this.s.stepHour);
          };
          // tslint:disable-next-line: variable-name
          _this._getMinutes = function (d) {
              // TODO: check if min/max needed here
              // return step(d.getMinutes(), this.s.stepMinute, minMinute, maxMinute);
              return step(d.getMinutes(), _this.s.stepMinute);
          };
          // tslint:disable-next-line: variable-name
          _this._getSeconds = function (d) {
              // TODO: check if min/max needed here
              // return step(d.getSeconds(), this.s.stepSecond, minSecond, maxSecond);
              return step(d.getSeconds(), _this.s.stepSecond);
          };
          // tslint:disable-next-line: variable-name
          _this._getFullTime = function (d) {
              // TODO: check if min/max needed here
              // return step(Math.round((d.getTime() - new Date(d).setHours(0, 0, 0, 0)) / 1000), this._timeStep || 1, 0, 86400);
              return step(round((d.getTime() - new Date(d).setHours(0, 0, 0, 0)) / 1000), _this._timeStep || 1);
          };
          return _this;
      }
      DatetimeBase.prototype.getVal = function () {
          return this._value;
      };
      DatetimeBase.prototype.setVal = function (value) {
          this._value = value;
          this.setState({ value: value });
      };
      DatetimeBase.prototype.position = function () {
          if (this._scroller) {
              this._scroller.position();
          }
      };
      DatetimeBase.prototype.isVisible = function () {
          return this._scroller && this._scroller.isVisible();
      };
      DatetimeBase.prototype._valueEquals = function (v1, v2) {
          return dateValueEquals(v1, v2, this.s);
      };
      // tslint:enable variable-name
      DatetimeBase.prototype._render = function (s, state) {
          var genWheels = false;
          var prevProps = this._prevS;
          var dateFormat = s.dateFormat;
          var timeFormat = s.timeFormat;
          var preset = s.mode || this._preset;
          var format = preset === 'datetime' ? dateFormat + s.separator + timeFormat : preset === 'time' ? timeFormat : dateFormat;
          this._value = s.value === UNDEFINED ? state.value : s.value;
          this._minWheelWidth = s.minWheelWidth || (preset === 'datetime' ? WHEEL_WIDTHS[s.baseTheme || s.theme] : UNDEFINED);
          this._dateWheels = s.dateWheels || (preset === 'datetime' ? s.dateWheelFormat : dateFormat);
          this._dateDisplay = s.dateWheels || s.dateDisplay;
          this._timeWheels = s.timeWheels || timeFormat;
          this._timeDisplay = this._timeWheels;
          this._format = format;
          this._hasAmPm = /h/.test(this._timeDisplay);
          // tslint:disable: object-literal-sort-keys
          this._getDatePart = {
              y: s.getYear,
              m: s.getMonth,
              d: s.getDay,
              h: this._getHours,
              i: this._getMinutes,
              s: this._getSeconds,
              u: getMilliseconds,
              a: getAmPm,
              dd: getFullDate,
              tt: this._getFullTime,
          };
          // tslint:enable: object-literal-sort-keys
          if (+makeDate(prevProps.min) !== +makeDate(s.min)) {
              genWheels = true;
              this._min = isEmpty(s.min) ? UNDEFINED : makeDate(s.min, s, format);
          }
          if (+makeDate(prevProps.max) !== +makeDate(s.max)) {
              genWheels = true;
              this._max = isEmpty(s.max) ? UNDEFINED : makeDate(s.max, s, format);
          }
          if (s.theme !== prevProps.theme ||
              s.mode !== prevProps.mode ||
              s.locale !== prevProps.locale ||
              s.dateWheels !== prevProps.dateWheels ||
              s.timeWheels !== prevProps.timeWheels ||
              genWheels) {
              this._wheels = this._getWheels();
          }
      };
      // tslint:enable variable-name
      DatetimeBase.prototype._getWheels = function () {
          this._wheelOrder = {};
          var s = this.s;
          var preset = s.mode || this._preset;
          var hasAmPm = this._hasAmPm;
          var dateDisplay = this._dateDisplay;
          var timeDisplay = this._timeDisplay;
          var wheelOrder = this._wheelOrder;
          var wheels = [];
          var dateGroup = [];
          var values;
          var timeGroup = [];
          var nr = 0;
          if (/date/i.test(preset)) {
              var dateParts = this._dateWheels.split(/\|/.test(this._dateWheels) ? '|' : '');
              for (var _i = 0, dateParts_1 = dateParts; _i < dateParts_1.length; _i++) {
                  var template = dateParts_1[_i];
                  var types = 0;
                  if (template.length) {
                      // If contains different characters
                      if (/y/i.test(template)) {
                          types++;
                      }
                      if (/m/i.test(template)) {
                          types++;
                      }
                      if (/d/i.test(template)) {
                          types++;
                      }
                      if (types > 1 && wheelOrder.dd === UNDEFINED) {
                          wheelOrder.dd = nr;
                          nr++;
                          dateGroup.push(this._getDateWheel(template));
                          timeGroup = dateGroup; // TODO ???
                          // oneDateWheel = true;
                      }
                      else if (/y/i.test(template) && wheelOrder.y === UNDEFINED) {
                          wheelOrder.y = nr;
                          nr++;
                          // Year wheel
                          dateGroup.push({
                              cssClass: 'mbsc-datetime-year-wheel',
                              getIndex: this._getYearIndex,
                              getItem: this._getYearValue,
                              max: this._max ? s.getYear(this._max) : UNDEFINED,
                              min: this._min ? s.getYear(this._min) : UNDEFINED,
                              spaceAround: true,
                          });
                      }
                      else if (/m/i.test(template) && wheelOrder.m === UNDEFINED) {
                          // Month wheel
                          wheelOrder.m = nr;
                          values = [];
                          nr++;
                          var monthDisplay = dateDisplay
                              .replace(/[dy|]/gi, '')
                              .replace(/MMMM/, '{mmmm}')
                              .replace(/MMM/, '{mmm}')
                              .replace(/MM/, '{mm}')
                              .replace(/M/, '{m}');
                          for (var j = 0; j < 12; j++) {
                              var monthStr = monthDisplay
                                  .replace(/{mmmm}/, s.monthNames[j])
                                  .replace(/{mmm}/, s.monthNamesShort[j])
                                  .replace(/{mm}/, pad(j + 1) + (s.monthSuffix || ''))
                                  .replace(/{m}/, j + 1 + (s.monthSuffix || ''));
                              values.push({
                                  display: monthStr,
                                  value: j,
                              });
                          }
                          dateGroup.push({
                              cssClass: 'mbsc-datetime-month-wheel',
                              data: values,
                              spaceAround: true,
                          });
                      }
                      else if (/d/i.test(template) && wheelOrder.d === UNDEFINED) {
                          // Day wheel
                          wheelOrder.d = nr;
                          values = [];
                          nr++;
                          for (var j = 1; j < 32; j++) {
                              values.push({
                                  display: (/dd/i.test(dateDisplay) ? pad(j) : j) + s.daySuffix,
                                  value: j,
                              });
                          }
                          dateGroup.push({
                              cssClass: 'mbsc-datetime-day-wheel',
                              data: values,
                              spaceAround: true,
                          });
                      }
                  }
              }
              wheels.push(dateGroup);
          }
          if (/time/i.test(preset)) {
              var timeParts = this._timeWheels.split(/\|/.test(this._timeWheels) ? '|' : '');
              for (var _a = 0, timeParts_1 = timeParts; _a < timeParts_1.length; _a++) {
                  var template = timeParts_1[_a];
                  var types = 0;
                  if (template.length) {
                      // If contains different characters
                      if (/h/i.test(template)) {
                          types++;
                      }
                      if (/m/i.test(template)) {
                          types++;
                      }
                      if (/s/i.test(template)) {
                          types++;
                      }
                      if (/a/i.test(template)) {
                          types++;
                      }
                  }
                  if (types > 1 && wheelOrder.tt === UNDEFINED) {
                      wheelOrder.tt = nr;
                      nr++;
                      timeGroup.push(this._getTimeWheel(template));
                  }
                  else if (/h/i.test(template) && wheelOrder.h === UNDEFINED) {
                      // Hours wheel
                      values = [];
                      wheelOrder.h = nr;
                      nr++;
                      for (var j = 0; j < (hasAmPm ? 12 : 24); j += s.stepHour) {
                          values.push({
                              display: hasAmPm && j === 0 ? 12 : /hh/i.test(timeDisplay) ? pad(j) : j,
                              value: j,
                          });
                      }
                      timeGroup.push({
                          cssClass: 'mbsc-datetime-hour-wheel',
                          data: values,
                          spaceAround: true,
                      });
                  }
                  else if (/m/i.test(template) && wheelOrder.i === UNDEFINED) {
                      // Minutes wheel
                      values = [];
                      wheelOrder.i = nr;
                      nr++;
                      for (var j = 0; j < 60; j += s.stepMinute) {
                          values.push({
                              display: /mm/i.test(timeDisplay) ? pad(j) : j,
                              value: j,
                          });
                      }
                      timeGroup.push({
                          cssClass: 'mbsc-datetime-minute-wheel',
                          data: values,
                          spaceAround: true,
                      });
                  }
                  else if (/s/i.test(template) && wheelOrder.s === UNDEFINED) {
                      // Seconds wheel
                      values = [];
                      wheelOrder.s = nr;
                      nr++;
                      for (var j = 0; j < 60; j += s.stepSecond) {
                          values.push({
                              display: /ss/i.test(timeDisplay) ? pad(j) : j,
                              value: j,
                          });
                      }
                      timeGroup.push({
                          cssClass: 'mbsc-datetime-second-wheel',
                          data: values,
                          spaceAround: true,
                      });
                  }
                  else if (/a/i.test(template) && wheelOrder.a === UNDEFINED) {
                      wheelOrder.a = nr;
                      nr++;
                      timeGroup.push({
                          cssClass: 'mbsc-dt-whl-a',
                          data: /A/.test(template)
                              ? [
                                  {
                                      display: s.amText.toUpperCase(),
                                      value: 0,
                                  },
                                  {
                                      display: s.pmText.toUpperCase(),
                                      value: 1,
                                  },
                              ]
                              : [
                                  {
                                      display: s.amText,
                                      value: 0,
                                  },
                                  {
                                      display: s.pmText,
                                      value: 1,
                                  },
                              ],
                          spaceAround: true,
                      });
                  }
              }
              if (timeGroup !== dateGroup) {
                  wheels.push(timeGroup);
              }
          }
          return wheels;
      };
      DatetimeBase.prototype._getDateWheel = function (template) {
          var hasDay = /d/i.test(template);
          this._hasDay = hasDay;
          this._dateTemplate = template;
          return {
              cssClass: 'mbsc-datetime-date-wheel',
              getIndex: this._getDateIndex,
              getItem: this._getDateItem,
              label: '',
              max: this._max ? getDateIndex(getFullDate(this._max), hasDay) : UNDEFINED,
              min: this._min ? getDateIndex(getFullDate(this._min), hasDay) : UNDEFINED,
              spaceAround: true,
          };
      };
      DatetimeBase.prototype._getTimeWheel = function (template) {
          var s = this.s;
          var values = [];
          var st = 1;
          if (/s/i.test(template)) {
              st = s.stepSecond;
          }
          else if (/m/i.test(template)) {
              st = s.stepMinute * 60;
          }
          else if (/h/i.test(template)) {
              st = s.stepHour * 3600;
          }
          // timeStep = steps.tt = step;
          this._timeStep = st;
          for (var i = 0; i < 86400; i += st) {
              var time = new Date(new Date().setHours(0, 0, 0, 0) + i * 1000);
              values.push({
                  display: formatDate(template, time, s),
                  value: i,
              });
          }
          return {
              // cssClass: 'mbsc-datetime-time-wheel',
              data: values,
              label: '',
              spaceAround: true,
          };
      };
      DatetimeBase.prototype._getArray = function (d, fillInner) {
          var parts = ['y', 'm', 'd', 'a', 'h', 'i', 's', 'u', 'dd', 'tt'];
          var ret = [];
          var wheelOrder = this._wheelOrder;
          if (d === null || d === UNDEFINED) {
              return ret;
          }
          for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
              var part = parts_1[_i];
              var v = this._getDatePart[part](d);
              if (wheelOrder[part] !== UNDEFINED) {
                  ret[wheelOrder[part]] = v;
              }
              if (fillInner) {
                  this._innerValues[part] = v;
              }
          }
          return ret;
      };
      /** @hidden */
      DatetimeBase.defaults = __assign({}, dateTimeLocale, { dateDisplay: 'MMMMDDYYYY', dateWheelFormat: '|DDD MMM D|', stepHour: 1, stepMinute: 1, stepSecond: 1 });
      // tslint:disable variable-name
      DatetimeBase._name = 'Datetime';
      return DatetimeBase;
  }(BaseComponent));

  function template$d(s, inst) {
      return (createElement(Scroller, { disabled: s.disabled, endIcon: s.endIcon, endIconSrc: s.endIconSrc, endIconSvg: s.endIconSvg, error: s.error, errorMessage: s.errorMessage, inputStyle: s.inputStyle, label: s.label, labelStyle: s.labelStyle, placeholder: s.placeholder, name: s.name, startIcon: s.startIcon, startIconSrc: s.startIconSrc, startIconSvg: s.startIconSvg, anchor: s.anchor, animation: s.animation, buttons: s.buttons, cancelText: s.cancelText, clearText: s.clearText, closeOnOverlayClick: s.closeOnOverlayClick, context: s.context, display: s.display, focusOnClose: s.focusOnClose, focusTrap: s.focusTrap, headerText: s.headerText, height: s.height, setText: s.setText, showArrow: s.showArrow, showOverlay: s.showOverlay, width: s.width, circular: s.circular, displayStyle: s.displayStyle, formatValue: inst._formatDate, getValue: inst._getDate, itemHeight: s.itemHeight, maxWheelWidth: s.maxWheelWidth, minWheelWidth: inst._minWheelWidth, parseValue: inst._parseDate, ref: inst._setScroller, rows: s.rows, rtl: s.rtl, shouldValidate: inst._shouldValidate, showOnClick: s.showOnClick, showOnFocus: s.showOnFocus, theme: s.theme, themeVariant: s.themeVariant, touchUi: inst._touchUi, validate: inst._validate, value: inst._value, valueEquality: inst._valueEquals, wheels: inst._wheels, wheelWidth: s.wheelWidth, onChange: inst._onChange }, s.children));
  }
  var Date$1 = /*#__PURE__*/ (function (_super) {
      __extends(Date, _super);
      function Date() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Date.prototype._template = function (s) {
          return template$d(s, this);
      };
      return Date;
  }(DatetimeBase));

  var Datetime = /*#__PURE__*/ (function (_super) {
      __extends(Datetime, _super);
      function Datetime() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          // tslint:disable-next-line: variable-name
          _this._preset = 'datetime';
          return _this;
      }
      return Datetime;
  }(Date$1));

  /** @jsxRuntime classic */
  var RadioContext = createContext({});

  var radios = {};
  function subscribeRadio(name, handler) {
      if (!radios[name]) {
          radios[name] = {
              change: new Observable(),
              selectedIndex: -1,
          };
      }
      return radios[name].change.subscribe(handler);
  }
  function unsubscribeRadio(name, key) {
      var data = radios[name];
      if (data) {
          data.change.unsubscribe(key);
          if (!data.change.nr) {
              delete radios[name];
          }
      }
  }
  function setRadio(name, value, selectedIndex) {
      var data = radios[name];
      if (data) {
          if (selectedIndex !== UNDEFINED) {
              data.selectedIndex = selectedIndex;
          }
          if (value !== UNDEFINED) {
              data.value = value;
          }
          data.change.next(data.value);
      }
  }
  function getSelectedIndex(name) {
      return radios[name] && radios[name].selectedIndex;
  }
  function setSelectedIndex(name, selectedIndex) {
      if (radios[name]) {
          radios[name].selectedIndex = selectedIndex;
      }
  }

  // tslint:disable no-non-null-assertion
  // tslint:disable no-inferrable-types
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  var guid$2 = 1;
  /** @hidden */
  var SegmentedGroupBase = /*#__PURE__*/ (function (_super) {
      __extends(SegmentedGroupBase, _super);
      function SegmentedGroupBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._id = 'mbsc-segmented-group' + guid$2++;
          _this._onChange = function (ev, val) {
              var s = _this.s;
              var value = _this.value;
              if (s.select === 'multiple') {
                  if (value !== UNDEFINED) {
                      value = value || [];
                      var index = value.indexOf(val);
                      if (index !== -1) {
                          value.splice(index, 1);
                      }
                      else {
                          value.push(val);
                      }
                      _this.value = value.slice();
                  }
              }
              else {
                  _this.value = val;
              }
              if (s.onChange) {
                  s.onChange(ev);
              }
          };
          return _this;
      }
      SegmentedGroupBase.prototype._setupDrag = function () {
          var _this = this;
          var disabledArray = [];
          var widthArray = [];
          var wrapperWidth;
          var wrapperLeft;
          var isDragging;
          var selectedIndex;
          var oldIndex;
          var name;
          this._unlisten = gestureListener(this._el, {
              onEnd: function () {
                  if (isDragging && selectedIndex !== oldIndex && !disabledArray[selectedIndex]) {
                      var inputElement = _this._el.querySelectorAll('.mbsc-segmented-input')[selectedIndex];
                      inputElement.click();
                  }
                  isDragging = false;
                  _this.setState({ dragging: false });
              },
              onMove: function (ev) {
                  // if (this.state.dragging && this.state.handleDrag && widthArray.length) {
                  if (isDragging) {
                      // mouse x constrained to the group left and right side
                      var relativeLeft = Math.min(Math.max(ev.endX - wrapperLeft, 0), wrapperWidth);
                      var newIndex = 0;
                      var beforeSum = widthArray[0];
                      while (relativeLeft > beforeSum && widthArray.length > newIndex + 1) {
                          newIndex++;
                          beforeSum += widthArray[newIndex];
                      }
                      newIndex = _this.s.rtl ? widthArray.length - 1 - newIndex : newIndex;
                      // const newIndex = Math.floor(relativeLeft / this._itemWidth);
                      if (newIndex !== selectedIndex && !disabledArray[newIndex]) {
                          selectedIndex = newIndex;
                          // this.forceUpdate();
                          setRadio(name, UNDEFINED, selectedIndex);
                      }
                  }
              },
              onStart: function (ev) {
                  // console.log(`wrapper(${wrapperWidth}), items(${widthArray.join(',')}), itemsSum(${widthArray.reduce((t, c) => t + c)})`);
                  // go into dragging state - handle or not
                  var item = closest(ev.domEvent.target, '.mbsc-segmented-item', _this._el);
                  if (!item) {
                      // Gesture was started outside of an item
                      return;
                  }
                  var input = item.querySelector('.mbsc-segmented-input');
                  var classList = input.classList;
                  if (classList.contains('mbsc-selected')) {
                      // this.setState({ dragging: true, handleDrag: classList.contains('mbsc-selected') });
                      // update disabled array
                      disabledArray = [];
                      forEach(_this._el.querySelectorAll('.mbsc-segmented-button'), function (button) {
                          disabledArray.push(button.classList.contains('mbsc-disabled'));
                      });
                      widthArray = [];
                      forEach(_this._el.querySelectorAll('.mbsc-segmented-item'), function (el) {
                          widthArray.push(el.clientWidth);
                      });
                      var padding = 15; // (12 + 3) on each side
                      wrapperWidth = _this._el.clientWidth - padding * 2;
                      wrapperLeft = getOffset(_this._el).left + padding;
                      name = input.name;
                      selectedIndex = getSelectedIndex(name);
                      oldIndex = selectedIndex;
                      // We don't always have select multiple specified for the group,
                      // so we additionally check if it's a radio input
                      if (widthArray.length && input.type === 'radio') {
                          isDragging = true;
                          _this.setState({ dragging: true });
                      }
                  }
              },
          });
      };
      SegmentedGroupBase.prototype._cleanupDrag = function () {
          if (this._unlisten) {
              this._unlisten();
              this._unlisten = null;
          }
      };
      SegmentedGroupBase.prototype._render = function (s) {
          this._name = s.name === UNDEFINED ? this._id : s.name;
          this._groupClass =
              'mbsc-segmented mbsc-flex ' +
                  this._className +
                  this._theme +
                  this._rtl +
                  (s.color ? ' mbsc-segmented-' + s.color : '') +
                  (this.state.dragging ? ' mbsc-segmented-dragging' : '');
          this._groupOpt = {
              color: s.color,
              disabled: s.disabled,
              name: this._name,
              onChange: this._onChange,
              select: s.select,
              value: s.value,
          };
      };
      SegmentedGroupBase.prototype._updated = function () {
          // we need to setup the dragging based on the `drag` option (theme specific default), which can change
          if (this.s.drag && this.s.select !== 'multiple') {
              if (!this._unlisten) {
                  this._setupDrag();
              }
          }
          else {
              this._cleanupDrag();
          }
      };
      SegmentedGroupBase.prototype._destroy = function () {
          this._cleanupDrag();
      };
      // tslint:disable variable-name
      SegmentedGroupBase.defaults = {
          select: 'single',
      };
      SegmentedGroupBase._name = 'SegmentedGroup';
      return SegmentedGroupBase;
  }(BaseComponent));

  function template$e(s, inst, content) {
      return (createElement("div", { className: inst._groupClass, ref: inst._setEl }, content));
  }
  /**
   * The SegmentedGroup.
   *
   * Usage:
   *
   * ```
   * <SegmentedGroup>...</SegmentedGroup>
   * ```
   */
  var SegmentedGroup = /*#__PURE__*/ (function (_super) {
      __extends(SegmentedGroup, _super);
      function SegmentedGroup() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      SegmentedGroup.prototype._template = function (s) {
          // With preact it does not compile if jsx <RadioContext.Provider> is used,
          // so we're using the createElement function
          return createElement(RadioContext.Provider, { children: template$e(s, this, s.children), value: this._groupOpt });
      };
      return SegmentedGroup;
  }(SegmentedGroupBase));

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  var guid$3 = 1;
  /** @hidden */
  var SegmentedBase = /*#__PURE__*/ (function (_super) {
      __extends(SegmentedBase, _super);
      function SegmentedBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._onChange = function (ev) {
              var s = _this.s;
              var checked = ev.target.checked;
              if (checked === _this._checked) {
                  return;
              }
              _this._change(checked); // needed for angular
              // Notify group
              if (_this._onGroupChange) {
                  _this._onGroupChange(ev, _this._value);
              }
              _this._toggle(checked);
              if (s.onChange) {
                  s.onChange(ev);
              }
          };
          _this._onValueChange = function (value) {
              var s = _this.s;
              var selected = _this._isMultiple ? value && value.indexOf(_this._value) !== -1 : value === _this._value;
              // Uncontrolled
              if (s.checked === UNDEFINED && selected !== _this.state.selected) {
                  _this.setState({ selected: selected });
              }
              else {
                  // Force update to handle index change
                  _this.forceUpdate();
              }
              _this._change(selected);
          };
          _this._setBox = function (box) {
              _this._box = box;
          };
          return _this;
      }
      // tslint:enable variable-name
      // tslint:disable-next-line no-empty
      SegmentedBase.prototype._change = function (checked) { };
      SegmentedBase.prototype._groupOptions = function (_a) {
          var _this = this;
          var color = _a.color, disabled = _a.disabled, name = _a.name, onChange = _a.onChange, select = _a.select, value = _a.value;
          // The group options received above are optional. In case of jQuery / JS they won't be present,
          // because we render the group and items separately, without context between them.
          // Group options have higher priority, if present.
          var s = this.s;
          var state = this.state;
          var prevChecked = this._checked;
          var modelValue = s.modelValue !== UNDEFINED ? s.modelValue === s.value : s.checked;
          var checked = modelValue !== UNDEFINED
              ? emptyOrTrue(modelValue) // Controlled
              : state.selected === UNDEFINED
                  ? emptyOrTrue(s.defaultChecked)
                  : state.selected; // Uncontrolled
          this._id = s.id === UNDEFINED ? this._id || 'mbsc-segmented-' + guid$3++ : s.id;
          this._value = s.value === UNDEFINED ? this._id : s.value;
          this._onGroupChange = onChange;
          this._isMultiple = (select || s.select) === 'multiple';
          this._name = name === UNDEFINED ? s.name : name;
          this._disabled =
              disabled === UNDEFINED ? (s.disabled === UNDEFINED ? state.disabled : emptyOrTrue(s.disabled)) : emptyOrTrue(disabled);
          this._color = color === UNDEFINED ? s.color : color;
          this._checked = value === UNDEFINED ? checked : this._isMultiple ? value && value.indexOf(this._value) !== -1 : value === this._value;
          // Subscribe to radio changes if not yet subscribed
          if (this._name && !this._unsubscribe) {
              this._unsubscribe = subscribeRadio(this._name, this._onValueChange);
          }
          if (!this._isMultiple && !prevChecked && this._checked) {
              setTimeout(function () {
                  // It's possible that the checked state is modified with a subsequent render,
                  // so we check again, otherwise we end up with an infinite loop
                  if (_this._checked) {
                      setRadio(_this._name, _this._value, _this._index);
                  }
              });
          }
          this._selectedIndex = getSelectedIndex(this._name);
          this._cssClass =
              'mbsc-segmented-item ' +
                  this._className +
                  this._theme +
                  this._rtl +
                  (this._checked ? ' mbsc-segmented-item-checked' : '') +
                  (state.hasFocus ? ' mbsc-focus' : '') +
                  (this._index === this._selectedIndex ||
                      (this._index === UNDEFINED && this._checked) || // We do not have an index yet, but we know it's checked (on first render)
                      (this._isMultiple && this._checked)
                      ? ' mbsc-segmented-item-selected'
                      : '');
      };
      SegmentedBase.prototype._toggle = function (checked) {
          // Update state of uncontrolled component
          if (this.s.checked === UNDEFINED) {
              this.setState({ selected: checked });
          }
          // The setRadio is now moved in the _render, to also handle programatic changes
          // if (!this._isMultiple) {
          //   setRadio(this._name, this._value, this._index);
          // }
      };
      SegmentedBase.prototype._mounted = function () {
          var _this = this;
          // The click event needs to be listened manually, because react messes with the onChange listening
          // and doesn't pick up the programatically triggered events
          listen(this._el, CLICK, this._onChange);
          this._unlisten = gestureListener(this._el, {
              onBlur: function () {
                  _this.setState({ hasFocus: false });
              },
              onFocus: function () {
                  _this.setState({ hasFocus: true });
              },
          });
      };
      SegmentedBase.prototype._updated = function () {
          if (!this._isMultiple) {
              // Find the index and selected index.
              // We're using the document and getting the siblings by name, because the group is not available in jQuery / JS.
              // TODO: this is not very nice, think of a better solution.
              var cont = closest(this._el, '.mbsc-segmented');
              var index = -1;
              var selectedIndex = -1;
              if (cont) {
                  var items = cont.querySelectorAll('.mbsc-segmented-input[name="' + this._name + '"]');
                  for (var i = 0; i < items.length; i++) {
                      if (items[i] === this._el) {
                          index = i;
                      }
                      if (items[i].checked) {
                          selectedIndex = i;
                      }
                  }
              }
              if (this._index !== index && selectedIndex !== -1) {
                  setSelectedIndex(this._name, selectedIndex);
              }
              if (this._selectedIndex !== -1) {
                  this._box.style.transform = 'translateX(' + (this.s.rtl ? -1 : 1) * (this._selectedIndex - index) * 100 + '%)';
                  this._animate = true;
              }
              if (index !== -1) {
                  this._index = index;
              }
          }
      };
      SegmentedBase.prototype._destroy = function () {
          unlisten(this._el, CLICK, this._onChange);
          if (this._unsubscribe) {
              unsubscribeRadio(this._name, this._unsubscribe);
          }
          if (this._unlisten) {
              this._unlisten();
          }
      };
      // tslint:disable variable-name
      SegmentedBase.defaults = {
          select: 'single',
      };
      SegmentedBase._name = 'Segmented';
      return SegmentedBase;
  }(BaseComponent));

  function template$f(s, state, inst, content, groupOpt) {
      // With preact it does not compile if jsx <RadioContext.Consumer> is used,
      // so we're using the createElement function
      inst._groupOptions(groupOpt);
      return (createElement("label", { className: inst._cssClass },
          createElement("input", { ref: inst._setEl, "aria-labelledby": inst._id, checked: inst._checked, className: 'mbsc-segmented-input mbsc-reset ' + (s.inputClass || '') + inst._theme + (inst._checked ? ' mbsc-selected' : ''), disabled: inst._disabled, name: inst._isMultiple ? s.name : inst._name, onChange: noop, type: inst._isMultiple ? 'checkbox' : 'radio', value: inst._value }),
          createElement("div", { ref: inst._setBox, className: 'mbsc-segmented-selectbox' +
                  inst._theme +
                  (inst._animate ? ' mbsc-segmented-selectbox-animate' : '') +
                  (inst._checked ? ' mbsc-selected' : '') },
              createElement("div", { className: 'mbsc-segmented-selectbox-inner' +
                      inst._theme +
                      (inst._index === inst._selectedIndex || inst._checked ? ' mbsc-segmented-selectbox-inner-visible' : '') +
                      (inst._checked ? ' mbsc-selected' : '') })),
          createElement(Button, { "aria-hidden": true, ariaLabel: s.ariaLabel, className: 'mbsc-segmented-button' + (inst._checked ? ' mbsc-selected' : '') + (state.hasFocus ? ' mbsc-focus' : ''), color: inst._color, disabled: inst._disabled, endIcon: s.endIcon, endIconSrc: s.endIconSrc, endIconSvg: s.endIconSvg, icon: s.icon, iconSrc: s.iconSrc, iconSvg: s.iconSvg, id: inst._id, ripple: s.ripple, rtl: s.rtl, startIcon: s.startIcon, startIconSrc: s.startIconSrc, startIconSvg: s.startIconSvg, tag: "span", tabIndex: -1, theme: s.theme, themeVariant: s.themeVariant }, content)));
  }
  var Segmented = /*#__PURE__*/ (function (_super) {
      __extends(Segmented, _super);
      function Segmented() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(Segmented.prototype, "checked", {
          get: function () {
              return this._checked;
          },
          set: function (value) {
              this._toggle(value);
          },
          enumerable: true,
          configurable: true
      });
      Segmented.prototype._template = function (s, state) {
          var _this = this;
          return createElement(RadioContext.Consumer, null, (function (groupOpt) {
              return template$f(s, state, _this, s.children, groupOpt);
          }));
      };
      return Segmented;
  }(SegmentedBase));

  function TimeBox(_a) {
      var _b;
      var disabled = _a.disabled, selected = _a.selected, theme = _a.theme, timeSlot = _a.timeSlot, onClick = _a.onClick, onKeyDown = _a.onKeyDown;
      var keydown = (_b = {}, _b[ON_KEY_DOWN] = onKeyDown, _b);
      // tslint:disable: jsx-no-lambda
      return (createElement("div", __assign({ className: 'mbsc-timegrid-item' + (selected ? ' mbsc-selected' : '') + (disabled ? ' mbsc-disabled' : '') + theme, onClick: function () { return onClick(timeSlot); }, tabIndex: disabled ? UNDEFINED : 0, "data-timeslot": timeSlot.value }, keydown), timeSlot.formattedValue));
      // tslint:enable: jsx-no-lambda
  }

  /**
   * Returns the closest number (timestamp) to a value from an array of numbers
   */
  function getClosestNumber(arr, value) {
      if (value == null || !arr.length) {
          // intentional == checks for undefined as well
          return null;
      }
      // go until find a greated number
      var i = 0;
      while (i < arr.length && value >= arr[i]) {
          i++;
      }
      if (i === arr.length) {
          // no greater number was found
          return arr[i - 1]; // the last one is the closest
      }
      else if (i === 0) {
          // the first one was greater
          return arr[0];
      }
      else {
          var prev = arr[i - 1];
          var next = arr[i];
          return value - prev < next - value ? prev : next; // return the one that is closer to the given number
      }
  }
  var TimegridBase = /*#__PURE__*/ (function (_super) {
      __extends(TimegridBase, _super);
      function TimegridBase() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._setTime = function (timeSlot) {
              _this._hook('onChange', { value: createDate(_this.s, timeSlot.value) });
          };
          _this._isDisabled = function (d) {
              if (d) {
                  var key = getDateStr(createDate(_this.s, d));
                  var invalidsForDay = _this._invalids && _this._invalids[key];
                  var validsForDay = _this._valids && _this._valids[key];
                  var exclusiveEndDates = _this.s.exclusiveEndDates;
                  if (validsForDay) {
                      for (var _i = 0, validsForDay_1 = validsForDay; _i < validsForDay_1.length; _i++) {
                          var valid = validsForDay_1[_i];
                          var lessThanEnd = valid.end && (exclusiveEndDates ? d < +valid.end : d <= +valid.end);
                          if ((valid.start && d >= +valid.start && lessThanEnd) || valid.allDay) {
                              return false;
                          }
                      }
                      return true;
                  }
                  if (invalidsForDay) {
                      for (var _a = 0, invalidsForDay_1 = invalidsForDay; _a < invalidsForDay_1.length; _a++) {
                          var invalid = invalidsForDay_1[_a];
                          var lessThanEnd = invalid.end && (exclusiveEndDates ? d < +invalid.end : d <= +invalid.end);
                          if ((invalid.start && d >= +invalid.start && lessThanEnd) || invalid.allDay) {
                              return true;
                          }
                      }
                      return false;
                  }
              }
              return false;
          };
          _this._onKeyDown = function (ev) {
              switch (ev.keyCode) {
                  case SPACE:
                      ev.target.click();
                      ev.preventDefault();
                      break;
              }
          };
          _this._setCont = function (el) {
              _this._gridContEl = el && el.parentElement;
          };
          return _this;
      }
      TimegridBase.prototype._render = function (s, state) {
          var _this = this;
          var prevS = this._prevS;
          this._cssClass = 'mbsc-timegrid-container mbsc-font' + this._theme + this._rtl;
          var minChanged = s.min !== prevS.min;
          var maxChanged = s.max !== prevS.max;
          var timeFormat = s.timeFormat;
          var valueChanged = (prevS.value && !s.value) || (s.value && +s.value !== this._value);
          if (minChanged) {
              this._min = isEmpty(s.min) ? UNDEFINED : makeDate(s.min, s, timeFormat);
          }
          if (maxChanged) {
              this._max = isEmpty(s.max) ? UNDEFINED : makeDate(s.max, s, timeFormat);
          }
          // constrain the default date or the selected date that comes from outside to the min and max
          var selected = s.value || createDate(s);
          // const selectedConstrained = createDate(s, constrain(+selected, +this._min, +this._max));
          // calculate the current day start and end points
          var dayStart = getDateOnly(selected);
          var dayEnd = addDays(dayStart, 1);
          // optimize the invalid map to only reload when the current day changes
          // because invalids are loaded for a single day only
          // TODO: maybe we could optimize for a month as well
          var currentDateChanged = this._selectedDate !== +dayStart;
          var invChanged = s.invalid !== prevS.invalid;
          var validChanged = s.valid !== prevS.valid;
          if (invChanged || currentDateChanged) {
              this._invalids = getEventMap(s.invalid, dayStart, dayEnd, s, true);
          }
          if (validChanged || currentDateChanged) {
              this._valids = getEventMap(s.valid, dayStart, dayEnd, s, true);
          }
          if (valueChanged) {
              this._value = s.value && +s.value; // set or clear the selected time
          }
          var timeSlotsChange = currentDateChanged || invChanged || minChanged || maxChanged || timeFormat !== prevS.timeFormat;
          if (timeSlotsChange) {
              this._selectedDate = +dayStart; // save the current day for next render
              // define start and end points of the timeslots - the day start and day end points constrained with min and max
              // const start = +constrainDate(dayStart, this._min);
              // const end = +constrainDate(dayEnd, UNDEFINED, this._max);
              var start = Math.max(+dayStart, +(this._min || -Infinity));
              var end = Math.min(+dayEnd, +(this._max || Infinity) + 1);
              // calculate the time step
              var timeInterval = s.stepHour * 3600000 + s.stepMinute * 60000;
              this._timeSlots = [];
              this._validTimes = [];
              var arr = [];
              var i = 0;
              for (var d = +dayStart; d < +dayEnd; d += timeInterval) {
                  if (end >= start ? d >= start && d < end : d >= start || d < end) {
                      var timeslot = { formattedValue: formatDate(timeFormat, createDate(s, d), s), value: d };
                      arr.push(timeslot);
                      if (i === 2) {
                          this._timeSlots.push(arr);
                          arr = [];
                          i = -1;
                      }
                      if (!this._isDisabled(d)) {
                          this._validTimes.push(timeslot);
                      }
                      i++;
                  }
              }
              if (arr.length) {
                  this._timeSlots.push(arr);
              }
          }
          // validate the selected time passed down from datepicker
          if (this._isDisabled(this._value) ||
              ((valueChanged || timeSlotsChange) && findIndex(this._validTimes, function (ts) { return ts.value === _this._value; }) === -1)) {
              var validated_1 = getClosestNumber(this._validTimes.map(function (slot) { return slot.value; }), this._value);
              if (validated_1) {
                  clearTimeout(this._validationHandle);
                  this._validationHandle = setTimeout(function () {
                      var validTimeslot = find(_this._validTimes, function (slot) { return slot.value === validated_1; });
                      _this._setTime(validTimeslot);
                  });
              }
          }
          else if (timeSlotsChange) {
              // if the value and the valid times also change in the next cycle, before the setTimeout above could have run,
              // then the validated value will not be found in the _validTimes array, so the validTimeSlot will error out in
              // _setTime. We can safely clear the timeout since, the value we wanted to set is not available anymore.
              clearTimeout(this._validationHandle);
          }
          this._valueChanged = this._valueChanged || valueChanged;
      };
      TimegridBase.prototype._updated = function () {
          if (this._value !== UNDEFINED && (this._valueChanged || (this._isOpen !== this.s.isOpen && this.s.isOpen))) {
              var animate_1 = this._lastValue !== UNDEFINED;
              var grid_1 = this._gridContEl;
              var timeslot_1 = grid_1.querySelector('[data-timeslot="' + this._value + '"]');
              if (timeslot_1) {
                  setTimeout(function () {
                      var itemRect = timeslot_1.getBoundingClientRect();
                      var itemTop = itemRect.top;
                      var itemHeight = itemRect.height;
                      var gridRect = grid_1.getBoundingClientRect();
                      var gridTop = gridRect.top;
                      var gridHeight = gridRect.height;
                      var currPos = getScrollTop(grid_1);
                      if (itemTop + itemHeight > gridTop + gridHeight || itemTop < gridTop) {
                          var scrollPos = itemTop - gridTop + currPos - 5;
                          smoothScroll(grid_1, UNDEFINED, scrollPos, animate_1);
                      }
                  });
              }
              this._valueChanged = false;
              this._lastValue = this._value;
          }
          this._isOpen = this.s.isOpen;
      };
      /** @hidden */
      TimegridBase.defaults = __assign({}, dateTimeLocale, { stepHour: 0, stepMinute: 30 });
      // tslint:disable variable-name
      TimegridBase._name = 'Timegrid';
      return TimegridBase;
  }(BaseComponent));

  function template$g(s, inst) {
      return (createElement("div", { className: inst._cssClass, ref: inst._setCont }, inst._timeSlots.map(function (arr, rowIndex) {
          return (createElement("div", { className: "mbsc-timegrid-row", key: rowIndex }, arr.map(function (v, cellIndex) {
              var disabled = inst._isDisabled(v.value);
              return (createElement("div", { className: 'mbsc-timegrid-cell' + (disabled ? ' mbsc-disabled' : ''), key: cellIndex },
                  createElement(TimeBox, { disabled: disabled, onKeyDown: inst._onKeyDown, selected: inst._value === v.value, timeSlot: v, onClick: inst._setTime, theme: inst._theme })));
          })));
      })));
  }
  var Timegrid = /*#__PURE__*/ (function (_super) {
      __extends(Timegrid, _super);
      function Timegrid() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Timegrid.prototype._template = function (s) {
          return template$g(s, this);
      };
      return Timegrid;
  }(TimegridBase));

  modules[Datetime._name] = Datetime;
  modules[Calendar._name] = Calendar;
  modules[Timegrid._name] = Timegrid;
  function template$h(s, inst, content, slots) {
      var hasTabs = inst._renderTabs;
      var controls = inst._controls;
      var activeSelect = inst._activeSelect;
      var rtl = inst._rtl;
      var theme = inst._theme;
      return (createElement(Fragment, null,
          createElement("div", { className: 'mbsc-datepicker mbsc-flex-col mbsc-datepicker-' +
                  s.display +
                  theme +
                  (s.display === 'inline' ? ' ' + inst._className + inst._hb : '') +
                  inst._controlsClass },
              inst._headerText && s.display === 'inline' && createElement("div", { className: 'mbsc-picker-header' + theme + inst._hb }, inst._headerText),
              hasTabs && (createElement(SegmentedGroup, { rtl: s.rtl, theme: s.theme, themeVariant: s.themeVariant, value: inst._activeTab, onChange: inst._changeActiveTab }, controls.map(function (control, i) {
                  return (createElement(Segmented, { key: i, rtl: s.rtl, theme: s.theme, themeVariant: s.themeVariant, value: control.name }, control.title));
              }))),
              inst._renderControls && (createElement("div", { className: 'mbsc-range-control-wrapper' + theme },
                  createElement(SegmentedGroup, { theme: s.theme, themeVariant: s.themeVariant, rtl: s.rtl, value: activeSelect, onChange: inst._changeActiveSelect },
                      createElement(Segmented, { rtl: s.rtl, theme: s.theme, themeVariant: s.themeVariant, value: "start", className: 'mbsc-range-start' + (inst._tempStartText ? ' mbsc-range-value-nonempty' : '') },
                          createElement("div", { className: 'mbsc-range-control-label' + theme + rtl + (activeSelect === 'start' ? ' active' : '') }, s.rangeStartLabel),
                          createElement("div", { className: 'mbsc-range-control-value' +
                                  theme +
                                  rtl +
                                  (activeSelect === 'start' ? ' active' : '') +
                                  (!inst._tempStartText ? ' mbsc-range-control-text-empty' : '') }, inst._tempStartText || s.rangeStartHelp),
                          activeSelect === 'start' && inst._tempStartText && (createElement(Icon, { className: 'mbsc-range-label-clear' + rtl, onClick: inst._clearStart, svg: s.clearIcon, theme: s.theme }))),
                      createElement(Segmented, { rtl: s.rtl, theme: s.theme, themeVariant: s.themeVariant, value: "end", className: 'mbsc-range-end' + (inst._tempEndText ? ' mbsc-range-value-nonempty' : '') },
                          createElement("div", { className: 'mbsc-range-control-label' + theme + rtl + (activeSelect === 'end' ? ' active' : '') }, s.rangeEndLabel),
                          createElement("div", { className: 'mbsc-range-control-value' +
                                  theme +
                                  rtl +
                                  (activeSelect === 'end' ? ' active' : '') +
                                  (!inst._tempEndText ? ' mbsc-range-control-text-empty' : '') }, inst._tempEndText || s.rangeEndHelp),
                          activeSelect === 'end' && inst._tempEndText && (createElement(Icon, { className: 'mbsc-range-label-clear' + rtl, onClick: inst._clearEnd, svg: s.clearIcon, theme: s.theme })))))),
              createElement("div", { className: 'mbsc-datepicker-tab-wrapper mbsc-flex mbsc-flex-1-1' + theme, ref: inst._setWrapper }, controls.map(function (control, i) {
                  var options = control.options;
                  if (slots) {
                      options.renderCalendarHeader = slots.header;
                      options.renderDay = slots.day;
                      options.renderDayContent = slots.dayContent;
                  }
                  return (createElement("div", { key: i, className: 'mbsc-flex mbsc-datepicker-tab mbsc-datepicker-tab-' +
                          control.name +
                          theme +
                          ((hasTabs && control.name === inst._activeTab) || !hasTabs ? ' mbsc-datepicker-tab-active' : '') +
                          (hasTabs && control.name === 'time' ? ' mbsc-datepicker-time-modal' : '') +
                          (hasTabs || controls.length === 1 ? ' mbsc-datepicker-tab-expand mbsc-flex-1-1' : '') },
                      createElement(control.Component, __assign({}, options))));
              }))),
          content));
  }
  var Datepicker = /*#__PURE__*/ (function (_super) {
      __extends(Datepicker, _super);
      function Datepicker() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Datepicker.prototype._template = function (s) {
          return pickerTemplate(this, s, template$h(s, this, s.children));
      };
      return Datepicker;
  }(DatepickerBase));

  function getInput(inp) {
      if (isString(inp)) {
          return doc.querySelector(inp);
      }
      return inp;
  }
  var renderOptions = {
      before: function (elm, options) {
          var select = options.select, startInput = options.startInput, endInput = options.endInput;
          if (select === 'range' && startInput && endInput) {
              var start = getInput(startInput);
              var end = getInput(endInput);
              var startValue = start && start.value;
              var endValue = end && end.value;
              if (startValue && endValue) {
                  options.defaultValue = startValue + RANGE_SEPARATOR + endValue;
              }
          }
          else {
              options.defaultValue = elm.value;
          }
          options.element = elm;
      },
  };

  // tslint:disable no-non-null-assertion
  var id = 0;
  function jsonp(url, callback) {
      // Check if we're in browser env
      if (win) {
          var script_1 = doc.createElement('script');
          var unique_1 = 'mbscjsonp' + ++id;
          win[unique_1] = function (data) {
              script_1.parentNode.removeChild(script_1);
              delete win[unique_1];
              if (!data) {
                  return;
              }
              callback(data);
          };
          script_1.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + unique_1;
          doc.body.appendChild(script_1);
      }
  }
  function ajaxGet(url, callback) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
              // Success!
              callback(JSON.parse(request.response));
          } // else {
          // We reached our target server, but it returned an error
          // }
      };
      request.onerror = function () {
          // There was a connection error of some sort
      };
      request.send();
  }
  /**
   * Load JSON-encoded data from a server using a GET HTTP request.
   * @param url URL to which the request is sent.
   * @param callback A function that is executed if the request succeeds.
   * @param type Type of the JSON request (json or jsonp)
   */
  function getJson(url, callback, type) {
      if (type === 'jsonp') {
          jsonp(url, callback);
      }
      else {
          ajaxGet(url, callback);
      }
  }
  var http = {
      getJson: getJson,
  };
  util.http = http;

  // tslint:disable: no-use-before-declare
  var localTimezone;
  function normTimezone(timezone) {
      if (!localTimezone) {
          localTimezone = luxonTimezone.luxon.DateTime.local().zoneName;
      }
      return !timezone || timezone === 'local' ? localTimezone : timezone;
  }
  /**
   * Checks which version of luxon library is used, version 1 or 2+
   * @param DT
   * @returns 1 for version 1.x and 2 for versions above 2.0, depending on the DT.fromObject function
   */
  function getVersion(DT) {
      var fn = DT.fromObject.toString().trim();
      return /^(function )?\w*\(\w+\)/.test(fn) ? 1 : 2;
  }
  var LDate = /*#__PURE__*/ (function () {
      function LDate(value, timezone) {
          if (timezone === void 0) { timezone = 'utc'; }
          // tslint:disable-next-line
          this._mbsc = true;
          timezone = normTimezone(timezone);
          var DT = luxonTimezone.luxon.DateTime;
          var zoneOpt = { zone: timezone };
          this.zone = timezone;
          if (isUndefined(value)) {
              this.dt = DT.utc().setZone(timezone);
          }
          else if (isDate(value) || isNumber(value)) {
              this.dt = DT.fromMillis(+value, zoneOpt);
          }
          else if (isString(value)) {
              this.dt = DT.fromISO(value, zoneOpt);
          }
          else if (isArray(value)) {
              var keys = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
              var valueObj = {};
              for (var i = 0; i < value.length && i < 7; i++) {
                  valueObj[keys[i]] = value[i] + (i === 1 ? 1 : 0);
              }
              // In version 2+ of luxon, the options (the zone) should go into a second parameter.
              // To work with both version 1 and 2 we need to determin the version of luxon if not provided explicitly.
              luxonTimezone.version = luxonTimezone.version || getVersion(DT);
              if (luxonTimezone.version === 1) {
                  // v1.x
                  this.dt = DT.fromObject(__assign({}, valueObj, zoneOpt));
              }
              else {
                  // v2+
                  this.dt = DT.fromObject(valueObj, zoneOpt);
              }
          }
      }
      LDate.prototype.clone = function () {
          return new LDate(this, this.zone);
      };
      LDate.prototype.createDate = function (year, month, date, h, min, sec, ms) {
          return luxonTimezone.createDate({ displayTimezone: this.zone }, year, month, date, h, min, sec, ms);
      };
      LDate.prototype[Symbol.toPrimitive] = function (hint) {
          return this.dt.toJSDate()[Symbol.toPrimitive](hint);
      };
      LDate.prototype.toDateString = function () {
          return this.dt.toFormat('ccc MMM dd yyyy');
      };
      LDate.prototype.toISOString = function () {
          return this.dt.toISO();
      };
      LDate.prototype.toJSON = function () {
          return this.dt.toISO();
      };
      LDate.prototype.valueOf = function () {
          return this.dt.valueOf();
      };
      // Getters
      LDate.prototype.getDate = function () {
          return this.dt.day;
      };
      LDate.prototype.getDay = function () {
          return this.dt.weekday % 7;
      };
      LDate.prototype.getFullYear = function () {
          return this.dt.year;
      };
      LDate.prototype.getHours = function () {
          return this.dt.hour;
      };
      LDate.prototype.getMilliseconds = function () {
          return this.dt.millisecond;
      };
      LDate.prototype.getMinutes = function () {
          return this.dt.minute;
      };
      LDate.prototype.getMonth = function () {
          return this.dt.month - 1;
      };
      LDate.prototype.getSeconds = function () {
          return this.dt.second;
      };
      LDate.prototype.getTime = function () {
          return this.valueOf();
      };
      LDate.prototype.getTimezoneOffset = function () {
          return -this.dt.offset;
      };
      LDate.prototype.getUTCDate = function () {
          return this.dt.toUTC().day;
      };
      LDate.prototype.getUTCDay = function () {
          return this.dt.toUTC().weekday % 7;
      };
      LDate.prototype.getUTCFullYear = function () {
          return this.dt.toUTC().year;
      };
      LDate.prototype.getUTCHours = function () {
          return this.dt.toUTC().hour;
      };
      LDate.prototype.getUTCMilliseconds = function () {
          return this.dt.toUTC().millisecond;
      };
      LDate.prototype.getUTCMinutes = function () {
          return this.dt.toUTC().minute;
      };
      LDate.prototype.getUTCMonth = function () {
          return this.dt.toUTC().month - 1;
      };
      LDate.prototype.getUTCSeconds = function () {
          return this.dt.toUTC().second;
      };
      // Setters
      LDate.prototype.setMilliseconds = function (millisecond) {
          return this.setter({ millisecond: millisecond });
      };
      LDate.prototype.setSeconds = function (second, millisecond) {
          return this.setter({ second: second, millisecond: millisecond });
      };
      LDate.prototype.setMinutes = function (minute, second, millisecond) {
          return this.setter({ minute: minute, second: second, millisecond: millisecond });
      };
      LDate.prototype.setHours = function (hour, minute, second, millisecond) {
          return this.setter({ hour: hour, minute: minute, second: second, millisecond: millisecond });
      };
      LDate.prototype.setDate = function (day) {
          return this.setter({ day: day });
      };
      LDate.prototype.setMonth = function (month, day) {
          month++;
          return this.setter({ month: month, day: day });
      };
      LDate.prototype.setFullYear = function (year, month, day) {
          return this.setter({ year: year, month: month, day: day });
      };
      LDate.prototype.setTime = function (time) {
          this.dt = luxonTimezone.luxon.DateTime.fromMillis(time);
          return this.dt.valueOf();
      };
      LDate.prototype.setTimezone = function (timezone) {
          timezone = normTimezone(timezone);
          this.zone = timezone;
          this.dt = this.dt.setZone(timezone);
      };
      // The correct implementations of the UTC methods are omitted for not using them currently
      // but because of the Date interface they must be present
      LDate.prototype.setUTCMilliseconds = function (ms) {
          return 0;
      };
      LDate.prototype.setUTCSeconds = function (sec, ms) {
          return 0;
      };
      LDate.prototype.setUTCMinutes = function (min, sec, ms) {
          return 0;
      };
      LDate.prototype.setUTCHours = function (hours, min, sec, ms) {
          return 0;
      };
      LDate.prototype.setUTCDate = function (date) {
          return 0;
      };
      LDate.prototype.setUTCMonth = function (month, date) {
          return 0;
      };
      LDate.prototype.setUTCFullYear = function (year, month, date) {
          return 0;
      };
      LDate.prototype.toUTCString = function () {
          return '';
      };
      LDate.prototype.toTimeString = function () {
          return '';
      };
      LDate.prototype.toLocaleDateString = function () {
          return '';
      };
      LDate.prototype.toLocaleTimeString = function () {
          return '';
      };
      LDate.prototype.setter = function (obj) {
          this.dt = this.dt.set(obj);
          return this.dt.valueOf();
      };
      return LDate;
  }());
  /** @hidden */
  var luxonTimezone = {
      luxon: UNDEFINED,
      version: UNDEFINED,
      parse: function (date, s) {
          return new LDate(date, s.dataTimezone || s.displayTimezone);
      },
      /**
       * Supports two call signatures:
       * createDate(settings, dateObj|timestamp)
       * createDate(settings, year, month, date, hour, min, sec)
       * @returns IDate object
       */
      createDate: function (s, year, month, day, hour, minute, second, millisecond) {
          var displayTimezone = s.displayTimezone;
          if (isObject(year) || isString(year) || isUndefined(month)) {
              return new LDate(year, displayTimezone);
          }
          return new LDate([year || 1970, month || 0, day || 1, hour || 0, minute || 0, second || 0, millisecond || 0], displayTimezone);
      },
  };

  // tslint:disable: no-use-before-declare
  function normTimezone$1(timezone) {
      return !timezone || timezone === 'local' ? momentTimezone.moment.tz.guess() : timezone;
  }
  var MDate = /*#__PURE__*/ (function () {
      function MDate(value, timezone) {
          // tslint:disable-next-line
          this._mbsc = true;
          this.timezone = normTimezone$1(timezone);
          this.init(value);
      }
      MDate.prototype.clone = function () {
          return new MDate(this, this.timezone);
      };
      MDate.prototype.createDate = function (year, month, date, h, min, sec, ms) {
          return momentTimezone.createDate({ displayTimezone: this.timezone }, year, month, date, h, min, sec, ms);
      };
      MDate.prototype[Symbol.toPrimitive] = function (hint) {
          return this.m.toDate()[Symbol.toPrimitive](hint);
      };
      MDate.prototype.toDateString = function () {
          return this.m.format('ddd MMM DD YYYY');
      };
      MDate.prototype.toISOString = function () {
          return this.m.toISOString(true);
      };
      MDate.prototype.toJSON = function () {
          return this.m.toISOString();
      };
      MDate.prototype.valueOf = function () {
          return this.m.valueOf();
      };
      // Getters
      MDate.prototype.getDate = function () {
          return this.m.date();
      };
      MDate.prototype.getDay = function () {
          return this.m.day();
      };
      MDate.prototype.getFullYear = function () {
          return this.m.year();
      };
      MDate.prototype.getHours = function () {
          return this.m.hours();
      };
      MDate.prototype.getMilliseconds = function () {
          return this.m.milliseconds();
      };
      MDate.prototype.getMinutes = function () {
          return this.m.minutes();
      };
      MDate.prototype.getMonth = function () {
          return this.m.month();
      };
      MDate.prototype.getSeconds = function () {
          return this.m.seconds();
      };
      MDate.prototype.getTime = function () {
          return this.m.valueOf();
      };
      MDate.prototype.getTimezoneOffset = function () {
          return -this.m.utcOffset();
      };
      MDate.prototype.getUTCDate = function () {
          return this.utc().date();
      };
      MDate.prototype.getUTCDay = function () {
          return this.utc().day();
      };
      MDate.prototype.getUTCFullYear = function () {
          return this.utc().year();
      };
      MDate.prototype.getUTCHours = function () {
          return this.utc().hours();
      };
      MDate.prototype.getUTCMilliseconds = function () {
          return this.utc().milliseconds();
      };
      MDate.prototype.getUTCMinutes = function () {
          return this.utc().minutes();
      };
      MDate.prototype.getUTCMonth = function () {
          return this.utc().month();
      };
      MDate.prototype.getUTCSeconds = function () {
          return this.utc().seconds();
      };
      // Setters
      MDate.prototype.setMilliseconds = function (ms) {
          return +this.m.set({ millisecond: ms });
      };
      MDate.prototype.setSeconds = function (sec, ms) {
          return +this.m.set({ seconds: sec, milliseconds: ms });
      };
      MDate.prototype.setMinutes = function (min, sec, ms) {
          return +this.m.set({ minutes: min, seconds: sec, milliseconds: ms });
      };
      MDate.prototype.setHours = function (hours, min, sec, ms) {
          return +this.m.set({ hours: hours, minutes: min, seconds: sec, milliseconds: ms });
      };
      MDate.prototype.setDate = function (date) {
          return +this.m.set({ date: date });
      };
      MDate.prototype.setMonth = function (month, date) {
          return +this.m.set({ month: month, date: date });
      };
      MDate.prototype.setFullYear = function (year, month, date) {
          return +this.m.set({ year: year, month: month, date: date });
      };
      MDate.prototype.setTime = function (time) {
          this.init(time);
          return this.m.valueOf();
      };
      MDate.prototype.setTimezone = function (timezone) {
          this.timezone = normTimezone$1(timezone);
          this.m.tz(this.timezone);
      };
      // The original implementations of the UTC methods are commented out below for not using them currently
      // but because of the Date interface they must be present
      MDate.prototype.setUTCMilliseconds = function (ms) {
          return 0;
      };
      MDate.prototype.setUTCSeconds = function (sec, ms) {
          return 0;
      };
      MDate.prototype.setUTCMinutes = function (min, sec, ms) {
          return 0;
      };
      MDate.prototype.setUTCHours = function (hours, min, sec, ms) {
          return 0;
      };
      MDate.prototype.setUTCDate = function (date) {
          return 0;
      };
      MDate.prototype.setUTCMonth = function (month, date) {
          return 0;
      };
      MDate.prototype.setUTCFullYear = function (year, month, date) {
          return 0;
      };
      MDate.prototype.toUTCString = function () {
          return '';
      };
      MDate.prototype.toTimeString = function () {
          return '';
      };
      MDate.prototype.toLocaleDateString = function () {
          return '';
      };
      MDate.prototype.toLocaleTimeString = function () {
          return '';
      };
      // public setUTCMilliseconds(ms: number) { return this.setter({ millisecond: ms }, true).milliseconds(); }
      // public setUTCSeconds(sec: number, ms?: number) { return this.setter({ seconds: sec, milliseconds: ms }, true).seconds(); }
      // public setUTCMinutes(min: number, sec?: number, ms?: number) {
      //   return this.setter({ minutes: min, seconds: sec, milliseconds: ms }, true).minutes();
      // }
      // public setUTCHours(hours: number, min?: number, sec?: number, ms?: number) {
      //   return this.setter({ hours, minutes: min, seconds: sec, milliseconds: ms }, true).hours();
      // }
      // public setUTCDate(date: number) { return this.setter({ date }, true).date(); }
      // public setUTCMonth(month: number, date?: number) { return this.setter({ month, date }, true).month(); }
      // public setUTCFullYear(year: number, month?: number, date?: number) { return this.setter({ year, month, date }, true).year(); }
      // public toUTCString() { throw new Error('not implemented'); return ''; }
      // public toTimeString() { throw new Error('not implemented'); return ''; }
      // public toLocaleDateString() { throw new Error('not implemented'); return ''; }
      // public toLocaleTimeString() { throw new Error('not implemented'); return ''; }
      MDate.prototype.init = function (input) {
          var tz = momentTimezone.moment.tz;
          var normInput = isUndefined(input) || isString(input) || isNumber(input) || isArray(input) ? input : +input;
          var isTime = isString(input) && ISO_8601_TIME.test(input);
          this.m = isTime ? tz(normInput, 'HH:mm:ss', this.timezone) : tz(normInput, this.timezone);
      };
      MDate.prototype.utc = function () {
          return this.m.clone().utc();
      };
      return MDate;
  }());
  /** @hidden */
  var momentTimezone = {
      // ...timezonePluginBase,
      moment: UNDEFINED,
      parse: function (date, s) {
          return new MDate(date, s.dataTimezone || s.displayTimezone);
      },
      /**
       * Supports two call signatures:
       * createDate(settings, dateObj|timestamp)
       * createDate(settings, year, month, date, hour, min, sec)
       * @returns IDate object
       */
      createDate: function (s, year, month, date, h, min, sec, ms) {
          var displayTimezone = s.displayTimezone;
          if (isObject(year) || isString(year) || isUndefined(month)) {
              return new MDate(year, displayTimezone);
          }
          return new MDate([year || 1970, month || 0, date || 1, h || 0, min || 0, sec || 0, ms || 0], displayTimezone);
      },
  };

  var datepicker = /*#__PURE__*/ createComponentFactory(Datepicker, renderOptions);

  // tslint:disable only-arrow-functions
  var CalendarNav$1 = (function () {
      CalendarNext._selector = '[mbsc-calendar-next]';
      return CalendarNav;
  })();
  var CalendarNext$1 = (function () {
      CalendarPrev._selector = '[mbsc-calendar-prev]';
      return CalendarNext;
  })();
  var CalendarPrev$1 = (function () {
      CalendarToday._selector = '[mbsc-calendar-today]';
      return CalendarPrev;
  })();
  var CalendarToday$1 = (function () {
      CalendarNav._selector = '[mbsc-calendar-nav]';
      return CalendarToday;
  })();

  registerComponent(CalendarNav$1);
  registerComponent(CalendarNext$1);
  registerComponent(CalendarPrev$1);
  registerComponent(CalendarToday$1);

  exports.CalendarNav = CalendarNav$1;
  exports.CalendarNext = CalendarNext$1;
  exports.CalendarPrev = CalendarPrev$1;
  exports.CalendarToday = CalendarToday$1;
  exports.Datepicker = Datepicker;
  exports.autoDetect = autoDetect;
  exports.createCustomTheme = createCustomTheme;
  exports.datepicker = datepicker;
  exports.enhance = enhance;
  exports.formatDate = formatDatePublic;
  exports.getAutoTheme = getAutoTheme;
  exports.getInst = getInst;
  exports.getJson = getJson;
  exports.globalChanges = globalChanges;
  exports.hijriCalendar = hijriCalendar;
  exports.jalaliCalendar = jalaliCalendar;
  exports.locale = locale;
  exports.localeEn = localeEn;
  exports.luxonTimezone = luxonTimezone;
  exports.momentTimezone = momentTimezone;
  exports.options = options;
  exports.parseDate = parseDate;
  exports.platform = platform$1;
  exports.registerComponent = registerComponent;
  exports.setOptions = setOptions;
  exports.themes = themes;
  exports.util = util;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
