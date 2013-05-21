
/*
 * This file uses SJCL as found here:
 * https://github.com/bitwiseshiftleft/sjcl/blob/ecc/sjcl.js
 * SJCL was "decompiled" using closure-compiler.appspot.com selecting
 * pretty print (fast than compiling it all again...).
 * 
 * Then, the 521-bit-curve was appended after
 * sjcl.ecc.curves = {c192:new sjcl.ecc.curve(sjcl.bn.prime.p192, "0x662107c8eb94364e4b2dd7ce", -3, "0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1", "0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012", "0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811"), c224:new sjcl.ecc.curve(sjcl.bn.prime.p224, "0xe95c1f470fc1ec22d6baa3a3d5c4", -3, "0xb4050a850c04b3abf54132565044b0b7d7bfd8ba270b39432355ffb4", "0xb70e0cbd6bb4bf7f321390b94a03c1d356c21122343280d6115c1d21", "0xbd376388b5f723fb4c22dfe6cd4375a05a07476444d5819985007e34"), 
 * c256:new sjcl.ecc.curve(sjcl.bn.prime.p256, "0x4319055358e8617b0c46353d039cdaae", -3, "0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b", "0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296", "0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"), c384:new sjcl.ecc.curve(sjcl.bn.prime.p384, "0x389cb27e0bc8d21fa7e5f24cb74f58851313e696333ad68c", -3, "0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef", 
 * "0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7", "0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f"), c521:new sjcl.ecc.curve(sjcl.bn.prime.p521, "0x5AE79787C40D069948033FEB708F65A2FC44A36477663B851449048E16EC79BF6", -3, "0x051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00", "0xc6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66", 
 * "0x11839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650")};
 * 
 * So it looks like below:
 * sjcl.ecc.curves = 
 * {c192:new sjcl.ecc.curve(sjcl.bn.prime.p192, "0x662107c8eb94364e4b2dd7ce", -3, "0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1", "0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012", "0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811"),
 * c224:new sjcl.ecc.curve(sjcl.bn.prime.p224, "0xe95c1f470fc1ec22d6baa3a3d5c4", -3, "0xb4050a850c04b3abf54132565044b0b7d7bfd8ba270b39432355ffb4", "0xb70e0cbd6bb4bf7f321390b94a03c1d356c21122343280d6115c1d21", "0xbd376388b5f723fb4c22dfe6cd4375a05a07476444d5819985007e34"), 
 * c256:new sjcl.ecc.curve(sjcl.bn.prime.p256, "0x4319055358e8617b0c46353d039cdaae", -3, "0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b", "0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296", "0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"), 
 * c384:new sjcl.ecc.curve(sjcl.bn.prime.p384, "0x389cb27e0bc8d21fa7e5f24cb74f58851313e696333ad68c", -3, "0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef", 
 * "0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7", "0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f"), 
 * c521:new sjcl.ecc.curve(sjcl.bn.prime.p521, "0x5AE79787C40D069948033FEB708F65A2FC44A36477663B851449048E16EC79BF6", -3, "0x051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00", "0xc6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66", 
 * "0x11839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650")};
 * 
 * Apart from that, the file was left unchanged.
 * */

var sjcl = {cipher:{}, hash:{}, keyexchange:{}, mode:{}, misc:{}, codec:{}, exception:{corrupt:function(a) {
  this.toString = function() {
    return"CORRUPT: " + this.message
  };
  this.message = a
}, invalid:function(a) {
  this.toString = function() {
    return"INVALID: " + this.message
  };
  this.message = a
}, bug:function(a) {
  this.toString = function() {
    return"BUG: " + this.message
  };
  this.message = a
}, notReady:function(a) {
  this.toString = function() {
    return"NOT READY: " + this.message
  };
  this.message = a
}}};
"undefined" != typeof module && module.exports && (module.exports = sjcl);
sjcl.cipher.aes = function(a) {
  this.k[0][0][0] || this.C();
  var b, c, d, e, f = this.k[0][4], g = this.k[1];
  b = a.length;
  var h = 1;
  if(4 !== b && 6 !== b && 8 !== b) {
    throw new sjcl.exception.invalid("invalid aes key size");
  }
  this.c = [d = a.slice(0), e = []];
  for(a = b;a < 4 * b + 28;a++) {
    c = d[a - 1];
    if(0 === a % b || 8 === b && 4 === a % b) {
      c = f[c >>> 24] << 24 ^ f[c >> 16 & 255] << 16 ^ f[c >> 8 & 255] << 8 ^ f[c & 255], 0 === a % b && (c = c << 8 ^ c >>> 24 ^ h << 24, h = h << 1 ^ 283 * (h >> 7))
    }
    d[a] = d[a - b] ^ c
  }
  for(b = 0;a;b++, a--) {
    c = d[b & 3 ? a : a - 4], e[b] = 4 >= a || 4 > b ? c : g[0][f[c >>> 24]] ^ g[1][f[c >> 16 & 255]] ^ g[2][f[c >> 8 & 255]] ^ g[3][f[c & 255]]
  }
};
sjcl.cipher.aes.prototype = {encrypt:function(a) {
  return this.J(a, 0)
}, decrypt:function(a) {
  return this.J(a, 1)
}, k:[[[], [], [], [], []], [[], [], [], [], []]], C:function() {
  var a = this.k[0], b = this.k[1], c = a[4], d = b[4], e, f, g, h = [], m = [], n, j, k, p;
  for(e = 0;256 > e;e++) {
    m[(h[e] = e << 1 ^ 283 * (e >> 7)) ^ e] = e
  }
  for(f = g = 0;!c[f];f ^= n || 1, g = m[g] || 1) {
    k = g ^ g << 1 ^ g << 2 ^ g << 3 ^ g << 4;
    k = k >> 8 ^ k & 255 ^ 99;
    c[f] = k;
    d[k] = f;
    j = h[e = h[n = h[f]]];
    p = 16843009 * j ^ 65537 * e ^ 257 * n ^ 16843008 * f;
    j = 257 * h[k] ^ 16843008 * k;
    for(e = 0;4 > e;e++) {
      a[e][f] = j = j << 24 ^ j >>> 8, b[e][k] = p = p << 24 ^ p >>> 8
    }
  }
  for(e = 0;5 > e;e++) {
    a[e] = a[e].slice(0), b[e] = b[e].slice(0)
  }
}, J:function(a, b) {
  if(4 !== a.length) {
    throw new sjcl.exception.invalid("invalid aes block size");
  }
  var c = this.c[b], d = a[0] ^ c[0], e = a[b ? 3 : 1] ^ c[1], f = a[2] ^ c[2];
  a = a[b ? 1 : 3] ^ c[3];
  var g, h, m, n = c.length / 4 - 2, j, k = 4, p = [0, 0, 0, 0];
  g = this.k[b];
  var q = g[0], u = g[1], z = g[2], B = g[3], A = g[4];
  for(j = 0;j < n;j++) {
    g = q[d >>> 24] ^ u[e >> 16 & 255] ^ z[f >> 8 & 255] ^ B[a & 255] ^ c[k], h = q[e >>> 24] ^ u[f >> 16 & 255] ^ z[a >> 8 & 255] ^ B[d & 255] ^ c[k + 1], m = q[f >>> 24] ^ u[a >> 16 & 255] ^ z[d >> 8 & 255] ^ B[e & 255] ^ c[k + 2], a = q[a >>> 24] ^ u[d >> 16 & 255] ^ z[e >> 8 & 255] ^ B[f & 255] ^ c[k + 3], k += 4, d = g, e = h, f = m
  }
  for(j = 0;4 > j;j++) {
    p[b ? 3 & -j : j] = A[d >>> 24] << 24 ^ A[e >> 16 & 255] << 16 ^ A[f >> 8 & 255] << 8 ^ A[a & 255] ^ c[k++], g = d, d = e, e = f, f = a, a = g
  }
  return p
}};
sjcl.bitArray = {bitSlice:function(a, b, c) {
  a = sjcl.bitArray.R(a.slice(b / 32), 32 - (b & 31)).slice(1);
  return void 0 === c ? a : sjcl.bitArray.clamp(a, c - b)
}, extract:function(a, b, c) {
  var d = Math.floor(-b - c & 31);
  return((b + c - 1 ^ b) & -32 ? a[b / 32 | 0] << 32 - d ^ a[b / 32 + 1 | 0] >>> d : a[b / 32 | 0] >>> d) & (1 << c) - 1
}, concat:function(a, b) {
  if(0 === a.length || 0 === b.length) {
    return a.concat(b)
  }
  var c = a[a.length - 1], d = sjcl.bitArray.getPartial(c);
  return 32 === d ? a.concat(b) : sjcl.bitArray.R(b, d, c | 0, a.slice(0, a.length - 1))
}, bitLength:function(a) {
  var b = a.length;
  return 0 === b ? 0 : 32 * (b - 1) + sjcl.bitArray.getPartial(a[b - 1])
}, clamp:function(a, b) {
  if(32 * a.length < b) {
    return a
  }
  a = a.slice(0, Math.ceil(b / 32));
  var c = a.length;
  b &= 31;
  0 < c && b && (a[c - 1] = sjcl.bitArray.partial(b, a[c - 1] & 2147483648 >> b - 1, 1));
  return a
}, partial:function(a, b, c) {
  return 32 === a ? b : (c ? b | 0 : b << 32 - a) + 1099511627776 * a
}, getPartial:function(a) {
  return Math.round(a / 1099511627776) || 32
}, equal:function(a, b) {
  if(sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) {
    return!1
  }
  var c = 0, d;
  for(d = 0;d < a.length;d++) {
    c |= a[d] ^ b[d]
  }
  return 0 === c
}, R:function(a, b, c, d) {
  var e;
  for(void 0 === d && (d = []);32 <= b;b -= 32) {
    d.push(c), c = 0
  }
  if(0 === b) {
    return d.concat(a)
  }
  for(e = 0;e < a.length;e++) {
    d.push(c | a[e] >>> b), c = a[e] << 32 - b
  }
  e = a.length ? a[a.length - 1] : 0;
  a = sjcl.bitArray.getPartial(e);
  d.push(sjcl.bitArray.partial(b + a & 31, 32 < b + a ? c : d.pop(), 1));
  return d
}, Y:function(a, b) {
  return[a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]]
}};
sjcl.codec.utf8String = {fromBits:function(a) {
  var b = "", c = sjcl.bitArray.bitLength(a), d, e;
  for(d = 0;d < c / 8;d++) {
    0 === (d & 3) && (e = a[d / 4]), b += String.fromCharCode(e >>> 24), e <<= 8
  }
  return decodeURIComponent(escape(b))
}, toBits:function(a) {
  a = unescape(encodeURIComponent(a));
  var b = [], c, d = 0;
  for(c = 0;c < a.length;c++) {
    d = d << 8 | a.charCodeAt(c), 3 === (c & 3) && (b.push(d), d = 0)
  }
  c & 3 && b.push(sjcl.bitArray.partial(8 * (c & 3), d));
  return b
}};
sjcl.hash.sha256 = function(a) {
  this.c[0] || this.C();
  a ? (this.o = a.o.slice(0), this.l = a.l.slice(0), this.h = a.h) : this.reset()
};
sjcl.hash.sha256.hash = function(a) {
  return(new sjcl.hash.sha256).update(a).finalize()
};
sjcl.hash.sha256.prototype = {blockSize:512, reset:function() {
  this.o = this.O.slice(0);
  this.l = [];
  this.h = 0;
  return this
}, update:function(a) {
  "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a));
  var b, c = this.l = sjcl.bitArray.concat(this.l, a);
  b = this.h;
  a = this.h = b + sjcl.bitArray.bitLength(a);
  for(b = 512 + b & -512;b <= a;b += 512) {
    this.H(c.splice(0, 16))
  }
  return this
}, finalize:function() {
  var a, b = this.l, c = this.o, b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]);
  for(a = b.length + 2;a & 15;a++) {
    b.push(0)
  }
  b.push(Math.floor(this.h / 4294967296));
  for(b.push(this.h | 0);b.length;) {
    this.H(b.splice(0, 16))
  }
  this.reset();
  return c
}, O:[], c:[], C:function() {
  function a(a) {
    return 4294967296 * (a - Math.floor(a)) | 0
  }
  var b = 0, c = 2, d;
  a:for(;64 > b;c++) {
    for(d = 2;d * d <= c;d++) {
      if(0 === c % d) {
        continue a
      }
    }
    8 > b && (this.O[b] = a(Math.pow(c, 0.5)));
    this.c[b] = a(Math.pow(c, 1 / 3));
    b++
  }
}, H:function(a) {
  var b, c, d = a.slice(0), e = this.o, f = this.c, g = e[0], h = e[1], m = e[2], n = e[3], j = e[4], k = e[5], p = e[6], q = e[7];
  for(a = 0;64 > a;a++) {
    16 > a ? b = d[a] : (b = d[a + 1 & 15], c = d[a + 14 & 15], b = d[a & 15] = (b >>> 7 ^ b >>> 18 ^ b >>> 3 ^ b << 25 ^ b << 14) + (c >>> 17 ^ c >>> 19 ^ c >>> 10 ^ c << 15 ^ c << 13) + d[a & 15] + d[a + 9 & 15] | 0), b = b + q + (j >>> 6 ^ j >>> 11 ^ j >>> 25 ^ j << 26 ^ j << 21 ^ j << 7) + (p ^ j & (k ^ p)) + f[a], q = p, p = k, k = j, j = n + b | 0, n = m, m = h, h = g, g = b + (h & m ^ n & (h ^ m)) + (h >>> 2 ^ h >>> 13 ^ h >>> 22 ^ h << 30 ^ h << 19 ^ h << 10) | 0
  }
  e[0] = e[0] + g | 0;
  e[1] = e[1] + h | 0;
  e[2] = e[2] + m | 0;
  e[3] = e[3] + n | 0;
  e[4] = e[4] + j | 0;
  e[5] = e[5] + k | 0;
  e[6] = e[6] + p | 0;
  e[7] = e[7] + q | 0
}};

sjcl.random = {randomWords:function(a, b) {
  var c = [];
  b = this.isReady(b);
  var d;
  if(0 === b) {
    throw new sjcl.exception.notReady("generator isn't seeded");
  }
  b & 2 && this.X(!(b & 1));
  for(b = 0;b < a;b += 4) {
    0 === (b + 1) % 65536 && this.N(), d = this.A(), c.push(d[0], d[1], d[2], d[3])
  }
  this.N();
  return c.slice(0, a)
}, setDefaultParanoia:function(a) {
  this.v = a
}, addEntropy:function(a, b, c) {
  c = c || "user";
  var d, e, f = (new Date).valueOf(), g = this.s[c], h = this.isReady();
  d = this.I[c];
  void 0 === d && (d = this.I[c] = this.U++);
  void 0 === g && (g = this.s[c] = 0);
  this.s[c] = (this.s[c] + 1) % this.f.length;
  switch(typeof a) {
    case "number":
      break;
    case "object":
      if(void 0 === b) {
        for(c = b = 0;c < a.length;c++) {
          for(e = a[c];0 < e;) {
            b++, e >>>= 1
          }
        }
      }
      this.f[g].update([d, this.L++, 2, b, f, a.length].concat(a));
      break;
    case "string":
      void 0 === b && (b = a.length);
      this.f[g].update([d, this.L++, 3, b, f, a.length]);
      this.f[g].update(a);
      break;
    default:
      throw new sjcl.exception.bug("random: addEntropy only supports number, array or string");
  }
  this.m[g] += b;
  this.i += b;
  0 === h && (0 !== this.isReady() && this.M("seeded", Math.max(this.j, this.i)), this.M("progress", this.getProgress()))
}, isReady:function(a) {
  a = this.F[void 0 !== a ? a : this.v];
  return this.j && this.j >= a ? 80 < this.m[0] && (new Date).valueOf() > this.Q ? 3 : 1 : this.i >= a ? 2 : 0
}, getProgress:function(a) {
  a = this.F[a ? a : this.v];
  return this.j >= a ? 1["0"] : this.i > a ? 1["0"] : this.i / a
}, startCollectors:function() {
  if(!this.n) {
    if(window.addEventListener) {
      window.addEventListener("load", this.p, !1), window.addEventListener("mousemove", this.q, !1)
    }else {
      if(document.attachEvent) {
        document.attachEvent("onload", this.p), document.attachEvent("onmousemove", this.q)
      }else {
        throw new sjcl.exception.bug("can't attach event");
      }
    }
    this.n = !0
  }
}, stopCollectors:function() {
  this.n && (window.removeEventListener ? (window.removeEventListener("load", this.p, !1), window.removeEventListener("mousemove", this.q, !1)) : window.detachEvent && (window.detachEvent("onload", this.p), window.detachEvent("onmousemove", this.q)), this.n = !1)
}, addEventListener:function(a, b) {
  this.t[a][this.T++] = b
}, removeEventListener:function(a, b) {
  var c;
  a = this.t[a];
  var d = [];
  for(c in a) {
    a.hasOwnProperty(c) && a[c] === b && d.push(c)
  }
  for(b = 0;b < d.length;b++) {
    c = d[b], delete a[c]
  }
}, f:[new sjcl.hash.sha256], m:[0], D:0, s:{}, L:0, I:{}, U:0, j:0, i:0, Q:0, c:[0, 0, 0, 0, 0, 0, 0, 0], g:[0, 0, 0, 0], u:void 0, v:6, n:!1, t:{progress:{}, seeded:{}}, T:0, F:[0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024], A:function() {
  for(var a = 0;4 > a && !(this.g[a] = this.g[a] + 1 | 0, this.g[a]);a++) {
  }
  return this.u.encrypt(this.g)
}, N:function() {
  this.c = this.A().concat(this.A());
  this.u = new sjcl.cipher.aes(this.c)
}, W:function(a) {
  this.c = sjcl.hash.sha256.hash(this.c.concat(a));
  this.u = new sjcl.cipher.aes(this.c);
  for(a = 0;4 > a && !(this.g[a] = this.g[a] + 1 | 0, this.g[a]);a++) {
  }
}, X:function(a) {
  var b = [], c = 0, d;
  this.Q = b[0] = (new Date).valueOf() + 3E4;
  for(d = 0;16 > d;d++) {
    b.push(4294967296 * Math.random() | 0)
  }
  for(d = 0;d < this.f.length && !(b = b.concat(this.f[d].finalize()), c += this.m[d], this.m[d] = 0, !a && this.D & 1 << d);d++) {
  }
  this.D >= 1 << this.f.length && (this.f.push(new sjcl.hash.sha256), this.m.push(0));
  this.i -= c;
  c > this.j && (this.j = c);
  this.D++;
  this.W(b)
}, q:function(a) {
  sjcl.random.addEntropy([a.x || a.clientX || a.offsetX, a.y || a.clientY || a.offsetY], 2, "mouse")
}, p:function() {
  sjcl.random.addEntropy(new Date, 2, "loadtime")
}, M:function(a, b) {
  var c;
  a = sjcl.random.t[a];
  var d = [];
  for(c in a) {
    a.hasOwnProperty(c) && d.push(a[c])
  }
  for(c = 0;c < d.length;c++) {
    d[c](b)
  }
}};
try {
  var s = new Uint32Array(32);
  crypto.getRandomValues(s);
  sjcl.random.addEntropy(s, 1024, "crypto['getRandomValues']")
}catch(t$$1) {
}
//<CONVENIENCE>
//</CONVENIENCE>
sjcl.bn = function(a) {
  this.initWith(a)
};
sjcl.bn.prototype = {radix:24, maxMul:8, d:sjcl.bn, copy:function() {
  return new this.d(this)
}, initWith:function(a) {
  var b = 0, c;
  switch(typeof a) {
    case "object":
      this.limbs = a.limbs.slice(0);
      break;
    case "number":
      this.limbs = [a];
      this.normalize();
      break;
    case "string":
      a = a.replace(/^0x/, "");
      this.limbs = [];
      c = this.radix / 4;
      for(b = 0;b < a.length;b += c) {
        this.limbs.push(parseInt(a.substring(Math.max(a.length - b - c, 0), a.length - b), 16))
      }
      break;
    default:
      this.limbs = [0]
  }
  return this
}, equals:function(a) {
  "number" === typeof a && (a = new this.d(a));
  var b = 0, c;
  this.fullReduce();
  a.fullReduce();
  for(c = 0;c < this.limbs.length || c < a.limbs.length;c++) {
    b |= this.getLimb(c) ^ a.getLimb(c)
  }
  return 0 === b
}, getLimb:function(a) {
  return a >= this.limbs.length ? 0 : this.limbs[a]
}, greaterEquals:function(a) {
  "number" === typeof a && (a = new this.d(a));
  var b = 0, c = 0, d, e, f;
  for(d = Math.max(this.limbs.length, a.limbs.length) - 1;0 <= d;d--) {
    e = this.getLimb(d), f = a.getLimb(d), c |= f - e & ~b, b |= e - f & ~c
  }
  return(c | ~b) >>> 31
}, toString:function() {
  this.fullReduce();
  var a = "", b, c, d = this.limbs;
  for(b = 0;b < this.limbs.length;b++) {
    for(c = d[b].toString(16);b < this.limbs.length - 1 && 6 > c.length;) {
      c = "0" + c
    }
    a = c + a
  }
  return"0x" + a
}, addM:function(a) {
  "object" !== typeof a && (a = new this.d(a));
  var b = this.limbs, c = a.limbs;
  for(a = b.length;a < c.length;a++) {
    b[a] = 0
  }
  for(a = 0;a < c.length;a++) {
    b[a] += c[a]
  }
  return this
}, doubleM:function() {
  var a, b = 0, c, d = this.radix, e = this.radixMask, f = this.limbs;
  for(a = 0;a < f.length;a++) {
    c = f[a], c = c + c + b, f[a] = c & e, b = c >> d
  }
  b && f.push(b);
  return this
}, halveM:function() {
  var a, b = 0, c, d = this.radix, e = this.limbs;
  for(a = e.length - 1;0 <= a;a--) {
    c = e[a], e[a] = c + b >> 1, b = (c & 1) << d
  }
  e[e.length - 1] || e.pop();
  return this
}, subM:function(a) {
  "object" !== typeof a && (a = new this.d(a));
  var b = this.limbs, c = a.limbs;
  for(a = b.length;a < c.length;a++) {
    b[a] = 0
  }
  for(a = 0;a < c.length;a++) {
    b[a] -= c[a]
  }
  return this
}, mod:function(a) {
  a = (new sjcl.bn(a)).normalize();
  for(var b = (new sjcl.bn(this)).normalize(), c = 0;b.greaterEquals(a);c++) {
    a.doubleM()
  }
  for(;0 < c;c--) {
    a.halveM(), b.greaterEquals(a) && b.subM(a).normalize()
  }
  return b.trim()
}, inverseMod:function(a) {
  var b = new sjcl.bn(1), c = new sjcl.bn(0), d = new sjcl.bn(this), e = new sjcl.bn(a), f, g = 1;
  if(!(a.limbs[0] & 1)) {
    throw new sjcl.exception.invalid("inverseMod: p must be odd");
  }
  do {
    d.limbs[0] & 1 && (d.greaterEquals(e) || (f = d, d = e, e = f, f = b, b = c, c = f), d.subM(e), d.normalize(), b.greaterEquals(c) || b.addM(a), b.subM(c));
    d.halveM();
    b.limbs[0] & 1 && b.addM(a);
    b.normalize();
    b.halveM();
    for(f = g = 0;f < d.limbs.length;f++) {
      g |= d.limbs[f]
    }
  }while(g);
  if(!e.equals(1)) {
    throw new sjcl.exception.invalid("inverseMod: p and x must be relatively prime");
  }
  return c
}, add:function(a) {
  return this.copy().addM(a)
}, sub:function(a) {
  return this.copy().subM(a)
}, mul:function(a) {
  "number" === typeof a && (a = new this.d(a));
  var b, c = this.limbs, d = a.limbs, e = c.length, f = d.length, g = new this.d, h = g.limbs, m, n = this.maxMul;
  for(b = 0;b < this.limbs.length + a.limbs.length + 1;b++) {
    h[b] = 0
  }
  for(b = 0;b < e;b++) {
    m = c[b];
    for(a = 0;a < f;a++) {
      h[b + a] += m * d[a]
    }
    --n || (n = this.maxMul, g.cnormalize())
  }
  return g.cnormalize().reduce()
}, square:function() {
  return this.mul(this)
}, power:function(a) {
  "number" === typeof a ? a = [a] : void 0 !== a.limbs && (a = a.normalize().limbs);
  var b, c, d = new this.d(1), e = this;
  for(b = 0;b < a.length;b++) {
    for(c = 0;c < this.radix;c++) {
      a[b] & 1 << c && (d = d.mul(e)), e = e.square()
    }
  }
  return d
}, mulmod:function(a, b) {
  return this.mod(b).mul(a.mod(b)).mod(b)
}, powermod:function(a, b) {
  var c = new sjcl.bn(1), d = new sjcl.bn(this);
  for(a = new sjcl.bn(a);;) {
    a.limbs[0] & 1 && (c = c.mulmod(d, b));
    a.halveM();
    if(a.equals(0)) {
      break
    }
    d = d.mulmod(d, b)
  }
  return c.normalize().reduce()
}, trim:function() {
  var a = this.limbs, b;
  do {
    b = a.pop()
  }while(a.length && 0 === b);
  a.push(b);
  return this
}, reduce:function() {
  return this
}, fullReduce:function() {
  return this.normalize()
}, normalize:function() {
  var a = 0, b, c = this.ipv, d, e = this.limbs, f = e.length, g = this.radixMask;
  for(b = 0;b < f || 0 !== a && -1 !== a;b++) {
    a = (e[b] || 0) + a, d = e[b] = a & g, a = (a - d) * c
  }
  -1 === a && (e[b - 1] -= this.placeVal);
  return this
}, cnormalize:function() {
  var a = 0, b, c = this.ipv, d, e = this.limbs, f = e.length, g = this.radixMask;
  for(b = 0;b < f - 1;b++) {
    a = e[b] + a, d = e[b] = a & g, a = (a - d) * c
  }
  e[b] += a;
  return this
}, toBits:function(a) {
  this.fullReduce();
  a = a || this.exponent || this.limbs.length * this.radix;
  var b = Math.floor((a - 1) / 24), c = sjcl.bitArray;
  a = [c.partial((a + 7 & -8) % this.radix || this.radix, this.getLimb(b))];
  for(b--;0 <= b;b--) {
    a = c.concat(a, [c.partial(this.radix, this.getLimb(b))])
  }
  return a
}, bitLength:function() {
  this.fullReduce();
  for(var a = this.radix * (this.limbs.length - 1), b = this.limbs[this.limbs.length - 1];b;b >>= 1) {
    a++
  }
  return a + 7 & -8
}};
sjcl.bn.fromBits = function(a) {
  var b = new this, c = [], d = sjcl.bitArray, e = this.prototype, f = Math.min(this.bitLength || 4294967296, d.bitLength(a)), g = f % e.radix || e.radix;
  for(c[0] = d.extract(a, 0, g);g < f;g += e.radix) {
    c.unshift(d.extract(a, g, e.radix))
  }
  b.limbs = c;
  return b
};
sjcl.bn.prototype.ipv = 1 / (sjcl.bn.prototype.placeVal = Math.pow(2, sjcl.bn.prototype.radix));
sjcl.bn.prototype.radixMask = (1 << sjcl.bn.prototype.radix) - 1;
sjcl.bn.pseudoMersennePrime = function(a, b) {
  function c(a) {
    this.initWith(a)
  }
  var d = c.prototype = new sjcl.bn, e, f;
  e = d.modOffset = Math.ceil(f = a / d.radix);
  d.exponent = a;
  d.offset = [];
  d.factor = [];
  d.minOffset = e;
  d.fullMask = 0;
  d.fullOffset = [];
  d.fullFactor = [];
  d.modulus = c.modulus = new sjcl.bn(Math.pow(2, a));
  d.fullMask = 0 | -Math.pow(2, a % d.radix);
  for(e = 0;e < b.length;e++) {
    d.offset[e] = Math.floor(b[e][0] / d.radix - f), d.fullOffset[e] = Math.ceil(b[e][0] / d.radix - f), d.factor[e] = b[e][1] * Math.pow(0.5, a - b[e][0] + d.offset[e] * d.radix), d.fullFactor[e] = b[e][1] * Math.pow(0.5, a - b[e][0] + d.fullOffset[e] * d.radix), d.modulus.addM(new sjcl.bn(Math.pow(2, b[e][0]) * b[e][1])), d.minOffset = Math.min(d.minOffset, -d.offset[e])
  }
  d.d = c;
  d.modulus.cnormalize();
  d.reduce = function() {
    var a, b, c, d = this.modOffset, e = this.limbs, f = this.offset, p = this.offset.length, q = this.factor, u;
    for(a = this.minOffset;e.length > d;) {
      c = e.pop();
      u = e.length;
      for(b = 0;b < p;b++) {
        e[u + f[b]] -= q[b] * c
      }
      a--;
      a || (e.push(0), this.cnormalize(), a = this.minOffset)
    }
    this.cnormalize();
    return this
  };
  d.S = -1 === d.fullMask ? d.reduce : function() {
    var a = this.limbs, b = a.length - 1, c, d;
    this.reduce();
    if(b === this.modOffset - 1) {
      d = a[b] & this.fullMask;
      a[b] -= d;
      for(c = 0;c < this.fullOffset.length;c++) {
        a[b + this.fullOffset[c]] -= this.fullFactor[c] * d
      }
      this.normalize()
    }
  };
  d.fullReduce = function() {
    var a, b;
    this.S();
    this.addM(this.modulus);
    this.addM(this.modulus);
    this.normalize();
    this.S();
    for(b = this.limbs.length;b < this.modOffset;b++) {
      this.limbs[b] = 0
    }
    a = this.greaterEquals(this.modulus);
    for(b = 0;b < this.limbs.length;b++) {
      this.limbs[b] -= this.modulus.limbs[b] * a
    }
    this.cnormalize();
    return this
  };
  d.inverse = function() {
    return this.power(this.modulus.sub(2))
  };
  c.fromBits = sjcl.bn.fromBits;
  return c
};
sjcl.bn.prime = {p127:sjcl.bn.pseudoMersennePrime(127, [[0, -1]]), p25519:sjcl.bn.pseudoMersennePrime(255, [[0, -19]]), p192:sjcl.bn.pseudoMersennePrime(192, [[0, -1], [64, -1]]), p224:sjcl.bn.pseudoMersennePrime(224, [[0, 1], [96, -1]]), p256:sjcl.bn.pseudoMersennePrime(256, [[0, -1], [96, 1], [192, 1], [224, -1]]), p384:sjcl.bn.pseudoMersennePrime(384, [[0, -1], [32, 1], [96, -1], [128, -1]]), p521:sjcl.bn.pseudoMersennePrime(521, [[0, -1]])};
sjcl.bn.random = function(a, b) {
  "object" !== typeof a && (a = new sjcl.bn(a));
  for(var c, d, e = a.limbs.length, f = a.limbs[e - 1] + 1, g = new sjcl.bn;;) {
    do {
      c = sjcl.random.randomWords(e, b), 0 > c[e - 1] && (c[e - 1] += 4294967296)
    }while(Math.floor(c[e - 1] / f) === Math.floor(4294967296 / f));
    c[e - 1] %= f;
    for(d = 0;d < e - 1;d++) {
      c[d] &= a.radixMask
    }
    g.limbs = c;
    if(!g.greaterEquals(a)) {
      return g
    }
  }
};
sjcl.ecc = {};
sjcl.ecc.point = function(a, b, c) {
  void 0 === b ? this.isIdentity = !0 : (this.x = b, this.y = c, this.isIdentity = !1);
  this.curve = a
};
sjcl.ecc.point.prototype = {toJac:function() {
  return new sjcl.ecc.pointJac(this.curve, this.x, this.y, new this.curve.field(1))
}, mult:function(a) {
  return this.toJac().mult(a, this).toAffine()
}, mult2:function(a, b, c) {
  return this.toJac().mult2(a, this, b, c).toAffine()
}, multiples:function() {
  var a, b, c;
  if(void 0 === this.P) {
    c = this.toJac().doubl();
    a = this.P = [new sjcl.ecc.point(this.curve), this, c.toAffine()];
    for(b = 3;16 > b;b++) {
      c = c.add(this), a.push(c.toAffine())
    }
  }
  return this.P
}, isValid:function() {
  return this.y.square().equals(this.curve.b.add(this.x.mul(this.curve.a.add(this.x.square()))))
}, toBits:function() {
  return sjcl.bitArray.concat(this.x.toBits(), this.y.toBits())
}};
sjcl.ecc.pointJac = function(a, b, c, d) {
  void 0 === b ? this.isIdentity = !0 : (this.x = b, this.y = c, this.z = d, this.isIdentity = !1);
  this.curve = a
};
sjcl.ecc.pointJac.prototype = {add:function(a) {
  var b, c, d, e;
  if(this.curve !== a.curve) {
    throw"sjcl['ecc']['add'](): Points must be on the same curve to add them!";
  }
  if(this.isIdentity) {
    return a.toJac()
  }
  if(a.isIdentity) {
    return this
  }
  b = this.z.square();
  c = a.x.mul(b).subM(this.x);
  if(c.equals(0)) {
    return this.y.equals(a.y.mul(b.mul(this.z))) ? this.doubl() : new sjcl.ecc.pointJac(this.curve)
  }
  b = a.y.mul(b.mul(this.z)).subM(this.y);
  d = c.square();
  a = b.square();
  e = c.square().mul(c).addM(this.x.add(this.x).mul(d));
  a = a.subM(e);
  b = this.x.mul(d).subM(a).mul(b);
  d = this.y.mul(c.square().mul(c));
  b = b.subM(d);
  c = this.z.mul(c);
  return new sjcl.ecc.pointJac(this.curve, a, b, c)
}, doubl:function() {
  if(this.isIdentity) {
    return this
  }
  var a = this.y.square(), b = a.mul(this.x.mul(4)), c = a.square().mul(8), a = this.z.square(), d = this.x.sub(a).mul(3).mul(this.x.add(a)), a = d.square().subM(b).subM(b), b = b.sub(a).mul(d).subM(c), c = this.y.add(this.y).mul(this.z);
  return new sjcl.ecc.pointJac(this.curve, a, b, c)
}, toAffine:function() {
  if(this.isIdentity || this.z.equals(0)) {
    return new sjcl.ecc.point(this.curve)
  }
  var a = this.z.inverse(), b = a.square();
  return new sjcl.ecc.point(this.curve, this.x.mul(b).fullReduce(), this.y.mul(b.mul(a)).fullReduce())
}, mult:function(a, b) {
  "number" === typeof a ? a = [a] : void 0 !== a.limbs && (a = a.normalize().limbs);
  var c, d = (new sjcl.ecc.point(this.curve)).toJac(), e = b.multiples();
  for(b = a.length - 1;0 <= b;b--) {
    for(c = sjcl.bn.prototype.radix - 4;0 <= c;c -= 4) {
      d = d.doubl().doubl().doubl().doubl().add(e[a[b] >> c & 15])
    }
  }
  return d
}, mult2:function(a, b, c, d) {
  "number" === typeof a ? a = [a] : void 0 !== a.limbs && (a = a.normalize().limbs);
  "number" === typeof c ? c = [c] : void 0 !== c.limbs && (c = c.normalize().limbs);
  var e, f = (new sjcl.ecc.point(this.curve)).toJac();
  b = b.multiples();
  var g = d.multiples(), h, m;
  for(d = Math.max(a.length, c.length) - 1;0 <= d;d--) {
    h = a[d] | 0;
    m = c[d] | 0;
    for(e = sjcl.bn.prototype.radix - 4;0 <= e;e -= 4) {
      f = f.doubl().doubl().doubl().doubl().add(b[h >> e & 15]).add(g[m >> e & 15])
    }
  }
  return f
}, isValid:function() {
  var a = this.z.square(), b = a.square(), a = b.mul(a);
  return this.y.square().equals(this.curve.b.mul(a).add(this.x.mul(this.curve.a.mul(b).add(this.x.square()))))
}};
sjcl.ecc.curve = function(a, b, c, d, e, f) {
  this.field = a;
  this.r = a.prototype.modulus.sub(b);
  this.a = new a(c);
  this.b = new a(d);
  this.G = new sjcl.ecc.point(this, new a(e), new a(f))
};
sjcl.ecc.curve.prototype.fromBits = function(a) {
  var b = sjcl.bitArray, c = this.field.prototype.exponent + 7 & -8;
  a = new sjcl.ecc.point(this, this.field.fromBits(b.bitSlice(a, 0, c)), this.field.fromBits(b.bitSlice(a, c, 2 * c)));
  if(!a.isValid()) {
    throw new sjcl.exception.corrupt("not on the curve!");
  }
  return a
};
sjcl.ecc.curves = {c192:new sjcl.ecc.curve(sjcl.bn.prime.p192, "0x662107c8eb94364e4b2dd7ce", -3, "0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1", "0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012", "0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811"), c224:new sjcl.ecc.curve(sjcl.bn.prime.p224, "0xe95c1f470fc1ec22d6baa3a3d5c4", -3, "0xb4050a850c04b3abf54132565044b0b7d7bfd8ba270b39432355ffb4", "0xb70e0cbd6bb4bf7f321390b94a03c1d356c21122343280d6115c1d21", "0xbd376388b5f723fb4c22dfe6cd4375a05a07476444d5819985007e34"), 
c256:new sjcl.ecc.curve(sjcl.bn.prime.p256, "0x4319055358e8617b0c46353d039cdaae", -3, "0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b", "0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296", "0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"), c384:new sjcl.ecc.curve(sjcl.bn.prime.p384, "0x389cb27e0bc8d21fa7e5f24cb74f58851313e696333ad68c", -3, "0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef", 
"0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7", "0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f"), c521:new sjcl.ecc.curve(sjcl.bn.prime.p521, "0x5AE79787C40D069948033FEB708F65A2FC44A36477663B851449048E16EC79BF6", -3, "0x051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00", "0xc6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66", 
"0x11839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650")};
sjcl.ecc.K = function(a) {
  sjcl.ecc[a] = {publicKey:function(a, c, d) {
    this.e = c;
    this.B = d instanceof Array ? c.fromBits(d) : d;
    a && (this.V = a, this.serialize = function() {
      return{point:d.toBits(), curve:a}
    })
  }, secretKey:function(a, c, d) {
    this.e = c;
    this.w = d;
    a && (this.V = a, this.serialize = function() {
      return{exponent:d.toBits(), curve:a}
    })
  }, generateKeys:function(b, c) {
    var d;
    void 0 === b && (b = 256);
    if("number" === typeof b && (d = b, b = sjcl.ecc.curves["c" + b], void 0 === b)) {
      throw new sjcl.exception.invalid("no such curve");
    }
    c = sjcl.bn.random(b.r, c);
    var e = b.G.mult(c);
    return{pub:new sjcl.ecc[a].publicKey(d, b, e), sec:new sjcl.ecc[a].secretKey(d, b, c)}
  }}
};
sjcl.ecc.K("elGamal");
sjcl.ecc.elGamal.publicKey.prototype = {kem:function(a) {
  a = sjcl.bn.random(this.e.r, a);
  var b = this.e.G.mult(a).toBits();
  return{key:sjcl.hash.sha256.hash(this.B.mult(a).toBits()), tag:b}
}};
sjcl.ecc.elGamal.secretKey.prototype = {unkem:function(a) {
  return sjcl.hash.sha256.hash(this.e.fromBits(a).mult(this.w).toBits())
}, dh:function(a) {
  return sjcl.hash.sha256.hash(a.B.mult(this.w).toBits())
}};
sjcl.ecc.K("ecdsa");
sjcl.ecc.ecdsa.secretKey.prototype = {sign:function(a, b) {
  var c = this.e.r, d = c.bitLength(), e = sjcl.bn.random(c.sub(1), b).add(1);
  b = this.e.G.mult(e).x.mod(c);
  a = sjcl.bn.fromBits(a).add(b.mul(this.w)).inverseMod(c).mul(e).mod(c);
  return sjcl.bitArray.concat(b.toBits(d), a.toBits(d))
}};
sjcl.ecc.ecdsa.publicKey.prototype = {verify:function(a, b) {
  var c = sjcl.bitArray, d = this.e.r, e = d.bitLength(), f = sjcl.bn.fromBits(c.bitSlice(b, 0, e));
  b = sjcl.bn.fromBits(c.bitSlice(b, e, 2 * e));
  a = sjcl.bn.fromBits(a).mul(b).mod(d);
  c = f.mul(b).mod(d);
  a = this.e.G.mult2(a, c, this.B).x;
  if(f.equals(0) || b.equals(0) || f.greaterEquals(d) || b.greaterEquals(d) || !a.equals(f)) {
    throw new sjcl.exception.corrupt("signature didn't check out");
  }
  return!0
}};
