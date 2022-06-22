var abc = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","ñ");

function getLemasJS(respuesta,corr){
    
    respuesta = respuesta.replace(/(\s)+/g," ")
    var frases = respuesta.split(/[.,;:¿?!¡]+/);

    var reAlfanum = /[\w\dáéíóúüñÁÉÍÓÚÜÑ]/;
    if(!reAlfanum.test(frases[frases.length-1])){
	frases.splice(frases.length-1,1);
    }
    var pals = separarPalsFrase(frases);
    var arrFrases = buscarLemas(pals,corr);
    
    //alert(makeString(arrFrases));
    
    return arrFrases;
}


function separarPalsFrase(frases){
    var pals2D = new Array();
    for(var i=0;i<frases.length;i++){
	var pals = frases[i].match(/[\w\dáéíóúüñÁÉÍÓÚÜÑ]+/g);
	pals2D.push(pals);
    }
    return pals2D;
}


function buscarLemas(pals,corr){

    var raices = [];
	
    for(var f=0;f<pals.length;f++){
	
	var raicesFrase = [];
		
	for(var i=0;i<pals[f].length;i++){
	    
	    var pal = pals[f][i];
	    
	    if(pal!=""){
			
		pal = strToLc(pal);
		lemas = consultarJSON(pal);
		
		if(isEmpty(lemas)){ // ---> Palabra no existe AGREGAR AQUÍ LA CORR ORTO
		    if(corr!="off"){
			lemas = getCorrJS(pal);
		    }
		    lemas[pal] = new Array("");
		} else {
		    lemas[pal] = new Array(pal);
		}
    
		raicesFrase.push(lemas);
	    }
	}
	
	raices.push(raicesFrase);
    }
            
    return raices;
}



function consultarJSON(pal){
        
    var lemas = new Object;
    
    for(var lema in jsonMorf) {
	var arr = jsonMorf[lema];
	if(arr.indexOf(pal)!=-1){
	    lemas[lema] = new Array(pal);
	}
    }
    
    var reSuper = /([íi]sim|[ée]rrim)[oa]s?$/;
    var reAdverb = /mente$/;
    var reEnclit = /(la|las|le|les|lo|los|me|nos|os|se|te|mela|melas|mele|meles|melo|melos|nosla|noslas|nosle|nosles|noslo|noslos|osla|oslas|osle|osles|oslo|oslos|osme|osnos|sela|selas|sele|seles|selo|selos|seme|senos|seos|sete|tela|telas|tele|teles|telo|telos|teme|tenos)$/;
    
    if(reSuper.test(pal)){
	pal = pal.replace(/isim/,"ísim");
	pal = pal.replace(/errim/,"érrim");
	for(var lema in jsonSuper) {
	    var arr = jsonSuper[lema];
	    if(arr.indexOf(pal)!=-1){
		lemas[lema] = new Array(pal);
	    }
	}
    } else if(reAdverb.test(pal)){
	for(var lema in jsonAdverb) {
	    var arr = jsonAdverb[lema];
	    if(arr.indexOf(pal)!=-1){
		lemas[lema] = new Array(pal);
	    }
	}
    } else if(reEnclit.test(pal)){
	for(var lema in jsonEnclit) {
	    var arr = jsonEnclit[lema];
	    if(arr.indexOf(pal)!=-1){
		lemas[lema] = new Array(pal);
	    }
	}
    }
    
    return lemas;
}


function getCorrJS(pal){

    var lemas = new Object;
    
    var opciones;
    if(pal.length>3){
	opciones = hacerOperaciones(pal);
    } else {
	opciones = addAcentos(new Array(pal));
    }
    
    for(var o=0;o<opciones.length;o++){
	var str = opciones[o];
	var lemasStr = consultarJSON(str);
	if(!(isEmpty(lemasStr))){
	    for(var lema in lemasStr){
		if(lemas[lema]==null){
		    lemas[lema] = lemasStr[lema];
		} else {
		    lemas[lema] = lemas[lema].concat(lemasStr[lema]);
		}
	    }
	}
    }
        
    return lemas;
}


function hacerOperaciones(pal){
    
    var arr = sustituirLetras(pal);
    arr = arr.concat(agregarLetras(pal));
    arr = arr.concat(eliminarLetras(pal));
    arr = arr.concat(invertirLetras(pal));
    arr = addAcentos(arr);
    
    return arr;
}

function sustituirLetras(pal){
    
    var arr = new Array();
    for(var i=0;i<=pal.length;i++){
	    for(var j=0;j<abc.length;j++){
		    var pal2 = pal.replaceAt(i,abc[j]);
		    arr.push(pal2);
	    }
    }
    return arr;
}

function agregarLetras(pal){
    
    var arr = new Array();
    for(var i=0;i<=pal.length;i++){
	    for(var j=0;j<abc.length;j++){
		    var pal2 = pal.insertAt(i,abc[j]);
		    arr.push(pal2);
	    }
    }
    return arr;
}

function eliminarLetras(pal){
        
    var arr = new Array();
    for(var i=0;i<pal.length;i++){
	var pal2 = pal.deleteAt(i,1);
	arr.push(pal2);
    }
    return arr;
}

function invertirLetras(pal){
        
    var arr = new Array();
    for(var i=0;i<pal.length-1;i++){
	var pal2 = pal.invertirChars(i,i+1);
	arr.push(pal2);
    }
    return arr;
}

function addAcentos(arr){
    
    var arrTot = new Array();
    var str2;
    
    var arr1 = new Array("a","á","e","é","i","í","o","ó","u","u","ú","ú","ü","ü");
    var arr2 = new Array("á","a","é","e","í","i","ó","o","ú","ü","u","ü","ú","u");
    
    for(var p=0;p<arr.length;p++){
	
	var str = arr[p];
	arrTot.push(str);
	
	for(var c=0;c<str.length;c++){
	    
	    for(var v=0;v<arr1.length;v++){
		if(str.charAt(c)==arr1[v]){
		    str2 = str.replaceAt(c,arr2[v]);
		    arrTot.push(str2);
		}
	    }
	}
    }
    
    return arrTot;
}



function makeString(arrFrases){
	
	var strFrases = "";
	
	for(var f=0;f<arrFrases.length;f++){
		var arrPos = arrFrases[f];
		var strPos = "";
		for(var p=0;p<arrPos.length;p++){
			var mapLemas = arrPos[p];
			var strLema = "";
			for(var lema in mapLemas){
				var arrPals = mapLemas[lema];
				var str = lema+"->"+arrPals.join(",");
				if(strLema!=""){
					strLema+="/";
				}
				strLema+=str;
			}
			if(strPos!=""){
				strPos+="//";
			}
			strPos+=strLema;
		}
		if(strFrases!=""){
			strFrases+="///";
		}
		strFrases+=strPos;
	}
	
	return strFrases;
}


