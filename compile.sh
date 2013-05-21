#!/bin/bash

#-----------------------------------------------------------------------
# outputs cipherscript.min.js
#-----------------------------------------------------------------------

java -jar compiler.jar --js="./src/tools/tools.js" --js="./src/crypto/cryptojs/core-min.js" --js="./src/crypto/cryptojs/enc/enc-utf16-min.js" --js="./src/crypto/cryptojs/enc/enc-base64-min.js" --js="./src/crypto/cryptojs/hash/sha512.js" --js="./src/crypto/cryptojs/hash/sha3.js" --js="./src/crypto/cryptojs/ciph/aes.js" --js="./src/crypto/sjcl/mobile.js" --js="./src/crypto/sjcl/sjcl.js" --js="./src/crypto/ecc_functions.js" --js="./src/crypto/crypto.js" --js="./src/cipherscript.js" --js_output_file="cipherscript.min.js"
