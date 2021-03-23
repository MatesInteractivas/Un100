var dialogo;
var definiciones;
var inicio = true;
var tit;
var xmlhttpTts;
var canReceiveMsg = true;
var hayDef = false;
var nodo;
var nodoMultResp;
var statusKey;
var respuesta = "";
var strLemas;
var hTot = 0;

var arrLemas;
var huboNeg = false;
var huboNegado = false;
var arrPosNeg = new Array();

var numResp = 0;
var serverOK = true;
var mm;
var mm_frente;
var micromundos;
var bestResp = false;
var d = 45;
var playAudio = false;
var tts = false;
var browser;
var esAndroid = false;
var myAudio;
var arrAudios;
var hayAudio = false;
var durAudios;
var enRetro = false;
var audioPlaying = false;
var ls;
var activarDialogoAlCerrar = false;

var reconstruyendo = false;
var respuestas;
var nRec = -1;

var obj_mm_frente = new Object;
var fctrWChat;
var nResp;

//var host = "http://localhost:8888/LITE/php_conTxt/";
var host = "http://localhost:8888/LITE/php/";
//var host = "http://dialogos.amite.mx/php/";
//var host = "http://arquimedes.matem.unam.mx/DescartesHTML5/servicioDialogo/RADIAL/php/";
//var host = "http://arquimedes.matem.unam.mx/DescartesHTML5/servicioDialogo/RADIAL/DGTic/php/";


function iniciar(){
    checkBrowser();
    readDialogo();
    pruebaServidor();
}

function checkBrowser(){
    
    var reBrowser = /(Chrome|Firefox|Opera|MSIE)/gi;  //Safari no se puede usar porque aparece en userAgent de chrome también
    var arr = navigator.userAgent.match(reBrowser);
    if(arr!=null && arr.length>0){
	browser = arr[0];
    } else {
	browser = "Safari";
    }
    
    var reAndroid = /android/i;
    if(reAndroid.test(navigator.userAgent)){
	esAndroid = true;
	if(browser!="Firefox"){
	    setScroll();
	}
    }
}


function readDialogo(){

    fctrWChat = parseFloat($("#contenedor").width()/$("#td_chat").width());    
    if(dialogo.autoresize){
        toFullWindow();
    } 
    
    if(dialogo.delay!=undefined && dialogo.delay!=0){
	d = dialogo.delay;
    }
    
    if(dialogo.withoutServer){
	serverOK = false;
    }
    
    setMicromundos();
    tit = dialogo.title;

    if(dialogo.withAudio){
	
	playAudio = true;
	
	if(dialogo.tts){
	    	    	      
	    var reDevice = /(iPhone|iPad)/i;
	    if(reDevice.test(navigator.userAgent)){
		playAudio=false;
		pruebaLocalStorage();
	    } else {
		if(browser=='Firefox' || browser=='Opera'){
		    playAudio=false;
		    pruebaLocalStorage();
		    if(serverOK){
			alert("Para llevar a cabo este diálogo con audio, ábrelo en los navegadores Chrome, Safari o Internet Explorer.");
		    }
		} else {
		    var reHTTP = /^http/;
		    if(reHTTP.test(location.protocol)){
			if(confirm("Este diálogo se puede llevar a cabo con audio. ¿Quieres escuchar los audios?")){
			    tts = true;
			    pruebaLocalStorage();
			} else {
			    playAudio = false;
			    pruebaLocalStorage();
			}
		    } else {
			playAudio = false;
			pruebaLocalStorage();
		    }
		}
	    }
	} else {
	    pruebaLocalStorage();
	}
    } else {
	pruebaLocalStorage();
    }    
}


function setMicromundos(){
    
    micromundos = new Array();
    for(var i=0;i<dialogo.microWorlds.length;i++){
	var miMm = new Micromundo(dialogo.microWorlds[i]);
	micromundos.push(miMm);
    }
}



///////CONFIG VENTANAS DEFINICIONES

function define(termino){
    
    //Ejemplo: Este principio lo exploramos en el diálogo sobre la <a href='#' onclick='define(\"Primera ley de la termodinámica\")'>primera ley de la termodinámica</a>
    
    hayDef = true;
    
    for(var i=0;i<definiciones.length;i++){
	if(definiciones[i].trm.toLowerCase() == termino.toLowerCase()){
	    var def = definiciones[i].def;
	    break;
	}
    }
    
    var ventana = document.createElement("div");
    ventana.setAttribute("id","def_"+termino);
    document.getElementById("contenedor").appendChild(ventana);

    var tabla = document.createElement("table");
    ventana.appendChild(tabla);
    tabla.setAttribute("class","ventana_definicion");
    tabla.style.position = "absolute";
    tabla.style.left = ($('#contenedor').width()-$('.ventana_definicion').width())/2+"px";
    tabla.style.top = ($('#contenedor').height()-$('.ventana_definicion').width())/2+"px";
    
    var row1 = document.createElement("tr");
    tabla.appendChild(row1);
    row1.style.width = "100%";
    row1.style.height = "15%";
    
    var cell1 = document.createElement("td");
    cell1.style.width = "95%";
    row1.appendChild(cell1);
    var tit = document.createElement("p");
    tit.innerHTML = "<b>"+termino+"</b>";
    cell1.appendChild(tit);    
    
    var cell2 = document.createElement("td");
    row1.appendChild(cell2);
    var bt = document.createElement("input");
    bt.setAttribute("type","button");
    bt.setAttribute("value","X");
    bt.setAttribute("id","cerrar_"+termino);
    bt.setAttribute("onclick","cerrarDef(event)");
    cell2.appendChild(bt);
    
    var row2 = document.createElement("tr");
    tabla.appendChild(row2);
    row2.style.width = "100%";
    row2.style.height = "85%";
    
    var cell3 = document.createElement("td");
    cell3.colSpan = "2";
    row2.appendChild(cell3);
    var pDef = document.createElement("p");
    pDef.innerHTML = def;
    cell3.appendChild(pDef);
}

function cerrarDef(evt){
    var termino = evt.target.id.split("_")[1];
    document.getElementById("contenedor").removeChild(document.getElementById("def_"+termino));
    hayDef = false;
}



function pruebaServidor(){
        
    if(serverOK){
	var xmlhttpTest=GetXmlHttpObject();
	if (xmlhttpTest==null){
	    serverOK = false;
	    //alert ("Your browser does not support XMLHTTP!");
	    return;
	}
	var url = host+"compararExprConTexto.php";
	var params = "e=(AFIR)&o=sipi&l=sipi->&c=auto";
	xmlhttpTest.onreadystatechange=function () {
	    if(xmlhttpTest.readyState==4){
		if(xmlhttpTest.status !== 200){
		    serverOK=false;
		    alert("No hay conexión con el servidor; se trabajará en modo off-line, por lo que estará limitada la corrección ortográfica.");
		}
	    }
	};
	xmlhttpTest.open("POST",url,true);
	xmlhttpTest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttpTest.send(params);
    }
}


function pruebaLocalStorage(){
    
    if(typeof(Storage)!=="undefined"){
	ls = true;
	if(localStorage.getItem("respuestas"+tit) && localStorage.getItem("respuestas"+tit)!=""){  
	    var recDial = confirm("En la sesión anterior no terminaste el diálogo. ¿Quieres retomarlo donde te quedaste?");
	    if(recDial){
		reconstruyendo = true;
		respuestas = localStorage.getItem("respuestas"+tit).split("|");
		crearLoader();
		primeraPregunta();
		reconstruir();
	    } else {
		localStorage.setItem("respuestas"+tit,"");
		primeraPregunta();
	    }
	} else {
	    primeraPregunta();
	}
    } else {
	ls = false;
	primeraPregunta();
    }
}


function primeraPregunta(){
    
    //Cambiado 9 dic 2013
    
    document.getElementById("chat_globos").innerHTML = "";
    document.getElementById('input').disabled = "";
    var fq = dialogo.firstQuestion;
    var nodoNum = -1;
    for(var i=0;i<dialogo.questions.length;i++){
	if(dialogo.questions[i].id==fq){
	    nodoNum = i;
	    break;
	}
    }
    
    if(nodoNum==-1){
	setNodo(0);
    } else {
	setNodo(nodoNum);
    }
    
    nuevoTexto(convertString(nodo.getTxt()),0);
    if(!reconstruyendo){
	checkAudio(nodo.obj.audio,nodo.getTxt());
	setTimeout(function(){
	    if(hayAudio==false){
		checkMicromundo(nodo.obj,quitarEtiquetas(nodo.getTxt()).length*d);
	    } else {
		crearBtApagarAudio();
		checkMicromundo(nodo.obj,durAudios);
	    }    	
	},500);
    } else {
	checkMicromundo(nodo.obj,1);
    }
}

function crearBtApagarAudio(){

    var divBt = document.createElement("div");
    divBt.setAttribute("id","bt_apagar_audio");
    divBt.setAttribute("style","position:absolute; overflow:hidden; ");
    document.getElementById('contenedor').appendChild(divBt);
    var obj = window.getComputedStyle(divBt);
    var srcImg = obj.getPropertyValue("background-image");
    if(srcImg=="none"){
	divBt.innerHTML = "<a id='ligaApagarAudio' href='#' onclick='switchAudio(\"ligaApagarAudio\")'>Apagar audio</a>";
    } else {
	var img = document.createElement("img");
	srcImg = srcImg.replace(/\"/g,"");
	img.id = srcImg.substring(4,srcImg.length-1);
	var srcApagar = img.id.replace(/\.png$/,"_apagar.png");
	srcApagar = srcApagar.replace(/\.jpg$/,"_apagar.jpg");
	img.src = srcApagar;
	img.style.cursor = "pointer";
	img.addEventListener("click",function(){
	    switchAudio(img.id);
	},false);
	divBt.style.backgroundImage = "none";
	divBt.appendChild(img);
    }
}

function switchAudio(id){
    
    var trgt = document.getElementById(id);
    if(id=="ligaApagarAudio"){
	if(trgt.innerHTML == "Apagar audio"){
	    myAudio.pause();
	    playAudio=false;
	    audioPlaying=false
	    trgt.innerHTML = "Activar audio";
	} else {
	    playAudio=true;
	    trgt.innerHTML = "Apagar audio";
	}
    } else { //Bt es imagen
	if(trgt.src == id){ // imagen prender audio
	    playAudio=true;
	    var srcApagar = id.replace(/\.png$/,"_apagar.png");
	    srcApagar = srcApagar.replace(/\.jpg$/,"_apagar.jpg");
	    trgt.src = srcApagar;
	} else {
	    myAudio.pause();
	    playAudio=false;
	    audioPlaying=false
	    trgt.src = id;
	}
    }
}

function convertString(str){
    
    //Sirve para insertar la respuesta del alumno en el feedback del tutor
    str = str.replace("##",respuesta);
    
    //Por el editor de textos que agrega <p></p> a inicio y final de los textos del tutor.
    str = str.replace(/<p>&nbsp;<\/p>/g,"");
    str = str.replace(/<p>/g,"");
    str = str.replace(/<\/p>$/,"");
    str = str.replace(/<\/p>/g,"<br><br>");
        
    return str;
}

function mouseDown(evt){
    if(inicio){
 	inicio=false;
	document.getElementById('input').value = "";
    }
}

function keypressed(evt){
    
    var intKey = (evt.keyCode)? evt.keyCode: evt.charCode;
    if(intKey=='13'){
	document.getElementById('input').value = document.getElementById('input').value.replace("\n", "");
	if(validInput(document.getElementById('input').value)){
	    if(enRetro==false && audioPlaying==false){
		if(canReceiveMsg==false){
		    canReceiveMsg = true;
		    resetMicromundo();
		}
		respuesta = document.getElementById('input').value;
		procesarRespuesta();
	    } else {
		alert("Lee y/o escucha el mensaje del tutor antes de contestar.");
	    }
	} else {
	    alert("Escribe una respuesta válida y pulsa ENTER.");
	}
    } 
}


function validInput(str){
    
    var match = false;
    
    //Checar si es una sola letra (por eje. nombre de una variable) o bien un número
    //var re = /(^[a-z]$|^[a-z][\s,\.;:!\?]|\s[a-z]$|\s[a-z][\s,\.;:!\?]|^[\d]+$|^[\d]+[\s,\.;:!\?]|\s[\d]+$|\s[\d]+[\s,\.;:!\?])/;
    var re = /[a-z\d]/i;
    if(re.test(str)){
	match = true;
    }
    
    /*
    //Checar si hay una sílaba válida al inicio o final de alguna palabra --> Causa problemas con expresiones matemáticas, fórmulas etc.
    if(match==false){
	for(var i=0;i<silabasEsp.length;i++){
	    var sil = silabasEsp[i];
	    if(sil.length>1){
		var re1 = new RegExp("^"+sil,"");
		var re2 = new RegExp("([\s¡¿,\.;]"+sil+"|"+sil+"[\s\.,;!\?:])","");
		var re3 = new RegExp(sil+"$","");
		if(re1.test(str) || re2.test(str) || re3.test(str)){
		    match = true;
		    break;
		}
	    }
	}
    }
    */
    
    return match;
}


function procesarRespuesta(){
    
    document.getElementById('input').value="";
    enRetro = true;
    nResp++;
    statusKey += "_resp"+nResp;
    nuevoTexto(respuesta,1);
    numResp=0;
    checkClaves();
}


function setNodo(numPreg){
    
    bestResp=false;
    nResp=0;
    
    nodo = new Nodo(numPreg);
    
     if(!(nodo.obj.nrRequiredResponses==undefined || nodo.obj.nrRequiredResponses==1)){
	if(nodoMultResp!=null && nodo.getIdPreg() == nodoMultResp.getIdPreg()){
	    nodo = nodoMultResp;
	} else {
	    nodo.multResp = true;
	    nodoMultResp = nodo;
	}
     }
    
    statusKey = "preg"+numPreg;
    setValorMicromundo("nPJS:"+nodo.getIdPreg());
    checkFinal(nodo.obj);
}

function checkFinal(obj){
    
    if(obj.endDialogue){
	document.getElementById('input').disabled = "disabled";
	document.getElementById('input').style.backgroundColor = "#eeeeee";
	//Sólo para plantilla DGTic
	if(window.parent.document.getElementById("ligaCierre")!=null){
	    window.parent.document.getElementById("ligaCierre").style.display = "block";
	}
	//Final sólo DGTic
	if(ls){
	    localStorage.setItem("respuestas"+tit,"");
	}
    }
}

function nuevoTexto(txt,intLctr){
    
    if(txt!=""){
	crearDiv(txt,intLctr);
	if(intLctr==1 && reconstruyendo==false){
	    addToLs();
	}
    }
}

function crearDiv(txt,intLctr){
    
    var newdiv = document.createElement("div");
    newdiv.setAttribute("id",statusKey);
    document.getElementById("chat_globos").appendChild(newdiv);
    
    var par = document.createElement("p");
    par.innerHTML = txt;
    
    if(intLctr==0){
	newdiv.setAttribute("class","globo_avatar");
	par.setAttribute("class","txt_avatar");
    } else {
	newdiv.setAttribute("class","globo_usuario");	
	par.setAttribute("class","txt_usuario");		
    }
        
    if(dialogo.styleBalloons!="img"){
	
	newdiv.appendChild(par);
	
    } else {
    
	var pos_ver = new Array("top","middle","bottom");  
	var pos_hor = new Array("left","center","right");
	
	var tabla = document.createElement("table");
	tabla.style.borderCollapse = "collapse";
	newdiv.appendChild(tabla);
	
	for(var r=0;r<3;r++){
	    var row = tabla.insertRow(r);
	    for(var c=0;c<3;c++){
		var cell = row.insertCell(c);
		cell.id = statusKey+"_c_"+r+"_"+c;
		if(c==1){
		    cell.name = "cellCenter";
		}
		var img;
		if(intLctr==0){
		    img = "globoTutor_";
		} else {
		    img = "globoUsuario_";			
		}
		cell.style.backgroundImage = "url('img/"+img+pos_ver[r]+"_"+pos_hor[c]+".png')";
		cell.style.backgroundSize = "100% 100%";
		if(r==1 && c==1){
		    cell.style.backgroundRepeat = "repeat";
		    cell.appendChild(par);
		} else {
		    if(r!=1 && c!=1){
			cell.className = "esquinaGlobo";
			cell.style.backgroundRepeat = "no-repeat";
		    } else {
			if(r==1){
			    cell.style.backgroundRepeat = "repeat-y";
			    cell.style.width = $("#"+statusKey+"_c_0_0").width()+"px";
			} else if(c==1){
			    cell.style.backgroundRepeat = "repeat-x";
			    cell.style.height = $("#"+statusKey+"_c_0_0").height()+"px";
			    cell.style.width = $("#"+statusKey).width()-($("#"+statusKey+"_c_0_0").width()*2)+"px";
			}
		    }
		}
	    }
	}
    }

    var estilo = window.getComputedStyle(newdiv);
    var margin = parseInt(estilo.getPropertyValue("margin-bottom").replace(/[^\d]+/g,""));
    actualizarScroll($("#"+statusKey).height()+margin);

}


function actualizarScroll(h){
    
    hTot += h;

    if(esAndroid && browser!="Firefox"){
	updateScroll();
    } else {
	document.getElementById('chat_globos').style.overflow = 'hidden';
	document.getElementById('chat_globos').scrollTop = hTot;
	document.getElementById('chat_globos').style.overflow = 'auto';
    }
    
}


function checkClaves(){

    var delay;
    if(reconstruyendo){
	delay = 1;
    } else {
	if(serverOK){
	    delay = 300;
	} else {
	    delay = 800;
	}
    }
    
    setTimeout(function(){
	
	var hayClaveRADial = false;
	for(var i=0;i<nodo.nodosResp.length;i++){
	    if(!(claveVacia("RADial",i))){
		hayClaveRADial = true;
		break;
	    }
	}
	
	if(hayClaveRADial){
	    getLemas();
	} else {
	    evaluarRespuesta();
	}
	
    },delay);
}


function getLemas(){
        
    if(serverOK){
	
	var req = GetXmlHttpObject();
	if (req==null){
		alert ("Your browser does not support XMLHTTP!");
		return;
	}
	req.onreadystatechange=function () {
		if(req.readyState==4){
		    strLemas = req.responseText;
		    evaluarRespuesta();
		} 
	};
	var url = host+"getLemas.php";
	var params = "o="+encodeURI(respuesta)+"&c="+dialogo.spellcheck;
	req.open("POST", url, true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.send(params);
    } else {
	arrLemas = getLemasJS(respuesta,dialogo.spellcheck);
	evaluarRespuesta();
    }
}


function evaluarRespuesta(){
        
    if(claveVacia("RADial",numResp) && claveVacia("Descartes",numResp) && claveVacia("regex",numResp)){
	hayMatch();
    } else {
	if(claveVacia("RADial",numResp)==false){
	    evalRADial(nodo.nodosResp[numResp].RADialKey);
	} else {
	   if(claveVacia("Descartes",numResp)==false){
		evalDescartes(nodo.nodosResp[numResp].DescartesKey);
	   } else if(claveVacia("regex",numResp)==false){
		aplicarRegExp(nodo.nodosResp[numResp].regexKey);
	   }
	}
    }
}


function claveVacia(tipo,n){
    if(nodo.nodosResp[n][tipo+"Key"] == "" || nodo.nodosResp[n][tipo+"Key"] == undefined){
	return true;
    } else {
	return false;
    }
}


function evalDescartes(clave){
   
    var match;
    var reNr = /\d/;
    
    if(reNr.test(clave) && reNr.test(respuesta)){
	
	var arrNrs = respuesta.match(/([\d]+[\.]?[\d]*)/);
	var nr = parseFloat(arrNrs[0]);
	match = descartesJS.escorrecto(clave,nr);
	
    } else {
	
	var reAND = new RegExp("AND","g");
	var reOR = new RegExp("OR","g");
	clave = clave.replace(reAND,"&");
	clave = clave.replace(reOR,"|");
	
	if(dialogo.spellcheck=="off"){
	    match = descartesJS.esCorrecto(clave,respuesta);
	} else {
	    match = descartesJS.escorrecto(clave,respuesta);
	}
    }
        
    if(match==1){
	hayMatch();
    } else {
	noMatch();
    }
}


function evalRADial(clave){
    
    if(serverOK){
	
	var req = GetXmlHttpObject();
	if (req==null){
		alert ("Your browser does not support XMLHTTP!");
		return;
	}
	
	req.onreadystatechange=function () {
	    if(req.readyState == 4){
		var arr = req.responseText.split("|");
		if(arr[0]=="true"){
			hayMatch();
		} else {
			noMatch();
		}
	    } 
	};
    
	var url = host+"compararExprConTexto.php";
	var params = "e="+encodeURI(clave)+"&o="+encodeURI(respuesta)+"&c="+dialogo.spellcheck+"&l="+encodeURI(strLemas);
	req.open("POST", url, true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.send(params);
	
    } else {
		
	var nodo1 = crearArbol(clave);
	if(nodo1!=null){
	    if(nodo1.analizar(1)){
		hayMatch();
	    } else {
		if(huboNeg && huboNegado){
		    var match = nodo1.analizar(2);
		    huboNeg = false;
		    huboNegado = false;
		    arrPosNeg = new Array();
		    if(match){
			hayMatch();
		    } else {
			noMatch();
		    }
		} else {
		    noMatch();
		}
	    }
	} else { //Error en expr. RADial
	    var cl;
	    if(clave.length>20){
		cl = clave.substring(0,20)+"...";
	    } else {
		cl = clave;
	    }
	    var seguir = confirm("Hay un error en la clave "+cl+". ¿Quieres saltar esta clave y seguir con el diálogo?");
	    if(seguir){
		noMatch();
	    }
	}
    }
}



function GetXmlHttpObject() {
	
	if (window.XMLHttpRequest){
	  	// code for IE7+, Firefox, Chrome, Opera, Safari
	  	return new XMLHttpRequest();
	}
	if (window.ActiveXObject){
		// code for IE6, IE5
	 	return new ActiveXObject("Microsoft.XMLHTTP");
	}
	return null;	
}


function aplicarRegExp(clave){
	
	//var re = new RegExp(clave,"i");
	
	var re1 = new RegExp("[\\s¡¿]"+clave+"[\\s\\.,;\\?\\!]","i");
	var re2 = new RegExp("^"+clave+"[\\s\\.,;\\?\\!]","i");
	var re3 = new RegExp("[\\s¡¿]"+clave+"$","i");
	var re4 = new RegExp("^"+clave+"$","i");
	
	if(re1.test(respuesta) || re2.test(respuesta) || re3.test(respuesta) || re4.test(respuesta)){
		hayMatch();	
	} else {
		noMatch();
	}
}


function noMatch(){
    if(nodo.nodosResp.length>numResp+1){
	    numResp++;
	    evaluarRespuesta();
    } else {
	    mostrarBestResps();
	    enRetro = false;
	    if(reconstruyendo){
		reconstruir();
	    }
    }
}


function hayMatch(){
	
    statusKey = "preg"+nodo.numPreg+"_retro"+numResp;
    nuevoTexto(convertString(nodo.nodosResp[numResp].feedback),0);
    setValorMicromundo("nRJS:"+nodo.nodosResp[numResp].id);

    if(reconstruyendo){
	checkMicromundo(nodo.nodosResp[numResp],1);
	afterRetro();
    } else {
	var delay;
	checkAudio(nodo.nodosResp[numResp].audio,convertString(nodo.nodosResp[numResp].feedback));
	checkFinal(nodo.nodosResp[numResp]);
	setTimeout(function(){
	    if(hayAudio){
		delay = durAudios;
	    } else {
		delay = quitarEtiquetas(nodo.nodosResp[numResp].feedback).length*d/2;
	    }
	    checkMicromundo(nodo.nodosResp[numResp],delay);
	    setTimeout(function(){
		afterRetro();
	    },delay);
	},500);
    }
    
}

function afterRetro(){
    
    if(hayDef==false){
	   
	if(nodo.multResp){
	    if(nodo.nodosResp[numResp].weight!=undefined){
		nodo.respCorrs += nodo.nodosResp[numResp].weight;
	    }
	}
        
	var idProxPreg = nodo.nodosResp[numResp].nextQuestion;
	if(idProxPreg!="" && idProxPreg!=undefined && idProxPreg!=nodo.getIdPreg()){
	    nodo.nodosResp.splice(numResp,1); //por si hay multResp y se regresa posteriormente a ese nodo
	    setNextPreg(idProxPreg);
	} else {
	    if(nodo.multResp){
		if(nodo.respReq == nodo.respCorrs){
		    setNextPreg(nodo.obj.nextQuestion);
		    nodoMultResp = null;
		} else {
		    nodo.nodosResp.splice(numResp,1);
		    if(nodo.nodosResp[numResp].weight!=0 && nodo.nodosResp[numResp].weight!=undefined){
			nuevoTexto(convertString(nodo.obj.prompt),0);
		    } else {
			if(bestResp){
			    mostrarBestResps();
			}
		    }
		}
	    } else {
		nodo.nodosResp.splice(numResp,1);
		if(bestResp){
		    mostrarBestResps();
		}
	    }
	}
	
	enRetro = false;
	if(reconstruyendo){
	    reconstruir();
	}
    
    } else {
	
	setTimeout(function(){
	    afterRetro();
	},1000);
	
    }
}

function setNextPreg(idProxPreg){
    
    var nodoNum = -1;
    for(var i=0;i<dialogo.questions.length;i++){
	if(dialogo.questions[i].id==idProxPreg){
	    nodoNum = i;
	    break;
	}
    }
    
    if(nodoNum==-1){
	
	alert("ID de siguiente pregunta inexistente.");
	//localStorage.setItem("respuestas"+tit,"");
	
    } else {
	
	//Por si ti estaba desactivado por mm con deactivateChat=true
	document.getElementById('input').disabled = "";
	
	setNodo(nodoNum);
	
	//checar si no es regreso a un nodo con mult resp
	if(nodo == nodoMultResp){
	    if(nodo.respReq == nodo.respCorrs){
		setNextPreg(nodo.obj.nextQuestion);
		nodoMultResp = null;
	    } else {
		nuevoTexto(convertString(nodo.obj.prompt),0);
		checkMMPreg();
	    }
	} else {
	    nuevoTexto(convertString(nodo.getTxt()),0);
	    checkMMPreg();
	}
    }
}

function checkMMPreg(){
    
    if(reconstruyendo){
	checkMicromundo(nodo.obj,1);
    } else {
	checkAudio(nodo.obj.audio,quitarEtiquetas(nodo.getTxt()));
	setTimeout(function(){
	    if(hayAudio){
		checkMicromundo(nodo.obj,durAudios);
	    } else {
		checkMicromundo(nodo.obj,quitarEtiquetas(nodo.getTxt()).length*d);
	    }
	},500);
    }
}


function mostrarBestResps(){
    
    var arr = new Array();
    for(var i=0;i<nodo.nodosResp.length;i++){
	if(nodo.nodosResp[i].bestAnswer!="" && nodo.nodosResp[i].bestAnswer!=undefined){
	    arr.push(nodo.nodosResp[i].bestAnswer);
	}
    }

    bestResp=true;
    statusKey = "preg"+nodo.numPreg+"_"+arr.length+"bestResps";
    if(document.getElementById(statusKey)!=null){ //Por si se vuelve a repetir con la misma cantidad de opciones (por ej. porque el usuario no eligió de la lista)
	for(var j=1;j<10;j++){
	    statusKey += "_";
	    if(document.getElementById(statusKey)==null){
		nuevoTexto("Por favor elige una de las siguientes opciones:",0);
		break;
	    }
	}
    } else {
	nuevoTexto("Elige entre las siguientes opciones:",0);
    }
    
    if(reconstruyendo==false){
	checkAudio("bestResp","Elige entre las siguientes opciones:");
    }
    agregarOpciones(arr);
}

function agregarOpciones(arr){
    
    var hIni = $("#"+statusKey).height();
    var divOpciones = document.createElement('div');
    for(var i=0;i<arr.length;i++){
	    var form = document.createElement('form');
	    form.setAttribute("class","opcMult");
	    divOpciones.appendChild(form);
	    var tabla = document.createElement('table');
	    var row = tabla.insertRow(0);
	    var cel1 = row.insertCell(0);
	    var cel2 = row.insertCell(1);
	    form.appendChild(tabla);
	    var radioBt = document.createElement('input');
	    radioBt.setAttribute("type","radio");
	    radioBt.setAttribute("name","rb_"+statusKey);
	    radioBt.setAttribute("value",arr[i]);
	    radioBt.setAttribute("id",statusKey+"_"+arr[i]);
	    radioBt.setAttribute("onclick","rbClicked(event)");
	    radioBt.style.cursor = "pointer";
	    cel1.appendChild(radioBt);
	    var label = document.createElement("label");
	    label.innerHTML = arr[i];
	    label.setAttribute("for",statusKey+"_"+arr[i]);
	    label.style.cursor = "pointer";
	    cel2.appendChild(label);
    }
    if(dialogo.styleBalloons=="img"){
	divOpciones.style.marginTop = "20px";
	document.getElementById(statusKey+"_c_1_1").appendChild(divOpciones);
    } else {
	document.getElementById(statusKey).appendChild(divOpciones);
    }
    actualizarScroll($("#"+statusKey).height()-hIni);
}


function rbClicked(evt){
    
    var rbs = document.getElementsByName("rb_"+statusKey);
    for(var i=0;i<rbs.length;i++){
	rbs[i].disabled = true;
    }
    document.getElementsByName("rb_"+statusKey).disabled = true;
    respuesta = evt.target.value;
    if(enRetro){
	document.getElementById('input').value=respuesta;
	alert("Primero lee bien el mensaje del tutor, luego pulsa ENTER para confirmar tu respuesta.");
    } else {
	procesarRespuesta();
    }
}


function checkMicromundo(obj,delay){
        
    //Orden: hide, display, set
    
    if(obj.hide!=undefined && obj.hide!=""){
	hideMicromundo();
    }
    
    if(obj.display!=undefined && obj.display!=""){
	var id = obj.display;
	if(document.getElementById(id)!=null){
	    var mm1 = getMm(id);
	    var mm2 = new Micromundo(mm1.obj);
	    for(var i=0;i<10;i++){
		if(document.getElementById(id+"_"+i)==null){
		    id = id+"_"+i;
		    mm2.id = id;
		    break;
		}
	    }
	    micromundos.push(mm2);
	}   
	showMicromundo(id,delay);
	
	if(obj.set!=undefined && obj.set!=""){
	    var iframe = document.getElementById("iframe_"+mm.id);
	    iframe.addEventListener("load",function(){
		setValorMicromundo(obj.set);
	    },true);
	}
    } else {
	if(obj.set!=undefined && obj.set!=""){
	    setValorMicromundo(obj.set);
	}
    }
    
}


function showMicroWorld(id){
    
    //Desde link dentro de texto, ¡siempre al frente:true!
    //Ejemplo: text: "¿Te parece factible que el <a href='#' onclick='showMicroWorld(\"universo\")'>Universo</a> se quede sin energía?",
    
    if(obj_mm_frente[id]==null){
	mm_frente = getMm(id);
	crear_ventana_mm();
	display_ventana_mm(id);
	canReceiveMsg = false;
	activarDialogoAlCerrar = true;
    } else {
	revisitMicromundo(id);
    }
}

function showMicromundo(id,delay){

    hideAllMms();

    var miMm = getMm(id);
    //agregar statusKey al micromundo
    miMm.statusKeys.push(statusKey);
    
    if(miMm.alFrente==false){
	hideMicromundo();
	mm=miMm;
	crearMicromundo(mm);
    } else {
	mm_frente=miMm;
	if(mm_frente.auto && !reconstruyendo){
	    agregarBtGlobo(false);
	    crear_ventana_mm();
	    setTimeout(function(){
		display_ventana_mm(id);
		document.getElementById("liga_"+mm_frente.id).setAttribute("style","display:block; ")
	    },delay);
	} else {
	    agregarBtGlobo(true);
	    crear_ventana_mm();
	}
    }
    
    if(miMm.chatOff){
	document.getElementById('input').disabled = "disabled";
    }
}


function crearMicromundo(miMm){

    var div_mm = document.createElement("div");
    div_mm.setAttribute("id",miMm.id);
    div_mm.setAttribute("name","div_mm");
    div_mm.setAttribute("style","position:relative; width:100%; height:100%; align:center; overflow:hidden; ");
    var reHTTP = /^http/;
    if(reHTTP.test(miMm.url)){
	div_mm.innerHTML = "<iframe id='iframe_"+miMm.id+"' class='micromundo' src=\'"+miMm.url+"?version="+Math.random()+"' align='middle' marginheight='0px' marginwidth='0px' style='overflow:hidden;'></iframe>";
    } else {
	div_mm.innerHTML = "<iframe id='iframe_"+miMm.id+"' class='micromundo' src=\'micromundos/"+miMm.url+"?version="+Math.random()+"' align='middle' marginheight='0px' marginwidth='0px' style='overflow:hidden;'></iframe>";
    }
    document.getElementById('micromundo').appendChild(div_mm);
    
    if(miMm.getW()!=-1){
	var iframe = document.getElementById("iframe_"+miMm.id);
	iframe.style.width = miMm.getW()+"px";
	iframe.style.height = miMm.getH()+"px";
	posicionarMm(miMm.id);
    }
}

function revisitMicromundo(id){
    
    var miMM = getMm(id);
    
    if(!miMM.alFrente){
	canReceiveMsg=false;
	hideAllMms();
	if(miMM.reset){
	    crearMicromundo(miMM);
	} else {
	    document.getElementById(id).setAttribute("style","display:block; ");
	    posicionarMm(id);
	}
	if(document.getElementById(id).childNodes.length==1){
	    agregarBtCerrar(id);
	    posicionar_btCerrar_mm(id);
	}
	
	//Para diálogo termodinamica3 de DGTic
	var re = /etapa[\d]_anim/;
	if(re.test(id)){
	    var iframe = document.getElementById("iframe_"+id);
	    iframe.contentWindow.reiniciarVideo();                            
	}
	//Final para diálogo termodinamica3 de DGTic
	
    } else {
	mm_frente = miMM;
	if(document.getElementById(id)==null){
	    display_ventana_mm(id);
	}
	document.getElementById(id).setAttribute("style","display: block; ");
	if(inArray(statusKey,mm_frente.statusKeys)==false && canReceiveMsg){
	    canReceiveMsg=false;
	    activarDialogoAlCerrar = true;
	} else {
	    activarDialogoAlCerrar = false;
	}
    }
}


function hideAllMms(){
    var divs = document.getElementsByName("div_mm");
    for(var i=0;i<divs.length;i++){
	var miMM = getMm(divs[i].id);
	if(miMM.reset){
	    //Para diálogo termodinamica3 de DGTic
	    var re = /etapa[\d]_anim/;
	    if(re.test(divs[i].id)){
		var iframe = document.getElementById("iframe_"+divs[i].id);
		//iframe.contentWindow.player.stop();
		//alert(iframe.contentWindow.$("#jquery_jplayer_1"));
		iframe.contentWindow.$("#jquery_jplayer_1").jPlayer("destroy");
	    }
	    //Final diálogo termodinamica3
	    document.getElementById('micromundo').removeChild(divs[i]);
	} else {
	    divs[i].setAttribute("style","display:none; ");
	}
    }
}


function resetMicromundo(){
    hideAllMms();
    if(mm!=null){
	if(mm.reset){
	    crearMicromundo(mm);
	    //Para diálogo termodinamica3 de DGTic
	    var re = /etapa[\d]_anim/;
	    if(re.test(mm.id)){
		var iframe = document.getElementById("iframe_"+mm.id);
		iframe.contentWindow.reiniciarVideo();
	    }
	    //Final para diálogo termodinamica3 de DGTic
	} else {
	    document.getElementById(mm.id).setAttribute("style","display:block; ");
	    posicionarMm(mm.id);
	}
    }
}

function crear_ventana_mm(){
    
    var div_mm_frente = document.createElement("div");
    div_mm_frente.setAttribute("id",mm_frente.id);
    div_mm_frente.setAttribute("name","div_mm_frente");
    var div_mm_frente_int = document.createElement("div");
    div_mm_frente_int.setAttribute("class","ventana_mm_frente");
    div_mm_frente.appendChild(div_mm_frente_int);
    div_mm_frente_int.setAttribute("id","div_mm_frente_int_"+mm_frente.id);
    var reHTTP = /^http/;
    if(reHTTP.test(mm_frente.url)){
	div_mm_frente_int.innerHTML = "<iframe id='iframe_frente_"+mm_frente.id+"' class='micromundo' src=\'"+mm_frente.url+"?version="+Math.random()+"' align='middle' marginheight='0px' marginwidth='0px' style='overflow:hidden;'></iframe>";
    } else {
	div_mm_frente_int.innerHTML = "<iframe id='iframe_frente_"+mm_frente.id+"' class='micromundo' src=\'micromundos/"+mm_frente.url+"?version="+Math.random()+"' align='middle' marginheight='0px' marginwidth='0px' style='overflow:hidden;'></iframe>";
    }
    obj_mm_frente[mm_frente.id] = div_mm_frente;
}

function display_ventana_mm(id){
    
    document.getElementById("contenedor").appendChild(obj_mm_frente[id]);
    agregarBtCerrar(mm_frente.id);
    if(mm_frente.getW()!=-1){
	setTam_mm_frente();
	setPos_mm_frente(mm_frente.id);
    }
    document.getElementById('input').disabled = "disabled";
}

function setTam_mm_frente(){
    var div = document.getElementById("div_mm_frente_int_"+mm_frente.id);
    div.style.width = (mm_frente.getW()+20)+"px";
    div.style.height = (mm_frente.getH()+35)+"px";
    var iframe = document.getElementById("iframe_frente_"+mm_frente.id);
    iframe.style.width = mm_frente.getW()+"px";
    iframe.style.height = mm_frente.getH()+"px";
    //iframe.style.overflow = "hidden";
}


function setPos_mm_frente(id){
    
    var mmLoc = getMm(id);
    
    var divInt = document.getElementById("div_mm_frente_int_"+id);
    divInt.style.position = "absolute";
    if(mmLoc.getX()!=-1){
	divInt.style.left = mmLoc.getX()+"px";
    } else {
	divInt.style.left = ($('#contenedor').width()-(mmLoc.getW()+20))/2+"px";
    }
    if(mmLoc.getY()!=-1){
	divInt.style.top = mmLoc.getY()+"px";
    } else {
	divInt.style.top = ($('#contenedor').height()-(mmLoc.getH()+35))/2+"px";
    }
    
    var iframe = document.getElementById("iframe_frente_"+id);
    iframe.style.position = "absolute";
    iframe.style.left = "10px";
    iframe.style.top = "25px";
    
    var bt = document.getElementById("btCerrar_mm_"+id);
    bt.style.position = "absolute";
    
    var btStyle = window.getComputedStyle(bt);
    var btW = btStyle.getPropertyValue("width");
    btW = parseInt(btW.substring(0,btW.length-2));
    if(mmLoc.getX()!=-1){
	bt.style.left = (mmLoc.getX()+mmLoc.getW()-btW-5)+"px";
    } else {
	bt.style.left = (($('#contenedor').width()-mmLoc.getW())/2+mmLoc.getW()-btW-5)+"px";
    }
    
    if(mmLoc.getY()!=-1){
	bt.style.top = (mmLoc.getY()+5)+"px";
    } else {
	bt.style.top = (($('#contenedor').height()-mmLoc.getH())/2-10)+"px";
    }
}


function agregarBtCerrar(idMm){

    var divBt = document.createElement("div");
    divBt.setAttribute("id","btCerrar_mm_"+idMm);
    divBt.className = "btCerrar_mm";
    divBt.setAttribute("style","overflow:hidden; ");
    document.getElementById(idMm).appendChild(divBt);
    var obj = window.getComputedStyle(divBt);
    var srcImg = obj.getPropertyValue("background-image");
    if(srcImg=="none"){
	divBt.innerHTML = "<a href='#' onclick='cerrar_mm(\""+idMm+"\")'>Cerrar</a>";
    } else {
	var img = document.createElement("img");
	srcImg = srcImg.replace(/\"/g,"");
	img.src = srcImg.substring(4,srcImg.length-1);
	img.style.cursor = "pointer";
	img.addEventListener("click",function(){
	    cerrar_mm(idMm);
	},false);
	divBt.style.backgroundImage = "none";
	divBt.appendChild(img);
    }
}

function cerrar_mm(id){
    
    var miMm = getMm(id);
    
    if(miMm.alFrente){
	
	var iframe_fr = document.getElementById("iframe_frente_" + id);
        iframe_fr.contentWindow.postMessage({ type: "exec", name: "_Stop_Audios_", value: "" }, "*");
	if(miMm.reset){
	    document.getElementById('contenedor').removeChild(document.getElementById(id));
	} else {
	    document.getElementById(id).setAttribute("style","display:none;");
	}
	mm_frente=null;
	if(activarDialogoAlCerrar){
	    canReceiveMsg = true;
	}
	document.getElementById('input').disabled = "";

	if(miMm.toNxtQstn && !miMm.closed){
	    miMm.closed=true;
	    nextQuestionDesdeMm();
	}
	
    } else {
	var iframe = document.getElementById("iframe_" + id);
        iframe.contentWindow.postMessage({ type: "exec", name: "_Stop_Audios_", value: "" }, "*");
	canReceiveMsg = true;
	resetMicromundo();
    }
}

function nextQuestionDesdeMm(){
    enRetro=false; //Por si se da una respuesta antes de abrir el mm y se queda ciclando
    respuesta = "[Mensaje micromundo]";
    addToLs();
    var idProxPreg = nodo.nodosResp[0].nextQuestion;
    setNextPreg(idProxPreg);
}

function agregarBtGlobo(vis){
    var target;
    if(dialogo.styleBalloons=="img"){
	target = document.getElementById(statusKey+"_c_2_1");
    } else {
	target = document.getElementById(statusKey);
    }
    var re = new RegExp("^<a href=","i");
    if(target.lastChild==null || re.test(target.lastChild.innerHTML)==false){
	agregarLiga(target,mm_frente,vis);
    }
}

function posicionarMm(id){
    
    var mmLoc = getMm(id);
    var iframe = document.getElementById("iframe_"+id);
	
    if(mmLoc.getW()>parseInt($("#contenedor").width()-($("#contenedor").width()/fctrWChat))){
	$("#td_chat").css("width",$("#contenedor").width()-mmLoc.getW());
	$("#td_micromundo").css("width",mmLoc.getW());
	if(mmLoc.getW()>$("#td_micromundo").width()){
	    //A veces el mm + chat no caben en la ventana => navegador da prioridad a desplegar el chat.
	    $("#"+id).css("overflow","scroll");
	} else {
	    $("#td_micromundo").css("overflow","hidden");
	    $("#iframe_"+id).css("overflow","hidden");
	}
    } else {
	$("#td_chat").css("width",parseInt(100/fctrWChat)+"%");
	$("#td_micromundo").css("width",parseInt(100-(100/fctrWChat))+"%");
	$("#"+id).css("overflow","hidden");
    }
    
    iframe.style.position = "absolute";
    if(mmLoc.getX()!=-1){
	iframe.style.left = mmLoc.getX()+"px";
    } else {
	iframe.style.left = ($('#micromundo').width()-mmLoc.getW())/2+"px";
    }
    if(mmLoc.getY()!=-1){
	iframe.style.top = mmLoc.getY()+"px";
    } else {
	iframe.style.top = ($('#micromundo').height()-mmLoc.getH())/2+"px";
    }
    
    if(document.getElementById(id).childNodes.length>1){
	posicionar_btCerrar_mm(id);
    }
    
    //Se agregó la sig. línea por si cambia el tamaño del chat, sin embargo al volver a ver un mm, el chat scrolea hasta abajo, lo cual no está bien.
    //actualizarScroll();
}

function posicionar_btCerrar_mm(id){
    
    var bt = document.getElementById("btCerrar_mm_"+id);
    bt.style.position = "absolute";
    var btStyle = window.getComputedStyle(bt);
    var btW = btStyle.getPropertyValue("width");
    btW = parseInt(btW.substring(0,btW.length-2));
    bt.style.left = ($("#micromundo").width() - btW - 5) + "px";
    bt.style.top = "10px";
}


function getMm(id){
    var mmLoc;
    for(var i=0;i<micromundos.length;i++){
	if(micromundos[i].id==id){
	    mmLoc=micromundos[i];
	    break;
	}
    }
    return mmLoc;
}
function getMmXUrl(url){
    var mmLoc;
    for(var i=0;i<micromundos.length;i++){
	if(micromundos[i].url==url){
	    mmLoc=micromundos[i];
	    break;
	}
    }
    return mmLoc;
}

function hideMicromundo(){
    
    if(mm!=null){
	for(var i=0;i<mm.statusKeys.length;i++){
	    var target;
	    if(dialogo.styleBalloons=="img"){
		target = document.getElementById(mm.statusKeys[i]+"_c_2_1");
	    } else {
		target = document.getElementById(mm.statusKeys[i]);
	    }
	    var re = new RegExp("^<a href=","i");
	    if(target.lastChild==null || re.test(target.lastChild.innerHTML)==false){
		agregarLiga(target,mm,true);
	    }
	}
	var iframe = document.getElementById("iframe_" + mm.id);
	if(iframe!=null){
	    iframe.contentWindow.postMessage({ type: "exec", name: "_Stop_Audios_", value: "" }, "*");
	    if(mm.reset){
		document.getElementById('micromundo').removeChild(document.getElementById(mm.id));
	    } else {
		document.getElementById(mm.id).setAttribute("style","display:none;");
	    }
	}
	
	mm = null;
	
	$("#td_chat").css("width",parseInt(100/fctrWChat)+"%");
	$("#td_micromundo").css("width",parseInt(100-(100/fctrWChat))+"%");
    }
}

function agregarLiga(target,mm,vis){

    var hIni = $("#"+target.id).height();
    var par = document.createElement("p");
    par.setAttribute("id","liga_"+mm.id);
    par.setAttribute("class","ligaMicromundo");
    if(!vis){
	par.setAttribute("style","display: none; ");
    }
    par.innerHTML = "<a href='#' onclick='revisitMicromundo(\""+mm.id+"\")'>"+mm.txtLiga+"</a>";
    target.appendChild(par);
    actualizarScroll($("#"+target.id).height()-hIni);
}


function setValorMicromundo(vlr){
    
    var vlrs = vlr.split("+");
    //Jossy: Este if sólo está para checar si funciona
    /*if(vlrs[0]=="nPJS" || vlrs[0]=="nRJS"){
	alert("var: "+vlrs[0]+"; valor: "+vlrs[1]);
    }*/
    
    var hijo;
    if(mm_frente!=null){
	//es poco probable o incluso imposible que esto se necesite dado que el mm estaría tapando el chat.
	//además, está causando problemas por el delay en la carga del mm_frente, por lo que en este momento, hijo=null
	hijo = document.getElementById("iframe_frente_"+mm_frente.id);
	if(hijo!=null){
	    for(var v=0;v<vlrs.length;v++){
		var arr = vlrs[v].split(":");
		var mensajeTipoSet = { type: "set", name: arr[0], value: parseInt(convertString(arr[1])) };
		hijo.contentWindow.postMessage(mensajeTipoSet, "*");
		updateMicromundo("iframe_frente_"+mm_frente.id);
	    }
	}
    } else if(mm!=null){
	hijo = document.getElementById("iframe_"+mm.id);
	for(var v=0;v<vlrs.length;v++){
	    var arr = vlrs[v].split(":");
	    var mensajeTipoSet = { type: "set", name: arr[0], value: parseInt(convertString(arr[1])) };
	    hijo.contentWindow.postMessage(mensajeTipoSet, "*");
	    updateMicromundo("iframe_"+mm.id);
	}
    }
}

function updateMicromundo(idIframe){
    
    var hijo = document.getElementById(idIframe);
    var mensajeTipoUpdate = { type: "update" };
    hijo.contentWindow.postMessage(mensajeTipoUpdate, "*");
}


// PARA RECIBIR MENSAJES DEL HIJO
if (window.addEventListener != null){
    window.addEventListener("message", receiveMessage, false);
} else { //IE
    window.attachEvent("onmessage", receiveMessage);
}

function receiveMessage(evt) {
    
    if (evt.data && evt.data.type === "set") {
	if(canReceiveMsg){
	    if(evt.data.name=="respuesta"){
		respuesta = evt.data.value;
		if(enRetro){
		    document.getElementById('input').value=respuesta;
		    alert("Primero lee bien el mensaje del tutor, luego pulsa ENTER para confirmar tu respuesta.");
		} else {
		    procesarRespuesta();
		}
	    } else if(evt.data.name=="question" && evt.data.value=="next"){
		nextQuestionDesdeMm();
	    }
	} 
    }
  
  // mensaje tipo update
  if (evt.data && evt.data.type === "update") {
    //alert("mensaje tipo <update> enviado por el hijo");
  }
  
  if (evt.data && evt.data.type === "reportSize") {
    var arr = (evt.data.href).split("/");
    var urlMm = arr[arr.length-1];
    var miMm = getMmXUrl(urlMm);
    if(miMm.w==-1){
	miMm.w = evt.data.width;
	miMm.h = evt.data.height;
	if(miMm.alFrente){
	    setTam_mm_frente();
	    setPos_mm_frente(miMm.id);
	} else {
	    var iframe = document.getElementById("iframe_"+miMm.id);
	    iframe.style.width = miMm.getW()+"px";
	    iframe.style.height = miMm.getH()+"px";
	    posicionarMm(miMm.id);
	}
    }
  }
}


function quitarEtiquetas(txt){
    txt = txt.replace(/<([^<>]+)>/g,"");
    return txt;
}


//// AUDIO

function checkAudio(url,txt){
    
    if(playAudio){
		
	if( tts || (url!=undefined && url!="") ){
	    
	    if(tts){
				
		//Crear array de textos de no más de 99 caracteres de extensión
		chunkText(txt);
		var arrDur = [];
		   
		// Calcular duración aprox. de audios
		durAudios = 0;
		var rePunt = /([^,;]+)([,;]{1})([^,;]+)/g;
		var msExtra = 0;
		for(var a in arrAudios){ 
		    var arrPunt = arrAudios[a].match(rePunt);
		    if(arrPunt!=null){
			msExtra = arrPunt.length*50;
		    }
		    var dur = 1400 + (arrAudios[a].length*65) + msExtra;
		    durAudios += dur;
		    arrDur.push(dur);
		}
		
		audioPlaying=true;
		hayAudio=true;
		
		if(browser=="Firefox" || browser=="Opera"){
		    playAudioFf(arrAudios,arrDur,0);
		} else { //Internet Explorer, Chrome y Safari
		    playAudioChr(arrAudios,0);
		}
				
	    } else if(url!="null" && url!=""){
		
		if(myAudio){
		    myAudio.pause();
		}
		myAudio = new Audio();
		
		if(myAudio.canPlayType("audio/mpeg")==""){
		    myAudio.setAttribute("type","audio/ogg");
		    myAudio.setAttribute("src","audio/"+url+".ogg");
		} else {
		    myAudio.setAttribute("type","audio/mpeg");
		    myAudio.setAttribute("src","audio/"+url+".mp3");
		}
		
		myAudio.addEventListener('loadedmetadata', function datosCargados() {
		    hayAudio = true;
		    durAudios = myAudio.duration*1000;
		    myAudio.play();
		    audioPlaying = true;
		});
		myAudio.addEventListener('error', function hayError() {
		    hayAudio = false;
		    alert("Error en audio.");
		});
		myAudio.addEventListener('ended', function audioEnded() {
		    audioPlaying = false;
		});
		myAudio.load();
	    } 
	} else {
	    hayAudio = false;
	}
    } else {
	hayAudio = false;
    }
}


function playAudioFf(arrAudios,arrDur,n){
        
    if(n<arrAudios.length){
	
	//myAudio = document.getElementById("tts_audio_ff");
	myAudio = document.createElement("embed");
	myAudio.setAttribute("type","audio/mpeg");
	myAudio.setAttribute("id","audio_tts_"+n);
	myAudio.src = "php/tts.php?txt="+arrAudios[n];
	document.getElementById("div_tts").appendChild(myAudio);
	if(n>0){
	    var ant = n-1;
	    document.getElementById("div_tts").removeChild(document.getElementById("audio_tts_"+ant));
	}
		
	setTimeout(function(){
	    playAudioFf(arrAudios,arrDur,n+1);
	},arrDur[n]);
	
    } else {
	audioPlaying=false;
    }
}

function playAudioChr(arrAudios,n){
    
    if(n<arrAudios.length && hayAudio){
	
	if(myAudio){
	    myAudio.pause();
	}
	
	myAudio = new Audio();
	myAudio.setAttribute("type","audio/mpeg");
	myAudio.src = "php/tts.php?txt="+arrAudios[n];
	
	myAudio.addEventListener('loadedmetadata', function datosCargados() {    
	    //alert("myAudio.duration="+myAudio.duration);
	    myAudio.play();
	});
	myAudio.addEventListener('error', function hayError() {
	    hayAudio = false;
	    audioPlaying = false;
	    alert("Error en audio.");
	});
	myAudio.addEventListener('ended', function audioEnded() {
	    playAudioChr(arrAudios,n+1);
	});
	myAudio.load();
	
    } else {
	audioPlaying=false;
    }
}


function chunkText(txt){

    txt = quitarEtiquetas(txt);
    
    var re2 = /[¡¿]/g; //[¡\!¿\?]
    txt = txt.replace(re2,"");
    var re3 = /[\s]{2,3}/g;
    txt = txt.replace(re3," ");
    var re4 = /[\.]{2,3}/g;
    txt = txt.replace(re4,".");
    var re5 = /:-/g;
    txt = txt.replace(re5,",");
    
    var str1;
    var str2;
    
    var rePunt = /([^\.\!\?]+)[\.\!\?]/g;
    arrAudios = txt.match(rePunt);
    if(arrAudios==null || arrAudios.length==0){
	arrAudios = [];
	arrAudios.push(txt);
    }
    for(var ind in arrAudios){
	arrAudios[ind]=arrAudios[ind].replace(/^[\s]+/,"");
    }

    var audios = [];
    
    function checkLength(){
					
	var lIni = arrAudios.length;
    
	for(var i=0;i<arrAudios.length;i++){
	    if(arrAudios[i].length>99){
		str1="";
		str2="";
		//Se empieza a la mitad para buscar coma o punto y coma.
		var mitad = arrAudios[i].length/2;
		for(var j=1;j<mitad-1;j++){
		    if(arrAudios[i].charAt(mitad+j)=="," || arrAudios[i].charAt(mitad+j)==";"){
			str1 = arrAudios[i].substring(0,mitad+j+1);
			str2 = arrAudios[i].substring(mitad+j+2,arrAudios[i].length); // +2 para no incluir , o ; ni espacio.
			break;
		    } else if(arrAudios[i].charAt(mitad-j)=="," || arrAudios[i].charAt(mitad-j)==";"){
			str1 = arrAudios[i].substring(0,mitad-j+1);
			str2 = arrAudios[i].substring(mitad-j+2,arrAudios[i].length)
			break;
		    }
		}
		//Si no hubo ninguna coma o punto y coma.
		if(str1==""){
		   for(j=1;j<mitad-1;j++){
			if(arrAudios[i].charAt(mitad+j)==" "){
			    str1 = arrAudios[i].substring(0,mitad+j);
			    str2 = arrAudios[i].substring(mitad+j+1,arrAudios[i].length);
			    break;
			}
		    }
		}
		arrAudios[i]=str1;
		arrAudios.splice(i+1,0,str2);
		break;
	    }
	}
	
	if(arrAudios.length>lIni){
	    checkLength();
	} 
    }
    
    //En Firefox, es importante que la llamada a la función venga después de la misma es es una función anidada.
    checkLength(); //Máximo de 100 caracteres, incluyendo los signos +.
}



/// RECONSTRUIR

function addToLs(){
    if(ls){
	if(localStorage.getItem("respuestas"+tit) && localStorage.getItem("respuestas"+tit)!=""){
	    localStorage.setItem("respuestas"+tit,localStorage.getItem("respuestas"+tit)+"|"+respuesta);
	} else {
	    localStorage.setItem("respuestas"+tit,respuesta);
	}
    }
}

function crearLoader(){
    
    var loader = document.createElement("div");
    document.getElementById("contenedor").appendChild(loader);
    loader.setAttribute("id","loader");
    loader.setAttribute("class","loader");
    loader.setAttribute("style","position:absolute; top:0px; left:0px; ");
    $("#loader").css("width",$("#contenedor").width());
    $("#loader").css("height",$("#contenedor").height());
    var txt = document.createElement("par");
    txt.setAttribute("class","loader");
    txt.innerHTML = "<br><br><br><br><br>El diálogo se está reconstruyendo...";
    loader.appendChild(txt);    
}

function reconstruir(){

    nRec++;
        
    if(nRec<respuestas.length){
	respuesta = respuestas[nRec];
	if(respuesta=="[Mensaje micromundo]"){
	    mm_frente.closed=true;
	    var idProxPreg = nodo.nodosResp[0].nextQuestion;
	    setNextPreg(idProxPreg);
	    setTimeout(function(){
		reconstruir();	
	    },100);
	} else {
	    nuevoTexto(respuesta,1);
	    numResp=0;
	    checkClaves();
	}
    } else {
	reconstruyendo = false;
	document.getElementById("contenedor").removeChild(document.getElementById("loader"));
    }
}


//// FUNCIONES ACOMODO

function toFullWindow(){
    
    $("#contenedor").css("width",$(window).width());
    $("#contenedor").css("height",$(window).height());
    
    var estiloGlobos = document.getElementById('td_chat').currentStyle || getComputedStyle(document.getElementById('td_chat'), null);
    var padTop = parseInt(estiloGlobos.paddingTop.substr(0,estiloGlobos.paddingTop.length-2));
    var padBot = parseInt(estiloGlobos.paddingBottom.substr(0,estiloGlobos.paddingBottom.length-2));
    $("#chat_globos").css("height",$(window).height()-($("#chat_campo").height()+padTop+padBot));
    
    var mms = document.getElementsByName("div_mm");
    for(var i=0;i<mms.length;i++){
	if($('#'+mms[i].id).is(':visible')){
	    posicionarMm(mms[i].id);
	}
    }
    var mms_frente = document.getElementsByName("div_mm_frente");
    for(var i=0;i<mms_frente.length;i++){
	setPos_mm_frente(mms_frente[i].id);
    }
    
    if(dialogo.styleBalloons=="img"){
	var cellsCenter = document.getElementsByName("cellCenter");
	for(var i=0;i<cellsCenter.length;i++){
	    var key = cellsCenter[i].id.split("_")[0];
	    cellsCenter[i].style.width = $("#"+key).width()-($("#"+key+"_c_0_0").width()*2)+"px";
	}
    }
}

$(window).resize(function() {
    if(dialogo.autoresize){
        toFullWindow();
    }
});


