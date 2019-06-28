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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/nearley/lib/nearley.js":
/*!*********************************************!*\
  !*** ./node_modules/nearley/lib/nearley.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function(root, factory) {
    if ( true && module.exports) {
        module.exports = factory();
    } else {
        root.nearley = factory();
    }
}(this, function() {

    function Rule(name, symbols, postprocess) {
        this.id = ++Rule.highestId;
        this.name = name;
        this.symbols = symbols;        // a list of literal | regex class | nonterminal
        this.postprocess = postprocess;
        return this;
    }
    Rule.highestId = 0;

    Rule.prototype.toString = function(withCursorAt) {
        function stringifySymbolSequence (e) {
            return e.literal ? JSON.stringify(e.literal) :
                   e.type ? '%' + e.type : e.toString();
        }
        var symbolSequence = (typeof withCursorAt === "undefined")
                             ? this.symbols.map(stringifySymbolSequence).join(' ')
                             : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')
                                 + " ● "
                                 + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );
        return this.name + " → " + symbolSequence;
    }


    // a State is a rule at a position from a given starting point in the input stream (reference)
    function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
    }

    State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    };

    State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
        }
        return state;
    };

    State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    };

    State.prototype.finish = function() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
    };


    function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {}; // states indexed by the non-terminal they expect
        this.scannable = []; // list of states that expect a token
        this.completed = {}; // states that are nullable
    }


    Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;

        for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
            var state = states[w];

            if (state.isComplete) {
                state.finish();
                if (state.data !== Parser.fail) {
                    // complete
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--; ) { // this line is hot
                        var left = wantedBy[i];
                        this.complete(left, state);
                    }

                    // special-case nullables
                    if (state.reference === this.index) {
                        // make sure future predictors of this rule get completed.
                        var exp = state.rule.name;
                        (this.completed[exp] = this.completed[exp] || []).push(state);
                    }
                }

            } else {
                // queue scannable states
                var exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }

                // predict
                if (wants[exp]) {
                    wants[exp].push(state);

                    if (completed.hasOwnProperty(exp)) {
                        var nulls = completed[exp];
                        for (var i = 0; i < nulls.length; i++) {
                            var right = nulls[i];
                            this.complete(state, right);
                        }
                    }
                } else {
                    wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }

    Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];

        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var wantedBy = this.wants[exp];
            var s = new State(r, 0, this.index, wantedBy);
            this.states.push(s);
        }
    }

    Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
    }


    function Grammar(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
            if (!byName.hasOwnProperty(rule.name)) {
                byName[rule.name] = [];
            }
            byName[rule.name].push(rule);
        });
    }

    // So we can allow passing (rules, start) directly to Parser for backwards compatibility
    Grammar.fromCompiled = function(rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
        var g = new Grammar(rules, start);
        g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return g;
    }


    function StreamLexer() {
      this.reset("");
    }

    StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
    }

    StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
            var ch = this.buffer[this.index++];
            if (ch === '\n') {
              this.line += 1;
              this.lastLineBreak = this.index;
            }
            return {value: ch};
        }
    }

    StreamLexer.prototype.save = function() {
      return {
        line: this.line,
        col: this.index - this.lastLineBreak,
      }
    }

    StreamLexer.prototype.formatError = function(token, message) {
        // nb. this gets called after consuming the offending token,
        // so the culprit is index-1
        var buffer = this.buffer;
        if (typeof buffer === 'string') {
            var nextLineBreak = buffer.indexOf('\n', this.index);
            if (nextLineBreak === -1) nextLineBreak = buffer.length;
            var line = buffer.substring(this.lastLineBreak, nextLineBreak)
            var col = this.index - this.lastLineBreak;
            message += " at line " + this.line + " col " + col + ":\n\n";
            message += "  " + line + "\n"
            message += "  " + Array(col).join(" ") + "^"
            return message;
        } else {
            return message + " at index " + (this.index - 1);
        }
    }


    function Parser(rules, start, options) {
        if (rules instanceof Grammar) {
            var grammar = rules;
            var options = start;
        } else {
            var grammar = Grammar.fromCompiled(rules, start);
        }
        this.grammar = grammar;

        // Read options
        this.options = {
            keepHistory: false,
            lexer: grammar.lexer || new StreamLexer,
        };
        for (var key in (options || {})) {
            this.options[key] = options[key];
        }

        // Setup lexer
        this.lexer = this.options.lexer;
        this.lexerState = undefined;

        // Setup a table
        var column = new Column(grammar, 0);
        var table = this.table = [column];

        // I could be expecting anything.
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        // TODO what if start rule is nullable?
        column.process();
        this.current = 0; // token index
    }

    // create a reserved token for indicating a parse fail
    Parser.fail = {};

    Parser.prototype.feed = function(chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);

        var token;
        while (token = lexer.next()) {
            // We add new states to table[current+1]
            var column = this.table[this.current];

            // GC unused states
            if (!this.options.keepHistory) {
                delete this.table[this.current - 1];
            }

            var n = this.current + 1;
            var nextColumn = new Column(this.grammar, n);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            var literal = token.text !== undefined ? token.text : token.value;
            var value = lexer.constructor === StreamLexer ? token.value : token;
            var scannable = column.scannable;
            for (var w = scannable.length; w--; ) {
                var state = scannable[w];
                var expect = state.rule.symbols[state.dot];
                // Try to consume the token
                // either regex or literal
                if (expect.test ? expect.test(value) :
                    expect.type ? expect.type === token.type
                                : expect.literal === literal) {
                    // Add it
                    var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                    nextColumn.states.push(next);
                }
            }

            // Next, for each of the rules, we either
            // (a) complete it, and try to see if the reference row expected that
            //     rule
            // (b) predict the next nonterminal it expects by adding that
            //     nonterminal's start state
            // To prevent duplication, we also keep track of rules we have already
            // added

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                var message = this.lexer.formatError(token, "invalid syntax") + "\n";
                message += "Unexpected " + (token.type ? token.type + " token: " : "");
                message += JSON.stringify(token.value !== undefined ? token.value : token) + "\n";
                var err = new Error(message);
                err.offset = this.current;
                err.token = token;
                throw err;
            }

            // maybe save lexer state
            if (this.options.keepHistory) {
              column.lexerState = lexer.save()
            }

            this.current++;
        }
        if (column) {
          this.lexerState = lexer.save()
        }

        // Incrementally keep track of results
        this.results = this.finish();

        // Allow chaining, for whatever it's worth
        return this;
    };

    Parser.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    };

    Parser.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;

        // Incrementally keep track of results
        this.results = this.finish();
    };

    // nb. deprecated: use save/restore instead!
    Parser.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding')
        }
        // nb. recall column (table) indicies fall between token indicies.
        //        col 0   --   token 0   --   col 1
        this.restore(this.table[index]);
    };

    Parser.prototype.finish = function() {
        // Return the possible parsings
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1]
        column.states.forEach(function (t) {
            if (t.rule.name === start
                    && t.dot === t.rule.symbols.length
                    && t.reference === 0
                    && t.data !== Parser.fail) {
                considerations.push(t);
            }
        });
        return considerations.map(function(c) {return c.data; });
    };

    return {
        Parser: Parser,
        Grammar: Grammar,
        Rule: Rule,
    };

}));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/chunk.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/chunk.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.chunk = fp_1.curry((size, array) => {
    const arr = toArrayOrEmpty_1.toArrayOrEmpty(array);
    const output = [];
    let chnk = [];
    for (const elem of arr) {
        if (chnk.length >= size) {
            output.push(chnk);
            chnk = [];
        }
        chnk.push(elem);
    }
    if (chnk.length) {
        output.push(chnk);
    }
    return output;
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/filter.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/filter.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.filter = fp_1.curry((func, array) => toArrayOrEmpty_1.toArrayOrEmpty(array).filter(func));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/first.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/first.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const firstOrNull_1 = __webpack_require__(/*! ./firstOrNull */ "./node_modules/tofu-js/dist/arrays/firstOrNull.js");
exports.first = firstOrNull_1.firstOrNull;


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/firstOr.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/firstOr.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
exports.firstOr = fp_1.curry((defaultValue, array) => {
    const arr = toArrayOrEmpty_1.toArrayOrEmpty(array);
    return arr.length ? arr[0] : defaultValue;
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/firstOrNull.js":
/*!*********************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/firstOrNull.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const firstOr_1 = __webpack_require__(/*! ./firstOr */ "./node_modules/tofu-js/dist/arrays/firstOr.js");
exports.firstOrNull = firstOr_1.firstOr(null);


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/flatMap.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/flatMap.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
const map_1 = __webpack_require__(/*! ./map */ "./node_modules/tofu-js/dist/arrays/map.js");
const flatten_1 = __webpack_require__(/*! ./flatten */ "./node_modules/tofu-js/dist/arrays/flatten.js");
exports.flatMap = fp_1.curry((func, array) => fp_1.pipe(toArrayOrEmpty_1.toArrayOrEmpty(array), map_1.map(func), flatten_1.flatten));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/flatten.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/flatten.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.flatten = fp_1.curry(array => [].concat(...toArrayOrEmpty_1.toArrayOrEmpty(array)));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/fromPairs.js":
/*!*******************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/fromPairs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.fromPairs = (pairs) => {
    return toArrayOrEmpty_1.toArrayOrEmpty(pairs)
        .map(([key, val]) => ({ [key]: val }))
        .reduce((a, c) => Object.assign(a, c), {});
};


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/index.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./filter */ "./node_modules/tofu-js/dist/arrays/filter.js"));
__export(__webpack_require__(/*! ./flatMap */ "./node_modules/tofu-js/dist/arrays/flatMap.js"));
__export(__webpack_require__(/*! ./flatten */ "./node_modules/tofu-js/dist/arrays/flatten.js"));
__export(__webpack_require__(/*! ./limit */ "./node_modules/tofu-js/dist/arrays/limit.js"));
__export(__webpack_require__(/*! ./map */ "./node_modules/tofu-js/dist/arrays/map.js"));
__export(__webpack_require__(/*! ./scan */ "./node_modules/tofu-js/dist/arrays/scan.js"));
__export(__webpack_require__(/*! ./skip */ "./node_modules/tofu-js/dist/arrays/skip.js"));
__export(__webpack_require__(/*! ./tap */ "./node_modules/tofu-js/dist/arrays/tap.js"));
__export(__webpack_require__(/*! ./zip */ "./node_modules/tofu-js/dist/arrays/zip.js"));
__export(__webpack_require__(/*! ./takeWhile */ "./node_modules/tofu-js/dist/arrays/takeWhile.js"));
__export(__webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js"));
__export(__webpack_require__(/*! ./reduce */ "./node_modules/tofu-js/dist/arrays/reduce.js"));
__export(__webpack_require__(/*! ./chunk */ "./node_modules/tofu-js/dist/arrays/chunk.js"));
__export(__webpack_require__(/*! ./fromPairs */ "./node_modules/tofu-js/dist/arrays/fromPairs.js"));
__export(__webpack_require__(/*! ./first */ "./node_modules/tofu-js/dist/arrays/first.js"));
__export(__webpack_require__(/*! ./firstOr */ "./node_modules/tofu-js/dist/arrays/firstOr.js"));
__export(__webpack_require__(/*! ./firstOrNull */ "./node_modules/tofu-js/dist/arrays/firstOrNull.js"));
__export(__webpack_require__(/*! ./join */ "./node_modules/tofu-js/dist/arrays/join.js"));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/join.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/join.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
exports.join = fp_1.curry((separator, arr) => toArrayOrEmpty_1.toArrayOrEmpty(arr).join(separator));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/limit.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/limit.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.limit = fp_1.curry((max, array) => toArrayOrEmpty_1.toArrayOrEmpty(array).splice(0, max));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/map.js":
/*!*************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/map.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.map = fp_1.curry((func, array) => toArrayOrEmpty_1.toArrayOrEmpty(array).map(func));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/reduce.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/reduce.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.reduce = fp_1.curry((func, start, array) => toArrayOrEmpty_1.toArrayOrEmpty(array).reduce(func, start));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/scan.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/scan.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.scan = fp_1.curry((func, start, array) => {
    let accumulated = start;
    return toArrayOrEmpty_1.toArrayOrEmpty(array).map((elem) => {
        accumulated = func(accumulated, elem);
        return accumulated;
    });
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/skip.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/skip.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.skip = fp_1.curry((amt, array) => toArrayOrEmpty_1.toArrayOrEmpty(array).splice(amt));


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/takeWhile.js":
/*!*******************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/takeWhile.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.takeWhile = fp_1.curry((whileFunc, array) => {
    const arr = toArrayOrEmpty_1.toArrayOrEmpty(array);
    const res = [];
    for (const val of arr) {
        if (whileFunc(val))
            res.push(val);
        else
            return res;
    }
    return res;
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/tap.js":
/*!*************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/tap.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toArrayOrEmpty_1 = __webpack_require__(/*! ./toArrayOrEmpty */ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js");
exports.tap = fp_1.curry((func, array) => {
    toArrayOrEmpty_1.toArrayOrEmpty(array).forEach(func);
    return array;
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js":
/*!************************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/toArrayOrEmpty.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function toArrayOrEmpty(obj) {
    if (Array.isArray(obj))
        return obj;
    return [];
}
exports.toArrayOrEmpty = toArrayOrEmpty;


/***/ }),

/***/ "./node_modules/tofu-js/dist/arrays/zip.js":
/*!*************************************************!*\
  !*** ./node_modules/tofu-js/dist/arrays/zip.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
exports.zip = fp_1.curry((arrLeft, arrRight, ...moreArrays) => {
    const arrays = [arrLeft, arrRight, ...moreArrays];
    const maxLen = Math.max(...arrays.map(a => a.length));
    const res = [];
    for (let i = 0; i < maxLen; ++i) {
        res.push(arrays.map(a => (i < a.length ? a[i] : null)));
    }
    return res;
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/curry.js":
/*!***********************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/curry.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.curry = func => {
    const curryImpl = (providedArgs) => (...args) => {
        const concatArgs = providedArgs.concat(args);
        if (concatArgs.length < func.length) {
            return curryImpl(concatArgs);
        }
        return func(...concatArgs);
    };
    return curryImpl([]);
};


/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/index.js":
/*!***********************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./curry */ "./node_modules/tofu-js/dist/fp/curry.js"));
__export(__webpack_require__(/*! ./pipe */ "./node_modules/tofu-js/dist/fp/pipe.js"));
__export(__webpack_require__(/*! ./predicate */ "./node_modules/tofu-js/dist/fp/predicate.js"));
__export(__webpack_require__(/*! ./reverseArgs */ "./node_modules/tofu-js/dist/fp/reverseArgs.js"));
__export(__webpack_require__(/*! ./reverseCurry */ "./node_modules/tofu-js/dist/fp/reverseCurry.js"));
__export(__webpack_require__(/*! ./spread */ "./node_modules/tofu-js/dist/fp/spread.js"));


/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/pipe.js":
/*!**********************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/pipe.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
exports.pipe = (paramOrFunc, ...functions) => {
    if (is_1.isFunction(paramOrFunc)) {
        return chain(paramOrFunc, ...functions);
    }
    return chain(...functions)(paramOrFunc);
};
function chain(...funcs) {
    return (param) => {
        let lastVal = param;
        for (const func of funcs) {
            lastVal = func(lastVal);
        }
        return lastVal;
    };
}


/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/predicate.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/predicate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.and = (...predicates) => (param) => [...predicates].reduce((a, p) => a && p(param), true) && !!predicates.length;
exports.or = (...predicates) => (param) => [...predicates].reduce((a, p) => a || p(param), false);
exports.xor = (...predicates) => (param) => [...predicates].map(p => +p(param)).reduce((a, c) => a + c, 0) === 1;
exports.negate = (p1) => (param) => !p1(param);
exports.toPredicate = (p) => (param) => !!p(param);
exports.boolToPredicate = (b) => () => b;


/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/reverseArgs.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/reverseArgs.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function reverseArgs(func) {
    return (...args) => {
        return func(...args.reverse());
    };
}
exports.reverseArgs = reverseArgs;


/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/reverseCurry.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/reverseCurry.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const reverseArgs_1 = __webpack_require__(/*! ./reverseArgs */ "./node_modules/tofu-js/dist/fp/reverseArgs.js");
exports.reverseCurry = func => {
    const curryImpl = providedArgs => (...args) => {
        const concatArgs = providedArgs.concat(args);
        if (concatArgs.length < func.length) {
            return curryImpl(concatArgs);
        }
        return reverseArgs_1.reverseArgs(func)(...concatArgs);
    };
    return curryImpl([]);
};


/***/ }),

/***/ "./node_modules/tofu-js/dist/fp/spread.js":
/*!************************************************!*\
  !*** ./node_modules/tofu-js/dist/fp/spread.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const curry_1 = __webpack_require__(/*! ./curry */ "./node_modules/tofu-js/dist/fp/curry.js");
exports.spread = curry_1.curry((func, args) => func(...args));


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/index.js":
/*!***********************************************!*\
  !*** ./node_modules/tofu-js/dist/is/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./isFunction */ "./node_modules/tofu-js/dist/is/isFunction.js"));
__export(__webpack_require__(/*! ./isInfinite */ "./node_modules/tofu-js/dist/is/isInfinite.js"));
__export(__webpack_require__(/*! ./isIterable */ "./node_modules/tofu-js/dist/is/isIterable.js"));
__export(__webpack_require__(/*! ./isNil */ "./node_modules/tofu-js/dist/is/isNil.js"));
__export(__webpack_require__(/*! ./isNull */ "./node_modules/tofu-js/dist/is/isNull.js"));
__export(__webpack_require__(/*! ./isObject */ "./node_modules/tofu-js/dist/is/isObject.js"));
__export(__webpack_require__(/*! ./isUndefined */ "./node_modules/tofu-js/dist/is/isUndefined.js"));
__export(__webpack_require__(/*! ./isNumber */ "./node_modules/tofu-js/dist/is/isNumber.js"));
__export(__webpack_require__(/*! ./isString */ "./node_modules/tofu-js/dist/is/isString.js"));
__export(__webpack_require__(/*! ./isInteger */ "./node_modules/tofu-js/dist/is/isInteger.js"));
__export(__webpack_require__(/*! ./isFloat */ "./node_modules/tofu-js/dist/is/isFloat.js"));
__export(__webpack_require__(/*! ./isArray */ "./node_modules/tofu-js/dist/is/isArray.js"));
__export(__webpack_require__(/*! ./isBuffer */ "./node_modules/tofu-js/dist/is/isBuffer.js"));
__export(__webpack_require__(/*! ./isSet */ "./node_modules/tofu-js/dist/is/isSet.js"));
__export(__webpack_require__(/*! ./isMap */ "./node_modules/tofu-js/dist/is/isMap.js"));


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isArray.js":
/*!*************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isArray.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = Array.isArray;


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isBuffer.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isBuffer.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBuffer = (obj) => {
    return Buffer ? Buffer.isBuffer(obj) : false;
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isFloat.js":
/*!*************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isFloat.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const isNumber_1 = __webpack_require__(/*! ./isNumber */ "./node_modules/tofu-js/dist/is/isNumber.js");
exports.isFloat = isNumber_1.isNumber;


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isFunction.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isFunction.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = (param) => typeof param === 'function';


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isInfinite.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isInfinite.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isInfinite = (param) => param === Infinity || param === -Infinity;


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isInteger.js":
/*!***************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isInteger.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isInteger = (param) => (param | 0) === param;


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isIterable.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isIterable.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const isObject_1 = __webpack_require__(/*! ./isObject */ "./node_modules/tofu-js/dist/is/isObject.js");
const isFunction_1 = __webpack_require__(/*! ./isFunction */ "./node_modules/tofu-js/dist/is/isFunction.js");
exports.isIterable = (param) => isObject_1.isObject(param) && isFunction_1.isFunction(param[Symbol.iterator]);


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isMap.js":
/*!***********************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isMap.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isMap = (obj) => (Map ? obj instanceof Map : false);


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isNil.js":
/*!***********************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isNil.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const isNull_1 = __webpack_require__(/*! ./isNull */ "./node_modules/tofu-js/dist/is/isNull.js");
const isUndefined_1 = __webpack_require__(/*! ./isUndefined */ "./node_modules/tofu-js/dist/is/isUndefined.js");
exports.isNil = (param) => isNull_1.isNull(param) || isUndefined_1.isUndefined(param);


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isNull.js":
/*!************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isNull.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isNull = (param) => param === null;


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isNumber.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isNumber.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = (param) => typeof param === 'number';


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isObject.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isObject.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = (param) => param === Object(param);


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isSet.js":
/*!***********************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isSet.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isSet = (obj) => (Set ? obj instanceof Set : false);


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isString.js":
/*!**************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isString.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = (param) => typeof param === 'string';


/***/ }),

/***/ "./node_modules/tofu-js/dist/is/isUndefined.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/is/isUndefined.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isUndefined = (param) => typeof param === 'undefined';


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/chunk.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/chunk.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.chunk = fp_1.curry(function* (size, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    let chunks = [];
    for (const elem of iter) {
        if (chunks.length >= size) {
            yield chunks;
            chunks = [];
        }
        chunks.push(elem);
    }
    if (chunks.length) {
        yield chunks;
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/collectToArray.js":
/*!***************************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/collectToArray.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
const limit_1 = __webpack_require__(/*! ./limit */ "./node_modules/tofu-js/dist/iterators/limit.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.collectToArray = (iterable, max = Infinity) => is_1.isInfinite(max)
    ? [...toIterableOrEmpty_1.toIterableOrEmpty(iterable)]
    : exports.collectToArray(limit_1.limit(max, toIterableOrEmpty_1.toIterableOrEmpty(iterable)));


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/filter.js":
/*!*******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/filter.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.filter = fp_1.curry(function* (func, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const val of iter) {
        if (func(val))
            yield val;
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/first.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/first.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const take_1 = __webpack_require__(/*! ./take */ "./node_modules/tofu-js/dist/iterators/take.js");
exports.first = take_1.take(1);


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/firstOr.js":
/*!********************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/firstOr.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
exports.firstOr = fp_1.curry((defaultValue, iterable) => {
    for (const v of iterable) {
        return v;
    }
    return defaultValue;
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/firstOrNull.js":
/*!************************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/firstOrNull.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const firstOr_1 = __webpack_require__(/*! ./firstOr */ "./node_modules/tofu-js/dist/iterators/firstOr.js");
exports.firstOrNull = firstOr_1.firstOr(null);


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/flatMap.js":
/*!********************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/flatMap.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.flatMap = fp_1.curry(function* (func, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const val of iter) {
        const newIterable = func(val);
        if (is_1.isIterable(newIterable)) {
            for (const newVal of newIterable)
                yield newVal;
        }
        else {
            yield newIterable;
        }
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/flatten.js":
/*!********************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/flatten.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.flatten = fp_1.curry(function* (iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const val of iter) {
        if (is_1.isIterable(val)) {
            for (const innerVal of val)
                yield innerVal;
        }
        else {
            yield val;
        }
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/head.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/head.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const first_1 = __webpack_require__(/*! ./first */ "./node_modules/tofu-js/dist/iterators/first.js");
exports.head = first_1.first;


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/index.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./collectToArray */ "./node_modules/tofu-js/dist/iterators/collectToArray.js"));
__export(__webpack_require__(/*! ./filter */ "./node_modules/tofu-js/dist/iterators/filter.js"));
__export(__webpack_require__(/*! ./flatMap */ "./node_modules/tofu-js/dist/iterators/flatMap.js"));
__export(__webpack_require__(/*! ./flatten */ "./node_modules/tofu-js/dist/iterators/flatten.js"));
__export(__webpack_require__(/*! ./limit */ "./node_modules/tofu-js/dist/iterators/limit.js"));
__export(__webpack_require__(/*! ./map */ "./node_modules/tofu-js/dist/iterators/map.js"));
__export(__webpack_require__(/*! ./scan */ "./node_modules/tofu-js/dist/iterators/scan.js"));
__export(__webpack_require__(/*! ./skip */ "./node_modules/tofu-js/dist/iterators/skip.js"));
__export(__webpack_require__(/*! ./tap */ "./node_modules/tofu-js/dist/iterators/tap.js"));
__export(__webpack_require__(/*! ./zip */ "./node_modules/tofu-js/dist/iterators/zip.js"));
__export(__webpack_require__(/*! ./takeWhile */ "./node_modules/tofu-js/dist/iterators/takeWhile.js"));
__export(__webpack_require__(/*! ./chunk */ "./node_modules/tofu-js/dist/iterators/chunk.js"));
__export(__webpack_require__(/*! ./first */ "./node_modules/tofu-js/dist/iterators/first.js"));
__export(__webpack_require__(/*! ./take */ "./node_modules/tofu-js/dist/iterators/take.js"));
__export(__webpack_require__(/*! ./head */ "./node_modules/tofu-js/dist/iterators/head.js"));
__export(__webpack_require__(/*! ./firstOr */ "./node_modules/tofu-js/dist/iterators/firstOr.js"));
__export(__webpack_require__(/*! ./firstOrNull */ "./node_modules/tofu-js/dist/iterators/firstOrNull.js"));
__export(__webpack_require__(/*! ./join */ "./node_modules/tofu-js/dist/iterators/join.js"));
__export(__webpack_require__(/*! ./reduce */ "./node_modules/tofu-js/dist/iterators/reduce.js"));


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/join.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/join.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const collectToArray_1 = __webpack_require__(/*! ./collectToArray */ "./node_modules/tofu-js/dist/iterators/collectToArray.js");
exports.join = fp_1.curry(function* (separator, iterable) {
    yield collectToArray_1.collectToArray(toIterableOrEmpty_1.toIterableOrEmpty(iterable)).join(separator);
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/limit.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/limit.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.limit = fp_1.curry(function* (max, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    let count = 0;
    for (const val of iter) {
        if (count++ < (max | 0)) {
            yield val;
        }
        else {
            break;
        }
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/map.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/map.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.map = fp_1.curry(function* (func, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const val of iter)
        yield func(val);
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/reduce.js":
/*!*******************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/reduce.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.reduce = fp_1.curry(function (func, start, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    let accumulated = start;
    for (const val of iter) {
        accumulated = func(accumulated, val);
    }
    return accumulated;
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/scan.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/scan.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.scan = fp_1.curry(function* (func, start, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    let accumulated = start;
    for (const val of iter) {
        accumulated = func(accumulated, val);
        yield accumulated;
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/skip.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/skip.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.skip = fp_1.curry(function* (amt = 1, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable)[Symbol.iterator]();
    let isDone = false;
    for (let i = 0; i < amt && !isDone; ++i) {
        isDone = iter.next().done;
    }
    if (isDone)
        return;
    while (true) {
        const { done, value } = iter.next();
        if (done)
            return;
        yield value;
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/take.js":
/*!*****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/take.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
exports.take = fp_1.curry(function* (limit, iterable) {
    let i = 0;
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const v of iter) {
        if (i++ < limit) {
            yield v;
        }
        else {
            return;
        }
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/takeWhile.js":
/*!**********************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/takeWhile.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
exports.takeWhile = fp_1.curry(function* (whileFunc, iter) {
    if (is_1.isIterable(whileFunc)) {
        const whileIter = whileFunc[Symbol.iterator]();
        for (const val of iter) {
            const quitIndicator = whileIter.next();
            if (!quitIndicator.value || quitIndicator.done)
                return;
            yield val;
        }
    }
    else {
        for (const val of iter) {
            if (whileFunc(val))
                yield val;
            else
                return;
        }
    }
});
exports.takeWhilePullPush = fp_1.curry(function* (whileIterable, iter) {
    const whileIter = whileIterable[Symbol.iterator]();
    for (const val of iter) {
        let quitIndicator = whileIter.next();
        if (quitIndicator.done || !quitIndicator.value)
            return;
        quitIndicator = whileIter.next(val);
        if (quitIndicator.done || !quitIndicator.value)
            return;
        yield val;
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/tap.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/tap.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.tap = fp_1.curry(function* (func, iterable) {
    const iter = toIterableOrEmpty_1.toIterableOrEmpty(iterable);
    for (const val of iter) {
        func(val);
        yield val;
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js":
/*!******************************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
function toIterableOrEmpty(param) {
    if (!is_1.isIterable(param))
        return [];
    return param;
}
exports.toIterableOrEmpty = toIterableOrEmpty;


/***/ }),

/***/ "./node_modules/tofu-js/dist/iterators/zip.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/iterators/zip.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = __webpack_require__(/*! ../fp */ "./node_modules/tofu-js/dist/fp/index.js");
const toIterableOrEmpty_1 = __webpack_require__(/*! ./toIterableOrEmpty */ "./node_modules/tofu-js/dist/iterators/toIterableOrEmpty.js");
exports.zip = fp_1.curry(function* (iterableLeft, iterableRight, ...moreIterables) {
    const iterators = [iterableLeft, iterableRight]
        .concat(moreIterables)
        .map(toIterableOrEmpty_1.toIterableOrEmpty)
        .map(iterable => iterable[Symbol.iterator]());
    while (true) {
        const next = iterators.map(iterator => iterator.next());
        const items = next.map(({ value, done }) => (done ? null : value));
        if (next.reduce((acc, cur) => acc && cur.done, true))
            return;
        yield items;
    }
});


/***/ }),

/***/ "./node_modules/tofu-js/dist/objects/entries.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/objects/entries.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(/*! ../is */ "./node_modules/tofu-js/dist/is/index.js");
const iterators_1 = __webpack_require__(/*! ../iterators */ "./node_modules/tofu-js/dist/iterators/index.js");
exports.entries = (param) => {
    if (param instanceof Map) {
        return iterators_1.collectToArray(param.entries());
    }
    else if (param instanceof Set) {
        return iterators_1.collectToArray(param.entries());
    }
    else if (is_1.isObject(param)) {
        if (is_1.isFunction(param.entries)) {
            const paramEntries = param.entries();
            if (is_1.isIterable(paramEntries))
                return iterators_1.collectToArray(paramEntries);
        }
        return Object.entries(param);
    }
    else if (is_1.isArray(param)) {
        return param.map((v, i) => [i, v]);
    }
    else {
        return [];
    }
};


/***/ }),

/***/ "./node_modules/tofu-js/dist/objects/index.js":
/*!****************************************************!*\
  !*** ./node_modules/tofu-js/dist/objects/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./toPairs */ "./node_modules/tofu-js/dist/objects/toPairs.js"));
__export(__webpack_require__(/*! ./entries */ "./node_modules/tofu-js/dist/objects/entries.js"));


/***/ }),

/***/ "./node_modules/tofu-js/dist/objects/toPairs.js":
/*!******************************************************!*\
  !*** ./node_modules/tofu-js/dist/objects/toPairs.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const entries_1 = __webpack_require__(/*! ./entries */ "./node_modules/tofu-js/dist/objects/entries.js");
exports.toPairs = entries_1.entries;


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/grammar.ts":
/*!************************!*\
  !*** ./src/grammar.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
}); // Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley

function id(x) {
  return x[0];
}

var grammar = {
  Lexer: undefined,
  ParserRules: [{
    name: 'Main',
    symbols: ['EDN'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'EDN',
    symbols: ['Exp'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'Exp$subexpression$1',
    symbols: ['ElementSpace']
  }, {
    name: 'Exp$subexpression$1',
    symbols: ['ElementNoSpace']
  }, {
    name: 'Exp',
    symbols: ['Exp$subexpression$1'],
    postprocess: function postprocess(data) {
      return [].concat.apply([], data[0]);
    }
  }, {
    name: '_Exp',
    symbols: ['__exp']
  }, {
    name: '_Exp',
    symbols: ['__char'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: '__exp',
    symbols: ['_', 'Exp'],
    postprocess: function postprocess(data) {
      return data[1];
    }
  }, {
    name: '__char$ebnf$1$subexpression$1',
    symbols: ['_Exp']
  }, {
    name: '__char$ebnf$1$subexpression$1',
    symbols: ['ElementNoSpace']
  }, {
    name: '__char$ebnf$1',
    symbols: ['__char$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: '__char$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: '__char',
    symbols: ['Character', '__char$ebnf$1'],
    postprocess: function postprocess(data) {
      return [].concat.apply([], [data[0]].concat(data[1] ? [].concat.apply([], data[1]) : []));
    }
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Number']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Character']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Reserved']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Symbol']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Keyword']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Tag']
  }, {
    name: 'ElementSpace$subexpression$1',
    symbols: ['Discard']
  }, {
    name: 'ElementSpace$ebnf$1$subexpression$1',
    symbols: ['_Exp']
  }, {
    name: 'ElementSpace$ebnf$1$subexpression$1',
    symbols: ['ElementNoSpace']
  }, {
    name: 'ElementSpace$ebnf$1',
    symbols: ['ElementSpace$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'ElementSpace$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'ElementSpace',
    symbols: ['ElementSpace$subexpression$1', 'ElementSpace$ebnf$1'],
    postprocess: function postprocess(data) {
      return [].concat.apply([], [data[0][0]].concat(data[1] ? [].concat.apply([], data[1]) : []));
    }
  }, {
    name: 'ElementNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'ElementNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'ElementNoSpace$ebnf$1$subexpression$1',
    symbols: ['ElementNoSpace$ebnf$1$subexpression$1$ebnf$1', 'Exp']
  }, {
    name: 'ElementNoSpace$ebnf$1',
    symbols: ['ElementNoSpace$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'ElementNoSpace$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'ElementNoSpace',
    symbols: ['mapElementNoSpace', 'ElementNoSpace$ebnf$1'],
    postprocess: function postprocess(data) {
      return [data[0]].concat(data[1] ? data[1][1] : []);
    }
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Number']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Character']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Reserved']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Symbol']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Keyword']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Vector']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['List']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['String']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Map']
  }, {
    name: 'Element$subexpression$1',
    symbols: ['Set']
  }, {
    name: 'Element',
    symbols: ['Element$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0][0];
    }
  }, {
    name: 'Vector$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Vector$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Vector$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Vector$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Vector$ebnf$2$subexpression$1',
    symbols: ['Exp', 'Vector$ebnf$2$subexpression$1$ebnf$1']
  }, {
    name: 'Vector$ebnf$2',
    symbols: ['Vector$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'Vector$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Vector',
    symbols: [{
      literal: '['
    }, 'Vector$ebnf$1', 'Vector$ebnf$2', {
      literal: ']'
    }],
    postprocess: function postprocess(data) {
      return {
        type: 'vector',
        data: data[2] ? data[2][0] : []
      };
    }
  }, {
    name: 'List$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'List$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'List$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'List$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'List$ebnf$2$subexpression$1',
    symbols: ['Exp', 'List$ebnf$2$subexpression$1$ebnf$1']
  }, {
    name: 'List$ebnf$2',
    symbols: ['List$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'List$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'List',
    symbols: [{
      literal: '('
    }, 'List$ebnf$1', 'List$ebnf$2', {
      literal: ')'
    }],
    postprocess: function postprocess(data) {
      return {
        type: 'list',
        data: data[2] ? data[2][0] : []
      };
    }
  }, {
    name: 'Map$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Map$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Map$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Map$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Map$ebnf$2$subexpression$1',
    symbols: ['MapElem', 'Map$ebnf$2$subexpression$1$ebnf$1']
  }, {
    name: 'Map$ebnf$2',
    symbols: ['Map$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'Map$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Map',
    symbols: [{
      literal: '{'
    }, 'Map$ebnf$1', 'Map$ebnf$2', {
      literal: '}'
    }],
    postprocess: function postprocess(data) {
      return {
        type: 'map',
        data: data[2] ? data[2][0] : []
      };
    }
  }, {
    name: 'Set$string$1',
    symbols: [{
      literal: '#'
    }, {
      literal: '{'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'Set$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Set$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Set$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Set$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Set$ebnf$2$subexpression$1',
    symbols: ['Exp', 'Set$ebnf$2$subexpression$1$ebnf$1']
  }, {
    name: 'Set$ebnf$2',
    symbols: ['Set$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'Set$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Set',
    symbols: ['Set$string$1', 'Set$ebnf$1', 'Set$ebnf$2', {
      literal: '}'
    }],
    postprocess: function postprocess(data) {
      return {
        type: 'set',
        data: data[2] ? data[2][0] : []
      };
    }
  }, {
    name: 'Tag',
    symbols: [{
      literal: '#'
    }, 'Symbol', '_', 'Element'],
    postprocess: function postprocess(data, _l, reject) {
      if (data[1].data[0] === '_') return reject;
      return {
        type: 'tag',
        tag: data[1].data,
        data: data[3]
      };
    }
  }, {
    name: 'Discard$string$1',
    symbols: [{
      literal: '#'
    }, {
      literal: '_'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'Discard$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'Discard$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Discard',
    symbols: ['Discard$string$1', 'Discard$ebnf$1', 'Element'],
    postprocess: function postprocess() {
      return {
        type: 'discard'
      };
    }
  }, {
    name: 'String$ebnf$1',
    symbols: []
  }, {
    name: 'String$ebnf$1',
    symbols: ['String$ebnf$1', 'string_char'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'String',
    symbols: [{
      literal: '"'
    }, 'String$ebnf$1', {
      literal: '"'
    }],
    postprocess: function postprocess(data) {
      return {
        type: 'string',
        data: data[1].join('')
      };
    }
  }, {
    name: 'string_char',
    symbols: [/[^\\"]/]
  }, {
    name: 'string_char',
    symbols: ['backslash']
  }, {
    name: 'string_char',
    symbols: ['backslash_unicode'],
    postprocess: id
  }, {
    name: 'backslash',
    symbols: [{
      literal: '\\'
    }, /["trn\\]/],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'backslash_unicode',
    symbols: [{
      literal: '\\'
    }, 'unicode'],
    postprocess: function postprocess(data) {
      return data[1];
    }
  }, {
    name: 'Reserved$subexpression$1',
    symbols: ['boolean']
  }, {
    name: 'Reserved$subexpression$1',
    symbols: ['nil']
  }, {
    name: 'Reserved',
    symbols: ['Reserved$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0][0];
    }
  }, {
    name: 'boolean$subexpression$1',
    symbols: ['true']
  }, {
    name: 'boolean$subexpression$1',
    symbols: ['false']
  }, {
    name: 'boolean',
    symbols: ['boolean$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0][0];
    }
  }, {
    name: 'true$string$1',
    symbols: [{
      literal: 't'
    }, {
      literal: 'r'
    }, {
      literal: 'u'
    }, {
      literal: 'e'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'true',
    symbols: ['true$string$1'],
    postprocess: function postprocess() {
      return {
        type: 'bool',
        data: true
      };
    }
  }, {
    name: 'false$string$1',
    symbols: [{
      literal: 'f'
    }, {
      literal: 'a'
    }, {
      literal: 'l'
    }, {
      literal: 's'
    }, {
      literal: 'e'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'false',
    symbols: ['false$string$1'],
    postprocess: function postprocess() {
      return {
        type: 'bool',
        data: false
      };
    }
  }, {
    name: 'nil$string$1',
    symbols: [{
      literal: 'n'
    }, {
      literal: 'i'
    }, {
      literal: 'l'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'nil',
    symbols: ['nil$string$1'],
    postprocess: function postprocess() {
      return {
        type: 'nil',
        data: null
      };
    }
  }, {
    name: 'Symbol$subexpression$1',
    symbols: ['symbol']
  }, {
    name: 'Symbol$subexpression$1',
    symbols: [{
      literal: '/'
    }]
  }, {
    name: 'Symbol',
    symbols: ['Symbol$subexpression$1'],
    postprocess: function postprocess(data, _, reject) {
      if (data[0][0] === 'true' || data[0][0] === 'false' || data[0][0] === 'nil') return reject;
      return {
        type: 'symbol',
        data: data[0][0]
      };
    }
  }, {
    name: 'symbol$ebnf$1$subexpression$1',
    symbols: [{
      literal: '/'
    }, 'symbol_piece']
  }, {
    name: 'symbol$ebnf$1',
    symbols: ['symbol$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'symbol',
    symbols: ['symbol_piece', 'symbol$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0] + (data[1] ? data[1].join('') : '');
    }
  }, {
    name: 'symbol_piece',
    symbols: ['symbol_piece_basic']
  }, {
    name: 'symbol_piece',
    symbols: ['symbol_piece_num'],
    postprocess: id
  }, {
    name: 'symbol_piece_basic$ebnf$1',
    symbols: []
  }, {
    name: 'symbol_piece_basic$ebnf$1',
    symbols: ['symbol_piece_basic$ebnf$1', 'symbol_mid'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'symbol_piece_basic',
    symbols: ['symbol_start', 'symbol_piece_basic$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0] + data[1].join('');
    }
  }, {
    name: 'symbol_piece_num$ebnf$1$subexpression$1$ebnf$1',
    symbols: []
  }, {
    name: 'symbol_piece_num$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['symbol_piece_num$ebnf$1$subexpression$1$ebnf$1', 'symbol_mid'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'symbol_piece_num$ebnf$1$subexpression$1',
    symbols: ['symbol_second_special', 'symbol_piece_num$ebnf$1$subexpression$1$ebnf$1']
  }, {
    name: 'symbol_piece_num$ebnf$1',
    symbols: ['symbol_piece_num$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol_piece_num$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'symbol_piece_num',
    symbols: [/[\-+.]/, 'symbol_piece_num$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0] + (data[1] ? data[1][0] + data[1][1].join('') : '');
    }
  }, {
    name: 'symbol_basic$ebnf$1',
    symbols: []
  }, {
    name: 'symbol_basic$ebnf$1',
    symbols: ['symbol_basic$ebnf$1', 'symbol_mid'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'symbol_basic$ebnf$2$subexpression$1',
    symbols: [{
      literal: '/'
    }, 'symbol_piece']
  }, {
    name: 'symbol_basic$ebnf$2',
    symbols: ['symbol_basic$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol_basic$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'symbol_basic',
    symbols: ['symbol_start', 'symbol_basic$ebnf$1', 'symbol_basic$ebnf$2'],
    postprocess: function postprocess(data) {
      return data[0] + data[1].join('') + (data[2] ? data[2].join('') : '');
    }
  }, {
    name: 'symbol_start',
    symbols: ['letter']
  }, {
    name: 'symbol_start',
    symbols: [/[*~_!?$%&=<>]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'symbol_mid',
    symbols: ['letter']
  }, {
    name: 'symbol_mid',
    symbols: ['digit']
  }, {
    name: 'symbol_mid',
    symbols: [/[.*\!\-+_?$%&=<>:#]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1',
    symbols: []
  }, {
    name: 'symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1', 'symbol_mid'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'symbol_like_a_num$ebnf$1$subexpression$1',
    symbols: ['symbol_second_special', 'symbol_like_a_num$ebnf$1$subexpression$1$ebnf$1']
  }, {
    name: 'symbol_like_a_num$ebnf$1',
    symbols: ['symbol_like_a_num$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol_like_a_num$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'symbol_like_a_num$ebnf$2$subexpression$1',
    symbols: [{
      literal: '/'
    }, 'symbol_piece']
  }, {
    name: 'symbol_like_a_num$ebnf$2',
    symbols: ['symbol_like_a_num$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'symbol_like_a_num$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'symbol_like_a_num',
    symbols: [/[\-+.]/, 'symbol_like_a_num$ebnf$1', 'symbol_like_a_num$ebnf$2'],
    postprocess: function postprocess(data) {
      return data[0] + (data[1] ? data[1][0] + data[1][1].join('') : '') + (data[2] ? data[2].join('') : '');
    }
  }, {
    name: 'symbol_second_special',
    symbols: ['symbol_start']
  }, {
    name: 'symbol_second_special',
    symbols: [/[\-+.:#]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'Keyword',
    symbols: [{
      literal: ':'
    }, 'Symbol'],
    postprocess: function postprocess(data) {
      return {
        type: 'keyword',
        data: ':' + data[1].data
      };
    }
  }, {
    name: 'Character',
    symbols: [{
      literal: '\\'
    }, 'char'],
    postprocess: function postprocess(data) {
      return {
        type: 'char',
        data: data[1][0]
      };
    }
  }, {
    name: 'char',
    symbols: [/[^ \t\r\n]/]
  }, {
    name: 'char$string$1',
    symbols: [{
      literal: 'n'
    }, {
      literal: 'e'
    }, {
      literal: 'w'
    }, {
      literal: 'l'
    }, {
      literal: 'i'
    }, {
      literal: 'n'
    }, {
      literal: 'e'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'char',
    symbols: ['char$string$1']
  }, {
    name: 'char$string$2',
    symbols: [{
      literal: 'r'
    }, {
      literal: 'e'
    }, {
      literal: 't'
    }, {
      literal: 'u'
    }, {
      literal: 'r'
    }, {
      literal: 'n'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'char',
    symbols: ['char$string$2']
  }, {
    name: 'char$string$3',
    symbols: [{
      literal: 's'
    }, {
      literal: 'p'
    }, {
      literal: 'a'
    }, {
      literal: 'c'
    }, {
      literal: 'e'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'char',
    symbols: ['char$string$3']
  }, {
    name: 'char$string$4',
    symbols: [{
      literal: 't'
    }, {
      literal: 'a'
    }, {
      literal: 'b'
    }],
    postprocess: function joiner(d) {
      return d.join('');
    }
  }, {
    name: 'char',
    symbols: ['char$string$4']
  }, {
    name: 'char',
    symbols: ['unicode'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'Number',
    symbols: ['Integer']
  }, {
    name: 'Number',
    symbols: ['Float'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'Float',
    symbols: ['float'],
    postprocess: function postprocess(data) {
      return {
        type: 'double',
        data: data[0][0],
        arbitrary: !!data[0][1]
      };
    }
  }, {
    name: 'Integer$ebnf$1',
    symbols: [{
      literal: 'N'
    }],
    postprocess: id
  }, {
    name: 'Integer$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'Integer',
    symbols: ['int', 'Integer$ebnf$1'],
    postprocess: function postprocess(data) {
      return {
        type: 'int',
        data: data[0][0],
        arbitrary: !!data[1]
      };
    }
  }, {
    name: 'float',
    symbols: ['int', {
      literal: 'M'
    }],
    postprocess: function postprocess(data) {
      return [data.slice(0, 1).join(''), data[1]];
    }
  }, {
    name: 'float$ebnf$1',
    symbols: [{
      literal: 'M'
    }],
    postprocess: id
  }, {
    name: 'float$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'float',
    symbols: ['int', 'frac', 'float$ebnf$1'],
    postprocess: function postprocess(data) {
      return [data.slice(0, 2).join(''), data[2]];
    }
  }, {
    name: 'float$ebnf$2',
    symbols: [{
      literal: 'M'
    }],
    postprocess: id
  }, {
    name: 'float$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'float',
    symbols: ['int', 'exp', 'float$ebnf$2'],
    postprocess: function postprocess(data) {
      return [data.slice(0, 2).join(''), data[2]];
    }
  }, {
    name: 'float$ebnf$3',
    symbols: [{
      literal: 'M'
    }],
    postprocess: id
  }, {
    name: 'float$ebnf$3',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'float',
    symbols: ['int', 'frac', 'exp', 'float$ebnf$3'],
    postprocess: function postprocess(data) {
      return [data.slice(0, 3).join(''), data[2]];
    }
  }, {
    name: 'frac$ebnf$1',
    symbols: []
  }, {
    name: 'frac$ebnf$1',
    symbols: ['frac$ebnf$1', 'digit'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'frac',
    symbols: [{
      literal: '.'
    }, 'frac$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0] + data[1].join('');
    }
  }, {
    name: 'exp',
    symbols: ['ex', 'digits'],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'ex$subexpression$1',
    symbols: [{
      literal: 'e'
    }]
  }, {
    name: 'ex$subexpression$1',
    symbols: [{
      literal: 'E'
    }]
  }, {
    name: 'ex$ebnf$1$subexpression$1',
    symbols: [{
      literal: '+'
    }]
  }, {
    name: 'ex$ebnf$1$subexpression$1',
    symbols: [{
      literal: '-'
    }]
  }, {
    name: 'ex$ebnf$1',
    symbols: ['ex$ebnf$1$subexpression$1'],
    postprocess: id
  }, {
    name: 'ex$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'ex',
    symbols: ['ex$subexpression$1', 'ex$ebnf$1'],
    postprocess: function postprocess(data) {
      return 'e' + (data[1] || '+');
    }
  }, {
    name: 'int',
    symbols: ['int_no_prefix']
  }, {
    name: 'int',
    symbols: [{
      literal: '+'
    }, 'int_no_prefix'],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'int',
    symbols: [{
      literal: '-'
    }, 'int_no_prefix'],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'int_no_prefix',
    symbols: [{
      literal: '0'
    }],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'int_no_prefix$ebnf$1',
    symbols: []
  }, {
    name: 'int_no_prefix$ebnf$1',
    symbols: ['int_no_prefix$ebnf$1', 'digit'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'int_no_prefix',
    symbols: ['oneToNine', 'int_no_prefix$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0] + data[1].join('');
    }
  }, {
    name: 'oneToNine',
    symbols: [/[1-9]/],
    postprocess: function postprocess(data) {
      return data.join('');
    }
  }, {
    name: 'MapElem',
    symbols: ['mapKey', 'mapValue'],
    postprocess: function postprocess(data) {
      return [[data[0][0], data[1][0]]].concat(data[1].slice(1));
    }
  }, {
    name: 'mapKey$subexpression$1',
    symbols: ['mapKeySpace']
  }, {
    name: 'mapKey$subexpression$1',
    symbols: ['mapKeyNoSpace']
  }, {
    name: 'mapKey',
    symbols: ['mapKey$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'mapValue$subexpression$1',
    symbols: ['mapValueSpace']
  }, {
    name: 'mapValue$subexpression$1',
    symbols: ['mapValueNoSpace']
  }, {
    name: 'mapValue',
    symbols: ['mapValue$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0][0];
    }
  }, {
    name: 'mapKeySpace$ebnf$1',
    symbols: []
  }, {
    name: 'mapKeySpace$ebnf$1$subexpression$1',
    symbols: ['Discard', '_']
  }, {
    name: 'mapKeySpace$ebnf$1',
    symbols: ['mapKeySpace$ebnf$1', 'mapKeySpace$ebnf$1$subexpression$1'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'mapKeySpace',
    symbols: ['mapKeySpace$ebnf$1', 'mapElementSpace', '_'],
    postprocess: function postprocess(data) {
      return data[1];
    }
  }, {
    name: 'mapKeyNoSpace$ebnf$1',
    symbols: []
  }, {
    name: 'mapKeyNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'mapKeyNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapKeyNoSpace$ebnf$1$subexpression$1',
    symbols: ['Discard', 'mapKeyNoSpace$ebnf$1$subexpression$1$ebnf$1']
  }, {
    name: 'mapKeyNoSpace$ebnf$1',
    symbols: ['mapKeyNoSpace$ebnf$1', 'mapKeyNoSpace$ebnf$1$subexpression$1'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'mapKeyNoSpace$ebnf$2',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'mapKeyNoSpace$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapKeyNoSpace',
    symbols: ['mapKeyNoSpace$ebnf$1', 'mapElementNoSpace', 'mapKeyNoSpace$ebnf$2'],
    postprocess: function postprocess(data) {
      return data[1];
    }
  }, {
    name: 'mapValueSpace$ebnf$1',
    symbols: []
  }, {
    name: 'mapValueSpace$ebnf$1$subexpression$1',
    symbols: ['Discard', '_']
  }, {
    name: 'mapValueSpace$ebnf$1',
    symbols: ['mapValueSpace$ebnf$1', 'mapValueSpace$ebnf$1$subexpression$1'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'mapValueSpace$ebnf$2$subexpression$1',
    symbols: ['_', 'MapElem']
  }, {
    name: 'mapValueSpace$ebnf$2',
    symbols: ['mapValueSpace$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'mapValueSpace$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapValueSpace',
    symbols: ['mapValueSpace$ebnf$1', 'mapElementSpace', 'mapValueSpace$ebnf$2'],
    postprocess: function postprocess(data) {
      return [data[1]].concat(data[2] ? data[2][1] : []);
    }
  }, {
    name: 'mapValueNoSpace$ebnf$1',
    symbols: []
  }, {
    name: 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapValueNoSpace$ebnf$1$subexpression$1',
    symbols: ['Discard', 'mapValueNoSpace$ebnf$1$subexpression$1$ebnf$1']
  }, {
    name: 'mapValueNoSpace$ebnf$1',
    symbols: ['mapValueNoSpace$ebnf$1', 'mapValueNoSpace$ebnf$1$subexpression$1'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'mapValueNoSpace$ebnf$2$subexpression$1$ebnf$1',
    symbols: ['_'],
    postprocess: id
  }, {
    name: 'mapValueNoSpace$ebnf$2$subexpression$1$ebnf$1',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapValueNoSpace$ebnf$2$subexpression$1',
    symbols: ['mapValueNoSpace$ebnf$2$subexpression$1$ebnf$1', 'MapElem']
  }, {
    name: 'mapValueNoSpace$ebnf$2',
    symbols: ['mapValueNoSpace$ebnf$2$subexpression$1'],
    postprocess: id
  }, {
    name: 'mapValueNoSpace$ebnf$2',
    symbols: [],
    postprocess: function postprocess() {
      return null;
    }
  }, {
    name: 'mapValueNoSpace',
    symbols: ['mapValueNoSpace$ebnf$1', 'mapElementNoSpace', 'mapValueNoSpace$ebnf$2'],
    postprocess: function postprocess(data) {
      return [data[1]].concat(data[2] ? data[2][1] : []);
    }
  }, {
    name: 'mapElementNoSpace$subexpression$1',
    symbols: ['Vector']
  }, {
    name: 'mapElementNoSpace$subexpression$1',
    symbols: ['List']
  }, {
    name: 'mapElementNoSpace$subexpression$1',
    symbols: ['String']
  }, {
    name: 'mapElementNoSpace$subexpression$1',
    symbols: ['Map']
  }, {
    name: 'mapElementNoSpace$subexpression$1',
    symbols: ['Set']
  }, {
    name: 'mapElementNoSpace',
    symbols: ['mapElementNoSpace$subexpression$1'],
    postprocess: function postprocess(data) {
      return data[0][0];
    }
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Number']
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Character']
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Reserved']
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Symbol']
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Keyword']
  }, {
    name: 'mapElementSpace$subexpression$1',
    symbols: ['Tag']
  }, {
    name: 'mapElementSpace',
    symbols: ['mapElementSpace$subexpression$1'],
    postprocess: function postprocess(data) {
      return [].concat.apply([], [data[0][0]])[0];
    }
  }, {
    name: 'hexDigit',
    symbols: [/[a-fA-F0-9]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'unicode',
    symbols: [{
      literal: 'u'
    }, 'hexDigit', 'hexDigit', 'hexDigit', 'hexDigit'],
    postprocess: function postprocess(data) {
      return String.fromCharCode(parseInt(data.slice(1).join(''), 16));
    }
  }, {
    name: '_',
    symbols: ['space'],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'space$ebnf$1',
    symbols: [/[\s,\n]/]
  }, {
    name: 'space$ebnf$1',
    symbols: ['space$ebnf$1', /[\s,\n]/],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'space',
    symbols: ['space$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0].join('');
    }
  }, {
    name: 'digits$ebnf$1',
    symbols: ['digit']
  }, {
    name: 'digits$ebnf$1',
    symbols: ['digits$ebnf$1', 'digit'],
    postprocess: function arrpush(d) {
      return d[0].concat([d[1]]);
    }
  }, {
    name: 'digits',
    symbols: ['digits$ebnf$1'],
    postprocess: function postprocess(data) {
      return data[0].join('');
    }
  }, {
    name: 'digit',
    symbols: [/[0-9]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }, {
    name: 'letter',
    symbols: [/[a-zA-Z]/],
    postprocess: function postprocess(data) {
      return data[0];
    }
  }],
  ParserStart: 'Main'
}; // Do the parsing

var nearley_1 = __webpack_require__(/*! nearley */ "./node_modules/nearley/lib/nearley.js");

var preprocessor_1 = __webpack_require__(/*! ./preprocessor */ "./src/preprocessor.ts");

function parse(string) {
  var parser = new nearley_1.Parser(nearley_1.Grammar.fromCompiled(grammar));
  var str = preprocessor_1.preprocess(string);
  if (!str) return null;

  try {
    return parser.feed(preprocessor_1.preprocess(string)).results[0];
  } catch (_a) {
    return false;
  }
}

exports.parse = parse;

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var grammar_1 = __webpack_require__(/*! ./grammar */ "./src/grammar.ts");

var interpreter_1 = __webpack_require__(/*! ./interpreter */ "./src/interpreter.ts");

var stringify_1 = __webpack_require__(/*! ./stringify */ "./src/stringify.ts");

var json_interpreter_1 = __webpack_require__(/*! ./json_interpreter */ "./src/json_interpreter.ts");

var types = __importStar(__webpack_require__(/*! ./types */ "./src/types.ts"));

exports.Edn = {
  parse: function parse(str) {
    return interpreter_1.processTokens(grammar_1.parse(str));
  },
  parseJson: function parseJson(str) {
    return json_interpreter_1.processTokens(grammar_1.parse(str));
  },
  stringify: stringify_1.stringify,
  types: types
};

/***/ }),

/***/ "./src/interpreter.ts":
/*!****************************!*\
  !*** ./src/interpreter.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");

var arrays_1 = __webpack_require__(/*! tofu-js/dist/arrays */ "./node_modules/tofu-js/dist/arrays/index.js");

var is_1 = __webpack_require__(/*! tofu-js/dist/is */ "./node_modules/tofu-js/dist/is/index.js");

var strings_1 = __webpack_require__(/*! ./strings */ "./src/strings.ts");

function processTokens(tokens) {
  if (!is_1.isArray(tokens)) {
    throw 'Invalid EDN string';
  }

  return tokens.filter(function (t) {
    return t && t.type !== 'discard';
  }).map(processToken);
}

exports.processTokens = processTokens;

function processToken(token) {
  var data = token.data,
      type = token.type,
      tag = token.tag;

  switch (type) {
    case 'double':
      return parseFloat(data);

    case 'int':
      return parseInt(data);

    case 'string':
      return strings_1.unescapeStr(data);

    case 'char':
      return data;

    case 'keyword':
      return types_1.keyword(data);

    case 'symbol':
      return types_1.symbol(data);

    case 'boolean':
    case 'bool':
      return data === 'true' || data === true;

    case 'tag':
      return processTag(tag, data);

    case 'list':
    case 'vector':
      return processTokens(data);

    case 'set':
      return types_1.set(processTokens(data));

    case 'map':
      return types_1.map(arrays_1.flatMap(processTokens, data));
  }

  return null;
}

function processTag(tagName, data) {
  return types_1.tag(tagName, processToken(data));
}

/***/ }),

/***/ "./src/json_interpreter.ts":
/*!*********************************!*\
  !*** ./src/json_interpreter.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var arrays_1 = __webpack_require__(/*! tofu-js/dist/arrays */ "./node_modules/tofu-js/dist/arrays/index.js");

var is_1 = __webpack_require__(/*! tofu-js/dist/is */ "./node_modules/tofu-js/dist/is/index.js");

var strings_1 = __webpack_require__(/*! ./strings */ "./src/strings.ts");

function processTokens(tokens) {
  if (!is_1.isArray(tokens)) {
    throw 'Invalid EDN string';
  }

  return tokens.filter(function (t) {
    return t && t.type !== 'discard';
  }).map(processToken);
}

exports.processTokens = processTokens;

function processToken(token) {
  var data = token.data,
      type = token.type,
      tag = token.tag;

  switch (type) {
    case 'double':
      return parseFloat(data);

    case 'int':
      return parseInt(data);

    case 'string':
      return strings_1.unescapeStr(data);

    case 'char':
      return data;

    case 'keyword':
      return data;

    case 'symbol':
      return data;

    case 'boolean':
    case 'bool':
      return data === 'true' || data === true;

    case 'tag':
      return {
        tag: tag,
        value: processToken(data)
      };

    case 'list':
    case 'vector':
      return processTokens(data);

    case 'set':
      return arrays_1.fromPairs(arrays_1.map(function (t) {
        return [t, t];
      }, processTokens(data)));

    case 'map':
      return arrays_1.fromPairs(arrays_1.chunk(2, arrays_1.flatMap(processTokens, data)));
  }

  return null;
}

/***/ }),

/***/ "./src/preprocessor.ts":
/*!*****************************!*\
  !*** ./src/preprocessor.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.preprocess = function (str) {
  return removeComments(str).trim();
};

function removeComments(str) {
  var newStr = '';
  var inQuotes = false;
  var inComment = false;
  var skip = false;

  for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
    var c = str_1[_i];

    if (skip) {
      newStr += c;
      skip = false;
    } else if (c === ';' && !inQuotes) {
      inComment = true;
    } else if (c === '\n') {
      newStr += '\n';
      inComment = false;
    } else if (!inComment) {
      newStr += c;
      if (c === '\\') skip = true;else if (c === '"') inQuotes = !inQuotes;
    }
  }

  return newStr;
}

/***/ }),

/***/ "./src/stringify.ts":
/*!**************************!*\
  !*** ./src/stringify.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var fp_1 = __webpack_require__(/*! tofu-js/dist/fp */ "./node_modules/tofu-js/dist/fp/index.js");

var iterators_1 = __webpack_require__(/*! tofu-js/dist/iterators */ "./node_modules/tofu-js/dist/iterators/index.js");

var arrays_1 = __webpack_require__(/*! tofu-js/dist/arrays */ "./node_modules/tofu-js/dist/arrays/index.js");

var types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");

var objects_1 = __webpack_require__(/*! tofu-js/dist/objects */ "./node_modules/tofu-js/dist/objects/index.js");

exports.stringify = function (data) {
  var typeOf = types_1.type(data);

  switch (typeOf) {
    case 'Nil':
      return 'nil';

    case 'Number':
      return '' + data;

    case 'String':
      return JSON.stringify(data);

    case 'Map':
      return stringifyMap(data);

    case 'Set':
      return stringifySet(data);

    case 'Tag':
      return stringifyTag(data);

    case 'Symbol':
      return stringifySymbol(data);

    case 'Keyword':
      return stringifyKeyword(data);

    case 'Vector':
      return stringifyVector(data);

    default:
      return '' + data;
  }
};

function stringifyMap(data) {
  return '{' + fp_1.pipe(objects_1.entries(data), iterators_1.flatten, iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) + '}';
}

function stringifySet(data) {
  return '#{' + fp_1.pipe(data.values(), iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) + '}';
}

function stringifyTag(data) {
  return '#' + data.tag.symbol + ' ' + exports.stringify(data.data);
}

function stringifySymbol(data) {
  return data.symbol;
}

function stringifyKeyword(data) {
  return ':' + data.keyword;
}

function stringifyVector(data) {
  return '[' + arrays_1.map(exports.stringify, data).join(' ') + ']';
}

/***/ }),

/***/ "./src/strings.ts":
/*!************************!*\
  !*** ./src/strings.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function unescapeChar(str) {
  if (!str.length) {
    return '\\';
  }

  var _char = str[0];
  var rest = str.substr(1);

  switch (_char.toLowerCase()) {
    case 'n':
      return "\n" + rest;

    case 'r':
      return "\r" + rest;

    case 't':
      return "\t" + rest;

    case '\\':
      return "\\" + rest;

    case "'":
      return "'" + rest;

    case '"':
      return "\"" + rest;

    case 'b':
      return "\b" + rest;

    case 'f':
      return "\f" + rest;
    /// TODO: Unescape unicode characters

    default:
      return str;
  }
}

exports.unescapeChar = unescapeChar;

function unescapeStr(str) {
  var parts = str.split('\\');
  return parts.map(function (p, i) {
    return i ? unescapeChar(p) : p;
  }).join('');
}

exports.unescapeStr = unescapeStr;

/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var is_1 = __webpack_require__(/*! tofu-js/dist/is */ "./node_modules/tofu-js/dist/is/index.js");

var arrays_1 = __webpack_require__(/*! tofu-js/dist/arrays */ "./node_modules/tofu-js/dist/arrays/index.js");

var iterators_1 = __webpack_require__(/*! tofu-js/dist/iterators */ "./node_modules/tofu-js/dist/iterators/index.js");

var fp_1 = __webpack_require__(/*! tofu-js/dist/fp */ "./node_modules/tofu-js/dist/fp/index.js");

var EdnKeyword =
/** @class */
function () {
  function EdnKeyword(keyword) {
    this._keyword = '';
    this.keyword = keyword;
  }

  Object.defineProperty(EdnKeyword.prototype, "keyword", {
    get: function get() {
      return this._keyword;
    },
    set: function set(keyword) {
      if (keyword[0] === ':') {
        keyword = keyword.substr(1);
      }

      this._keyword = keyword;
    },
    enumerable: true,
    configurable: true
  });
  return EdnKeyword;
}();

exports.EdnKeyword = EdnKeyword;

var EdnSymbol =
/** @class */
function () {
  function EdnSymbol(symbol) {
    this.symbol = symbol;
  }

  return EdnSymbol;
}();

exports.EdnSymbol = EdnSymbol;

var EdnTag =
/** @class */
function () {
  function EdnTag(tag, data) {
    this.data = data;
    if (is_1.isString(tag)) this.tag = new EdnSymbol(tag);else this.tag = tag;
  }

  return EdnTag;
}();

exports.EdnTag = EdnTag;

var AnyKeyMap =
/** @class */
function () {
  function AnyKeyMap(data) {
    this.data = new Map();
    this.data = new Map(fp_1.pipe(data, arrays_1.chunk(2), arrays_1.map(function (_a) {
      var key = _a[0],
          value = _a[1];
      return [toKey(key), {
        key: key,
        value: value
      }];
    })));
  }

  AnyKeyMap.prototype.get = function (key) {
    var k = toKey(key);

    if (this.data.has(k)) {
      return this.data.get(k).value;
    } else {
      return null;
    }
  };

  AnyKeyMap.prototype.has = function (key) {
    return this.data.has(toKey(key));
  };

  AnyKeyMap.prototype.set = function (key, value) {
    this.data.set(toKey(key), {
      key: key,
      value: value
    });
  };

  AnyKeyMap.prototype.keys = function () {
    return iterators_1.map(function (_a) {
      var key = _a.key;
      return key;
    }, this.data.values());
  };

  AnyKeyMap.prototype.values = function () {
    return iterators_1.map(function (_a) {
      var value = _a.value;
      return value;
    }, this.data.values());
  };

  AnyKeyMap.prototype["delete"] = function (key) {
    return this.data["delete"](toKey(key));
  };

  AnyKeyMap.prototype.clear = function () {
    this.data.clear();
  };

  AnyKeyMap.prototype[Symbol.iterator] = function () {
    return this.entries();
  };

  AnyKeyMap.prototype.entries = function () {
    return iterators_1.map(function (_a) {
      var key = _a.key,
          value = _a.value;
      return [key, value];
    }, this.data.values());
  };

  return AnyKeyMap;
}();

var EdnMap =
/** @class */
function () {
  function EdnMap(data) {
    var _this = this;

    this.has = function (key) {
      return _this.data.has(key);
    };

    this.clear = function () {
      return _this.data.clear();
    };

    this["delete"] = function (key) {
      return _this.data["delete"](key);
    };

    this.entries = function () {
      return _this.data.entries();
    };

    this.get = function (key) {
      return _this.data.get(key);
    };

    this.keys = function () {
      return _this.data.keys();
    };

    this.set = function (key, value) {
      return _this.data.set(key, value);
    };

    this.values = function () {
      return _this.data.values();
    };

    this[Symbol.iterator] = function () {
      return _this.data[Symbol.iterator]();
    };

    this.data = new AnyKeyMap(data);
  }

  return EdnMap;
}();

exports.EdnMap = EdnMap;

var EdnSet =
/** @class */
function () {
  function EdnSet(data) {
    var _this = this;

    this.add = function (elem) {
      return _this.data.set(elem, elem);
    };

    this.clear = function () {
      return _this.data.clear();
    };

    this.has = function (elem) {
      return _this.data.has(elem);
    };

    this["delete"] = function (elem) {
      return _this.data["delete"](elem);
    };

    this.entries = function () {
      return _this.data.entries();
    };

    this.values = function () {
      return _this.data.values();
    };

    this[Symbol.iterator] = function () {
      return _this.data[Symbol.iterator]();
    };

    this.data = new AnyKeyMap(fp_1.pipe(data, arrays_1.map(function (d) {
      return [d, d];
    }), arrays_1.flatten));
  }

  return EdnSet;
}();

exports.EdnSet = EdnSet;

function toKey(input) {
  return type(input) + '#' + toString(input);
}

function toString(input) {
  if (is_1.isNil(input)) {
    return 'null';
  }

  return JSON.stringify(input);
}

function type(input) {
  if (is_1.isNil(input)) {
    return 'Nil';
  } else if (is_1.isNumber(input)) {
    return 'Number';
  } else if (is_1.isString(input)) {
    return 'String';
  } else if (input instanceof EdnTag) {
    return 'Tag';
  } else if (input instanceof EdnSymbol) {
    return 'Symbol';
  } else if (input instanceof EdnKeyword) {
    return 'Keyword';
  } else if (input instanceof EdnSet) {
    return 'Set';
  } else if (is_1.isArray(input)) {
    return 'Vector';
  } else if (is_1.isObject(input) || input instanceof EdnMap) {
    return 'Map';
  } else {
    return 'Other';
  }
}

exports.type = type;

exports.keyword = function (str) {
  return new EdnKeyword(str);
};

exports.symbol = function (str) {
  return new EdnSymbol(str);
};

exports.set = function (data) {
  return new EdnSet(data);
};

exports.map = function (data) {
  return new EdnMap(data);
};

exports.tag = function (tag, data) {
  return new EdnTag(tag, data);
};

exports.stringify = function (data) {
  var typeOf = type(data);

  switch (typeOf) {
    case 'Nil':
      return 'nil';

    case 'Number':
      return '' + data;

    case 'String':
      return JSON.stringify(data);

    case 'Map':
      return stringifyMap(data);

    case 'Set':
      return stringifySet(data);

    case 'Tag':
      return stringifyTag(data);

    case 'Symbol':
      return stringifySymbol(data);

    case 'Keyword':
      return stringifyKeyword(data);

    case 'Vector':
      return stringifyVector(data);

    default:
      return '' + data;
  }
};

function stringifyMap(data) {
  return '{' + fp_1.pipe(data.entries(), iterators_1.flatten, iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) + '}';
}

function stringifySet(data) {
  return '#{' + fp_1.pipe(data.values(), iterators_1.map(exports.stringify), iterators_1.collectToArray, arrays_1.join(' ')) + '}';
}

function stringifyTag(data) {
  return '#' + data.tag.symbol + ' ' + exports.stringify(data.data);
}

function stringifySymbol(data) {
  return data.symbol;
}

function stringifyKeyword(data) {
  return ':' + data.keyword;
}

function stringifyVector(data) {
  return '[' + arrays_1.map(exports.stringify, data).join(' ') + ']';
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9pc2FycmF5L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9uZWFybGV5L2xpYi9uZWFybGV5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2NodW5rLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2ZpbHRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9maXJzdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9maXJzdE9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2ZpcnN0T3JOdWxsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL2ZsYXRNYXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvZmxhdHRlbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9mcm9tUGFpcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvam9pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9saW1pdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvcmVkdWNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL3NjYW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvc2tpcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2FycmF5cy90YWtlV2hpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9hcnJheXMvdGFwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL3RvQXJyYXlPckVtcHR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvYXJyYXlzL3ppcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2ZwL2N1cnJ5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvZnAvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9mcC9waXBlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvZnAvcHJlZGljYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvZnAvcmV2ZXJzZUFyZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9mcC9yZXZlcnNlQ3VycnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9mcC9zcHJlYWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc0J1ZmZlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzRmxvYXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc0Z1bmN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXMvaXNJbmZpbml0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzSW50ZWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzSXRlcmFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc01hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzTmlsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXMvaXNOdWxsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXMvaXNOdW1iZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2lzL2lzU2V0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXMvaXNTdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pcy9pc1VuZGVmaW5lZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9jaHVuay5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9jb2xsZWN0VG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvZmlyc3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvZmlyc3RPci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9maXJzdE9yTnVsbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9mbGF0TWFwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2ZsYXR0ZW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvaGVhZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9qb2luLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL2xpbWl0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL21hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9yZWR1Y2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvc2Nhbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy9za2lwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL3Rha2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9pdGVyYXRvcnMvdGFrZVdoaWxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzL3RhcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy90b0l0ZXJhYmxlT3JFbXB0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG9mdS1qcy9kaXN0L2l0ZXJhdG9ycy96aXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9vYmplY3RzL2VudHJpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvZnUtanMvZGlzdC9vYmplY3RzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90b2Z1LWpzL2Rpc3Qvb2JqZWN0cy90b1BhaXJzLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYW1tYXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9pbnRlcnByZXRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvanNvbl9pbnRlcnByZXRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcHJlcHJvY2Vzc29yLnRzIiwid2VicGFjazovLy8uL3NyYy9zdHJpbmdpZnkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0cmluZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixVQUFVO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsdUNBQXVDLFNBQVM7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxpQkFBaUI7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLGlCQUFpQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsRUFBRTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZUFBZTtBQUN2QztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSx3QkFBd0IsUUFBUTtBQUNoQztBQUNBLHFCQUFxQixlQUFlO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGtCQUFrQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsbUJBQW1CLGNBQWM7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RCxPQUFPO0FBQzlEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQsT0FBTztBQUM5RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsUUFBUTtBQUM3QjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLFNBQVM7QUFDNUI7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsaUJBQWlCO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLFlBQVk7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZ0JBQWdCO0FBQ2pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDNXZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FB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c0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbnZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG5mb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxufVxuXG4vLyBTdXBwb3J0IGRlY29kaW5nIFVSTC1zYWZlIGJhc2U2NCBzdHJpbmdzLCBhcyBOb2RlLmpzIGRvZXMuXG4vLyBTZWU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NCNVUkxfYXBwbGljYXRpb25zXG5yZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbnJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xuXG5mdW5jdGlvbiBnZXRMZW5zIChiNjQpIHtcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gVHJpbSBvZmYgZXh0cmEgYnl0ZXMgYWZ0ZXIgcGxhY2Vob2xkZXIgYnl0ZXMgYXJlIGZvdW5kXG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2JlYXRnYW1taXQvYmFzZTY0LWpzL2lzc3Vlcy80MlxuICB2YXIgdmFsaWRMZW4gPSBiNjQuaW5kZXhPZignPScpXG4gIGlmICh2YWxpZExlbiA9PT0gLTEpIHZhbGlkTGVuID0gbGVuXG5cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IHZhbGlkTGVuID09PSBsZW5cbiAgICA/IDBcbiAgICA6IDQgLSAodmFsaWRMZW4gJSA0KVxuXG4gIHJldHVybiBbdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbl1cbn1cblxuLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChiNjQpIHtcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gX2J5dGVMZW5ndGggKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikge1xuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cblxuICB2YXIgYXJyID0gbmV3IEFycihfYnl0ZUxlbmd0aChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pKVxuXG4gIHZhciBjdXJCeXRlID0gMFxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgdmFyIGxlbiA9IHBsYWNlSG9sZGVyc0xlbiA+IDBcbiAgICA/IHZhbGlkTGVuIC0gNFxuICAgIDogdmFsaWRMZW5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8XG4gICAgICByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPVxuICAgICAgKCh1aW50OFtpXSA8PCAxNikgJiAweEZGMDAwMCkgK1xuICAgICAgKCh1aW50OFtpICsgMV0gPDwgOCkgJiAweEZGMDApICtcbiAgICAgICh1aW50OFtpICsgMl0gJiAweEZGKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKFxuICAgICAgdWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKVxuICAgICkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAyXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdICtcbiAgICAgICc9PSdcbiAgICApXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArIHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMTBdICtcbiAgICAgIGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXSArXG4gICAgICAnPSdcbiAgICApXG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIER1ZSB0byB2YXJpb3VzIGJyb3dzZXIgYnVncywgc29tZXRpbWVzIHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24gd2lsbCBiZSB1c2VkIGV2ZW5cbiAqIHdoZW4gdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLlxuICpcbiAqIE5vdGU6XG4gKlxuICogICAtIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcyxcbiAqICAgICBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOC5cbiAqXG4gKiAgIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgIC0gSUUxMCBoYXMgYSBicm9rZW4gYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFycmF5cyBvZlxuICogICAgIGluY29ycmVjdCBsZW5ndGggaW4gc29tZSBzaXR1YXRpb25zLlxuXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleVxuICogZ2V0IHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24sIHdoaWNoIGlzIHNsb3dlciBidXQgYmVoYXZlcyBjb3JyZWN0bHkuXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlQgIT09IHVuZGVmaW5lZFxuICA/IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gIDogdHlwZWRBcnJheVN1cHBvcnQoKVxuXG4vKlxuICogRXhwb3J0IGtNYXhMZW5ndGggYWZ0ZXIgdHlwZWQgYXJyYXkgc3VwcG9ydCBpcyBkZXRlcm1pbmVkLlxuICovXG5leHBvcnRzLmtNYXhMZW5ndGggPSBrTWF4TGVuZ3RoKClcblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5fX3Byb3RvX18gPSB7X19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSwgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9fVxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiAhKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnSWYgZW5jb2RpbmcgaXMgc3BlY2lmaWVkIHRoZW4gdGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZSh0aGlzLCBhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20odGhpcywgYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG4vLyBUT0RPOiBMZWdhY3ksIG5vdCBuZWVkZWQgYW55bW9yZS4gUmVtb3ZlIGluIG5leHQgbWFqb3IgdmVyc2lvbi5cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiBmcm9tICh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgcmV0dXJuIGZyb21PYmplY3QodGhhdCwgdmFsdWUpXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20obnVsbCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuX19wcm90b19fID0gVWludDhBcnJheS5wcm90b3R5cGVcbiAgQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC5zcGVjaWVzICYmXG4gICAgICBCdWZmZXJbU3ltYm9sLnNwZWNpZXNdID09PSBCdWZmZXIpIHtcbiAgICAvLyBGaXggc3ViYXJyYXkoKSBpbiBFUzIwMTYuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC85N1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIsIFN5bWJvbC5zcGVjaWVzLCB7XG4gICAgICB2YWx1ZTogbnVsbCxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgbmVnYXRpdmUnKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jICh0aGF0LCBzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldHRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhudWxsLCBzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHRoYXQsIHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyArK2kpIHtcbiAgICAgIHRoYXRbaV0gPSAwXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogRXF1aXZhbGVudCB0byBCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqICovXG5CdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cbi8qKlxuICogRXF1aXZhbGVudCB0byBTbG93QnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICB9XG5cbiAgaWYgKCFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImVuY29kaW5nXCIgbXVzdCBiZSBhIHZhbGlkIHN0cmluZyBlbmNvZGluZycpXG4gIH1cblxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG5cbiAgdmFyIGFjdHVhbCA9IHRoYXQud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIHRoYXQgPSB0aGF0LnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKHRoYXQsIGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgYXJyYXkuYnl0ZUxlbmd0aCAvLyB0aGlzIHRocm93cyBpZiBgYXJyYXlgIGlzIG5vdCBhIHZhbGlkIEFycmF5QnVmZmVyXG5cbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ29mZnNldFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnbGVuZ3RoXFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBhcnJheVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICB0aGF0ID0gZnJvbUFycmF5TGlrZSh0aGF0LCBhcnJheSlcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0ICh0aGF0LCBvYmopIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmopKSB7XG4gICAgdmFyIGxlbiA9IGNoZWNrZWQob2JqLmxlbmd0aCkgfCAwXG4gICAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW4pXG5cbiAgICBpZiAodGhhdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGF0XG4gICAgfVxuXG4gICAgb2JqLmNvcHkodGhhdCwgMCwgMCwgbGVuKVxuICAgIHJldHVybiB0aGF0XG4gIH1cblxuICBpZiAob2JqKSB7XG4gICAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIG9iai5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgfHwgJ2xlbmd0aCcgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IGlzbmFuKG9iai5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgMClcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iailcbiAgICB9XG5cbiAgICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIGlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmouZGF0YSlcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgYXJyYXktbGlrZSBvYmplY3QuJylcbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IGtNYXhMZW5ndGgoKWAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBrTWF4TGVuZ3RoKCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsga01heExlbmd0aCgpLnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChpc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmXG4gICAgICAgIHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFsgdmFsIF0sIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIHZhciBpbmRleFNpemUgPSAxXG4gIHZhciBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIHZhciB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpXG4gIGlmIChkaXIpIHtcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA8IGFyckxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVhZChhcnIsIGkpID09PSByZWFkKHZhbCwgZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXgpKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gZm91bmRJbmRleCAqIGluZGV4U2l6ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSBpIC09IGkgLSBmb3VuZEluZGV4XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYnl0ZU9mZnNldCArIHZhbExlbmd0aCA+IGFyckxlbmd0aCkgYnl0ZU9mZnNldCA9IGFyckxlbmd0aCAtIHZhbExlbmd0aFxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgZm91bmQgPSB0cnVlXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbExlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChyZWFkKGFyciwgaSArIGopICE9PSByZWFkKHZhbCwgaikpIHtcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kKSByZXR1cm4gaVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSAhPT0gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgdHJ1ZSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBmYWxzZSlcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAoaXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHwgMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIC8vIGxlZ2FjeSB3cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aCkgLSByZW1vdmUgaW4gdjAuMTNcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQnVmZmVyLndyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldFssIGxlbmd0aF0pIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQnXG4gICAgKVxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpID8gMlxuICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBsYXRpbjFTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSArIDFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWZcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAgIG5ld0J1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgKytpKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgKytpKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKGNvZGUgPCAyNTYpIHtcbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gaXNuYW4gKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB2YWwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cbiIsImV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gKGUgKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gKG0gKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAoKHZhbHVlICogYykgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5uZWFybGV5ID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG5cbiAgICBmdW5jdGlvbiBSdWxlKG5hbWUsIHN5bWJvbHMsIHBvc3Rwcm9jZXNzKSB7XG4gICAgICAgIHRoaXMuaWQgPSArK1J1bGUuaGlnaGVzdElkO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnN5bWJvbHMgPSBzeW1ib2xzOyAgICAgICAgLy8gYSBsaXN0IG9mIGxpdGVyYWwgfCByZWdleCBjbGFzcyB8IG5vbnRlcm1pbmFsXG4gICAgICAgIHRoaXMucG9zdHByb2Nlc3MgPSBwb3N0cHJvY2VzcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFJ1bGUuaGlnaGVzdElkID0gMDtcblxuICAgIFJ1bGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24od2l0aEN1cnNvckF0KSB7XG4gICAgICAgIGZ1bmN0aW9uIHN0cmluZ2lmeVN5bWJvbFNlcXVlbmNlIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZS5saXRlcmFsID8gSlNPTi5zdHJpbmdpZnkoZS5saXRlcmFsKSA6XG4gICAgICAgICAgICAgICAgICAgZS50eXBlID8gJyUnICsgZS50eXBlIDogZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzeW1ib2xTZXF1ZW5jZSA9ICh0eXBlb2Ygd2l0aEN1cnNvckF0ID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMuc3ltYm9scy5tYXAoc3RyaW5naWZ5U3ltYm9sU2VxdWVuY2UpLmpvaW4oJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICggICB0aGlzLnN5bWJvbHMuc2xpY2UoMCwgd2l0aEN1cnNvckF0KS5tYXAoc3RyaW5naWZ5U3ltYm9sU2VxdWVuY2UpLmpvaW4oJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIiDil48gXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgdGhpcy5zeW1ib2xzLnNsaWNlKHdpdGhDdXJzb3JBdCkubWFwKHN0cmluZ2lmeVN5bWJvbFNlcXVlbmNlKS5qb2luKCcgJykgICAgICk7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyBcIiDihpIgXCIgKyBzeW1ib2xTZXF1ZW5jZTtcbiAgICB9XG5cblxuICAgIC8vIGEgU3RhdGUgaXMgYSBydWxlIGF0IGEgcG9zaXRpb24gZnJvbSBhIGdpdmVuIHN0YXJ0aW5nIHBvaW50IGluIHRoZSBpbnB1dCBzdHJlYW0gKHJlZmVyZW5jZSlcbiAgICBmdW5jdGlvbiBTdGF0ZShydWxlLCBkb3QsIHJlZmVyZW5jZSwgd2FudGVkQnkpIHtcbiAgICAgICAgdGhpcy5ydWxlID0gcnVsZTtcbiAgICAgICAgdGhpcy5kb3QgPSBkb3Q7XG4gICAgICAgIHRoaXMucmVmZXJlbmNlID0gcmVmZXJlbmNlO1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgdGhpcy53YW50ZWRCeSA9IHdhbnRlZEJ5O1xuICAgICAgICB0aGlzLmlzQ29tcGxldGUgPSB0aGlzLmRvdCA9PT0gcnVsZS5zeW1ib2xzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBTdGF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFwie1wiICsgdGhpcy5ydWxlLnRvU3RyaW5nKHRoaXMuZG90KSArIFwifSwgZnJvbTogXCIgKyAodGhpcy5yZWZlcmVuY2UgfHwgMCk7XG4gICAgfTtcblxuICAgIFN0YXRlLnByb3RvdHlwZS5uZXh0U3RhdGUgPSBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICB2YXIgc3RhdGUgPSBuZXcgU3RhdGUodGhpcy5ydWxlLCB0aGlzLmRvdCArIDEsIHRoaXMucmVmZXJlbmNlLCB0aGlzLndhbnRlZEJ5KTtcbiAgICAgICAgc3RhdGUubGVmdCA9IHRoaXM7XG4gICAgICAgIHN0YXRlLnJpZ2h0ID0gY2hpbGQ7XG4gICAgICAgIGlmIChzdGF0ZS5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICBzdGF0ZS5kYXRhID0gc3RhdGUuYnVpbGQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfTtcblxuICAgIFN0YXRlLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5vZGUucmlnaHQuZGF0YSk7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5sZWZ0O1xuICAgICAgICB9IHdoaWxlIChub2RlLmxlZnQpO1xuICAgICAgICBjaGlsZHJlbi5yZXZlcnNlKCk7XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICB9O1xuXG4gICAgU3RhdGUucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5ydWxlLnBvc3Rwcm9jZXNzKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnJ1bGUucG9zdHByb2Nlc3ModGhpcy5kYXRhLCB0aGlzLnJlZmVyZW5jZSwgUGFyc2VyLmZhaWwpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgZnVuY3Rpb24gQ29sdW1uKGdyYW1tYXIsIGluZGV4KSB7XG4gICAgICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy53YW50cyA9IHt9OyAvLyBzdGF0ZXMgaW5kZXhlZCBieSB0aGUgbm9uLXRlcm1pbmFsIHRoZXkgZXhwZWN0XG4gICAgICAgIHRoaXMuc2Nhbm5hYmxlID0gW107IC8vIGxpc3Qgb2Ygc3RhdGVzIHRoYXQgZXhwZWN0IGEgdG9rZW5cbiAgICAgICAgdGhpcy5jb21wbGV0ZWQgPSB7fTsgLy8gc3RhdGVzIHRoYXQgYXJlIG51bGxhYmxlXG4gICAgfVxuXG5cbiAgICBDb2x1bW4ucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbihuZXh0Q29sdW1uKSB7XG4gICAgICAgIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcbiAgICAgICAgdmFyIHdhbnRzID0gdGhpcy53YW50cztcbiAgICAgICAgdmFyIGNvbXBsZXRlZCA9IHRoaXMuY29tcGxldGVkO1xuXG4gICAgICAgIGZvciAodmFyIHcgPSAwOyB3IDwgc3RhdGVzLmxlbmd0aDsgdysrKSB7IC8vIG5iLiB3ZSBwdXNoKCkgZHVyaW5nIGl0ZXJhdGlvblxuICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW3ddO1xuXG4gICAgICAgICAgICBpZiAoc3RhdGUuaXNDb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmZpbmlzaCgpO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5kYXRhICE9PSBQYXJzZXIuZmFpbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICB2YXIgd2FudGVkQnkgPSBzdGF0ZS53YW50ZWRCeTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHdhbnRlZEJ5Lmxlbmd0aDsgaS0tOyApIHsgLy8gdGhpcyBsaW5lIGlzIGhvdFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlZnQgPSB3YW50ZWRCeVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGUobGVmdCwgc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3BlY2lhbC1jYXNlIG51bGxhYmxlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUucmVmZXJlbmNlID09PSB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgZnV0dXJlIHByZWRpY3RvcnMgb2YgdGhpcyBydWxlIGdldCBjb21wbGV0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwID0gc3RhdGUucnVsZS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY29tcGxldGVkW2V4cF0gPSB0aGlzLmNvbXBsZXRlZFtleHBdIHx8IFtdKS5wdXNoKHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBxdWV1ZSBzY2FubmFibGUgc3RhdGVzXG4gICAgICAgICAgICAgICAgdmFyIGV4cCA9IHN0YXRlLnJ1bGUuc3ltYm9sc1tzdGF0ZS5kb3RdO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXhwICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYW5uYWJsZS5wdXNoKHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcHJlZGljdFxuICAgICAgICAgICAgICAgIGlmICh3YW50c1tleHBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhbnRzW2V4cF0ucHVzaChzdGF0ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZC5oYXNPd25Qcm9wZXJ0eShleHApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVsbHMgPSBjb21wbGV0ZWRbZXhwXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmlnaHQgPSBudWxsc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlKHN0YXRlLCByaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3YW50c1tleHBdID0gW3N0YXRlXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVkaWN0KGV4cCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQ29sdW1uLnByb3RvdHlwZS5wcmVkaWN0ID0gZnVuY3Rpb24oZXhwKSB7XG4gICAgICAgIHZhciBydWxlcyA9IHRoaXMuZ3JhbW1hci5ieU5hbWVbZXhwXSB8fCBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgciA9IHJ1bGVzW2ldO1xuICAgICAgICAgICAgdmFyIHdhbnRlZEJ5ID0gdGhpcy53YW50c1tleHBdO1xuICAgICAgICAgICAgdmFyIHMgPSBuZXcgU3RhdGUociwgMCwgdGhpcy5pbmRleCwgd2FudGVkQnkpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZXMucHVzaChzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIENvbHVtbi5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgICB2YXIgY29weSA9IGxlZnQubmV4dFN0YXRlKHJpZ2h0KTtcbiAgICAgICAgdGhpcy5zdGF0ZXMucHVzaChjb3B5KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIEdyYW1tYXIocnVsZXMsIHN0YXJ0KSB7XG4gICAgICAgIHRoaXMucnVsZXMgPSBydWxlcztcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0IHx8IHRoaXMucnVsZXNbMF0ubmFtZTtcbiAgICAgICAgdmFyIGJ5TmFtZSA9IHRoaXMuYnlOYW1lID0ge307XG4gICAgICAgIHRoaXMucnVsZXMuZm9yRWFjaChmdW5jdGlvbihydWxlKSB7XG4gICAgICAgICAgICBpZiAoIWJ5TmFtZS5oYXNPd25Qcm9wZXJ0eShydWxlLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgYnlOYW1lW3J1bGUubmFtZV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ5TmFtZVtydWxlLm5hbWVdLnB1c2gocnVsZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFNvIHdlIGNhbiBhbGxvdyBwYXNzaW5nIChydWxlcywgc3RhcnQpIGRpcmVjdGx5IHRvIFBhcnNlciBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICBHcmFtbWFyLmZyb21Db21waWxlZCA9IGZ1bmN0aW9uKHJ1bGVzLCBzdGFydCkge1xuICAgICAgICB2YXIgbGV4ZXIgPSBydWxlcy5MZXhlcjtcbiAgICAgICAgaWYgKHJ1bGVzLlBhcnNlclN0YXJ0KSB7XG4gICAgICAgICAgc3RhcnQgPSBydWxlcy5QYXJzZXJTdGFydDtcbiAgICAgICAgICBydWxlcyA9IHJ1bGVzLlBhcnNlclJ1bGVzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBydWxlcyA9IHJ1bGVzLm1hcChmdW5jdGlvbiAocikgeyByZXR1cm4gKG5ldyBSdWxlKHIubmFtZSwgci5zeW1ib2xzLCByLnBvc3Rwcm9jZXNzKSk7IH0pO1xuICAgICAgICB2YXIgZyA9IG5ldyBHcmFtbWFyKHJ1bGVzLCBzdGFydCk7XG4gICAgICAgIGcubGV4ZXIgPSBsZXhlcjsgLy8gbmIuIHN0b3JpbmcgbGV4ZXIgb24gR3JhbW1hciBpcyBpZmZ5LCBidXQgdW5hdm9pZGFibGVcbiAgICAgICAgcmV0dXJuIGc7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBTdHJlYW1MZXhlcigpIHtcbiAgICAgIHRoaXMucmVzZXQoXCJcIik7XG4gICAgfVxuXG4gICAgU3RyZWFtTGV4ZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oZGF0YSwgc3RhdGUpIHtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBkYXRhO1xuICAgICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5saW5lID0gc3RhdGUgPyBzdGF0ZS5saW5lIDogMTtcbiAgICAgICAgdGhpcy5sYXN0TGluZUJyZWFrID0gc3RhdGUgPyAtc3RhdGUuY29sIDogMDtcbiAgICB9XG5cbiAgICBTdHJlYW1MZXhlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5pbmRleCA8IHRoaXMuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNoID0gdGhpcy5idWZmZXJbdGhpcy5pbmRleCsrXTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgICAgICAgIHRoaXMubGFzdExpbmVCcmVhayA9IHRoaXMuaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge3ZhbHVlOiBjaH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTdHJlYW1MZXhlci5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGluZTogdGhpcy5saW5lLFxuICAgICAgICBjb2w6IHRoaXMuaW5kZXggLSB0aGlzLmxhc3RMaW5lQnJlYWssXG4gICAgICB9XG4gICAgfVxuXG4gICAgU3RyZWFtTGV4ZXIucHJvdG90eXBlLmZvcm1hdEVycm9yID0gZnVuY3Rpb24odG9rZW4sIG1lc3NhZ2UpIHtcbiAgICAgICAgLy8gbmIuIHRoaXMgZ2V0cyBjYWxsZWQgYWZ0ZXIgY29uc3VtaW5nIHRoZSBvZmZlbmRpbmcgdG9rZW4sXG4gICAgICAgIC8vIHNvIHRoZSBjdWxwcml0IGlzIGluZGV4LTFcbiAgICAgICAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgICAgICBpZiAodHlwZW9mIGJ1ZmZlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBuZXh0TGluZUJyZWFrID0gYnVmZmVyLmluZGV4T2YoJ1xcbicsIHRoaXMuaW5kZXgpO1xuICAgICAgICAgICAgaWYgKG5leHRMaW5lQnJlYWsgPT09IC0xKSBuZXh0TGluZUJyZWFrID0gYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBsaW5lID0gYnVmZmVyLnN1YnN0cmluZyh0aGlzLmxhc3RMaW5lQnJlYWssIG5leHRMaW5lQnJlYWspXG4gICAgICAgICAgICB2YXIgY29sID0gdGhpcy5pbmRleCAtIHRoaXMubGFzdExpbmVCcmVhaztcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCIgYXQgbGluZSBcIiArIHRoaXMubGluZSArIFwiIGNvbCBcIiArIGNvbCArIFwiOlxcblxcblwiO1xuICAgICAgICAgICAgbWVzc2FnZSArPSBcIiAgXCIgKyBsaW5lICsgXCJcXG5cIlxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIiAgXCIgKyBBcnJheShjb2wpLmpvaW4oXCIgXCIpICsgXCJeXCJcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2UgKyBcIiBhdCBpbmRleCBcIiArICh0aGlzLmluZGV4IC0gMSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIFBhcnNlcihydWxlcywgc3RhcnQsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHJ1bGVzIGluc3RhbmNlb2YgR3JhbW1hcikge1xuICAgICAgICAgICAgdmFyIGdyYW1tYXIgPSBydWxlcztcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gc3RhcnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZ3JhbW1hciA9IEdyYW1tYXIuZnJvbUNvbXBpbGVkKHJ1bGVzLCBzdGFydCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcblxuICAgICAgICAvLyBSZWFkIG9wdGlvbnNcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAga2VlcEhpc3Rvcnk6IGZhbHNlLFxuICAgICAgICAgICAgbGV4ZXI6IGdyYW1tYXIubGV4ZXIgfHwgbmV3IFN0cmVhbUxleGVyLFxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gKG9wdGlvbnMgfHwge30pKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldHVwIGxleGVyXG4gICAgICAgIHRoaXMubGV4ZXIgPSB0aGlzLm9wdGlvbnMubGV4ZXI7XG4gICAgICAgIHRoaXMubGV4ZXJTdGF0ZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAvLyBTZXR1cCBhIHRhYmxlXG4gICAgICAgIHZhciBjb2x1bW4gPSBuZXcgQ29sdW1uKGdyYW1tYXIsIDApO1xuICAgICAgICB2YXIgdGFibGUgPSB0aGlzLnRhYmxlID0gW2NvbHVtbl07XG5cbiAgICAgICAgLy8gSSBjb3VsZCBiZSBleHBlY3RpbmcgYW55dGhpbmcuXG4gICAgICAgIGNvbHVtbi53YW50c1tncmFtbWFyLnN0YXJ0XSA9IFtdO1xuICAgICAgICBjb2x1bW4ucHJlZGljdChncmFtbWFyLnN0YXJ0KTtcbiAgICAgICAgLy8gVE9ETyB3aGF0IGlmIHN0YXJ0IHJ1bGUgaXMgbnVsbGFibGU/XG4gICAgICAgIGNvbHVtbi5wcm9jZXNzKCk7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IDA7IC8vIHRva2VuIGluZGV4XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGEgcmVzZXJ2ZWQgdG9rZW4gZm9yIGluZGljYXRpbmcgYSBwYXJzZSBmYWlsXG4gICAgUGFyc2VyLmZhaWwgPSB7fTtcblxuICAgIFBhcnNlci5wcm90b3R5cGUuZmVlZCA9IGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgICAgIHZhciBsZXhlciA9IHRoaXMubGV4ZXI7XG4gICAgICAgIGxleGVyLnJlc2V0KGNodW5rLCB0aGlzLmxleGVyU3RhdGUpO1xuXG4gICAgICAgIHZhciB0b2tlbjtcbiAgICAgICAgd2hpbGUgKHRva2VuID0gbGV4ZXIubmV4dCgpKSB7XG4gICAgICAgICAgICAvLyBXZSBhZGQgbmV3IHN0YXRlcyB0byB0YWJsZVtjdXJyZW50KzFdXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy50YWJsZVt0aGlzLmN1cnJlbnRdO1xuXG4gICAgICAgICAgICAvLyBHQyB1bnVzZWQgc3RhdGVzXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5rZWVwSGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnRhYmxlW3RoaXMuY3VycmVudCAtIDFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbiA9IHRoaXMuY3VycmVudCArIDE7XG4gICAgICAgICAgICB2YXIgbmV4dENvbHVtbiA9IG5ldyBDb2x1bW4odGhpcy5ncmFtbWFyLCBuKTtcbiAgICAgICAgICAgIHRoaXMudGFibGUucHVzaChuZXh0Q29sdW1uKTtcblxuICAgICAgICAgICAgLy8gQWR2YW5jZSBhbGwgdG9rZW5zIHRoYXQgZXhwZWN0IHRoZSBzeW1ib2xcbiAgICAgICAgICAgIHZhciBsaXRlcmFsID0gdG9rZW4udGV4dCAhPT0gdW5kZWZpbmVkID8gdG9rZW4udGV4dCA6IHRva2VuLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gbGV4ZXIuY29uc3RydWN0b3IgPT09IFN0cmVhbUxleGVyID8gdG9rZW4udmFsdWUgOiB0b2tlbjtcbiAgICAgICAgICAgIHZhciBzY2FubmFibGUgPSBjb2x1bW4uc2Nhbm5hYmxlO1xuICAgICAgICAgICAgZm9yICh2YXIgdyA9IHNjYW5uYWJsZS5sZW5ndGg7IHctLTsgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gc2Nhbm5hYmxlW3ddO1xuICAgICAgICAgICAgICAgIHZhciBleHBlY3QgPSBzdGF0ZS5ydWxlLnN5bWJvbHNbc3RhdGUuZG90XTtcbiAgICAgICAgICAgICAgICAvLyBUcnkgdG8gY29uc3VtZSB0aGUgdG9rZW5cbiAgICAgICAgICAgICAgICAvLyBlaXRoZXIgcmVnZXggb3IgbGl0ZXJhbFxuICAgICAgICAgICAgICAgIGlmIChleHBlY3QudGVzdCA/IGV4cGVjdC50ZXN0KHZhbHVlKSA6XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdC50eXBlID8gZXhwZWN0LnR5cGUgPT09IHRva2VuLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHBlY3QubGl0ZXJhbCA9PT0gbGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgaXRcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHQgPSBzdGF0ZS5uZXh0U3RhdGUoe2RhdGE6IHZhbHVlLCB0b2tlbjogdG9rZW4sIGlzVG9rZW46IHRydWUsIHJlZmVyZW5jZTogbiAtIDF9KTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dENvbHVtbi5zdGF0ZXMucHVzaChuZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5leHQsIGZvciBlYWNoIG9mIHRoZSBydWxlcywgd2UgZWl0aGVyXG4gICAgICAgICAgICAvLyAoYSkgY29tcGxldGUgaXQsIGFuZCB0cnkgdG8gc2VlIGlmIHRoZSByZWZlcmVuY2Ugcm93IGV4cGVjdGVkIHRoYXRcbiAgICAgICAgICAgIC8vICAgICBydWxlXG4gICAgICAgICAgICAvLyAoYikgcHJlZGljdCB0aGUgbmV4dCBub250ZXJtaW5hbCBpdCBleHBlY3RzIGJ5IGFkZGluZyB0aGF0XG4gICAgICAgICAgICAvLyAgICAgbm9udGVybWluYWwncyBzdGFydCBzdGF0ZVxuICAgICAgICAgICAgLy8gVG8gcHJldmVudCBkdXBsaWNhdGlvbiwgd2UgYWxzbyBrZWVwIHRyYWNrIG9mIHJ1bGVzIHdlIGhhdmUgYWxyZWFkeVxuICAgICAgICAgICAgLy8gYWRkZWRcblxuICAgICAgICAgICAgbmV4dENvbHVtbi5wcm9jZXNzKCk7XG5cbiAgICAgICAgICAgIC8vIElmIG5lZWRlZCwgdGhyb3cgYW4gZXJyb3I6XG4gICAgICAgICAgICBpZiAobmV4dENvbHVtbi5zdGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gc3RhdGVzIGF0IGFsbCEgVGhpcyBpcyBub3QgZ29vZC5cbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubGV4ZXIuZm9ybWF0RXJyb3IodG9rZW4sIFwiaW52YWxpZCBzeW50YXhcIikgKyBcIlxcblwiO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJVbmV4cGVjdGVkIFwiICsgKHRva2VuLnR5cGUgPyB0b2tlbi50eXBlICsgXCIgdG9rZW46IFwiIDogXCJcIik7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBKU09OLnN0cmluZ2lmeSh0b2tlbi52YWx1ZSAhPT0gdW5kZWZpbmVkID8gdG9rZW4udmFsdWUgOiB0b2tlbikgKyBcIlxcblwiO1xuICAgICAgICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgZXJyLm9mZnNldCA9IHRoaXMuY3VycmVudDtcbiAgICAgICAgICAgICAgICBlcnIudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG1heWJlIHNhdmUgbGV4ZXIgc3RhdGVcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMua2VlcEhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgY29sdW1uLmxleGVyU3RhdGUgPSBsZXhlci5zYXZlKClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbHVtbikge1xuICAgICAgICAgIHRoaXMubGV4ZXJTdGF0ZSA9IGxleGVyLnNhdmUoKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW5jcmVtZW50YWxseSBrZWVwIHRyYWNrIG9mIHJlc3VsdHNcbiAgICAgICAgdGhpcy5yZXN1bHRzID0gdGhpcy5maW5pc2goKTtcblxuICAgICAgICAvLyBBbGxvdyBjaGFpbmluZywgZm9yIHdoYXRldmVyIGl0J3Mgd29ydGhcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFBhcnNlci5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29sdW1uID0gdGhpcy50YWJsZVt0aGlzLmN1cnJlbnRdO1xuICAgICAgICBjb2x1bW4ubGV4ZXJTdGF0ZSA9IHRoaXMubGV4ZXJTdGF0ZTtcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9O1xuXG4gICAgUGFyc2VyLnByb3RvdHlwZS5yZXN0b3JlID0gZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGNvbHVtbi5pbmRleDtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaW5kZXg7XG4gICAgICAgIHRoaXMudGFibGVbaW5kZXhdID0gY29sdW1uO1xuICAgICAgICB0aGlzLnRhYmxlLnNwbGljZShpbmRleCArIDEpO1xuICAgICAgICB0aGlzLmxleGVyU3RhdGUgPSBjb2x1bW4ubGV4ZXJTdGF0ZTtcblxuICAgICAgICAvLyBJbmNyZW1lbnRhbGx5IGtlZXAgdHJhY2sgb2YgcmVzdWx0c1xuICAgICAgICB0aGlzLnJlc3VsdHMgPSB0aGlzLmZpbmlzaCgpO1xuICAgIH07XG5cbiAgICAvLyBuYi4gZGVwcmVjYXRlZDogdXNlIHNhdmUvcmVzdG9yZSBpbnN0ZWFkIVxuICAgIFBhcnNlci5wcm90b3R5cGUucmV3aW5kID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMua2VlcEhpc3RvcnkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2V0IG9wdGlvbiBga2VlcEhpc3RvcnlgIHRvIGVuYWJsZSByZXdpbmRpbmcnKVxuICAgICAgICB9XG4gICAgICAgIC8vIG5iLiByZWNhbGwgY29sdW1uICh0YWJsZSkgaW5kaWNpZXMgZmFsbCBiZXR3ZWVuIHRva2VuIGluZGljaWVzLlxuICAgICAgICAvLyAgICAgICAgY29sIDAgICAtLSAgIHRva2VuIDAgICAtLSAgIGNvbCAxXG4gICAgICAgIHRoaXMucmVzdG9yZSh0aGlzLnRhYmxlW2luZGV4XSk7XG4gICAgfTtcblxuICAgIFBhcnNlci5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFJldHVybiB0aGUgcG9zc2libGUgcGFyc2luZ3NcbiAgICAgICAgdmFyIGNvbnNpZGVyYXRpb25zID0gW107XG4gICAgICAgIHZhciBzdGFydCA9IHRoaXMuZ3JhbW1hci5zdGFydDtcbiAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMudGFibGVbdGhpcy50YWJsZS5sZW5ndGggLSAxXVxuICAgICAgICBjb2x1bW4uc3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0LnJ1bGUubmFtZSA9PT0gc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgJiYgdC5kb3QgPT09IHQucnVsZS5zeW1ib2xzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAmJiB0LnJlZmVyZW5jZSA9PT0gMFxuICAgICAgICAgICAgICAgICAgICAmJiB0LmRhdGEgIT09IFBhcnNlci5mYWlsKSB7XG4gICAgICAgICAgICAgICAgY29uc2lkZXJhdGlvbnMucHVzaCh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb25zaWRlcmF0aW9ucy5tYXAoZnVuY3Rpb24oYykge3JldHVybiBjLmRhdGE7IH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBQYXJzZXI6IFBhcnNlcixcbiAgICAgICAgR3JhbW1hcjogR3JhbW1hcixcbiAgICAgICAgUnVsZTogUnVsZSxcbiAgICB9O1xuXG59KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XG5leHBvcnRzLmNodW5rID0gZnBfMS5jdXJyeSgoc2l6ZSwgYXJyYXkpID0+IHtcbiAgICBjb25zdCBhcnIgPSB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KTtcbiAgICBjb25zdCBvdXRwdXQgPSBbXTtcbiAgICBsZXQgY2huayA9IFtdO1xuICAgIGZvciAoY29uc3QgZWxlbSBvZiBhcnIpIHtcbiAgICAgICAgaWYgKGNobmsubGVuZ3RoID49IHNpemUpIHtcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKGNobmspO1xuICAgICAgICAgICAgY2huayA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGNobmsucHVzaChlbGVtKTtcbiAgICB9XG4gICAgaWYgKGNobmsubGVuZ3RoKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKGNobmspO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XG5leHBvcnRzLmZpbHRlciA9IGZwXzEuY3VycnkoKGZ1bmMsIGFycmF5KSA9PiB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KS5maWx0ZXIoZnVuYykpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmaXJzdE9yTnVsbF8xID0gcmVxdWlyZShcIi4vZmlyc3RPck51bGxcIik7XG5leHBvcnRzLmZpcnN0ID0gZmlyc3RPck51bGxfMS5maXJzdE9yTnVsbDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcbmV4cG9ydHMuZmlyc3RPciA9IGZwXzEuY3VycnkoKGRlZmF1bHRWYWx1ZSwgYXJyYXkpID0+IHtcbiAgICBjb25zdCBhcnIgPSB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KTtcbiAgICByZXR1cm4gYXJyLmxlbmd0aCA/IGFyclswXSA6IGRlZmF1bHRWYWx1ZTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmaXJzdE9yXzEgPSByZXF1aXJlKFwiLi9maXJzdE9yXCIpO1xuZXhwb3J0cy5maXJzdE9yTnVsbCA9IGZpcnN0T3JfMS5maXJzdE9yKG51bGwpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xuY29uc3QgbWFwXzEgPSByZXF1aXJlKFwiLi9tYXBcIik7XG5jb25zdCBmbGF0dGVuXzEgPSByZXF1aXJlKFwiLi9mbGF0dGVuXCIpO1xuZXhwb3J0cy5mbGF0TWFwID0gZnBfMS5jdXJyeSgoZnVuYywgYXJyYXkpID0+IGZwXzEucGlwZSh0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KSwgbWFwXzEubWFwKGZ1bmMpLCBmbGF0dGVuXzEuZmxhdHRlbikpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xuZXhwb3J0cy5mbGF0dGVuID0gZnBfMS5jdXJyeShhcnJheSA9PiBbXS5jb25jYXQoLi4udG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSkpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xuZXhwb3J0cy5mcm9tUGFpcnMgPSAocGFpcnMpID0+IHtcbiAgICByZXR1cm4gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShwYWlycylcbiAgICAgICAgLm1hcCgoW2tleSwgdmFsXSkgPT4gKHsgW2tleV06IHZhbCB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYykgPT4gT2JqZWN0LmFzc2lnbihhLCBjKSwge30pO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuZnVuY3Rpb24gX19leHBvcnQobSkge1xuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZpbHRlclwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9mbGF0TWFwXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZsYXR0ZW5cIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vbGltaXRcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vbWFwXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3NjYW5cIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vc2tpcFwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi90YXBcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vemlwXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3Rha2VXaGlsZVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9yZWR1Y2VcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vY2h1bmtcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vZnJvbVBhaXJzXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZpcnN0XCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZpcnN0T3JcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vZmlyc3RPck51bGxcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vam9pblwiKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5leHBvcnRzLmpvaW4gPSBmcF8xLmN1cnJ5KChzZXBhcmF0b3IsIGFycikgPT4gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnIpLmpvaW4oc2VwYXJhdG9yKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XG5leHBvcnRzLmxpbWl0ID0gZnBfMS5jdXJyeSgobWF4LCBhcnJheSkgPT4gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSkuc3BsaWNlKDAsIG1heCkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xuZXhwb3J0cy5tYXAgPSBmcF8xLmN1cnJ5KChmdW5jLCBhcnJheSkgPT4gdG9BcnJheU9yRW1wdHlfMS50b0FycmF5T3JFbXB0eShhcnJheSkubWFwKGZ1bmMpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcbmV4cG9ydHMucmVkdWNlID0gZnBfMS5jdXJyeSgoZnVuYywgc3RhcnQsIGFycmF5KSA9PiB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KS5yZWR1Y2UoZnVuYywgc3RhcnQpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcbmNvbnN0IHRvQXJyYXlPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0FycmF5T3JFbXB0eVwiKTtcbmV4cG9ydHMuc2NhbiA9IGZwXzEuY3VycnkoKGZ1bmMsIHN0YXJ0LCBhcnJheSkgPT4ge1xuICAgIGxldCBhY2N1bXVsYXRlZCA9IHN0YXJ0O1xuICAgIHJldHVybiB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KS5tYXAoKGVsZW0pID0+IHtcbiAgICAgICAgYWNjdW11bGF0ZWQgPSBmdW5jKGFjY3VtdWxhdGVkLCBlbGVtKTtcbiAgICAgICAgcmV0dXJuIGFjY3VtdWxhdGVkO1xuICAgIH0pO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XG5leHBvcnRzLnNraXAgPSBmcF8xLmN1cnJ5KChhbXQsIGFycmF5KSA9PiB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KS5zcGxpY2UoYW10KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCB0b0FycmF5T3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9BcnJheU9yRW1wdHlcIik7XG5leHBvcnRzLnRha2VXaGlsZSA9IGZwXzEuY3VycnkoKHdoaWxlRnVuYywgYXJyYXkpID0+IHtcbiAgICBjb25zdCBhcnIgPSB0b0FycmF5T3JFbXB0eV8xLnRvQXJyYXlPckVtcHR5KGFycmF5KTtcbiAgICBjb25zdCByZXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBhcnIpIHtcbiAgICAgICAgaWYgKHdoaWxlRnVuYyh2YWwpKVxuICAgICAgICAgICAgcmVzLnB1c2godmFsKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xuY29uc3QgdG9BcnJheU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvQXJyYXlPckVtcHR5XCIpO1xuZXhwb3J0cy50YXAgPSBmcF8xLmN1cnJ5KChmdW5jLCBhcnJheSkgPT4ge1xuICAgIHRvQXJyYXlPckVtcHR5XzEudG9BcnJheU9yRW1wdHkoYXJyYXkpLmZvckVhY2goZnVuYyk7XG4gICAgcmV0dXJuIGFycmF5O1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIHRvQXJyYXlPckVtcHR5KG9iaikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIFtdO1xufVxuZXhwb3J0cy50b0FycmF5T3JFbXB0eSA9IHRvQXJyYXlPckVtcHR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xuZXhwb3J0cy56aXAgPSBmcF8xLmN1cnJ5KChhcnJMZWZ0LCBhcnJSaWdodCwgLi4ubW9yZUFycmF5cykgPT4ge1xuICAgIGNvbnN0IGFycmF5cyA9IFthcnJMZWZ0LCBhcnJSaWdodCwgLi4ubW9yZUFycmF5c107XG4gICAgY29uc3QgbWF4TGVuID0gTWF0aC5tYXgoLi4uYXJyYXlzLm1hcChhID0+IGEubGVuZ3RoKSk7XG4gICAgY29uc3QgcmVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhMZW47ICsraSkge1xuICAgICAgICByZXMucHVzaChhcnJheXMubWFwKGEgPT4gKGkgPCBhLmxlbmd0aCA/IGFbaV0gOiBudWxsKSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3VycnkgPSBmdW5jID0+IHtcbiAgICBjb25zdCBjdXJyeUltcGwgPSAocHJvdmlkZWRBcmdzKSA9PiAoLi4uYXJncykgPT4ge1xuICAgICAgICBjb25zdCBjb25jYXRBcmdzID0gcHJvdmlkZWRBcmdzLmNvbmNhdChhcmdzKTtcbiAgICAgICAgaWYgKGNvbmNhdEFyZ3MubGVuZ3RoIDwgZnVuYy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyeUltcGwoY29uY2F0QXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmMoLi4uY29uY2F0QXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gY3VycnlJbXBsKFtdKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9jdXJyeVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9waXBlXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3ByZWRpY2F0ZVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9yZXZlcnNlQXJnc1wiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9yZXZlcnNlQ3VycnlcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vc3ByZWFkXCIpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaXNfMSA9IHJlcXVpcmUoXCIuLi9pc1wiKTtcbmV4cG9ydHMucGlwZSA9IChwYXJhbU9yRnVuYywgLi4uZnVuY3Rpb25zKSA9PiB7XG4gICAgaWYgKGlzXzEuaXNGdW5jdGlvbihwYXJhbU9yRnVuYykpIHtcbiAgICAgICAgcmV0dXJuIGNoYWluKHBhcmFtT3JGdW5jLCAuLi5mdW5jdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gY2hhaW4oLi4uZnVuY3Rpb25zKShwYXJhbU9yRnVuYyk7XG59O1xuZnVuY3Rpb24gY2hhaW4oLi4uZnVuY3MpIHtcbiAgICByZXR1cm4gKHBhcmFtKSA9PiB7XG4gICAgICAgIGxldCBsYXN0VmFsID0gcGFyYW07XG4gICAgICAgIGZvciAoY29uc3QgZnVuYyBvZiBmdW5jcykge1xuICAgICAgICAgICAgbGFzdFZhbCA9IGZ1bmMobGFzdFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhc3RWYWw7XG4gICAgfTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hbmQgPSAoLi4ucHJlZGljYXRlcykgPT4gKHBhcmFtKSA9PiBbLi4ucHJlZGljYXRlc10ucmVkdWNlKChhLCBwKSA9PiBhICYmIHAocGFyYW0pLCB0cnVlKSAmJiAhIXByZWRpY2F0ZXMubGVuZ3RoO1xuZXhwb3J0cy5vciA9ICguLi5wcmVkaWNhdGVzKSA9PiAocGFyYW0pID0+IFsuLi5wcmVkaWNhdGVzXS5yZWR1Y2UoKGEsIHApID0+IGEgfHwgcChwYXJhbSksIGZhbHNlKTtcbmV4cG9ydHMueG9yID0gKC4uLnByZWRpY2F0ZXMpID0+IChwYXJhbSkgPT4gWy4uLnByZWRpY2F0ZXNdLm1hcChwID0+ICtwKHBhcmFtKSkucmVkdWNlKChhLCBjKSA9PiBhICsgYywgMCkgPT09IDE7XG5leHBvcnRzLm5lZ2F0ZSA9IChwMSkgPT4gKHBhcmFtKSA9PiAhcDEocGFyYW0pO1xuZXhwb3J0cy50b1ByZWRpY2F0ZSA9IChwKSA9PiAocGFyYW0pID0+ICEhcChwYXJhbSk7XG5leHBvcnRzLmJvb2xUb1ByZWRpY2F0ZSA9IChiKSA9PiAoKSA9PiBiO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiByZXZlcnNlQXJncyhmdW5jKSB7XG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHJldHVybiBmdW5jKC4uLmFyZ3MucmV2ZXJzZSgpKTtcbiAgICB9O1xufVxuZXhwb3J0cy5yZXZlcnNlQXJncyA9IHJldmVyc2VBcmdzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCByZXZlcnNlQXJnc18xID0gcmVxdWlyZShcIi4vcmV2ZXJzZUFyZ3NcIik7XG5leHBvcnRzLnJldmVyc2VDdXJyeSA9IGZ1bmMgPT4ge1xuICAgIGNvbnN0IGN1cnJ5SW1wbCA9IHByb3ZpZGVkQXJncyA9PiAoLi4uYXJncykgPT4ge1xuICAgICAgICBjb25zdCBjb25jYXRBcmdzID0gcHJvdmlkZWRBcmdzLmNvbmNhdChhcmdzKTtcbiAgICAgICAgaWYgKGNvbmNhdEFyZ3MubGVuZ3RoIDwgZnVuYy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyeUltcGwoY29uY2F0QXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldmVyc2VBcmdzXzEucmV2ZXJzZUFyZ3MoZnVuYykoLi4uY29uY2F0QXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gY3VycnlJbXBsKFtdKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGN1cnJ5XzEgPSByZXF1aXJlKFwiLi9jdXJyeVwiKTtcbmV4cG9ydHMuc3ByZWFkID0gY3VycnlfMS5jdXJyeSgoZnVuYywgYXJncykgPT4gZnVuYyguLi5hcmdzKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc0Z1bmN0aW9uXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzSW5maW5pdGVcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vaXNJdGVyYWJsZVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc05pbFwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc051bGxcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vaXNPYmplY3RcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vaXNVbmRlZmluZWRcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vaXNOdW1iZXJcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vaXNTdHJpbmdcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vaXNJbnRlZ2VyXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzRmxvYXRcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vaXNBcnJheVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc0J1ZmZlclwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc1NldFwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pc01hcFwiKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNCdWZmZXIgPSAob2JqKSA9PiB7XG4gICAgcmV0dXJuIEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlcihvYmopIDogZmFsc2U7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBpc051bWJlcl8xID0gcmVxdWlyZShcIi4vaXNOdW1iZXJcIik7XG5leHBvcnRzLmlzRmxvYXQgPSBpc051bWJlcl8xLmlzTnVtYmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzRnVuY3Rpb24gPSAocGFyYW0pID0+IHR5cGVvZiBwYXJhbSA9PT0gJ2Z1bmN0aW9uJztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0luZmluaXRlID0gKHBhcmFtKSA9PiBwYXJhbSA9PT0gSW5maW5pdHkgfHwgcGFyYW0gPT09IC1JbmZpbml0eTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0ludGVnZXIgPSAocGFyYW0pID0+IChwYXJhbSB8IDApID09PSBwYXJhbTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaXNPYmplY3RfMSA9IHJlcXVpcmUoXCIuL2lzT2JqZWN0XCIpO1xuY29uc3QgaXNGdW5jdGlvbl8xID0gcmVxdWlyZShcIi4vaXNGdW5jdGlvblwiKTtcbmV4cG9ydHMuaXNJdGVyYWJsZSA9IChwYXJhbSkgPT4gaXNPYmplY3RfMS5pc09iamVjdChwYXJhbSkgJiYgaXNGdW5jdGlvbl8xLmlzRnVuY3Rpb24ocGFyYW1bU3ltYm9sLml0ZXJhdG9yXSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNNYXAgPSAob2JqKSA9PiAoTWFwID8gb2JqIGluc3RhbmNlb2YgTWFwIDogZmFsc2UpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBpc051bGxfMSA9IHJlcXVpcmUoXCIuL2lzTnVsbFwiKTtcbmNvbnN0IGlzVW5kZWZpbmVkXzEgPSByZXF1aXJlKFwiLi9pc1VuZGVmaW5lZFwiKTtcbmV4cG9ydHMuaXNOaWwgPSAocGFyYW0pID0+IGlzTnVsbF8xLmlzTnVsbChwYXJhbSkgfHwgaXNVbmRlZmluZWRfMS5pc1VuZGVmaW5lZChwYXJhbSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNOdWxsID0gKHBhcmFtKSA9PiBwYXJhbSA9PT0gbnVsbDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc051bWJlciA9IChwYXJhbSkgPT4gdHlwZW9mIHBhcmFtID09PSAnbnVtYmVyJztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc09iamVjdCA9IChwYXJhbSkgPT4gcGFyYW0gPT09IE9iamVjdChwYXJhbSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNTZXQgPSAob2JqKSA9PiAoU2V0ID8gb2JqIGluc3RhbmNlb2YgU2V0IDogZmFsc2UpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzU3RyaW5nID0gKHBhcmFtKSA9PiB0eXBlb2YgcGFyYW0gPT09ICdzdHJpbmcnO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gKHBhcmFtKSA9PiB0eXBlb2YgcGFyYW0gPT09ICd1bmRlZmluZWQnO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xuZXhwb3J0cy5jaHVuayA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChzaXplLCBpdGVyYWJsZSkge1xuICAgIGNvbnN0IGl0ZXIgPSB0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKTtcbiAgICBsZXQgY2h1bmtzID0gW107XG4gICAgZm9yIChjb25zdCBlbGVtIG9mIGl0ZXIpIHtcbiAgICAgICAgaWYgKGNodW5rcy5sZW5ndGggPj0gc2l6ZSkge1xuICAgICAgICAgICAgeWllbGQgY2h1bmtzO1xuICAgICAgICAgICAgY2h1bmtzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgY2h1bmtzLnB1c2goZWxlbSk7XG4gICAgfVxuICAgIGlmIChjaHVua3MubGVuZ3RoKSB7XG4gICAgICAgIHlpZWxkIGNodW5rcztcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaXNfMSA9IHJlcXVpcmUoXCIuLi9pc1wiKTtcbmNvbnN0IGxpbWl0XzEgPSByZXF1aXJlKFwiLi9saW1pdFwiKTtcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcbmV4cG9ydHMuY29sbGVjdFRvQXJyYXkgPSAoaXRlcmFibGUsIG1heCA9IEluZmluaXR5KSA9PiBpc18xLmlzSW5maW5pdGUobWF4KVxuICAgID8gWy4uLnRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpXVxuICAgIDogZXhwb3J0cy5jb2xsZWN0VG9BcnJheShsaW1pdF8xLmxpbWl0KG1heCwgdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSkpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcbmV4cG9ydHMuZmlsdGVyID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKGZ1bmMsIGl0ZXJhYmxlKSB7XG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xuICAgIGZvciAoY29uc3QgdmFsIG9mIGl0ZXIpIHtcbiAgICAgICAgaWYgKGZ1bmModmFsKSlcbiAgICAgICAgICAgIHlpZWxkIHZhbDtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdGFrZV8xID0gcmVxdWlyZShcIi4vdGFrZVwiKTtcbmV4cG9ydHMuZmlyc3QgPSB0YWtlXzEudGFrZSgxKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcbmV4cG9ydHMuZmlyc3RPciA9IGZwXzEuY3VycnkoKGRlZmF1bHRWYWx1ZSwgaXRlcmFibGUpID0+IHtcbiAgICBmb3IgKGNvbnN0IHYgb2YgaXRlcmFibGUpIHtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZmlyc3RPcl8xID0gcmVxdWlyZShcIi4vZmlyc3RPclwiKTtcbmV4cG9ydHMuZmlyc3RPck51bGwgPSBmaXJzdE9yXzEuZmlyc3RPcihudWxsKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcbmNvbnN0IGlzXzEgPSByZXF1aXJlKFwiLi4vaXNcIik7XG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XG5leHBvcnRzLmZsYXRNYXAgPSBmcF8xLmN1cnJ5KGZ1bmN0aW9uKiAoZnVuYywgaXRlcmFibGUpIHtcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSk7XG4gICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcikge1xuICAgICAgICBjb25zdCBuZXdJdGVyYWJsZSA9IGZ1bmModmFsKTtcbiAgICAgICAgaWYgKGlzXzEuaXNJdGVyYWJsZShuZXdJdGVyYWJsZSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmV3VmFsIG9mIG5ld0l0ZXJhYmxlKVxuICAgICAgICAgICAgICAgIHlpZWxkIG5ld1ZhbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHlpZWxkIG5ld0l0ZXJhYmxlO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCBpc18xID0gcmVxdWlyZShcIi4uL2lzXCIpO1xuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xuZXhwb3J0cy5mbGF0dGVuID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKGl0ZXJhYmxlKSB7XG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xuICAgIGZvciAoY29uc3QgdmFsIG9mIGl0ZXIpIHtcbiAgICAgICAgaWYgKGlzXzEuaXNJdGVyYWJsZSh2YWwpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGlubmVyVmFsIG9mIHZhbClcbiAgICAgICAgICAgICAgICB5aWVsZCBpbm5lclZhbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHlpZWxkIHZhbDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmaXJzdF8xID0gcmVxdWlyZShcIi4vZmlyc3RcIik7XG5leHBvcnRzLmhlYWQgPSBmaXJzdF8xLmZpcnN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuX19leHBvcnQocmVxdWlyZShcIi4vY29sbGVjdFRvQXJyYXlcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vZmlsdGVyXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZsYXRNYXBcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vZmxhdHRlblwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9saW1pdFwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9tYXBcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vc2NhblwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9za2lwXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3RhcFwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi96aXBcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vdGFrZVdoaWxlXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2NodW5rXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZpcnN0XCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3Rha2VcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vaGVhZFwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9maXJzdE9yXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2ZpcnN0T3JOdWxsXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2pvaW5cIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vcmVkdWNlXCIpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcbmNvbnN0IGNvbGxlY3RUb0FycmF5XzEgPSByZXF1aXJlKFwiLi9jb2xsZWN0VG9BcnJheVwiKTtcbmV4cG9ydHMuam9pbiA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChzZXBhcmF0b3IsIGl0ZXJhYmxlKSB7XG4gICAgeWllbGQgY29sbGVjdFRvQXJyYXlfMS5jb2xsZWN0VG9BcnJheSh0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKSkuam9pbihzZXBhcmF0b3IpO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XG5leHBvcnRzLmxpbWl0ID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKG1heCwgaXRlcmFibGUpIHtcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSk7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XG4gICAgICAgIGlmIChjb3VudCsrIDwgKG1heCB8IDApKSB7XG4gICAgICAgICAgICB5aWVsZCB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xuZXhwb3J0cy5tYXAgPSBmcF8xLmN1cnJ5KGZ1bmN0aW9uKiAoZnVuYywgaXRlcmFibGUpIHtcbiAgICBjb25zdCBpdGVyID0gdG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eShpdGVyYWJsZSk7XG4gICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcilcbiAgICAgICAgeWllbGQgZnVuYyh2YWwpO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XG5leHBvcnRzLnJlZHVjZSA9IGZwXzEuY3VycnkoZnVuY3Rpb24gKGZ1bmMsIHN0YXJ0LCBpdGVyYWJsZSkge1xuICAgIGNvbnN0IGl0ZXIgPSB0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKTtcbiAgICBsZXQgYWNjdW11bGF0ZWQgPSBzdGFydDtcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XG4gICAgICAgIGFjY3VtdWxhdGVkID0gZnVuYyhhY2N1bXVsYXRlZCwgdmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIGFjY3VtdWxhdGVkO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XG5leHBvcnRzLnNjYW4gPSBmcF8xLmN1cnJ5KGZ1bmN0aW9uKiAoZnVuYywgc3RhcnQsIGl0ZXJhYmxlKSB7XG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xuICAgIGxldCBhY2N1bXVsYXRlZCA9IHN0YXJ0O1xuICAgIGZvciAoY29uc3QgdmFsIG9mIGl0ZXIpIHtcbiAgICAgICAgYWNjdW11bGF0ZWQgPSBmdW5jKGFjY3VtdWxhdGVkLCB2YWwpO1xuICAgICAgICB5aWVsZCBhY2N1bXVsYXRlZDtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcbmNvbnN0IHRvSXRlcmFibGVPckVtcHR5XzEgPSByZXF1aXJlKFwiLi90b0l0ZXJhYmxlT3JFbXB0eVwiKTtcbmV4cG9ydHMuc2tpcCA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChhbXQgPSAxLCBpdGVyYWJsZSkge1xuICAgIGNvbnN0IGl0ZXIgPSB0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgbGV0IGlzRG9uZSA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW10ICYmICFpc0RvbmU7ICsraSkge1xuICAgICAgICBpc0RvbmUgPSBpdGVyLm5leHQoKS5kb25lO1xuICAgIH1cbiAgICBpZiAoaXNEb25lKVxuICAgICAgICByZXR1cm47XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY29uc3QgeyBkb25lLCB2YWx1ZSB9ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIGlmIChkb25lKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB5aWVsZCB2YWx1ZTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdG9JdGVyYWJsZU9yRW1wdHlfMSA9IHJlcXVpcmUoXCIuL3RvSXRlcmFibGVPckVtcHR5XCIpO1xuY29uc3QgZnBfMSA9IHJlcXVpcmUoXCIuLi9mcFwiKTtcbmV4cG9ydHMudGFrZSA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChsaW1pdCwgaXRlcmFibGUpIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgY29uc3QgaXRlciA9IHRvSXRlcmFibGVPckVtcHR5XzEudG9JdGVyYWJsZU9yRW1wdHkoaXRlcmFibGUpO1xuICAgIGZvciAoY29uc3QgdiBvZiBpdGVyKSB7XG4gICAgICAgIGlmIChpKysgPCBsaW1pdCkge1xuICAgICAgICAgICAgeWllbGQgdjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmcF8xID0gcmVxdWlyZShcIi4uL2ZwXCIpO1xuY29uc3QgaXNfMSA9IHJlcXVpcmUoXCIuLi9pc1wiKTtcbmV4cG9ydHMudGFrZVdoaWxlID0gZnBfMS5jdXJyeShmdW5jdGlvbiogKHdoaWxlRnVuYywgaXRlcikge1xuICAgIGlmIChpc18xLmlzSXRlcmFibGUod2hpbGVGdW5jKSkge1xuICAgICAgICBjb25zdCB3aGlsZUl0ZXIgPSB3aGlsZUZ1bmNbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgICAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XG4gICAgICAgICAgICBjb25zdCBxdWl0SW5kaWNhdG9yID0gd2hpbGVJdGVyLm5leHQoKTtcbiAgICAgICAgICAgIGlmICghcXVpdEluZGljYXRvci52YWx1ZSB8fCBxdWl0SW5kaWNhdG9yLmRvbmUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgeWllbGQgdmFsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XG4gICAgICAgICAgICBpZiAod2hpbGVGdW5jKHZhbCkpXG4gICAgICAgICAgICAgICAgeWllbGQgdmFsO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuZXhwb3J0cy50YWtlV2hpbGVQdWxsUHVzaCA9IGZwXzEuY3VycnkoZnVuY3Rpb24qICh3aGlsZUl0ZXJhYmxlLCBpdGVyKSB7XG4gICAgY29uc3Qgd2hpbGVJdGVyID0gd2hpbGVJdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgZm9yIChjb25zdCB2YWwgb2YgaXRlcikge1xuICAgICAgICBsZXQgcXVpdEluZGljYXRvciA9IHdoaWxlSXRlci5uZXh0KCk7XG4gICAgICAgIGlmIChxdWl0SW5kaWNhdG9yLmRvbmUgfHwgIXF1aXRJbmRpY2F0b3IudmFsdWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHF1aXRJbmRpY2F0b3IgPSB3aGlsZUl0ZXIubmV4dCh2YWwpO1xuICAgICAgICBpZiAocXVpdEluZGljYXRvci5kb25lIHx8ICFxdWl0SW5kaWNhdG9yLnZhbHVlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB5aWVsZCB2YWw7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XG5leHBvcnRzLnRhcCA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChmdW5jLCBpdGVyYWJsZSkge1xuICAgIGNvbnN0IGl0ZXIgPSB0b0l0ZXJhYmxlT3JFbXB0eV8xLnRvSXRlcmFibGVPckVtcHR5KGl0ZXJhYmxlKTtcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBpdGVyKSB7XG4gICAgICAgIGZ1bmModmFsKTtcbiAgICAgICAgeWllbGQgdmFsO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBpc18xID0gcmVxdWlyZShcIi4uL2lzXCIpO1xuZnVuY3Rpb24gdG9JdGVyYWJsZU9yRW1wdHkocGFyYW0pIHtcbiAgICBpZiAoIWlzXzEuaXNJdGVyYWJsZShwYXJhbSkpXG4gICAgICAgIHJldHVybiBbXTtcbiAgICByZXR1cm4gcGFyYW07XG59XG5leHBvcnRzLnRvSXRlcmFibGVPckVtcHR5ID0gdG9JdGVyYWJsZU9yRW1wdHk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZwXzEgPSByZXF1aXJlKFwiLi4vZnBcIik7XG5jb25zdCB0b0l0ZXJhYmxlT3JFbXB0eV8xID0gcmVxdWlyZShcIi4vdG9JdGVyYWJsZU9yRW1wdHlcIik7XG5leHBvcnRzLnppcCA9IGZwXzEuY3VycnkoZnVuY3Rpb24qIChpdGVyYWJsZUxlZnQsIGl0ZXJhYmxlUmlnaHQsIC4uLm1vcmVJdGVyYWJsZXMpIHtcbiAgICBjb25zdCBpdGVyYXRvcnMgPSBbaXRlcmFibGVMZWZ0LCBpdGVyYWJsZVJpZ2h0XVxuICAgICAgICAuY29uY2F0KG1vcmVJdGVyYWJsZXMpXG4gICAgICAgIC5tYXAodG9JdGVyYWJsZU9yRW1wdHlfMS50b0l0ZXJhYmxlT3JFbXB0eSlcbiAgICAgICAgLm1hcChpdGVyYWJsZSA9PiBpdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCkpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBpdGVyYXRvcnMubWFwKGl0ZXJhdG9yID0+IGl0ZXJhdG9yLm5leHQoKSk7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gbmV4dC5tYXAoKHsgdmFsdWUsIGRvbmUgfSkgPT4gKGRvbmUgPyBudWxsIDogdmFsdWUpKTtcbiAgICAgICAgaWYgKG5leHQucmVkdWNlKChhY2MsIGN1cikgPT4gYWNjICYmIGN1ci5kb25lLCB0cnVlKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgeWllbGQgaXRlbXM7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGlzXzEgPSByZXF1aXJlKFwiLi4vaXNcIik7XG5jb25zdCBpdGVyYXRvcnNfMSA9IHJlcXVpcmUoXCIuLi9pdGVyYXRvcnNcIik7XG5leHBvcnRzLmVudHJpZXMgPSAocGFyYW0pID0+IHtcbiAgICBpZiAocGFyYW0gaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yc18xLmNvbGxlY3RUb0FycmF5KHBhcmFtLmVudHJpZXMoKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHBhcmFtIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvcnNfMS5jb2xsZWN0VG9BcnJheShwYXJhbS5lbnRyaWVzKCkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc18xLmlzT2JqZWN0KHBhcmFtKSkge1xuICAgICAgICBpZiAoaXNfMS5pc0Z1bmN0aW9uKHBhcmFtLmVudHJpZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbUVudHJpZXMgPSBwYXJhbS5lbnRyaWVzKCk7XG4gICAgICAgICAgICBpZiAoaXNfMS5pc0l0ZXJhYmxlKHBhcmFtRW50cmllcykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yc18xLmNvbGxlY3RUb0FycmF5KHBhcmFtRW50cmllcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNfMS5pc0FycmF5KHBhcmFtKSkge1xuICAgICAgICByZXR1cm4gcGFyYW0ubWFwKCh2LCBpKSA9PiBbaSwgdl0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi90b1BhaXJzXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2VudHJpZXNcIikpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBlbnRyaWVzXzEgPSByZXF1aXJlKFwiLi9lbnRyaWVzXCIpO1xuZXhwb3J0cy50b1BhaXJzID0gZW50cmllc18xLmVudHJpZXM7XG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG59IGNhdGNoIChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSBnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG4iLCIvLyBHZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSBuZWFybGV5LCB2ZXJzaW9uIDIuMTUuMVxuLy8gaHR0cDovL2dpdGh1Yi5jb20vSGFyZG1hdGgxMjMvbmVhcmxleVxuZnVuY3Rpb24gaWQoeCkge1xuICByZXR1cm4geFswXTtcbn1cbmNvbnN0IGdyYW1tYXIgPSB7XG4gIExleGVyOiB1bmRlZmluZWQsXG4gIFBhcnNlclJ1bGVzOiBbXG4gICAgeyBuYW1lOiAnTWFpbicsIHN5bWJvbHM6IFsnRUROJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcbiAgICB7IG5hbWU6ICdFRE4nLCBzeW1ib2xzOiBbJ0V4cCddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXG4gICAgeyBuYW1lOiAnRXhwJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRWxlbWVudFNwYWNlJ10gfSxcbiAgICB7IG5hbWU6ICdFeHAkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydFbGVtZW50Tm9TcGFjZSddIH0sXG4gICAgeyBuYW1lOiAnRXhwJywgc3ltYm9sczogWydFeHAkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtdLmNvbmNhdCguLi5kYXRhWzBdKSB9LFxuICAgIHsgbmFtZTogJ19FeHAnLCBzeW1ib2xzOiBbJ19fZXhwJ10gfSxcbiAgICB7IG5hbWU6ICdfRXhwJywgc3ltYm9sczogWydfX2NoYXInXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxuICAgIHsgbmFtZTogJ19fZXhwJywgc3ltYm9sczogWydfJywgJ0V4cCddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzFdIH0sXG4gICAgeyBuYW1lOiAnX19jaGFyJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ19FeHAnXSB9LFxuICAgIHsgbmFtZTogJ19fY2hhciRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydFbGVtZW50Tm9TcGFjZSddIH0sXG4gICAgeyBuYW1lOiAnX19jaGFyJGVibmYkMScsIHN5bWJvbHM6IFsnX19jaGFyJGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGlkIH0sXG4gICAge1xuICAgICAgbmFtZTogJ19fY2hhciRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ19fY2hhcicsXG4gICAgICBzeW1ib2xzOiBbJ0NoYXJhY3RlcicsICdfX2NoYXIkZWJuZiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbXS5jb25jYXQoLi4uW2RhdGFbMF1dLmNvbmNhdChkYXRhWzFdID8gW10uY29uY2F0KC4uLmRhdGFbMV0pIDogW10pKVxuICAgIH0sXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTnVtYmVyJ10gfSxcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydDaGFyYWN0ZXInXSB9LFxuICAgIHsgbmFtZTogJ0VsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1Jlc2VydmVkJ10gfSxcbiAgICB7IG5hbWU6ICdFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydTeW1ib2wnXSB9LFxuICAgIHsgbmFtZTogJ0VsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0tleXdvcmQnXSB9LFxuICAgIHsgbmFtZTogJ0VsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1RhZyddIH0sXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRGlzY2FyZCddIH0sXG4gICAgeyBuYW1lOiAnRWxlbWVudFNwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ19FeHAnXSB9LFxuICAgIHsgbmFtZTogJ0VsZW1lbnRTcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydFbGVtZW50Tm9TcGFjZSddIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0VsZW1lbnRTcGFjZSRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogWydFbGVtZW50U3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxuICAgICAgcG9zdHByb2Nlc3M6IGlkXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnRWxlbWVudFNwYWNlJGVibmYkMScsXG4gICAgICBzeW1ib2xzOiBbXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnRWxlbWVudFNwYWNlJyxcbiAgICAgIHN5bWJvbHM6IFsnRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsICdFbGVtZW50U3BhY2UkZWJuZiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbXS5jb25jYXQoLi4uW2RhdGFbMF1bMF1dLmNvbmNhdChkYXRhWzFdID8gW10uY29uY2F0KC4uLmRhdGFbMV0pIDogW10pKVxuICAgIH0sXG4gICAgeyBuYW1lOiAnRWxlbWVudE5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0VsZW1lbnROb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdFbGVtZW50Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnRWxlbWVudE5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCAnRXhwJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdFbGVtZW50Tm9TcGFjZSRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogWydFbGVtZW50Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogaWRcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdFbGVtZW50Tm9TcGFjZSRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0VsZW1lbnROb1NwYWNlJyxcbiAgICAgIHN5bWJvbHM6IFsnbWFwRWxlbWVudE5vU3BhY2UnLCAnRWxlbWVudE5vU3BhY2UkZWJuZiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbZGF0YVswXV0uY29uY2F0KGRhdGFbMV0gPyBkYXRhWzFdWzFdIDogW10pXG4gICAgfSxcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTnVtYmVyJ10gfSxcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnQ2hhcmFjdGVyJ10gfSxcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnUmVzZXJ2ZWQnXSB9LFxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydTeW1ib2wnXSB9LFxuICAgIHsgbmFtZTogJ0VsZW1lbnQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydLZXl3b3JkJ10gfSxcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnVmVjdG9yJ10gfSxcbiAgICB7IG5hbWU6ICdFbGVtZW50JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTGlzdCddIH0sXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1N0cmluZyddIH0sXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ01hcCddIH0sXG4gICAgeyBuYW1lOiAnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1NldCddIH0sXG4gICAgeyBuYW1lOiAnRWxlbWVudCcsIHN5bWJvbHM6IFsnRWxlbWVudCRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXVswXSB9LFxuICAgIHsgbmFtZTogJ1ZlY3RvciRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXG4gICAge1xuICAgICAgbmFtZTogJ1ZlY3RvciRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnVmVjdG9yJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdWZWN0b3IkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ1ZlY3RvciRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnRXhwJywgJ1ZlY3RvciRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMSddXG4gICAgfSxcbiAgICB7IG5hbWU6ICdWZWN0b3IkZWJuZiQyJywgc3ltYm9sczogWydWZWN0b3IkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogaWQgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnVmVjdG9yJGVibmYkMicsXG4gICAgICBzeW1ib2xzOiBbXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnVmVjdG9yJyxcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdbJyB9LCAnVmVjdG9yJGVibmYkMScsICdWZWN0b3IkZWJuZiQyJywgeyBsaXRlcmFsOiAnXScgfV0sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAndmVjdG9yJywgZGF0YTogZGF0YVsyXSA/IGRhdGFbMl1bMF0gOiBbXSB9KVxuICAgIH0sXG4gICAgeyBuYW1lOiAnTGlzdCRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0xpc3QkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHsgbmFtZTogJ0xpc3QkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0xpc3QkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnTGlzdCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydFeHAnLCAnTGlzdCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMSddIH0sXG4gICAgeyBuYW1lOiAnTGlzdCRlYm5mJDInLCBzeW1ib2xzOiBbJ0xpc3QkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogaWQgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnTGlzdCRlYm5mJDInLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0xpc3QnLFxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJygnIH0sICdMaXN0JGVibmYkMScsICdMaXN0JGVibmYkMicsIHsgbGl0ZXJhbDogJyknIH1dLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gKHsgdHlwZTogJ2xpc3QnLCBkYXRhOiBkYXRhWzJdID8gZGF0YVsyXVswXSA6IFtdIH0pXG4gICAgfSxcbiAgICB7IG5hbWU6ICdNYXAkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdNYXAkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHsgbmFtZTogJ01hcCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdNYXAkZWJuZiQyJHN1YmV4cHJlc3Npb24kMScsXG4gICAgICBzeW1ib2xzOiBbJ01hcEVsZW0nLCAnTWFwJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ11cbiAgICB9LFxuICAgIHsgbmFtZTogJ01hcCRlYm5mJDInLCBzeW1ib2xzOiBbJ01hcCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdNYXAkZWJuZiQyJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdNYXAnLFxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJ3snIH0sICdNYXAkZWJuZiQxJywgJ01hcCRlYm5mJDInLCB7IGxpdGVyYWw6ICd9JyB9XSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICh7IHR5cGU6ICdtYXAnLCBkYXRhOiBkYXRhWzJdID8gZGF0YVsyXVswXSA6IFtdIH0pXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnU2V0JHN0cmluZyQxJyxcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcjJyB9LCB7IGxpdGVyYWw6ICd7JyB9XSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xuICAgICAgICByZXR1cm4gZC5qb2luKCcnKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHsgbmFtZTogJ1NldCRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXG4gICAge1xuICAgICAgbmFtZTogJ1NldCRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnU2V0JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdTZXQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnU2V0JGVibmYkMiRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0V4cCcsICdTZXQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnXSB9LFxuICAgIHsgbmFtZTogJ1NldCRlYm5mJDInLCBzeW1ib2xzOiBbJ1NldCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdTZXQkZWJuZiQyJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdTZXQnLFxuICAgICAgc3ltYm9sczogWydTZXQkc3RyaW5nJDEnLCAnU2V0JGVibmYkMScsICdTZXQkZWJuZiQyJywgeyBsaXRlcmFsOiAnfScgfV0sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnc2V0JywgZGF0YTogZGF0YVsyXSA/IGRhdGFbMl1bMF0gOiBbXSB9KVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ1RhZycsXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnIycgfSwgJ1N5bWJvbCcsICdfJywgJ0VsZW1lbnQnXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiAoZGF0YSwgX2wsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoZGF0YVsxXS5kYXRhWzBdID09PSAnXycpIHJldHVybiByZWplY3Q7XG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd0YWcnLCB0YWc6IGRhdGFbMV0uZGF0YSwgZGF0YTogZGF0YVszXSB9O1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0Rpc2NhcmQkc3RyaW5nJDEnLFxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJyMnIH0sIHsgbGl0ZXJhbDogJ18nIH1dLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnRGlzY2FyZCRlYm5mJDEnLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0Rpc2NhcmQkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdEaXNjYXJkJyxcbiAgICAgIHN5bWJvbHM6IFsnRGlzY2FyZCRzdHJpbmckMScsICdEaXNjYXJkJGVibmYkMScsICdFbGVtZW50J10sXG4gICAgICBwb3N0cHJvY2VzczogKCkgPT4gKHsgdHlwZTogJ2Rpc2NhcmQnIH0pXG4gICAgfSxcbiAgICB7IG5hbWU6ICdTdHJpbmckZWJuZiQxJywgc3ltYm9sczogW10gfSxcbiAgICB7XG4gICAgICBuYW1lOiAnU3RyaW5nJGVibmYkMScsXG4gICAgICBzeW1ib2xzOiBbJ1N0cmluZyRlYm5mJDEnLCAnc3RyaW5nX2NoYXInXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnU3RyaW5nJyxcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdcIicgfSwgJ1N0cmluZyRlYm5mJDEnLCB7IGxpdGVyYWw6ICdcIicgfV0sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnc3RyaW5nJywgZGF0YTogZGF0YVsxXS5qb2luKCcnKSB9KVxuICAgIH0sXG4gICAgeyBuYW1lOiAnc3RyaW5nX2NoYXInLCBzeW1ib2xzOiBbL1teXFxcXFwiXS9dIH0sXG4gICAgeyBuYW1lOiAnc3RyaW5nX2NoYXInLCBzeW1ib2xzOiBbJ2JhY2tzbGFzaCddIH0sXG4gICAgeyBuYW1lOiAnc3RyaW5nX2NoYXInLCBzeW1ib2xzOiBbJ2JhY2tzbGFzaF91bmljb2RlJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdiYWNrc2xhc2gnLFxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJ1xcXFwnIH0sIC9bXCJ0cm5cXFxcXS9dLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YS5qb2luKCcnKVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2JhY2tzbGFzaF91bmljb2RlJyxcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdcXFxcJyB9LCAndW5pY29kZSddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVsxXVxuICAgIH0sXG4gICAgeyBuYW1lOiAnUmVzZXJ2ZWQkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydib29sZWFuJ10gfSxcbiAgICB7IG5hbWU6ICdSZXNlcnZlZCRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ25pbCddIH0sXG4gICAgeyBuYW1lOiAnUmVzZXJ2ZWQnLCBzeW1ib2xzOiBbJ1Jlc2VydmVkJHN1YmV4cHJlc3Npb24kMSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdWzBdIH0sXG4gICAgeyBuYW1lOiAnYm9vbGVhbiRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ3RydWUnXSB9LFxuICAgIHsgbmFtZTogJ2Jvb2xlYW4kc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydmYWxzZSddIH0sXG4gICAgeyBuYW1lOiAnYm9vbGVhbicsIHN5bWJvbHM6IFsnYm9vbGVhbiRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXVswXSB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICd0cnVlJHN0cmluZyQxJyxcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICd0JyB9LCB7IGxpdGVyYWw6ICdyJyB9LCB7IGxpdGVyYWw6ICd1JyB9LCB7IGxpdGVyYWw6ICdlJyB9XSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBqb2luZXIoZCkge1xuICAgICAgICByZXR1cm4gZC5qb2luKCcnKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHsgbmFtZTogJ3RydWUnLCBzeW1ib2xzOiBbJ3RydWUkc3RyaW5nJDEnXSwgcG9zdHByb2Nlc3M6ICgpID0+ICh7IHR5cGU6ICdib29sJywgZGF0YTogdHJ1ZSB9KSB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdmYWxzZSRzdHJpbmckMScsXG4gICAgICBzeW1ib2xzOiBbXG4gICAgICAgIHsgbGl0ZXJhbDogJ2YnIH0sXG4gICAgICAgIHsgbGl0ZXJhbDogJ2EnIH0sXG4gICAgICAgIHsgbGl0ZXJhbDogJ2wnIH0sXG4gICAgICAgIHsgbGl0ZXJhbDogJ3MnIH0sXG4gICAgICAgIHsgbGl0ZXJhbDogJ2UnIH1cbiAgICAgIF0sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gam9pbmVyKGQpIHtcbiAgICAgICAgcmV0dXJuIGQuam9pbignJyk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnZmFsc2UnLFxuICAgICAgc3ltYm9sczogWydmYWxzZSRzdHJpbmckMSddLFxuICAgICAgcG9zdHByb2Nlc3M6ICgpID0+ICh7IHR5cGU6ICdib29sJywgZGF0YTogZmFsc2UgfSlcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICduaWwkc3RyaW5nJDEnLFxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJ24nIH0sIHsgbGl0ZXJhbDogJ2knIH0sIHsgbGl0ZXJhbDogJ2wnIH1dLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnbmlsJywgc3ltYm9sczogWyduaWwkc3RyaW5nJDEnXSwgcG9zdHByb2Nlc3M6ICgpID0+ICh7IHR5cGU6ICduaWwnLCBkYXRhOiBudWxsIH0pIH0sXG4gICAgeyBuYW1lOiAnU3ltYm9sJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnc3ltYm9sJ10gfSxcbiAgICB7IG5hbWU6ICdTeW1ib2wkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJy8nIH1dIH0sXG4gICAge1xuICAgICAgbmFtZTogJ1N5bWJvbCcsXG4gICAgICBzeW1ib2xzOiBbJ1N5bWJvbCRzdWJleHByZXNzaW9uJDEnXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiAoZGF0YSwgXywgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChkYXRhWzBdWzBdID09PSAndHJ1ZScgfHwgZGF0YVswXVswXSA9PT0gJ2ZhbHNlJyB8fCBkYXRhWzBdWzBdID09PSAnbmlsJykgcmV0dXJuIHJlamVjdDtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3N5bWJvbCcsIGRhdGE6IGRhdGFbMF1bMF0gfTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHsgbmFtZTogJ3N5bWJvbCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJy8nIH0sICdzeW1ib2xfcGllY2UnXSB9LFxuICAgIHsgbmFtZTogJ3N5bWJvbCRlYm5mJDEnLCBzeW1ib2xzOiBbJ3N5bWJvbCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzeW1ib2wkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzeW1ib2wnLFxuICAgICAgc3ltYm9sczogWydzeW1ib2xfcGllY2UnLCAnc3ltYm9sJGVibmYkMSddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSArIChkYXRhWzFdID8gZGF0YVsxXS5qb2luKCcnKSA6ICcnKVxuICAgIH0sXG4gICAgeyBuYW1lOiAnc3ltYm9sX3BpZWNlJywgc3ltYm9sczogWydzeW1ib2xfcGllY2VfYmFzaWMnXSB9LFxuICAgIHsgbmFtZTogJ3N5bWJvbF9waWVjZScsIHN5bWJvbHM6IFsnc3ltYm9sX3BpZWNlX251bSddLCBwb3N0cHJvY2VzczogaWQgfSxcbiAgICB7IG5hbWU6ICdzeW1ib2xfcGllY2VfYmFzaWMkZWJuZiQxJywgc3ltYm9sczogW10gfSxcbiAgICB7XG4gICAgICBuYW1lOiAnc3ltYm9sX3BpZWNlX2Jhc2ljJGVibmYkMScsXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9waWVjZV9iYXNpYyRlYm5mJDEnLCAnc3ltYm9sX21pZCddLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzeW1ib2xfcGllY2VfYmFzaWMnLFxuICAgICAgc3ltYm9sczogWydzeW1ib2xfc3RhcnQnLCAnc3ltYm9sX3BpZWNlX2Jhc2ljJGVibmYkMSddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSArIGRhdGFbMV0uam9pbignJylcbiAgICB9LFxuICAgIHsgbmFtZTogJ3N5bWJvbF9waWVjZV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCBzeW1ib2xzOiBbXSB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzeW1ib2xfcGllY2VfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX3BpZWNlX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsICdzeW1ib2xfbWlkJ10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3N5bWJvbF9waWVjZV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9zZWNvbmRfc3BlY2lhbCcsICdzeW1ib2xfcGllY2VfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzeW1ib2xfcGllY2VfbnVtJGVibmYkMScsXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9waWVjZV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxuICAgICAgcG9zdHByb2Nlc3M6IGlkXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnc3ltYm9sX3BpZWNlX251bSRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3N5bWJvbF9waWVjZV9udW0nLFxuICAgICAgc3ltYm9sczogWy9bXFwtKy5dLywgJ3N5bWJvbF9waWVjZV9udW0kZWJuZiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdICsgKGRhdGFbMV0gPyBkYXRhWzFdWzBdICsgZGF0YVsxXVsxXS5qb2luKCcnKSA6ICcnKVxuICAgIH0sXG4gICAgeyBuYW1lOiAnc3ltYm9sX2Jhc2ljJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3N5bWJvbF9iYXNpYyRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogWydzeW1ib2xfYmFzaWMkZWJuZiQxJywgJ3N5bWJvbF9taWQnXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7IG5hbWU6ICdzeW1ib2xfYmFzaWMkZWJuZiQyJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcvJyB9LCAnc3ltYm9sX3BpZWNlJ10gfSxcbiAgICB7XG4gICAgICBuYW1lOiAnc3ltYm9sX2Jhc2ljJGVibmYkMicsXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9iYXNpYyRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogaWRcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzeW1ib2xfYmFzaWMkZWJuZiQyJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzeW1ib2xfYmFzaWMnLFxuICAgICAgc3ltYm9sczogWydzeW1ib2xfc3RhcnQnLCAnc3ltYm9sX2Jhc2ljJGVibmYkMScsICdzeW1ib2xfYmFzaWMkZWJuZiQyJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdICsgZGF0YVsxXS5qb2luKCcnKSArIChkYXRhWzJdID8gZGF0YVsyXS5qb2luKCcnKSA6ICcnKVxuICAgIH0sXG4gICAgeyBuYW1lOiAnc3ltYm9sX3N0YXJ0Jywgc3ltYm9sczogWydsZXR0ZXInXSB9LFxuICAgIHsgbmFtZTogJ3N5bWJvbF9zdGFydCcsIHN5bWJvbHM6IFsvWyp+XyE/JCUmPTw+XS9dLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXG4gICAgeyBuYW1lOiAnc3ltYm9sX21pZCcsIHN5bWJvbHM6IFsnbGV0dGVyJ10gfSxcbiAgICB7IG5hbWU6ICdzeW1ib2xfbWlkJywgc3ltYm9sczogWydkaWdpdCddIH0sXG4gICAgeyBuYW1lOiAnc3ltYm9sX21pZCcsIHN5bWJvbHM6IFsvWy4qXFwhXFwtK18/JCUmPTw+OiNdL10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcbiAgICB7IG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX2xpa2VfYV9udW0kZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnLCAnc3ltYm9sX21pZCddLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnc3ltYm9sX3NlY29uZF9zcGVjaWFsJywgJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogWydzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogaWRcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMiRzdWJleHByZXNzaW9uJDEnLFxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJy8nIH0sICdzeW1ib2xfcGllY2UnXVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMicsXG4gICAgICBzeW1ib2xzOiBbJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMiRzdWJleHByZXNzaW9uJDEnXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMicsXG4gICAgICBzeW1ib2xzOiBbXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnc3ltYm9sX2xpa2VfYV9udW0nLFxuICAgICAgc3ltYm9sczogWy9bXFwtKy5dLywgJ3N5bWJvbF9saWtlX2FfbnVtJGVibmYkMScsICdzeW1ib2xfbGlrZV9hX251bSRlYm5mJDInXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+XG4gICAgICAgIGRhdGFbMF0gK1xuICAgICAgICAoZGF0YVsxXSA/IGRhdGFbMV1bMF0gKyBkYXRhWzFdWzFdLmpvaW4oJycpIDogJycpICtcbiAgICAgICAgKGRhdGFbMl0gPyBkYXRhWzJdLmpvaW4oJycpIDogJycpXG4gICAgfSxcbiAgICB7IG5hbWU6ICdzeW1ib2xfc2Vjb25kX3NwZWNpYWwnLCBzeW1ib2xzOiBbJ3N5bWJvbF9zdGFydCddIH0sXG4gICAgeyBuYW1lOiAnc3ltYm9sX3NlY29uZF9zcGVjaWFsJywgc3ltYm9sczogWy9bXFwtKy46I10vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdLZXl3b3JkJyxcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICc6JyB9LCAnU3ltYm9sJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAna2V5d29yZCcsIGRhdGE6ICc6JyArIGRhdGFbMV0uZGF0YSB9KVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0NoYXJhY3RlcicsXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnXFxcXCcgfSwgJ2NoYXInXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+ICh7IHR5cGU6ICdjaGFyJywgZGF0YTogZGF0YVsxXVswXSB9KVxuICAgIH0sXG4gICAgeyBuYW1lOiAnY2hhcicsIHN5bWJvbHM6IFsvW14gXFx0XFxyXFxuXS9dIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2NoYXIkc3RyaW5nJDEnLFxuICAgICAgc3ltYm9sczogW1xuICAgICAgICB7IGxpdGVyYWw6ICduJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICdlJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICd3JyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICdsJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICdpJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICduJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICdlJyB9XG4gICAgICBdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnY2hhcicsIHN5bWJvbHM6IFsnY2hhciRzdHJpbmckMSddIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2NoYXIkc3RyaW5nJDInLFxuICAgICAgc3ltYm9sczogW1xuICAgICAgICB7IGxpdGVyYWw6ICdyJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICdlJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICd0JyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICd1JyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICdyJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICduJyB9XG4gICAgICBdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnY2hhcicsIHN5bWJvbHM6IFsnY2hhciRzdHJpbmckMiddIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2NoYXIkc3RyaW5nJDMnLFxuICAgICAgc3ltYm9sczogW1xuICAgICAgICB7IGxpdGVyYWw6ICdzJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICdwJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICdhJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICdjJyB9LFxuICAgICAgICB7IGxpdGVyYWw6ICdlJyB9XG4gICAgICBdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnY2hhcicsIHN5bWJvbHM6IFsnY2hhciRzdHJpbmckMyddIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2NoYXIkc3RyaW5nJDQnLFxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJ3QnIH0sIHsgbGl0ZXJhbDogJ2EnIH0sIHsgbGl0ZXJhbDogJ2InIH1dLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGpvaW5lcihkKSB7XG4gICAgICAgIHJldHVybiBkLmpvaW4oJycpO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnY2hhcicsIHN5bWJvbHM6IFsnY2hhciRzdHJpbmckNCddIH0sXG4gICAgeyBuYW1lOiAnY2hhcicsIHN5bWJvbHM6IFsndW5pY29kZSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXG4gICAgeyBuYW1lOiAnTnVtYmVyJywgc3ltYm9sczogWydJbnRlZ2VyJ10gfSxcbiAgICB7IG5hbWU6ICdOdW1iZXInLCBzeW1ib2xzOiBbJ0Zsb2F0J10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcbiAgICB7XG4gICAgICBuYW1lOiAnRmxvYXQnLFxuICAgICAgc3ltYm9sczogWydmbG9hdCddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gKHsgdHlwZTogJ2RvdWJsZScsIGRhdGE6IGRhdGFbMF1bMF0sIGFyYml0cmFyeTogISFkYXRhWzBdWzFdIH0pXG4gICAgfSxcbiAgICB7IG5hbWU6ICdJbnRlZ2VyJGVibmYkMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdOJyB9XSwgcG9zdHByb2Nlc3M6IGlkIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0ludGVnZXIkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdJbnRlZ2VyJyxcbiAgICAgIHN5bWJvbHM6IFsnaW50JywgJ0ludGVnZXIkZWJuZiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiAoeyB0eXBlOiAnaW50JywgZGF0YTogZGF0YVswXVswXSwgYXJiaXRyYXJ5OiAhIWRhdGFbMV0gfSlcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdmbG9hdCcsXG4gICAgICBzeW1ib2xzOiBbJ2ludCcsIHsgbGl0ZXJhbDogJ00nIH1dLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW2RhdGEuc2xpY2UoMCwgMSkuam9pbignJyksIGRhdGFbMV1dXG4gICAgfSxcbiAgICB7IG5hbWU6ICdmbG9hdCRlYm5mJDEnLCBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnTScgfV0sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdmbG9hdCRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2Zsb2F0JyxcbiAgICAgIHN5bWJvbHM6IFsnaW50JywgJ2ZyYWMnLCAnZmxvYXQkZWJuZiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbZGF0YS5zbGljZSgwLCAyKS5qb2luKCcnKSwgZGF0YVsyXV1cbiAgICB9LFxuICAgIHsgbmFtZTogJ2Zsb2F0JGVibmYkMicsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdNJyB9XSwgcG9zdHByb2Nlc3M6IGlkIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2Zsb2F0JGVibmYkMicsXG4gICAgICBzeW1ib2xzOiBbXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnZmxvYXQnLFxuICAgICAgc3ltYm9sczogWydpbnQnLCAnZXhwJywgJ2Zsb2F0JGVibmYkMiddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW2RhdGEuc2xpY2UoMCwgMikuam9pbignJyksIGRhdGFbMl1dXG4gICAgfSxcbiAgICB7IG5hbWU6ICdmbG9hdCRlYm5mJDMnLCBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnTScgfV0sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdmbG9hdCRlYm5mJDMnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2Zsb2F0JyxcbiAgICAgIHN5bWJvbHM6IFsnaW50JywgJ2ZyYWMnLCAnZXhwJywgJ2Zsb2F0JGVibmYkMyddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW2RhdGEuc2xpY2UoMCwgMykuam9pbignJyksIGRhdGFbMl1dXG4gICAgfSxcbiAgICB7IG5hbWU6ICdmcmFjJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2ZyYWMkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnZnJhYyRlYm5mJDEnLCAnZGlnaXQnXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnZnJhYycsXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnLicgfSwgJ2ZyYWMkZWJuZiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdICsgZGF0YVsxXS5qb2luKCcnKVxuICAgIH0sXG4gICAgeyBuYW1lOiAnZXhwJywgc3ltYm9sczogWydleCcsICdkaWdpdHMnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YS5qb2luKCcnKSB9LFxuICAgIHsgbmFtZTogJ2V4JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdlJyB9XSB9LFxuICAgIHsgbmFtZTogJ2V4JHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICdFJyB9XSB9LFxuICAgIHsgbmFtZTogJ2V4JGVibmYkMSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnKycgfV0gfSxcbiAgICB7IG5hbWU6ICdleCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogW3sgbGl0ZXJhbDogJy0nIH1dIH0sXG4gICAgeyBuYW1lOiAnZXgkZWJuZiQxJywgc3ltYm9sczogWydleCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdleCRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2V4JyxcbiAgICAgIHN5bWJvbHM6IFsnZXgkc3ViZXhwcmVzc2lvbiQxJywgJ2V4JGVibmYkMSddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gJ2UnICsgKGRhdGFbMV0gfHwgJysnKVxuICAgIH0sXG4gICAgeyBuYW1lOiAnaW50Jywgc3ltYm9sczogWydpbnRfbm9fcHJlZml4J10gfSxcbiAgICB7XG4gICAgICBuYW1lOiAnaW50JyxcbiAgICAgIHN5bWJvbHM6IFt7IGxpdGVyYWw6ICcrJyB9LCAnaW50X25vX3ByZWZpeCddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YS5qb2luKCcnKVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2ludCcsXG4gICAgICBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnLScgfSwgJ2ludF9ub19wcmVmaXgnXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGEuam9pbignJylcbiAgICB9LFxuICAgIHsgbmFtZTogJ2ludF9ub19wcmVmaXgnLCBzeW1ib2xzOiBbeyBsaXRlcmFsOiAnMCcgfV0sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGEuam9pbignJykgfSxcbiAgICB7IG5hbWU6ICdpbnRfbm9fcHJlZml4JGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2ludF9ub19wcmVmaXgkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnaW50X25vX3ByZWZpeCRlYm5mJDEnLCAnZGlnaXQnXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnaW50X25vX3ByZWZpeCcsXG4gICAgICBzeW1ib2xzOiBbJ29uZVRvTmluZScsICdpbnRfbm9fcHJlZml4JGVibmYkMSddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSArIGRhdGFbMV0uam9pbignJylcbiAgICB9LFxuICAgIHsgbmFtZTogJ29uZVRvTmluZScsIHN5bWJvbHM6IFsvWzEtOV0vXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YS5qb2luKCcnKSB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdNYXBFbGVtJyxcbiAgICAgIHN5bWJvbHM6IFsnbWFwS2V5JywgJ21hcFZhbHVlJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBbW2RhdGFbMF1bMF0sIGRhdGFbMV1bMF1dXS5jb25jYXQoZGF0YVsxXS5zbGljZSgxKSlcbiAgICB9LFxuICAgIHsgbmFtZTogJ21hcEtleSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ21hcEtleVNwYWNlJ10gfSxcbiAgICB7IG5hbWU6ICdtYXBLZXkkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydtYXBLZXlOb1NwYWNlJ10gfSxcbiAgICB7IG5hbWU6ICdtYXBLZXknLCBzeW1ib2xzOiBbJ21hcEtleSRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXSB9LFxuICAgIHsgbmFtZTogJ21hcFZhbHVlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnbWFwVmFsdWVTcGFjZSddIH0sXG4gICAgeyBuYW1lOiAnbWFwVmFsdWUkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydtYXBWYWx1ZU5vU3BhY2UnXSB9LFxuICAgIHsgbmFtZTogJ21hcFZhbHVlJywgc3ltYm9sczogWydtYXBWYWx1ZSRzdWJleHByZXNzaW9uJDEnXSwgcG9zdHByb2Nlc3M6IGRhdGEgPT4gZGF0YVswXVswXSB9LFxuICAgIHsgbmFtZTogJ21hcEtleVNwYWNlJGVibmYkMScsIHN5bWJvbHM6IFtdIH0sXG4gICAgeyBuYW1lOiAnbWFwS2V5U3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnRGlzY2FyZCcsICdfJ10gfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbWFwS2V5U3BhY2UkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnbWFwS2V5U3BhY2UkZWJuZiQxJywgJ21hcEtleVNwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtcbiAgICAgICAgcmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbWFwS2V5U3BhY2UnLFxuICAgICAgc3ltYm9sczogWydtYXBLZXlTcGFjZSRlYm5mJDEnLCAnbWFwRWxlbWVudFNwYWNlJywgJ18nXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMV1cbiAgICB9LFxuICAgIHsgbmFtZTogJ21hcEtleU5vU3BhY2UkZWJuZiQxJywgc3ltYm9sczogW10gfSxcbiAgICB7IG5hbWU6ICdtYXBLZXlOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJywgc3ltYm9sczogWydfJ10sIHBvc3Rwcm9jZXNzOiBpZCB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdtYXBLZXlOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdtYXBLZXlOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLFxuICAgICAgc3ltYm9sczogWydEaXNjYXJkJywgJ21hcEtleU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSRlYm5mJDEnXVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ21hcEtleU5vU3BhY2UkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnbWFwS2V5Tm9TcGFjZSRlYm5mJDEnLCAnbWFwS2V5Tm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnbWFwS2V5Tm9TcGFjZSRlYm5mJDInLCBzeW1ib2xzOiBbJ18nXSwgcG9zdHByb2Nlc3M6IGlkIH0sXG4gICAge1xuICAgICAgbmFtZTogJ21hcEtleU5vU3BhY2UkZWJuZiQyJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdtYXBLZXlOb1NwYWNlJyxcbiAgICAgIHN5bWJvbHM6IFsnbWFwS2V5Tm9TcGFjZSRlYm5mJDEnLCAnbWFwRWxlbWVudE5vU3BhY2UnLCAnbWFwS2V5Tm9TcGFjZSRlYm5mJDInXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMV1cbiAgICB9LFxuICAgIHsgbmFtZTogJ21hcFZhbHVlU3BhY2UkZWJuZiQxJywgc3ltYm9sczogW10gfSxcbiAgICB7IG5hbWU6ICdtYXBWYWx1ZVNwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0Rpc2NhcmQnLCAnXyddIH0sXG4gICAge1xuICAgICAgbmFtZTogJ21hcFZhbHVlU3BhY2UkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnbWFwVmFsdWVTcGFjZSRlYm5mJDEnLCAnbWFwVmFsdWVTcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnbWFwVmFsdWVTcGFjZSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydfJywgJ01hcEVsZW0nXSB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZVNwYWNlJGVibmYkMicsXG4gICAgICBzeW1ib2xzOiBbJ21hcFZhbHVlU3BhY2UkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSddLFxuICAgICAgcG9zdHByb2Nlc3M6IGlkXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbWFwVmFsdWVTcGFjZSRlYm5mJDInLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ21hcFZhbHVlU3BhY2UnLFxuICAgICAgc3ltYm9sczogWydtYXBWYWx1ZVNwYWNlJGVibmYkMScsICdtYXBFbGVtZW50U3BhY2UnLCAnbWFwVmFsdWVTcGFjZSRlYm5mJDInXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBkYXRhID0+IFtkYXRhWzFdXS5jb25jYXQoZGF0YVsyXSA/IGRhdGFbMl1bMV0gOiBbXSlcbiAgICB9LFxuICAgIHsgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDEnLCBzeW1ib2xzOiBbXSB9LFxuICAgIHsgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMScsXG4gICAgICBzeW1ib2xzOiBbJ0Rpc2NhcmQnLCAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMSRzdWJleHByZXNzaW9uJDEkZWJuZiQxJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnbWFwVmFsdWVOb1NwYWNlJGVibmYkMScsICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQxJHN1YmV4cHJlc3Npb24kMSddLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHsgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsIHN5bWJvbHM6IFsnXyddLCBwb3N0cHJvY2VzczogaWQgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFtdLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQyJHN1YmV4cHJlc3Npb24kMScsXG4gICAgICBzeW1ib2xzOiBbJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMScsICdNYXBFbGVtJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdtYXBWYWx1ZU5vU3BhY2UkZWJuZiQyJyxcbiAgICAgIHN5bWJvbHM6IFsnbWFwVmFsdWVOb1NwYWNlJGVibmYkMiRzdWJleHByZXNzaW9uJDEnXSxcbiAgICAgIHBvc3Rwcm9jZXNzOiBpZFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDInLFxuICAgICAgc3ltYm9sczogW10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ21hcFZhbHVlTm9TcGFjZScsXG4gICAgICBzeW1ib2xzOiBbJ21hcFZhbHVlTm9TcGFjZSRlYm5mJDEnLCAnbWFwRWxlbWVudE5vU3BhY2UnLCAnbWFwVmFsdWVOb1NwYWNlJGVibmYkMiddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW2RhdGFbMV1dLmNvbmNhdChkYXRhWzJdID8gZGF0YVsyXVsxXSA6IFtdKVxuICAgIH0sXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudE5vU3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydWZWN0b3InXSB9LFxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTGlzdCddIH0sXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudE5vU3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydTdHJpbmcnXSB9LFxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnROb1NwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnTWFwJ10gfSxcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50Tm9TcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1NldCddIH0sXG4gICAge1xuICAgICAgbmFtZTogJ21hcEVsZW1lbnROb1NwYWNlJyxcbiAgICAgIHN5bWJvbHM6IFsnbWFwRWxlbWVudE5vU3BhY2Ukc3ViZXhwcmVzc2lvbiQxJ10sXG4gICAgICBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdWzBdXG4gICAgfSxcbiAgICB7IG5hbWU6ICdtYXBFbGVtZW50U3BhY2Ukc3ViZXhwcmVzc2lvbiQxJywgc3ltYm9sczogWydOdW1iZXInXSB9LFxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ0NoYXJhY3RlciddIH0sXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnUmVzZXJ2ZWQnXSB9LFxuICAgIHsgbmFtZTogJ21hcEVsZW1lbnRTcGFjZSRzdWJleHByZXNzaW9uJDEnLCBzeW1ib2xzOiBbJ1N5bWJvbCddIH0sXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnS2V5d29yZCddIH0sXG4gICAgeyBuYW1lOiAnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMScsIHN5bWJvbHM6IFsnVGFnJ10gfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbWFwRWxlbWVudFNwYWNlJyxcbiAgICAgIHN5bWJvbHM6IFsnbWFwRWxlbWVudFNwYWNlJHN1YmV4cHJlc3Npb24kMSddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gW10uY29uY2F0KC4uLltkYXRhWzBdWzBdXSlbMF1cbiAgICB9LFxuICAgIHsgbmFtZTogJ2hleERpZ2l0Jywgc3ltYm9sczogWy9bYS1mQS1GMC05XS9dLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3VuaWNvZGUnLFxuICAgICAgc3ltYm9sczogW3sgbGl0ZXJhbDogJ3UnIH0sICdoZXhEaWdpdCcsICdoZXhEaWdpdCcsICdoZXhEaWdpdCcsICdoZXhEaWdpdCddLFxuICAgICAgcG9zdHByb2Nlc3M6IGRhdGEgPT4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChkYXRhLnNsaWNlKDEpLmpvaW4oJycpLCAxNikpXG4gICAgfSxcbiAgICB7IG5hbWU6ICdfJywgc3ltYm9sczogWydzcGFjZSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdIH0sXG4gICAgeyBuYW1lOiAnc3BhY2UkZWJuZiQxJywgc3ltYm9sczogWy9bXFxzLFxcbl0vXSB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzcGFjZSRlYm5mJDEnLFxuICAgICAgc3ltYm9sczogWydzcGFjZSRlYm5mJDEnLCAvW1xccyxcXG5dL10sXG4gICAgICBwb3N0cHJvY2VzczogZnVuY3Rpb24gYXJycHVzaChkKSB7XG4gICAgICAgIHJldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBuYW1lOiAnc3BhY2UnLCBzeW1ib2xzOiBbJ3NwYWNlJGVibmYkMSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdLmpvaW4oJycpIH0sXG4gICAgeyBuYW1lOiAnZGlnaXRzJGVibmYkMScsIHN5bWJvbHM6IFsnZGlnaXQnXSB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdkaWdpdHMkZWJuZiQxJyxcbiAgICAgIHN5bWJvbHM6IFsnZGlnaXRzJGVibmYkMScsICdkaWdpdCddLFxuICAgICAgcG9zdHByb2Nlc3M6IGZ1bmN0aW9uIGFycnB1c2goZCkge1xuICAgICAgICByZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHsgbmFtZTogJ2RpZ2l0cycsIHN5bWJvbHM6IFsnZGlnaXRzJGVibmYkMSddLCBwb3N0cHJvY2VzczogZGF0YSA9PiBkYXRhWzBdLmpvaW4oJycpIH0sXG4gICAgeyBuYW1lOiAnZGlnaXQnLCBzeW1ib2xzOiBbL1swLTldL10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfSxcbiAgICB7IG5hbWU6ICdsZXR0ZXInLCBzeW1ib2xzOiBbL1thLXpBLVpdL10sIHBvc3Rwcm9jZXNzOiBkYXRhID0+IGRhdGFbMF0gfVxuICBdLFxuICBQYXJzZXJTdGFydDogJ01haW4nXG59O1xuXG4vLyBEbyB0aGUgcGFyc2luZ1xuaW1wb3J0IHsgUGFyc2VyLCBHcmFtbWFyIH0gZnJvbSAnbmVhcmxleSc7XG5pbXBvcnQgeyBwcmVwcm9jZXNzIH0gZnJvbSAnLi9wcmVwcm9jZXNzb3InO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2Uoc3RyaW5nOiBzdHJpbmcpIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcihHcmFtbWFyLmZyb21Db21waWxlZChncmFtbWFyKSk7XG4gIGNvbnN0IHN0ciA9IHByZXByb2Nlc3Moc3RyaW5nKTtcbiAgaWYgKCFzdHIpIHJldHVybiBudWxsO1xuICB0cnkge1xuICAgIHJldHVybiBwYXJzZXIuZmVlZChwcmVwcm9jZXNzKHN0cmluZykpLnJlc3VsdHNbMF07XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgcGFyc2UgfSBmcm9tICcuL2dyYW1tYXInO1xuaW1wb3J0IHsgcHJvY2Vzc1Rva2VucyBhcyBjb3JyZWN0UHJvY2VzcyB9IGZyb20gJy4vaW50ZXJwcmV0ZXInO1xuaW1wb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSAnLi9zdHJpbmdpZnknO1xuaW1wb3J0IHsgcHJvY2Vzc1Rva2VucyBhcyBqc29uUHJvY2VzcyB9IGZyb20gJy4vanNvbl9pbnRlcnByZXRlcic7XG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IEVkbiA9IHtcbiAgcGFyc2U6IChzdHI6IHN0cmluZykgPT4gY29ycmVjdFByb2Nlc3MocGFyc2Uoc3RyKSksXG4gIHBhcnNlSnNvbjogKHN0cjogc3RyaW5nKSA9PiBqc29uUHJvY2VzcyhwYXJzZShzdHIpKSxcbiAgc3RyaW5naWZ5LFxuICB0eXBlc1xufTtcbiIsImltcG9ydCB7IGtleXdvcmQsIG1hcCwgc2V0LCBzeW1ib2wsIHRhZyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgZmxhdE1hcCB9IGZyb20gJ3RvZnUtanMvZGlzdC9hcnJheXMnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJ3RvZnUtanMvZGlzdC9pcyc7XG5pbXBvcnQgeyB1bmVzY2FwZVN0ciB9IGZyb20gJy4vc3RyaW5ncyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzVG9rZW5zKHRva2VuczogYW55W10gfCBib29sZWFuKSB7XG4gIGlmICghaXNBcnJheSh0b2tlbnMpKSB7XG4gICAgdGhyb3cgJ0ludmFsaWQgRUROIHN0cmluZyc7XG4gIH1cbiAgcmV0dXJuIHRva2Vucy5maWx0ZXIodCA9PiB0ICYmIHQudHlwZSAhPT0gJ2Rpc2NhcmQnKS5tYXAocHJvY2Vzc1Rva2VuKTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1Rva2VuKHRva2VuOiBhbnkpOiBhbnkge1xuICBjb25zdCB7IGRhdGEsIHR5cGUsIHRhZyB9ID0gdG9rZW47XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2RvdWJsZSc6XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChkYXRhKTtcbiAgICBjYXNlICdpbnQnOlxuICAgICAgcmV0dXJuIHBhcnNlSW50KGRhdGEpO1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdW5lc2NhcGVTdHIoZGF0YSk7XG4gICAgY2FzZSAnY2hhcic6XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICBjYXNlICdrZXl3b3JkJzpcbiAgICAgIHJldHVybiBrZXl3b3JkKGRhdGEpO1xuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gc3ltYm9sKGRhdGEpO1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgIGNhc2UgJ2Jvb2wnOlxuICAgICAgcmV0dXJuIGRhdGEgPT09ICd0cnVlJyB8fCBkYXRhID09PSB0cnVlO1xuICAgIGNhc2UgJ3RhZyc6XG4gICAgICByZXR1cm4gcHJvY2Vzc1RhZyh0YWcsIGRhdGEpO1xuICAgIGNhc2UgJ2xpc3QnOlxuICAgIGNhc2UgJ3ZlY3Rvcic6XG4gICAgICByZXR1cm4gcHJvY2Vzc1Rva2VucyhkYXRhKTtcbiAgICBjYXNlICdzZXQnOlxuICAgICAgcmV0dXJuIHNldChwcm9jZXNzVG9rZW5zKGRhdGEpKTtcbiAgICBjYXNlICdtYXAnOlxuICAgICAgcmV0dXJuIG1hcChmbGF0TWFwKHByb2Nlc3NUb2tlbnMsIGRhdGEpKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1RhZyh0YWdOYW1lOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICByZXR1cm4gdGFnKHRhZ05hbWUsIHByb2Nlc3NUb2tlbihkYXRhKSk7XG59XG4iLCJpbXBvcnQgeyBjaHVuaywgZmxhdE1hcCwgZnJvbVBhaXJzLCBtYXAgfSBmcm9tICd0b2Z1LWpzL2Rpc3QvYXJyYXlzJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICd0b2Z1LWpzL2Rpc3QvaXMnO1xuaW1wb3J0IHsgdW5lc2NhcGVTdHIgfSBmcm9tICcuL3N0cmluZ3MnO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc1Rva2Vucyh0b2tlbnM6IGFueVtdIHwgYm9vbGVhbikge1xuICBpZiAoIWlzQXJyYXkodG9rZW5zKSkge1xuICAgIHRocm93ICdJbnZhbGlkIEVETiBzdHJpbmcnO1xuICB9XG4gIHJldHVybiB0b2tlbnMuZmlsdGVyKHQgPT4gdCAmJiB0LnR5cGUgIT09ICdkaXNjYXJkJykubWFwKHByb2Nlc3NUb2tlbik7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NUb2tlbih0b2tlbjogYW55KTogYW55IHtcbiAgY29uc3QgeyBkYXRhLCB0eXBlLCB0YWcgfSA9IHRva2VuO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdkb3VibGUnOlxuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoZGF0YSk7XG4gICAgY2FzZSAnaW50JzpcbiAgICAgIHJldHVybiBwYXJzZUludChkYXRhKTtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHVuZXNjYXBlU3RyKGRhdGEpO1xuICAgIGNhc2UgJ2NoYXInOlxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgY2FzZSAna2V5d29yZCc6XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgY2FzZSAnYm9vbCc6XG4gICAgICByZXR1cm4gZGF0YSA9PT0gJ3RydWUnIHx8IGRhdGEgPT09IHRydWU7XG4gICAgY2FzZSAndGFnJzpcbiAgICAgIHJldHVybiB7IHRhZywgdmFsdWU6IHByb2Nlc3NUb2tlbihkYXRhKSB9O1xuICAgIGNhc2UgJ2xpc3QnOlxuICAgIGNhc2UgJ3ZlY3Rvcic6XG4gICAgICByZXR1cm4gcHJvY2Vzc1Rva2VucyhkYXRhKTtcbiAgICBjYXNlICdzZXQnOlxuICAgICAgcmV0dXJuIGZyb21QYWlycyhtYXAodCA9PiBbdCwgdF0sIHByb2Nlc3NUb2tlbnMoZGF0YSkpKTtcbiAgICBjYXNlICdtYXAnOlxuICAgICAgcmV0dXJuIGZyb21QYWlycyhjaHVuaygyLCBmbGF0TWFwKHByb2Nlc3NUb2tlbnMsIGRhdGEpKSBhcyBhbnkpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuIiwiZXhwb3J0IGNvbnN0IHByZXByb2Nlc3MgPSAoc3RyOiBzdHJpbmcpID0+IHJlbW92ZUNvbW1lbnRzKHN0cikudHJpbSgpO1xuXG5mdW5jdGlvbiByZW1vdmVDb21tZW50cyhzdHI6IHN0cmluZykge1xuICBsZXQgbmV3U3RyID0gJyc7XG4gIGxldCBpblF1b3RlcyA9IGZhbHNlO1xuICBsZXQgaW5Db21tZW50ID0gZmFsc2U7XG4gIGxldCBza2lwID0gZmFsc2U7XG4gIGZvciAoY29uc3QgYyBvZiBzdHIpIHtcbiAgICBpZiAoc2tpcCkge1xuICAgICAgbmV3U3RyICs9IGM7XG4gICAgICBza2lwID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChjID09PSAnOycgJiYgIWluUXVvdGVzKSB7XG4gICAgICBpbkNvbW1lbnQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gJ1xcbicpIHtcbiAgICAgIG5ld1N0ciArPSAnXFxuJztcbiAgICAgIGluQ29tbWVudCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoIWluQ29tbWVudCkge1xuICAgICAgbmV3U3RyICs9IGM7XG4gICAgICBpZiAoYyA9PT0gJ1xcXFwnKSBza2lwID0gdHJ1ZTtcbiAgICAgIGVsc2UgaWYgKGMgPT09ICdcIicpIGluUXVvdGVzID0gIWluUXVvdGVzO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3U3RyO1xufVxuIiwiaW1wb3J0IHsgcGlwZSB9IGZyb20gJ3RvZnUtanMvZGlzdC9mcCc7XG5pbXBvcnQgeyBjb2xsZWN0VG9BcnJheSwgZmxhdHRlbiBhcyBpZmxhdHRlbiwgbWFwIGFzIGltYXAgfSBmcm9tICd0b2Z1LWpzL2Rpc3QvaXRlcmF0b3JzJztcbmltcG9ydCB7IGpvaW4sIG1hcCBhcyBhbWFwIH0gZnJvbSAndG9mdS1qcy9kaXN0L2FycmF5cyc7XG5pbXBvcnQgeyBFZG5LZXl3b3JkLCBFZG5NYXAsIEVkblNldCwgRWRuU3ltYm9sLCBFZG5UYWcsIHR5cGUgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IGVudHJpZXMgfSBmcm9tICd0b2Z1LWpzL2Rpc3Qvb2JqZWN0cyc7XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdpZnkgPSAoZGF0YTogYW55KSA9PiB7XG4gIGNvbnN0IHR5cGVPZiA9IHR5cGUoZGF0YSk7XG4gIHN3aXRjaCAodHlwZU9mKSB7XG4gICAgY2FzZSAnTmlsJzpcbiAgICAgIHJldHVybiAnbmlsJztcbiAgICBjYXNlICdOdW1iZXInOlxuICAgICAgcmV0dXJuICcnICsgZGF0YTtcbiAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIGNhc2UgJ01hcCc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5TWFwKGRhdGEpO1xuICAgIGNhc2UgJ1NldCc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5U2V0KGRhdGEpO1xuICAgIGNhc2UgJ1RhZyc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5VGFnKGRhdGEpO1xuICAgIGNhc2UgJ1N5bWJvbCc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5U3ltYm9sKGRhdGEpO1xuICAgIGNhc2UgJ0tleXdvcmQnOlxuICAgICAgcmV0dXJuIHN0cmluZ2lmeUtleXdvcmQoZGF0YSk7XG4gICAgY2FzZSAnVmVjdG9yJzpcbiAgICAgIHJldHVybiBzdHJpbmdpZnlWZWN0b3IoZGF0YSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJyArIGRhdGE7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeU1hcChkYXRhOiBFZG5NYXAgfCBvYmplY3QpIHtcbiAgcmV0dXJuIChcbiAgICAneycgK1xuICAgIHBpcGUoXG4gICAgICBlbnRyaWVzKGRhdGEpLFxuICAgICAgaWZsYXR0ZW4sXG4gICAgICBpbWFwKHN0cmluZ2lmeSksXG4gICAgICBjb2xsZWN0VG9BcnJheSxcbiAgICAgIGpvaW4oJyAnKVxuICAgICkgK1xuICAgICd9J1xuICApO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlTZXQoZGF0YTogRWRuU2V0KSB7XG4gIHJldHVybiAoXG4gICAgJyN7JyArXG4gICAgcGlwZShcbiAgICAgIGRhdGEudmFsdWVzKCksXG4gICAgICBpbWFwKHN0cmluZ2lmeSksXG4gICAgICBjb2xsZWN0VG9BcnJheSxcbiAgICAgIGpvaW4oJyAnKVxuICAgICkgK1xuICAgICd9J1xuICApO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlUYWcoZGF0YTogRWRuVGFnKSB7XG4gIHJldHVybiAnIycgKyBkYXRhLnRhZy5zeW1ib2wgKyAnICcgKyBzdHJpbmdpZnkoZGF0YS5kYXRhKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5U3ltYm9sKGRhdGE6IEVkblN5bWJvbCkge1xuICByZXR1cm4gZGF0YS5zeW1ib2w7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUtleXdvcmQoZGF0YTogRWRuS2V5d29yZCkge1xuICByZXR1cm4gJzonICsgZGF0YS5rZXl3b3JkO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlWZWN0b3IoZGF0YTogYW55W10pIHtcbiAgcmV0dXJuICdbJyArIGFtYXAoc3RyaW5naWZ5LCBkYXRhKS5qb2luKCcgJykgKyAnXSc7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdW5lc2NhcGVDaGFyKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKCFzdHIubGVuZ3RoKSB7XG4gICAgcmV0dXJuICdcXFxcJztcbiAgfVxuICBjb25zdCBjaGFyID0gc3RyWzBdO1xuICBjb25zdCByZXN0ID0gc3RyLnN1YnN0cigxKTtcbiAgc3dpdGNoIChjaGFyLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICduJzpcbiAgICAgIHJldHVybiBgXFxuJHtyZXN0fWA7XG4gICAgY2FzZSAncic6XG4gICAgICByZXR1cm4gYFxcciR7cmVzdH1gO1xuICAgIGNhc2UgJ3QnOlxuICAgICAgcmV0dXJuIGBcXHQke3Jlc3R9YDtcbiAgICBjYXNlICdcXFxcJzpcbiAgICAgIHJldHVybiBgXFxcXCR7cmVzdH1gO1xuICAgIGNhc2UgXCInXCI6XG4gICAgICByZXR1cm4gYFxcJyR7cmVzdH1gO1xuICAgIGNhc2UgJ1wiJzpcbiAgICAgIHJldHVybiBgXCIke3Jlc3R9YDtcbiAgICBjYXNlICdiJzpcbiAgICAgIHJldHVybiBgXFxiJHtyZXN0fWA7XG4gICAgY2FzZSAnZic6XG4gICAgICByZXR1cm4gYFxcZiR7cmVzdH1gO1xuICAgIC8vLyBUT0RPOiBVbmVzY2FwZSB1bmljb2RlIGNoYXJhY3RlcnNcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5lc2NhcGVTdHIoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwYXJ0cyA9IHN0ci5zcGxpdCgnXFxcXCcpO1xuICByZXR1cm4gcGFydHMubWFwKChwLCBpKSA9PiAoaSA/IHVuZXNjYXBlQ2hhcihwKSA6IHApKS5qb2luKCcnKTtcbn1cbiIsImltcG9ydCB7IGlzTmlsLCBpc09iamVjdCwgaXNOdW1iZXIsIGlzU3RyaW5nLCBpc0FycmF5IH0gZnJvbSAndG9mdS1qcy9kaXN0L2lzJztcbmltcG9ydCB7IGNodW5rLCBmbGF0dGVuLCBtYXAgYXMgYW1hcCwgam9pbiB9IGZyb20gJ3RvZnUtanMvZGlzdC9hcnJheXMnO1xuaW1wb3J0IHsgY29sbGVjdFRvQXJyYXksIG1hcCBhcyBpbWFwLCBmbGF0dGVuIGFzIGlmbGF0dGVuIH0gZnJvbSAndG9mdS1qcy9kaXN0L2l0ZXJhdG9ycyc7XG5pbXBvcnQgeyBwaXBlIH0gZnJvbSAndG9mdS1qcy9kaXN0L2ZwJztcblxuZXhwb3J0IGNsYXNzIEVkbktleXdvcmQge1xuICBwcml2YXRlIF9rZXl3b3JkOiBzdHJpbmcgPSAnJztcbiAgY29uc3RydWN0b3Ioa2V5d29yZDogc3RyaW5nKSB7XG4gICAgdGhpcy5rZXl3b3JkID0ga2V5d29yZDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQga2V5d29yZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5d29yZDtcbiAgfVxuXG4gIHB1YmxpYyBzZXQga2V5d29yZChrZXl3b3JkOiBzdHJpbmcpIHtcbiAgICBpZiAoa2V5d29yZFswXSA9PT0gJzonKSB7XG4gICAgICBrZXl3b3JkID0ga2V5d29yZC5zdWJzdHIoMSk7XG4gICAgfVxuICAgIHRoaXMuX2tleXdvcmQgPSBrZXl3b3JkO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFZG5TeW1ib2wge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3ltYm9sOiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBFZG5UYWcge1xuICBwdWJsaWMgdGFnOiBFZG5TeW1ib2w7XG4gIGNvbnN0cnVjdG9yKHRhZzogc3RyaW5nIHwgRWRuU3ltYm9sLCBwdWJsaWMgZGF0YTogYW55KSB7XG4gICAgaWYgKGlzU3RyaW5nKHRhZykpIHRoaXMudGFnID0gbmV3IEVkblN5bWJvbCh0YWcpO1xuICAgIGVsc2UgdGhpcy50YWcgPSB0YWc7XG4gIH1cbn1cblxuY2xhc3MgQW55S2V5TWFwIHtcbiAgcHJpdmF0ZSBkYXRhID0gbmV3IE1hcCgpO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE6IGFueVtdKSB7XG4gICAgdGhpcy5kYXRhID0gbmV3IE1hcChcbiAgICAgIHBpcGUoXG4gICAgICAgIGRhdGEsXG4gICAgICAgIGNodW5rKDIpLFxuICAgICAgICBhbWFwKChba2V5LCB2YWx1ZV06IGFueVtdKSA9PiBbdG9LZXkoa2V5KSwgeyBrZXksIHZhbHVlIH1dKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBnZXQoa2V5OiBhbnkpIHtcbiAgICBjb25zdCBrID0gdG9LZXkoa2V5KTtcbiAgICBpZiAodGhpcy5kYXRhLmhhcyhrKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YS5nZXQoaykudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGhhcyhrZXk6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmRhdGEuaGFzKHRvS2V5KGtleSkpO1xuICB9XG5cbiAgc2V0KGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5kYXRhLnNldCh0b0tleShrZXkpLCB7IGtleSwgdmFsdWUgfSk7XG4gIH1cblxuICBrZXlzKCkge1xuICAgIHJldHVybiBpbWFwKCh7IGtleSB9KSA9PiBrZXksIHRoaXMuZGF0YS52YWx1ZXMoKSk7XG4gIH1cblxuICB2YWx1ZXMoKSB7XG4gICAgcmV0dXJuIGltYXAoKHsgdmFsdWUgfSkgPT4gdmFsdWUsIHRoaXMuZGF0YS52YWx1ZXMoKSk7XG4gIH1cblxuICBkZWxldGUoa2V5OiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLmRlbGV0ZSh0b0tleShrZXkpKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuZGF0YS5jbGVhcigpO1xuICB9XG5cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50cmllcygpO1xuICB9XG5cbiAgZW50cmllcygpIHtcbiAgICByZXR1cm4gaW1hcCgoeyBrZXksIHZhbHVlIH0pID0+IFtrZXksIHZhbHVlXSwgdGhpcy5kYXRhLnZhbHVlcygpKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRWRuTWFwIHtcbiAgcHJpdmF0ZSBkYXRhOiBBbnlLZXlNYXA7XG4gIGNvbnN0cnVjdG9yKGRhdGE6IGFueVtdKSB7XG4gICAgdGhpcy5kYXRhID0gbmV3IEFueUtleU1hcChkYXRhKTtcbiAgfVxuXG4gIGhhcyA9IChrZXk6IGFueSkgPT4gdGhpcy5kYXRhLmhhcyhrZXkpO1xuICBjbGVhciA9ICgpID0+IHRoaXMuZGF0YS5jbGVhcigpO1xuICBkZWxldGUgPSAoa2V5OiBhbnkpID0+IHRoaXMuZGF0YS5kZWxldGUoa2V5KTtcbiAgZW50cmllcyA9ICgpID0+IHRoaXMuZGF0YS5lbnRyaWVzKCk7XG4gIGdldCA9IChrZXk6IGFueSkgPT4gdGhpcy5kYXRhLmdldChrZXkpO1xuICBrZXlzID0gKCkgPT4gdGhpcy5kYXRhLmtleXMoKTtcbiAgc2V0ID0gKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB0aGlzLmRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB2YWx1ZXMgPSAoKSA9PiB0aGlzLmRhdGEudmFsdWVzKCk7XG4gIFtTeW1ib2wuaXRlcmF0b3JdID0gKCkgPT4gdGhpcy5kYXRhW1N5bWJvbC5pdGVyYXRvcl0oKTtcbn1cblxuZXhwb3J0IGNsYXNzIEVkblNldCB7XG4gIHByaXZhdGUgZGF0YTogQW55S2V5TWFwO1xuICBjb25zdHJ1Y3RvcihkYXRhOiBhbnlbXSkge1xuICAgIHRoaXMuZGF0YSA9IG5ldyBBbnlLZXlNYXAoXG4gICAgICBwaXBlKFxuICAgICAgICBkYXRhLFxuICAgICAgICBhbWFwKGQgPT4gW2QsIGRdKSxcbiAgICAgICAgZmxhdHRlblxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBhZGQgPSAoZWxlbTogYW55KSA9PiB0aGlzLmRhdGEuc2V0KGVsZW0sIGVsZW0pO1xuICBjbGVhciA9ICgpID0+IHRoaXMuZGF0YS5jbGVhcigpO1xuICBoYXMgPSAoZWxlbTogYW55KSA9PiB0aGlzLmRhdGEuaGFzKGVsZW0pO1xuICBkZWxldGUgPSAoZWxlbTogYW55KSA9PiB0aGlzLmRhdGEuZGVsZXRlKGVsZW0pO1xuICBlbnRyaWVzID0gKCkgPT4gdGhpcy5kYXRhLmVudHJpZXMoKTtcbiAgdmFsdWVzID0gKCkgPT4gdGhpcy5kYXRhLnZhbHVlcygpO1xuICBbU3ltYm9sLml0ZXJhdG9yXSA9ICgpID0+IHRoaXMuZGF0YVtTeW1ib2wuaXRlcmF0b3JdKCk7XG59XG5cbmZ1bmN0aW9uIHRvS2V5KGlucHV0OiBhbnkpIHtcbiAgcmV0dXJuIHR5cGUoaW5wdXQpICsgJyMnICsgdG9TdHJpbmcoaW5wdXQpO1xufVxuXG5mdW5jdGlvbiB0b1N0cmluZyhpbnB1dDogYW55KSB7XG4gIGlmIChpc05pbChpbnB1dCkpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShpbnB1dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlKGlucHV0OiBhbnkpIHtcbiAgaWYgKGlzTmlsKGlucHV0KSkge1xuICAgIHJldHVybiAnTmlsJztcbiAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkpIHtcbiAgICByZXR1cm4gJ051bWJlcic7XG4gIH0gZWxzZSBpZiAoaXNTdHJpbmcoaW5wdXQpKSB7XG4gICAgcmV0dXJuICdTdHJpbmcnO1xuICB9IGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgRWRuVGFnKSB7XG4gICAgcmV0dXJuICdUYWcnO1xuICB9IGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgRWRuU3ltYm9sKSB7XG4gICAgcmV0dXJuICdTeW1ib2wnO1xuICB9IGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgRWRuS2V5d29yZCkge1xuICAgIHJldHVybiAnS2V5d29yZCc7XG4gIH0gZWxzZSBpZiAoaW5wdXQgaW5zdGFuY2VvZiBFZG5TZXQpIHtcbiAgICByZXR1cm4gJ1NldCc7XG4gIH0gZWxzZSBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICByZXR1cm4gJ1ZlY3Rvcic7XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaW5wdXQpIHx8IGlucHV0IGluc3RhbmNlb2YgRWRuTWFwKSB7XG4gICAgcmV0dXJuICdNYXAnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnT3RoZXInO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBrZXl3b3JkID0gKHN0cjogc3RyaW5nKSA9PiBuZXcgRWRuS2V5d29yZChzdHIpO1xuZXhwb3J0IGNvbnN0IHN5bWJvbCA9IChzdHI6IHN0cmluZykgPT4gbmV3IEVkblN5bWJvbChzdHIpO1xuZXhwb3J0IGNvbnN0IHNldCA9IChkYXRhOiBhbnlbXSkgPT4gbmV3IEVkblNldChkYXRhKTtcbmV4cG9ydCBjb25zdCBtYXAgPSAoZGF0YTogYW55W10pID0+IG5ldyBFZG5NYXAoZGF0YSk7XG5leHBvcnQgY29uc3QgdGFnID0gKHRhZywgZGF0YSkgPT4gbmV3IEVkblRhZyh0YWcsIGRhdGEpO1xuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeSA9IChkYXRhOiBhbnkpID0+IHtcbiAgY29uc3QgdHlwZU9mID0gdHlwZShkYXRhKTtcbiAgc3dpdGNoICh0eXBlT2YpIHtcbiAgICBjYXNlICdOaWwnOlxuICAgICAgcmV0dXJuICduaWwnO1xuICAgIGNhc2UgJ051bWJlcic6XG4gICAgICByZXR1cm4gJycgKyBkYXRhO1xuICAgIGNhc2UgJ1N0cmluZyc6XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgY2FzZSAnTWFwJzpcbiAgICAgIHJldHVybiBzdHJpbmdpZnlNYXAoZGF0YSk7XG4gICAgY2FzZSAnU2V0JzpcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTZXQoZGF0YSk7XG4gICAgY2FzZSAnVGFnJzpcbiAgICAgIHJldHVybiBzdHJpbmdpZnlUYWcoZGF0YSk7XG4gICAgY2FzZSAnU3ltYm9sJzpcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTeW1ib2woZGF0YSk7XG4gICAgY2FzZSAnS2V5d29yZCc6XG4gICAgICByZXR1cm4gc3RyaW5naWZ5S2V5d29yZChkYXRhKTtcbiAgICBjYXNlICdWZWN0b3InOlxuICAgICAgcmV0dXJuIHN0cmluZ2lmeVZlY3RvcihkYXRhKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnICsgZGF0YTtcbiAgfVxufTtcblxuZnVuY3Rpb24gc3RyaW5naWZ5TWFwKGRhdGE6IEVkbk1hcCkge1xuICByZXR1cm4gKFxuICAgICd7JyArXG4gICAgcGlwZShcbiAgICAgIGRhdGEuZW50cmllcygpLFxuICAgICAgaWZsYXR0ZW4sXG4gICAgICBpbWFwKHN0cmluZ2lmeSksXG4gICAgICBjb2xsZWN0VG9BcnJheSxcbiAgICAgIGpvaW4oJyAnKVxuICAgICkgK1xuICAgICd9J1xuICApO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlTZXQoZGF0YTogRWRuU2V0KSB7XG4gIHJldHVybiAoXG4gICAgJyN7JyArXG4gICAgcGlwZShcbiAgICAgIGRhdGEudmFsdWVzKCksXG4gICAgICBpbWFwKHN0cmluZ2lmeSksXG4gICAgICBjb2xsZWN0VG9BcnJheSxcbiAgICAgIGpvaW4oJyAnKVxuICAgICkgK1xuICAgICd9J1xuICApO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlUYWcoZGF0YTogRWRuVGFnKSB7XG4gIHJldHVybiAnIycgKyBkYXRhLnRhZy5zeW1ib2wgKyAnICcgKyBzdHJpbmdpZnkoZGF0YS5kYXRhKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5U3ltYm9sKGRhdGE6IEVkblN5bWJvbCkge1xuICByZXR1cm4gZGF0YS5zeW1ib2w7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUtleXdvcmQoZGF0YTogRWRuS2V5d29yZCkge1xuICByZXR1cm4gJzonICsgZGF0YS5rZXl3b3JkO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlWZWN0b3IoZGF0YTogYW55W10pIHtcbiAgcmV0dXJuICdbJyArIGFtYXAoc3RyaW5naWZ5LCBkYXRhKS5qb2luKCcgJykgKyAnXSc7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9