
	var cipherScript = cipherScriptFunctions;
	cipherScript.init = cipherScriptFunctions.init;
	cipherScript.generateKeypair = cipherScriptFunctions.generateKeypair;
	cipherScript.encryptMessage = cipherScriptFunctions.encryptMessage;
	cipherScript.decryptMessage = cipherScriptFunctions.decryptMessage;
	cipherScript.signMessage = cipherScriptFunctions.signMessage;
	cipherScript.verifyMessage = cipherScriptFunctions.verifyMessage;
	cipherScript.encryptAndSignMessage = cipherScriptFunctions.encryptAndSignMessage;
	cipherScript.decryptAndVerifyMessage = cipherScriptFunctions.decryptAndVerifyMessage;
	cipherScript.symEncrypt = cipherScriptFunctions.symEncrypt;
	cipherScript.symDecrypt = cipherScriptFunctions.symDecrypt;
	cipherScript.improvePassword = cipherScriptFunctions.improvePassword;
	cipherScript.hash = cipherScriptFunctions.hash;
	/*some simple functions from eccCryptoScheme can also be here*/
	cipherScript.randomKeyString = eccCryptoScheme.randomKeyString;
	cipherScript.toBase64 = eccCryptoScheme.toBase64;
	cipherScript.toUtf8 = eccCryptoScheme.toUtf8;
	/*"raw" ecc-functions*/
	cipherScript.ecc = eccCryptoScheme;
	cipherScript.ecc.generateKeypair = eccCryptoScheme.generateKeypair;
	cipherScript.ecc.encryptString = eccCryptoScheme.encryptString;
	cipherScript.ecc.encryptAndSignString = eccCryptoScheme.encryptAndSignString;
	cipherScript.ecc.decryptString = eccCryptoScheme.decryptString;
	cipherScript.ecc.decryptAndVerifyString = eccCryptoScheme.decryptAndVerifyString;
	cipherScript.ecc.signString = eccCryptoScheme.signString;
	cipherScript.ecc.verifySignature = eccCryptoScheme.verifySignature;

