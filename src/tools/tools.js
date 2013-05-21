
/**
 * Checks if a string starts with another.
 * @param  str    String
 * @return String
 * */
if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

/**
 * Trim a given String, i.e. remove multiple whitespace.
 * <br>
 * @return String
 * */
if (typeof String.prototype.trim != 'function') {
	String.prototype.trim = function (){
		//this is where it comes from:
		//http://blog.stevenlevithan.com/archives/faster-trim-javascript
		//it is the trim12.
		//thanks!
		var	str = this.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
		while (ws.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	};
}

/**
 * Returns a string between two strings. Checks for the first 
 * occurence of @param start an the next occurence of @param end
 * after this.
 * <br>
 * @param   start  String
 * @param   end    String
 * @return  String
 * */
if (typeof String.prototype.between != 'function') {
	String.prototype.between = function(start, end){
		var pos1 = this.indexOf(start);
		var used = this.substr(pos1);
		var pos2 = used.indexOf(end);
		pos2 = pos1+pos2;
		if(pos1!=-1 && pos2!=-1){
			pos1 = pos1 + start.length;
			var pos3 = this.length - (this.length-pos2) - pos1;
			return this.substr(pos1, pos3);
		}
		return null;
	};
}
