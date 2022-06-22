String.prototype.replaceAt = function (i, char) {
    return this.substr(0, i) + char + this.substr(i + char.length);
}

String.prototype.insertAt = function (i, char) {
    return this.substr(0, i) + char + this.substr(i);
}

String.prototype.deleteAt = function (i, l) {
    return this.substr(0, i) + this.substr(i + l);
}

String.prototype.invertirChars = function (i, j) {
    return this.substr(0, i) + this.substr(j,1) + this.substr(i,1) + this.substr(j + 1);
}

String.prototype.replaceArray = function(arrFind, arrReplace) {
  var replaceString = this;
  for (var i = 0; i < arrFind.length; i++) {
    replaceString = replaceString.replace(arrFind[i], arrReplace[i]);
  }
  return replaceString;
};



function isEmpty(map) {
    
   var empty = true;
   for(var key in map) {
      empty = false;
      break;
   }
   return empty;
}



function strToLc(str){
    
    str = str.toLowerCase();
    str = str.replace(/Á/g,"á");
    str = str.replace(/É/g,"é");
    str = str.replace(/Í/g,"í");
    str = str.replace(/Ó/g,"ó");
    str = str.replace(/Ú/g,"ú");
    str = str.replace(/Ü/g,"ü");
    str = str.replace(/Ñ/g,"ñ");
    
    return str;
}


function inArray(elem,arr){
    var esta = false;
    for(var i=0;i<arr.length;i++){
	if(arr[i]==elem){
	    esta=true;
	    break;
	}
    }
    return esta;
}