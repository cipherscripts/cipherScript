cipherScript
============

cipherScript is a very simple javascript cryptography library designed for webapplications. 

It utilizes ECC/ECDSA (asynchronous encryption and signing), as well as AES256 (synchronous encryption) and SHA512/SHA3 (hashing).

cipherScript defines a XML-based block-format for anything related to ECC/ECDSA (similar to what you know from PGP), and a direct access to the equivalent functions if you don't want to use cipherScript's block format.

cipherScript aims at being "ajax-friendly". You just deal with strings (and objects with attributes that are strings) using cipherScript, hassle with JSON is done inside the library.

Check out the example and (!) read the docs carefully - then, cipherScript should be pretty straightforward to use.

Credits
============

This library includes the following tools:

* [SJCL](https://github.com/bitwiseshiftleft/sjcl)
* [CryptoJS](http://code.google.com/p/crypto-js/)

Please Note
============

cipherScript is a beta-stage library, so do not use it in dangerous situations. 

It also is not a server-client-encryption library. It's just an opinion, but [rsa-javascript-php](https://github.com/Trenker/rsa-javascript-php/) seems to be pretty lightweight and useful.

Cipherscript does *not* provide RSA.
