// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

var rng_state;
var rng_pool;
var rng_pptr;

// Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
  rng_pool[rng_pptr++] ^= x & 255;
  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
  if (rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}
var seed = 1293840000001;
// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
  //1293840000000
  // rng_seed_int(new Date().getTime());
  rng_seed_int(seed);
}
var initStateTime = 1293840002;
//2 bytes
function rand1() {
  initStateTime = initStateTime * 214013 + 2531011;
  console.log("rand1", initStateTime, (initStateTime >>> 16) & 0x7fff);
  //无符号右移
  return (initStateTime >>> 16) & 0x7fff;
}

var mathRandomRngState = [0, 0];
function initState() {
  mathRandomRngState[0] = rand1();
  mathRandomRngState[1] = rand1();
}

function MathRandom() {
  var r0 =
    (imul(18273, mathRandomRngState[0] & 0xffff) +
      (mathRandomRngState[0] >>> 16)) |
    0;
  mathRandomRngState[0] = r0;
  var r1 =
    (imul(36969, mathRandomRngState[1] & 0xffff) +
      (mathRandomRngState[1] >>> 16)) |
    0;
  mathRandomRngState[1] = r1;
  var x = ((r0 << 14) + (r1 & 0x3ffff)) | 0;

  return (x < 0 ? x + 0x100000000 : x) * 2.3283064365386962890625e-10;
}

function imul(x, y) {
  return ((x & 0xffff) * (y & 0xffff)) >>> 0;
}
initState();

console.log("seedTime", seed);
console.log("initStateTime", initStateTime);
console.log("mathRandomRngState[0]", mathRandomRngState[0]);
console.log("mathRandomRngState[1]", mathRandomRngState[1]);
// Initialize the pool with junk if needed.
if (rng_pool == null) {
  rng_pool = new Array();
  rng_pptr = 0;
  var t;
  if (
    navigator.appName == "Netscape" &&
    navigator.appVersion < "5" &&
    window.crypto
  ) {
    // Extract entropy (256 bits) from NS4 RNG if available
    var z = window.crypto.random(32);
    for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
    console.log("z", z);
  }
  while (rng_pptr < rng_psize) {
    // extract some randomness from Math.random()
    // t = Math.floor(65536 * Math.random());
    t = Math.floor(65536 * MathRandom()); //test with specific state
    console.log("MathRandom", t);
    rng_pool[rng_pptr++] = t >>> 8;
    rng_pool[rng_pptr++] = t & 255;
  }
  rng_pptr = 0;
  rng_seed_time();
  //rng_seed_int(window.screenX);
  //rng_seed_int(window.screenY);
}

function rng_get_byte() {
  if (rng_state == null) {
    console.log("rng_state == null");
    rng_seed_time();
    rng_state = prng_newstate();
    rng_state.init(rng_pool);
    for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
      rng_pool[rng_pptr] = 0;
    rng_pptr = 0;
    //rng_pool = null;
  }
  // TODO: allow reseeding after first request
  return rng_state.next();
}

function rng_get_bytes(ba) {
  var i;
  for (i = 0; i < ba.length; ++i) {
    ba[i] = rng_get_byte();
    console.log("ba[i]", i, ba[i]);
  }
}

function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;
