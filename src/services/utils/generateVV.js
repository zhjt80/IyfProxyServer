// VV Parameter Generator
// Extracted from iyf.tv application's code
// Module 6821 - MD5 Implementation

;(function () {
  // ============================================================================
  // Module 044b: Buffer check
  // ============================================================================
  function isBuffer(t) {
    return (
      !!t.constructor && 'function' === typeof t.constructor.isBuffer && t.constructor.isBuffer(t)
    )
  }

  // ============================================================================
  // Module 00d8: Binary utilities
  // ============================================================================
  function binaryUtils() {
    var base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    return {
      rotl: function (t, e) {
        return (t << e) | (t >>> (32 - e))
      },

      rotr: function (t, e) {
        return (t << (32 - e)) | (t >>> e)
      },

      endian: function (t) {
        if (t.constructor == Number)
          return (16711935 & this.rotl(t, 8)) | (4278255360 & this.rotl(t, 24))
        for (var e = 0; e < t.length; e++) t[e] = this.endian(t[e])
        return t
      },

      bytesToWords: function (t) {
        for (var e = [], n = 0, r = 0; n < t.length; n++, r += 8)
          e[r >>> 5] |= t[n] << (24 - (r % 32))
        return e
      },

      wordsToBytes: function (t) {
        for (var e = [], n = 0; n < 32 * t.length; n += 8)
          e.push((t[n >>> 5] >>> (24 - (n % 32))) & 255)
        return e
      },

      bytesToHex: function (t) {
        for (var e = [], n = 0; n < t.length; n++) {
          e.push((t[n] >>> 4).toString(16))
          e.push((15 & t[n]).toString(16))
        }
        return e.join('')
      },
    }
  }

  // ============================================================================
  // Module 9a63: UTF8 and Bin operations
  // ============================================================================
  function utf8Bin() {
    var bin = {
      stringToBytes: function (t) {
        for (var e = [], n = 0; n < t.length; n++) e.push(255 & t.charCodeAt(n))
        return e
      },

      bytesToString: function (t) {
        for (var e = [], n = 0; n < t.length; n++) e.push(String.fromCharCode(t[n]))
        return e.join('')
      },
    }

    return {
      utf8: {
        stringToBytes: function (t) {
          return bin.stringToBytes(unescape(encodeURIComponent(t)))
        },

        bytesToString: function (t) {
          return decodeURIComponent(escape(bin.bytesToString(t)))
        },
      },
    }
  }

  // ============================================================================
  // Module 6821: MD5 Implementation
  // ============================================================================
  function MD5() {
    var binary = binaryUtils()
    var utf8 = utf8Bin()
    var bin = utf8.bin

    var self = this

    // Main MD5 function
    var md5Function = function (t, n) {
      if (t.constructor == String) {
        t = n && 'binary' === n.encoding ? bin.stringToBytes(t) : utf8.utf8.stringToBytes(t)
      } else if (isBuffer(t)) {
        t = Array.prototype.slice.call(t, 0)
      } else if (Array.isArray(t) || t.constructor === Uint8Array) {
        // Already array
      } else {
        t = t.toString()
      }

      for (
        var s = binary.bytesToWords(t),
          a = 8 * t.length,
          c = 1732584193, // 0x67452301
          u = -271733879, // 0xEFCDAB89
          l = -1732584194, // 0x98BADCFE
          f = 271733878,
          h = 0;
        h < s.length;
        h++
      )
        s[h] =
          (16711935 & ((s[h] << 8) | (s[h] >>> 24))) | (4278255360 & ((s[h] << 24) | (s[h] >>> 8)))

      // MD5 Padding
      s[a >>> 5] |= 128 << (a % 32)
      s[14 + (((a + 64) >>> 9) << 4)] = a

      // MD5 Round Functions
      var d = self._ff,
        p = self._gg,
        g = self._hh,
        v = self._ii

      // 64 MD5 rounds
      for (h = 0; h < s.length; h += 16) {
        var y = c,
          m = u,
          w = l,
          b = f

        // Round 1
        c = d(c, u, l, f, s[h + 0], 7, -680876936)
        f = d(f, c, u, l, s[h + 1], 12, -389564586)
        l = d(l, f, c, u, s[h + 2], 17, 606105819)
        u = d(u, l, f, c, s[h + 3], 22, -1044525330)
        c = d(c, u, l, f, s[h + 4], 7, -176418897)
        f = d(f, c, u, l, s[h + 5], 12, 1200080426)
        l = d(l, f, c, u, s[h + 6], 17, -1473231341)
        u = d(u, l, f, c, s[h + 7], 22, -45705983)
        c = d(c, u, l, f, s[h + 8], 7, 1770035416)
        f = d(f, c, u, l, s[h + 9], 12, -1958414417)
        l = d(l, f, c, u, s[h + 10], 17, -42063)
        u = d(u, l, f, c, s[h + 11], 22, -1990404162)
        c = d(c, u, l, f, s[h + 12], 7, 1804603682)
        f = d(f, c, u, l, s[h + 13], 12, -40341101)
        l = d(l, f, c, u, s[h + 14], 17, -1502002290)
        u = d(u, l, f, c, s[h + 15], 22, 1236535329)

        // Round 2
        c = p(c, u, l, f, s[h + 1], 5, -165796510)
        f = p(f, c, u, l, s[h + 6], 9, -1069501632)
        l = p(l, f, c, u, s[h + 11], 14, 643717713)
        u = p(u, l, f, c, s[h + 0], 20, -373897302)
        c = p(c, u, l, f, s[h + 5], 5, -701558691)
        f = p(f, c, u, l, s[h + 10], 9, 38016083)
        l = p(l, f, c, u, s[h + 15], 14, -660478335)
        u = p(u, l, f, c, s[h + 4], 20, -405537848)
        c = p(c, u, l, f, s[h + 9], 5, 568446438)
        f = p(f, c, u, l, s[h + 14], 9, -1019803690)
        l = p(l, f, c, u, s[h + 3], 14, -187363961)
        u = p(u, l, f, c, s[h + 8], 20, 1163531501)
        c = p(c, u, l, f, s[h + 13], 5, -1444681467)
        f = p(f, c, u, l, s[h + 2], 9, -51403784)
        l = p(l, f, c, u, s[h + 7], 14, 1735328473)
        u = p(u, l, f, c, s[h + 12], 20, -1926607734)

        // Round 3
        c = g(c, u, l, f, s[h + 5], 4, -378558)
        f = g(f, c, u, l, s[h + 8], 11, -2022574463)
        l = g(l, f, c, u, s[h + 11], 16, 1839030562)
        u = g(u, l, f, c, s[h + 14], 23, -35309556)
        c = g(c, u, l, f, s[h + 1], 4, -1530992060)
        f = g(f, c, u, l, s[h + 4], 11, 1272893353)
        l = g(l, f, c, u, s[h + 7], 16, -155497632)
        u = g(u, l, f, c, s[h + 10], 23, -1094730640)
        c = g(c, u, l, f, s[h + 13], 4, 681279174)
        f = g(f, c, u, l, s[h + 0], 11, -358537222)
        l = g(l, f, c, u, s[h + 3], 16, -722521979)
        u = g(u, l, f, c, s[h + 6], 23, 76029189)
        c = g(c, u, l, f, s[h + 9], 4, -640364487)
        f = g(f, c, u, l, s[h + 12], 11, -421815835)
        l = g(l, f, c, u, s[h + 15], 16, 530742520)
        u = g(u, l, f, c, s[h + 2], 23, -995338651)

        // Round 4
        c = v(c, u, l, f, s[h + 0], 6, -198630844)
        f = v(f, c, u, l, s[h + 7], 10, 1126891415)
        l = v(l, f, c, u, s[h + 14], 15, -1416354905)
        u = v(u, l, f, c, s[h + 5], 21, -57434055)
        c = v(c, u, l, f, s[h + 12], 6, 1700485571)
        f = v(f, c, u, l, s[h + 3], 10, -1894986606)
        l = v(l, f, c, u, s[h + 10], 15, -1051523)
        u = v(u, l, f, c, s[h + 1], 21, -2054922799)
        c = v(c, u, l, f, s[h + 8], 6, 1873313359)
        f = v(f, c, u, l, s[h + 15], 10, -30611744)
        l = v(l, f, c, u, s[h + 6], 15, -1560198380)
        u = v(u, l, f, c, s[h + 13], 21, 1309151649)
        c = v(c, u, l, f, s[h + 4], 6, -145523070)
        f = v(f, c, u, l, s[h + 11], 10, -1120210379)
        l = v(l, f, c, u, s[h + 2], 15, 718787259)
        u = v(u, l, f, c, s[h + 9], 21, -343485551)

        c = (c + y) >>> 0
        u = (u + m) >>> 0
        l = (l + w) >>> 0
        f = (f + b) >>> 0
      }

      // Return Little-Endian byte order
      return binary.endian([c, u, l, f])
    }

    // Helper Functions
    self._ff = function (t, e, n, r, A, i, o) {
      var s = t + ((e & n) | (~e & r)) + (A >>> 0) + o
      return ((s << i) | (s >>> (32 - i))) + e
    }

    self._gg = function (t, e, n, r, A, i, o) {
      var s = t + ((e & r) | (n & ~r)) + (A >>> 0) + o
      return ((s << i) | (s >>> (32 - i))) + e
    }

    self._hh = function (t, e, n, r, A, i, o) {
      var s = t + (e ^ n ^ r) + (A >>> 0) + o
      return ((s << i) | (s >>> (32 - i))) + e
    }

    self._ii = function (t, e, n, r, A, i, o) {
      var s = t + (n ^ (e | ~r)) + (A >>> 0) + o
      return ((s << i) | (s >>> (32 - i))) + e
    }

    self._blocksize = 16
    self._digestsize = 16

    // Main Export
    self.exports = function (t, n) {
      if (void 0 === t || null === t) throw new Error('Illegal argument ' + t)
      var r = binary.wordsToBytes(md5Function(t, n))
      return n && n.asBytes ? r : n && n.asString ? bin.bytesToString(r) : binary.bytesToHex(r)
    }
  }

  // ============================================================================
  // Exposed function p (the VV generator)
  // ============================================================================
  function p(input) {
    var md5 = new MD5()
    return md5.exports(input)
  }

  // ============================================================================
  // Helper function to stringify params (from app.js)
  // ============================================================================
  function stringifyParams(params) {
    var B = [
      'pub',
      'vv',
      'uid',
      'gid',
      'expire',
      'sign',
      'login_uid',
      'DeviceId',
      'token',
      'System',
      'SystemVersion',
      'Version',
      'AppVersion',
      'version',
      'cacheable',
      'Lang',
      'i18n',
    ]

    var sorted = []
    var keys = Object.keys(params)
    //keys.sort()

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      //if (!B.includes(key) && params[key] != null) {
        sorted.push(key + '=' + params[key])
      //}
    }

    return sorted.join('&')
  }

  function generatePub() {
    return String(Math.floor(Date.now() / 1000))
  }

  function generatePubNumber() {
    return Math.floor(Date.now() / 1000)
  }

  function generateVVWithResult(params, options) {
    var url = options && options.url
    var pubValue = options.pub
    var vvValue = generateVV(params, url, pubValue)

    return {
      pub: pubValue !== undefined ? pubValue : '',
      vv: vvValue,
    }
  }

  // ============================================================================
  // Original generateVV function for backward compatibility
  // ============================================================================
  function generateVV(params, urlQuery, pub) {
    // Secret key from code
    var SECRET = '5569958*1'

    // Stringify parameters (sorted alphabetically, lowercase)
    var m = stringifyParams(params).toLowerCase()
    console.log(pub);
    // Combine: [pub, url_query, params_string, secret]
    var v = [pub, urlQuery, m, SECRET]

    // Filter out empty values
    var filtered = v.filter(function (t) {
      return !!t
    })

    // Join with & and URL decode
    var b = decodeURIComponent(filtered.join('&'))

    console.log(`b=${b}`);
    // Apply MD5 (function p)
    return p(b)
  }

  // ============================================================================
  // Export to global scope for testing
  // ============================================================================
  if (typeof window !== 'undefined') {
    window.generateVV = generateVVNew
    window.generateVVModule = MD5
    window.generatePub = generatePub
    window.generateVVWithResult = generateVVWithResult
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      generateVV: generateVV,
      generatePub: generatePub,
      generateVVWithResult: generateVVWithResult,
      MD5: MD5,
      p: p,
    }
  }
})()
