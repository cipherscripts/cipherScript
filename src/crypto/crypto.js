
var cipherScriptFunctions = new cipherScriptF();

function cipherScriptF(){
	
//INITIALIZE THE ENTROPY COLLECTORS
/**
 * Initiate encryption library by starting entropy collection from mouse
 * events.
 * <br>
 * @param entropyElementId           String Id of the element which 
 *                                   should display  the status of 
 * 									 entropy collection.
 * @param entropySufficientInnerHtml String What to display when
 * 											entropy collection is done.
 * */
this.init = function (entropyElementId, entropySufficientInnerHtml){
	eccCryptoScheme.init(entropyElementId, entropySufficientInnerHtml);
};

// KEY GENERATION

/**
 * Generates a key pair with a given number of bits and
 * encrypts the private key using a password.
 * <br>
 * @param   bits      Integer       Number of bits (384 or 521)
 * @param   password  String        Encryption password
 * @return  object                  Attributes: 
 * 										String pubkey
 * 										String privkey
 * */
this.generateKeypair = function(bits, password){
	try{
		var kp = eccCryptoScheme.generateKeypair(bits);
		var pubkey = kp.pub; var privkey = kp.priv;
		privkey = this.symEncrypt(privkey, password);
		var privblock = "<privkey>"+
							"<key>"+privkey+"</key>"+
						"</privkey>";
		var pubblock = "<pubkey>"+
							"<key>"+pubkey+"</key>"+
					  "</pubkey>";
		return {"privkey": privblock, "pubkey": pubblock};
	}catch(e){
		return null;
	}
}; //this.generateKeypair

// PLAIN ENCRYPTION

/**
 * Encrypts a given cleartext using an array of public keys, so 
 * multiple recipients are possible.
 * <br>
 * @param    cleartext   String          Cleartext to encrypt
 * @param    pubkeys     Array<String>   Array of public key blocks
 * @return   object                      Attributes: 
 * 											String message
 * */
this.encryptMessage = function(cleartext, pubkeys){
	try{
		var pks = new Array();
		for(var i=0; i<pubkeys.length; i++){
			var pk = pubkeys[i].between("<key>","</key>");
			if(pk != null){
				pks.push(pk);
			}
		}
		var enc = eccCryptoScheme.encryptString(cleartext, pks);
		var ciphertext = enc.ciphertext;
		var keys = enc.enckeys;
		var xmlstr = "<keyheader>";
		xmlstr += "<length>"+keys.length+"</length>";
		for(var j=0; j<keys.length; j++){
			var keyhash = keys[j].pubkey;
			var ciphkey = keys[j].cipherkey;
			var keytag = keys[j].keytag;
			
			xmlstr += "<header id='"+j.toString()+"'>"+
					  "<keyhash>"+keyhash+"</keyhash>"+
					 "<ciphkey>"+ciphkey+"</ciphkey>"+
					 "<keytag>"+keytag+"</keytag>"+
					 "</header>";
		}
		xmlstr += "</keyheader>";
		var msg = "<message>"+
					"<type>encrypted</type>"+
					xmlstr+
				  "<text>"+ciphertext+"</text>"+
				  "</message>";
		return {"message": msg};
	}catch(e){
		return null;
	}
}; //this.encryptMessage

/**
 * Decrypt a message with the receiver's private key and public key.
 * <br>
 * @param   message    String   Message block
 * @param   privkey    String   Receiver's private key block
 * @param   pubkey     String   Receiver's public key block
 * @param   pass       String   Receiver's password
 * @return  object              Attributes: 
 * 									String cleartext
 * */
this.decryptMessage = function(message, privkey, pubkey, pass){
    try{
		var pk = eccCryptoScheme.toUtf8(pubkey.between("<key>","</key>"));
		var pkh = CryptoJS.SHA3(pk, { outputLength: 224 });
		pkh = pkh.toString(CryptoJS.enc.Base64);
		var keyheader = message.between("<keyheader>", "</keyheader>");
		var len = keyheader.between("<length>", "</length>");
		len = parseInt(len);
		var keyhash = null; var ciphkey = null; var keytag = null;
		for(var i=0; i<len; i++){
			var header = keyheader.between("<header id='"+i.toString()+"'>", "</header>");
			keyhash = header.between("<keyhash>", "</keyhash>");
			if(keyhash == pkh){
				ciphkey = header.between("<ciphkey>", "</ciphkey>");
				keytag = header.between("<keytag>", "</keytag>");
				break;
			}
		}
		if(keyhash==null || ciphkey==null || keytag==null) return null;
		privkey = privkey.between("<key>", "</key>");
		privkey = this.symDecrypt(privkey, pass);
		
		var ciphertext = message.between("<text>", "</text>");
		
		var dec = eccCryptoScheme.decryptString(ciphertext, ciphkey, keytag, privkey);
		
		if(dec==null) return null;
		
		return {"cleartext" : dec.cleartext};
	}catch(e){
		return null;
	}
}; //this.decryptMessage

// PLAIN SIGNING

/**
 * Sign an unencrypted text using the sender's private key.
 * <br>
 * @param   texttosign  String  The text to be signed
 * @param   privkey     String  Sender's key block
 * @param   pass        String  Sender's password
 * @return  object              Attributes:
 * 									String message
 * */
this.signMessage = function(texttosign, privkey, pass){
	try{
		if(texttosign.length<1 || privkey.length<1 || pass.length<1) return null;
			var privstr = privkey.between("<key>","</key>");
			privstr = this.symDecrypt(privstr, pass);
			var signed = eccCryptoScheme.signString(texttosign, privstr);
			if(signed==null) return null;
			var msg = signed.message;
			var sig = signed.signature;
			var message = "<message>"+
							"<type>signed</type>"+
							"<text>"+msg+"</text>"+
							"<signature>"+sig+"</signature>"+
						  "</message>";
			return {"message": message};
	}catch(e){
		return null;
	}
}; //this.signMessage

/**
 * Verify a signed message with the senders public key.
 * <br>
 * @param   message   String   Signed message block (not encrypted)
 * @param   pubkey    String   Sender's public key
 * @return  object             Attributes:
 * 									String verified
 * */
this.verifyMessage = function(message, pubkey){
	try{
		if(message.length<1 || pubkey.length<1) return null;
			var sign = message.between("<signature>", "</signature>");
			var msg = message.between("<text>","</text>");
			var pub = pubkey.between("<key>","</key>");
			var ver = eccCryptoScheme.verifySignature(msg, sign, pub);
			var verified = "unverified";
			if(ver!=null) verified = ver.verified;
			return {"verified": verified};
	}catch(e){
		return null;
	}
}; //this.verifyMessage

// ENCRYPTION AND SIGNING

/**
 * Encrypts a given cleartext using an array of public keys, so 
 * multiple recipients are possible. Signs the message using the 
 * sender's private key.
 * <br>
 * @param    cleartext   String          Cleartext to encrypt
 * @param    pubkeys     Array<String>   Array of public key blocks
 * @param    privkey     String          Sender's private key block
 * @param    pass        String          Sender's password
 * @return   object                      Attributes: 
 * 											String message
 * */
this.encryptAndSignMessage = function(cleartext, pubkeys, privkey, pass){
	try{
		var pks = new Array();
		for(var i=0; i<pubkeys.length; i++){
			var pk = pubkeys[i].between("<key>","</key>");
			if(pk != null){
				pks.push(pk);
			}
		}
		var enc = eccCryptoScheme.encryptString(cleartext, pks);
		var ciphertext = enc.ciphertext;
		var keys = enc.enckeys;
		var xmlstr = "<keyheader>";
		xmlstr += "<length>"+keys.length+"</length>";
		for(var j=0; j<keys.length; j++){
			var keyhash = keys[j].pubkey;
			var ciphkey = keys[j].cipherkey;
			var keytag = keys[j].keytag;
			
			xmlstr += "<header id='"+j+"'>"+
					  "<keyhash>"+keyhash+"</keyhash>"+
					 "<ciphkey>"+ciphkey+"</ciphkey>"+
					 "<keytag>"+keytag+"</keytag>"+
					 "</header>";
		}
		xmlstr += "</keyheader>";
		
		var privstr = privkey.between("<key>","</key>");
		privstr = this.symDecrypt(privstr, pass);
		var signed = eccCryptoScheme.signString(cleartext, privstr);
		if(signed==null) return null;
		var sig = signed.signature;
		
		var msg = "<message>"+
					"<type>encrypted,signed</type>"+
					xmlstr+
				  "<text>"+ciphertext+"</text>"+
				  "<signature>"+sig+"</signature>"+
				  "</message>";
		return {"message": msg};
	}catch(e){
		return null;
	}
	
}; //this.encryptAndSignMessage

/**
 * Decrypt a message with the receiver's private key and public key.
 * Verfiy the signature using the sender's public key.
 * <br>
 * @param   message        String   Message block
 * @param   privkey        String   Receiver's private key block
 * @param   pubkey         String   Receiver's public key block
 * @param   pass           String   Receiver's password
 * @param   senderspubkey  String   Sender's public key block
 * @return  object                  Attributes: 
 * 										String cleartext
 * */
this.decryptAndVerifyMessage = function(message, privkey, pubkey, pass, senderspubkey){
	try{
		var pk = eccCryptoScheme.toUtf8(pubkey.between("<key>","</key>"));
		var pkh = CryptoJS.SHA3(pk, { outputLength: 224 });
		pkh = pkh.toString(CryptoJS.enc.Base64);
		var keyheader = message.between("<keyheader>", "</keyheader>");
		var len = keyheader.between("<length>", "</length>");
		len = parseInt(len);
		var keyhash = null; var ciphkey = null; var keytag = null;
		for(var i=0; i<len; i++){
			var header = keyheader.between("<header id='"+i.toString()+"'>", "</header>");
			keyhash = header.between("<keyhash>", "</keyhash>");
			if(keyhash == pkh){
				ciphkey = header.between("<ciphkey>", "</ciphkey>");
				keytag = header.between("<keytag>", "</keytag>");
				break;
			}
		}
		if(keyhash==null || ciphkey==null || keytag==null) return null;
		privkey = privkey.between("<key>", "</key>");
		privkey = this.symDecrypt(privkey, pass);
		
		var ciphertext = message.between("<text>", "</text>");
		
		var dec = eccCryptoScheme.decryptString(ciphertext, ciphkey, keytag, privkey);
		
		if(dec==null) return null;
		
		var vsign = message.between("<signature>", "</signature>");
		var vmsg = dec.cleartext;
		var vpub = senderspubkey.between("<key>","</key>");
		var ver = eccCryptoScheme.verifySignature(vmsg, vsign, vpub);
		var verified = "unverified";
		if(ver!=null) verified = ver.verified;
		
		return {"cleartext" : dec.cleartext, "verified": verified};
	}catch(e){
		return null;
	}
}; //this.decryptAndVerifyMessage

// SYMMETRIC ENCRYPTION

/**
 * Symmetrically encrypt a given cleartext with a password.
 * <br>
 * @param  cleartext String 
 * @param  password  String
 * @return String
 * */
this.symEncrypt = function (cleartext, password) {
	var enc = CryptoJS.AES.encrypt(cleartext, password);
	enc = enc+"";
	return enc;
}; //this.symEncrypt

/**
 * Symmetrically decrypt a given ciphertext with a password.
 * <br>
 * @param   ciphertext  String
 * @param   password    String
 * @return  String
 * */
this.symDecrypt = function (ciphertext, password) {
	var dec = CryptoJS.AES.decrypt(ciphertext, password);
	dec = dec.toString(CryptoJS.enc.Utf8);
	return dec;
}; //this.symDecrypt

/**
 * Improve password creates a base64-string of mostly 64 characters 
 * to annoy crackers without costing too much cpu time. Output is
 * deterministic.
 * <br>
 * @param   password  String     The hopefully not that bad password
 * @return  String
 * */
this.improvePassword = function(password){
	password = CryptoJS.SHA512(password);
	password = password.toString(CryptoJS.enc.Base64);
	password = CryptoJS.SHA3(password, { outputLength: 512 });
	password = password.toString(CryptoJS.enc.Base64);
	if(password.length<63){
		var pass2 = CryptoJS.SHA3(password, { outputLength: 384 });
		pass2 = pass2.toString(CryptoJS.enc.Base64);
		password = password+pass2;
	}
	if(password.length>64) password = password.substr(0, 63);
	return password;
};//this.improvePassword

/**
 * Provide a really simple function to get a SHA3-Hash.
 * <br>
 * @param    str    String   Some string to hash
 * @param    len    Integer  224, 256, 384 or 512, optional
 * @return   String
 * */
 this.hash = function(str, len){
	var length = 512;
	if(! typeof len === 'undefined' ){
		if(len===224 || len===256 || len===384){
			length = len;
		}
	}
	var hashed = CryptoJS.SHA3(str, { outputLength: length });
	hashed = hashed.toString(CryptoJS.enc.Base64);
	return hashed;
 }//this.hash

};//function encryptionScheme()
