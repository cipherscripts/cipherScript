
/*
 * eccCrypto uses the SJCL-API with ecc
 * https://github.com/bitwiseshiftleft/sjcl/tree/ecc
 * */

var entropyElemId = "entropy";
var entropySufficientMessage = "sufficient";

function eccCrypto(){

/**
 * Initiate ecc-crypto by starting entropy collection from mouse
 * events.
 * <br>
 * @param entropyElementId           String Id of the element which 
 *                                   should display  the status of 
 * 									 entropy collection.
 * @param entropySufficientInnerHtml String What to display when
 * 											entropy collection is done.
 * */
this.init = function (entropyElementId, entropySufficientInnerHtml) {
  entropyElemId = entropyElementId;
  entropySufficientMessage = entropySufficientInnerHtml;
  document.addEventListener("mousemove", this.update, true);
  sjcl.random.startCollectors();
};

/**
 * Updates entropy collection status. Do not call this manually, it is
 * called by default after calling init.
 * */
this.update = function () {
  var e = document.getElementById(entropyElemId);
  var progress = sjcl.random.getProgress(10);

  if(progress === undefined) {
    e.innerHTML = entropySufficientMessage;
    sjcl.random.stopCollectors();
    document.removeEventListener("mousemove", this.update);
  } else {
    e.innerHTML = progress.toFixed(2);
  }
};

/**
 * Generates a keypair.
 * <br>
 * @param bits Integer   The number of bits (i.e. 192, 224, 384, 521 etc.)
 * @return object        Attributes: priv, pub
 * */
this.generateKeypair = function(bits){
	try{
		var keys = sjcl.ecc.elGamal.generateKeys(bits, 10);
		var pubkeystr = JSON.stringify(keys.pub.serialize());
		var privkeystr = JSON.stringify(keys.sec.serialize());
		pubkeystr = this.toBase64(pubkeystr);
		privkeystr = this.toBase64(privkeystr);
		return { "priv": privkeystr, "pub": pubkeystr };
	}
	catch(e){
		return null;
	}
};

/**
 * Encrypt a given cleartextstring with the receivers' public keys.
 * <br>
 * @param  cleartext String           The cleartext to encrypt.
 * @param  pubkeys   Array<String>    The public keys of the receivers
 * @return object                     Attributes: ciphertext, enckeys (array:
 * 										attributes: pubkey, cipherkey, keytag             
 * */
this.encryptString = function (cleartext, pubkeys){
	try{
		/*
		 * Generate a random key
		 * */
		var randkey = this.randomKeyString();
		var len = pubkeys.length;
		var enckeys = new Array();
		for(var i=0; i<len; i++){
			//hashing is not necessary here, however, it keeps the 
			//stringlength reasonable while not costing much cpu time
			var pk = pubkeys[i];
			pk = this.toUtf8(pk);
			var keyhash = CryptoJS.SHA3(pk, { outputLength: 224 });
			keyhash = keyhash.toString(CryptoJS.enc.Base64);
			var pubjson = JSON.parse(pk);
			var point = sjcl.ecc.curves['c'+pubjson.curve].fromBits(pubjson.point);
			var pubkey = new sjcl.ecc.elGamal.publicKey(pubjson.curve, point.curve, point);
			var symkeyobj = pubkey.kem(0); //symkeyobj.key and symkeyobj.tag
			var symkey = symkeyobj.key;
			var keytag = JSON.stringify(symkeyobj.tag);
			var ciphertext = JSON.stringify(this.encrypt(randkey, symkey));
			keytag = this.toBase64(keytag); ciphertext = this.toBase64(ciphertext);
			var enckey = {"pubkey": keyhash, "cipherkey": ciphertext, "keytag": keytag};
			enckeys.push(enckey);
		}//for(var i=0; i<len; i++)
		var enc = CryptoJS.AES.encrypt(cleartext, randkey);
		enc = enc+"";
		return {"ciphertext": enc, "enckeys": enckeys};
	}
	catch(e){
		return null;
	}
};

/**
 * Encrypt a given cleartextstring with the receivers' public keys and
 * sign it with your private key.
 * <br>
 * @param cleartext   String           The cleartext to encrypt
 * @param pubkeys     Array<String>    The public keys of the receivers
 * @param privkeystr  String           Your private key
 * @return object                      Attributes: ciphertext, keytag, signature
 * */
this.encryptAndSignString = function (cleartext, pubkeys, privkeystr){
	try{
		privkeystr = this.toUtf8(privkeystr);
		var secret = JSON.parse(privkeystr);
		var ex = sjcl.bn.fromBits(secret.exponent);
		var sec = new sjcl.ecc.ecdsa.secretKey(secret.curve,sjcl.ecc.curves['c'+secret.curve],ex);
		var hash = this.hashMessage(cleartext);
		var signature = sec.sign(hash,0);
		var signstr = JSON.stringify(signature);
		signstr = this.toBase64(signstr);
		var enc = this.encryptString(cleartext, pubkeys);
		var ciph = enc.ciphertext; var eks = enc.enckeys;
		return {"ciphertext": ciph, "enckeys": eks, "signature": signstr};
	}
	catch(e){
		return null;
	}
};

/**
 * Decrypt a given ciphertext string with your private key and the 
 * sender's cipherkey and symkeytag.
 * <br>
 * @param ciphertext    String   The ciphertext to decrypt
 * @param cipherkey     String   Key encrypted with your privkey
 * @param keytag        String   The key tag
 * @param privkeystr    String   Your private key string
 * @return object                 Attributes: cleartext
 * */
this.decryptString = function (ciphertext, cipherkey, keytag, privkeystr){
	try{
		cipherkey = this.toUtf8(cipherkey);
		keytag = this.toUtf8(keytag);
		privkeystr = this.toUtf8(privkeystr);
		var decryptedsymkey = this.decryptSymKey(keytag, privkeystr);
		var deckey = this.decryptText(cipherkey, decryptedsymkey);
		var dec = CryptoJS.AES.decrypt(ciphertext, deckey);
		dec = dec.toString(CryptoJS.enc.Utf8);
		return {"cleartext": dec};
	}
	catch(e){
		return null;
	}
};

/**
 * Decrypt a given ciphertext string with your private key and the 
 * sender's cipherkey and keytag. Verify with the sender's public key. 
 * <br>
 * @param ciphertext    String   The ciphertext to decrypt
 * @param cipherkey     String   Key encrypted with your privkey
 * @param keytag        String   The key tag
 * @param privkeystr    String   Your private key string
 * @param pubkeystr     String   The senders public key
 * @param signature     String   The signature of the message
 * @return object                Attributes: cleartext, verified
 * */
this.decryptAndVerifyString = function (ciphertext, cipherkey, keytag, privkeystr, pubkeystr, signature){
	try{
		pubkeystr = this.toUtf8(pubkeystr);
		signature = this.toUtf8(signature);
		var pubjson = JSON.parse(pubkeystr);
		var point = sjcl.ecc.curves['c'+pubjson.curve].fromBits(pubjson.point);
		var pubkey = new sjcl.ecc.ecdsa.publicKey(pubjson.curve, point.curve, point);
		var signobj = JSON.parse(signature);
		var dec = this.decryptString(ciphertext, cipherkey, keytag, privkeystr);
		var cleartxt = dec.cleartext;
		var hash = this.hashMessage(cleartxt);
		var ver = false;
		/*
		 * verify breaks on not being able to verify. so allow it to break
		 * and let ver stay false.
		 * */
		try{
			ver = pubkey.verify(hash, signobj);
		}catch(e){
			ver = false;
		}
		var verified = "unverified";
		if(ver) verified = "verified";
		return {"cleartext": cleartxt, "verified": verified};
	}catch(e1){
		return null;
	}
};
/**
 * Signs a given string with a private key, returns a signature.
 * <br>
 * @param texttosign   String    Text to sign
 * @param privkeystr   String    Private key string
 * @return object                Attributes: message, signature
 * 								 (with message being the original text,
 * 								  added for convenience)
 * */
this.signString = function(texttosign, privkeystr){
	try{
		privkeystr = this.toUtf8(privkeystr);
		var secret = JSON.parse(privkeystr);
		var ex = sjcl.bn.fromBits(secret.exponent);
		var sec = new sjcl.ecc.ecdsa.secretKey(secret.curve,sjcl.ecc.curves['c'+secret.curve],ex);
		var hash = this.hashMessage(texttosign);
		var signature = sec.sign(hash,0);
		var signstr = JSON.stringify(signature);
		signstr = this.toBase64(signstr);
		return {"message": texttosign, "signature": signstr};
	}catch(e){
		return null;
	}
};

/**
 * Verifies a text which came with a signature with the public key of
 * the sender.
 * <br>
 * @param signedtext String Cleartext which came with a signature
 * @param signature String Signature
 * @param pubkeystr String Sender's public key
 * @return object   Attributes: verified ("verified" on true, else
 * 					"unverified")
 * */
 this.verifySignature = function (signedtext, signature, pubkeystr){
	 try{
		signature = this.toUtf8(signature);
		pubkeystr = this.toUtf8(pubkeystr);
		var pubjson = JSON.parse(pubkeystr);
		var point = sjcl.ecc.curves['c'+pubjson.curve].fromBits(pubjson.point);
		var pubkey = new sjcl.ecc.ecdsa.publicKey(pubjson.curve, point.curve, point);
		var signobj = JSON.parse(signature);
		var hash = this.hashMessage(signedtext);
		var ver = false;
		/*
		 * verify breaks on not being able to verify. so allow it to break
		 * and let ver stay false.
		 * */
		try{
			ver = pubkey.verify(hash, signobj);
		}catch(e){
			ver = false;
		}
		var verified = "unverified";
		if(ver) verified = "verified";
		return {"verified": verified};
	}
	catch(e1){
		return null;
	}
 };

/**
 * Create a long random key string (base64) for a really hard to crack
 * password.
 * <br>
 * @return String
 * */
this.randomKeyString = function() {
	/* Create any kind of long random String by 
	 * generating one and then hashing it a bit cause
	 * Math.random is not so perfect and it can be
	 * made more complicated.
	 * */
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var length = 64;
    var result1 = '';
    for (var i = length; i > 0; --i) result1 += chars[Math.round(Math.random() * (chars.length - 1))];
	var result2 = CryptoJS.SHA3(result1, { outputLength: 384});
	result2 = result2.toString(CryptoJS.enc.Base64);
	var result3 = CryptoJS.SHA3(result2, { outputLength: 512});
	result3 = result3.toString(CryptoJS.enc.Base64);
	var result = result2+result3;
	if(result.length>64) result = result.substr(0, 63);
    return result;
};

/**
 * Create a base64-encoded string from an utf8-String. 
 * <br>
 * @param utf8str String     A utf8-encoded string
 * @return String		
 * */
this.toBase64 = function (utf8str){
	var words = CryptoJS.enc.Utf8.parse(utf8str);
	var base64 = words.toString(CryptoJS.enc.Base64);
	return base64;
};//this.toBase64 = function (utf8str)

/**
 * Create an utf8-encoded string from a base64-string.
 * <br>
 * @param base64str String   A base64-encoded string
 * @return String
 * */
this.toUtf8 = function (base64str){
	var words = CryptoJS.enc.Base64.parse(base64str);
	var utf8 = words.toString(CryptoJS.enc.Utf8);
	return utf8;
};//this.toUtf8 = function (base64str)

//----------------------------------------------------------------------
// INNER FUNCTIONS
//----------------------------------------------------------------------

this.hashMessage = function(str){
	var hash = CryptoJS.SHA512(str);
	hash = hash.toString(CryptoJS.enc.Hex);
	hash = CryptoJS.SHA3(hash, { outputLength: 512 });
	hash = hash.toString(CryptoJS.enc.Base64);
	return hash;
};

this.decryptSymKey = function (tagstr, secretstr){
	var tag = JSON.parse(tagstr);
	var secret = JSON.parse(secretstr);
	var ex = sjcl.bn.fromBits(secret.exponent);
	var sec = new sjcl.ecc.elGamal.secretKey(secret.curve,sjcl.ecc.curves['c'+secret.curve],ex);
	var sym = sec.unkem(tag);
	return sym;	
};

this.decryptText = function(encryptedtextstr, symkey) {
var enc = JSON.parse(encryptedtextstr);
//var symkey = JSON.parse(symkeystr);

var plain = this.decrypt(enc, symkey);
var chars = this.binChars(this.decBin(plain));
var text = ""
for(i = 0; i < chars.length; i++) {
	if(chars[i] != 0) {
	text += String.fromCharCode(chars[i]);
	}
}

return text;
};

this.encrypt = function(plaintext, key) {
return this.toAes(this.toDec(this.toBin(plaintext)), key);
};

this.decrypt = function(encrypted, key) {
return this.fromAes(encrypted, key);
};

this.toAes = function(arr, key) {
//print("arr sent to toAes: " + arr);
aes = new sjcl.cipher.aes(key);
crypt_arr = [];

j = 0;
temp_arr = [];
for(i = 0; i < arr.length; i++, j++) {
	temp_arr[j] = arr[i];
	
	if((i + 1) >= arr.length) {
	//print("padding, length: " + temp_arr.length);
	while(temp_arr.length  < 4) {
		temp_arr[temp_arr.length] = null;
	}
	}
	
	if(temp_arr.length == 4) {
	//print("plain: " + temp_arr)
	temp_crypt = aes.encrypt(temp_arr, {ks:256, ts:128});
	//print("encrypted: " + temp_crypt);
	crypt_arr = crypt_arr.concat(temp_crypt);
	
	j = -1; temp_arr = [];
	}
}

return crypt_arr;
};

this.fromAes = function(encrypted, key) {
aes = new sjcl.cipher.aes(key);
plain_arr = [];

j = 0;
temp_arr = [];
for(i = 0; i < encrypted.length; i++, j++) {
	temp_arr[j] = encrypted[i];
	
	if(temp_arr.length == 4) {
	temp_plain = aes.decrypt(temp_arr, {ks:256, ts:128});
	//print("plain: " + temp_plain);
	plain_arr = plain_arr.concat(temp_plain);
	j = -1; temp_arr = [];
	}
}

return plain_arr;
};

this.decBin = function(decimal_arr) {
var binary = ""

for(i = 0; i < decimal_arr.length; i++) {
	temp_bin = parseInt(decimal_arr[i]).toString(2);
	
	while(temp_bin.length < 16) {
	temp_bin = "0" + temp_bin;
	}
	
	binary += temp_bin;
}

return binary;
};

this.binChars = function(binary_string) {
char_arr = [];

len = binary_string.length;
val = 1; dec = 0;
for (i = 1; i <= len; i++) {
	if(parseInt(binary_string[len - i]) == 1) {
	dec += val;
	}
	
	val *= 2;
	
	if(i != 1 && i % 8 == 0) {
	char_arr[char_arr.length] = dec;
	val = 1;
	dec = 0;
	}
}

char_arr.reverse();
return char_arr;
};

this.toBin = function(text) {
var st,
i,
j,
d;
var arr = [];
var len = text.length;
for (i = 1; i <= len; i++) {
	//reverse so its like a stack
	d = text.charCodeAt(len - i);
	for (j = 0; j < 8; j++) {
	st = d % 2 == '0' ? "class='zero'": ""
	arr.push(d % 2);
	d = Math.floor(d / 2);
	}
}
//reverse all bits again.
ret = arr.reverse().join("");
//print(ret)
return ret
};

this.toDec = function(binary) {
//print("binary length: " + binary.length);
var arr = [];

j = 0;
temp_arr = [];

for(i = 0; i < binary.length; i++, j++) {
	temp_arr[j] = binary[i];
	
	if((i + 1) == binary.length) {
	while(temp_arr.length < 16) {
		pad = [0]
		temp_arr = temp_arr.concat(pad);
	} 
	}
	
	if(temp_arr.length == 16) {
	dec = 0;
	val = 1;
	
	for(k = 1; k <= temp_arr.length; k++) {
		if(parseInt(temp_arr[temp_arr.length - k]) == 1) {
		dec += val;
		}	
  
		val *= 2;
	}
	
	arr[arr.length] = dec;
	
	j = -1; temp_arr = [];
	}
}

//print("dec: " + arr);
return arr;
};

};

var eccCryptoScheme = new eccCrypto();
