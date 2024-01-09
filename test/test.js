var assert = require("assert");
var ECKey = require("../src/eckey.js").ECKey;
var ECPubKey = require("../src/eckey.js").ECPubKey;
// var convert = require("../src/convert.js");
// var bytesToHex = convert.bytesToHex;
// var hexToBytes = convert.hexToBytes;
// var Address = require("../src/address");
// var Network = require("../src/network");
// var testnet = Network.testnet.addressVersion;
require("../src/crypto-js/crypto.js");
require("../src/crypto-js/ripemd160.js");
require("../src/crypto-js/sha256.js");
require("../src/jsbn/prng4.js");
require("../src/jsbn/rng.js");
require("../src/jsbn/jsbn.js");
require("../src/jsbn/jsbn2.js");
require("../src/jsbn/ec.js");
require("../src/jsbn/sec.js");
require("../src/events/eventemitter.js");
require("../src/bitcoin.js");
require("../src/util.js");
require("../src/base58.js");
require("../src/address.js");
require("../src/ecdsa.js");
require("../src/paillier.js");
require("../src/eckey.js");

describe("ECKey", function () {
  describe("toAddress", function () {
    var privkeys = [
      "ca48ec9783cf3ad0dfeff1fc254395a2e403cbbc666477b61b45e31d3b8ab458",
      "1111111111111111111111111111111111111111111111111111111111111111",
      "18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725",
    ];

    // compressed pubkeys
    var cpubkeys = [
      "024b12d9d7c77db68388b6ff7c89046174c871546436806bcd80d07c28ea811992",
      "034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa",
      "0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352",
    ];

    var pubkeys = cpubkeys.map(function (x) {
      return ECPubKey(x).toHex(false);
    });

    it("mainnet", function () {
      var addresses = [
        "19SgmoUj4xowEjwtXvNAtYTAgbvR9iBCui",
        "1MsHWS1BnwMc3tLE8G35UXsS58fKipzB7a",
        "16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM",
      ];
      var compressedAddresses = [
        "1AA4sjKW2aUmbtN3MtegdvhYtDBbDEke1q",
        "1Q1pE5vPGEEMqRcVRMbtBK842Y6Pzo6nK9",
        "1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs",
      ];

      for (var i = 0; i < addresses.length; ++i) {
        var priv = new ECKey(privkeys[i], false);
        var pub = new ECPubKey(pubkeys[i], false);
        var cpub = new ECPubKey(cpubkeys[i], true);

        var addr = addresses[i];
        var caddr = compressedAddresses[i];

        assert.equal(priv.getAddress().toString(), addr);
        assert.equal(pub.getAddress().toString(), addr);
        assert.equal(cpub.getAddress().toString(), caddr);
      }
    });
  });
});
