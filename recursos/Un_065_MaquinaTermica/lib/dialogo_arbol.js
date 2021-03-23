function crearArbol(clave){
    
    var WS;
    var error;
        
    clave = traducirOps(clave);
    var tokens = getTokens(clave);
    var arr = parsear(tokens);
    WS = arr[0];
    error = arr[1];

     if(error==0){
        return WS[0];
    } else {
        return null;
    }
}


function traducirOps(clave){
    
    var patrones = new Array(/AND/g,/OR/g,/NOT/g,/NEG/g,/MAS/g,/CAU/g,/SEG/g);
    var sustituciones = new Array('&&','//','!','#','++','->','&+');
    
    clave = clave.replaceArray(patrones,sustituciones);

    return clave;
}


function getTokens(clave){
    
    var toks = new Array();
    
    var reLetra = /[\w\dáéíóúüñ\-,SÍNODUA]/;
    var reOp = /[&\/\!\#\+\-\>_]/;
    var reOpCompl = /(\+\+|&&|\/\/|&\+|\!|\#|\-\>|_)/;
    var pal = "";
    var op = "";
    
    for(var l=0;l<clave.length;l++){
        
        if(reOp.test(clave.charAt(l))){
            if(pal!=""){
                toks.push(pal);
                pal = "";
            }
            op+=clave.charAt(l);
            if(reOpCompl.test(op)){
                toks.push(op);
                op = "";
            }
        } else if(clave.charAt(l)=="("){
            toks.push("(");
        } else if(clave.charAt(l)==")"){
            if(pal!=""){
                toks.push(pal);
                pal = "";
            }
            toks.push(")");
        } else {
            pal += clave.charAt(l);
        }
    }
    
    return toks;
}

function parsear(toks){
        
    var lp = 0;
    var rp = 1;
    var op = 2;
    var pal = 3;
    
    var WS = new Array();
    var OS = new Array();
    var error = 0;
    var countLp = 0;
    var woe;
        
    for(var i=0;i<toks.length;i++){
        var tok = toks[i];
	var nodo = new Nodo_arbol();
	nodo.setToken(tok);
        if(nodo.type==lp){
	    OS.push(nodo);
	    countLp++;
	} else if(nodo.type==op){
            OS.push(nodo);
        } else if(nodo.type==pal){
	    var reExprFija = /^(SÍ|NO|DUDA)$/;
	    if(reExprFija.test(nodo.token)){
		var arr = crearArbolFijo(nodo.token);
		nodo = arr[0];
	    }
	    WS.push(nodo);
        } else if(nodo.type==rp){
            if(countLp>0){
                woe = crearNodo(WS,OS);
                WS = woe[0];
                OS = woe[1];
                error = woe[2];
                //Quitar el left parentesis
                if(OS[OS.length-1].type == lp){
                        OS.pop();
                        countLp--;
                } else {
                        error=3;
                }
                // checar si operador anterior es NEG (0) o NOT (1) -> prioridad
                if(OS.length>0){
                    var opAnt = OS[OS.length-1];
                    if(opAnt.type==op && opAnt.valor<2){
                        woe = crearSimpleNode(WS,OS);
                        WS = woe[0];
                        OS = woe[1];
                        error = woe[2];
                    } 
                }
            } else {
                error=1;
            }
        }
    }
    
    if(countLp>0){
        error=2;
    }
	
    if(error==0 && OS.length>0){
            var woe = toOneNode(WS,OS);
            WS = woe[0];
            OS = woe[1];
            error = woe[2];
    }
    
    return new Array(WS,error);
}


function crearNodo(WS,OS){
    
    var lp = 0;
    var rp = 1;
    var op = 2;
    var pal = 3;
    
    var error = 0;
    var opNodes = new Array();
    
    while(OS.length>0 && OS[OS.length-1].type==op){
            opNodes.push(OS.pop());
    }
    
    if(opNodes.length==0){ //Se trata de una clave entre paréntesis
            //No hacer nada; el lp se quita más adelante
    } else if(opNodes.length==1){ //Hay un solo operador entre los paréntesis
            var nodo = opNodes[0];
            if(nodo.valor>=2 && WS.length>=2){
                    nodo.addChild(WS.pop());
                    nodo.addChild(WS.pop());
                    WS.push(nodo);
            } else if(OS[OS.length-1].type == lp){ //ya sólo hay un lp en OS
                    WS.push(nodo);
            } else {
                    error=4;
            }
    } else { //Hay múltiples operadores (todos los mismo) entre el mismo par de paréntesis
            var same=  true;
            for(var o=1;o<opNodes.length;o++){
                    if(opNodes[o].token!=opNodes[o-1].token){
                            same=false;
                            error=6;
                            break;
                    }
            }
            if(same){
                    nodo = opNodes[0];
                    if(WS.length>opNodes.length){
                            for(var i=0;i<=opNodes.length;i++){
                                nodo.addChild(WS.pop());
                            }
                            WS.push(nodo);
                    } else {
                            error=5;
                    }
            }
    }
    
    return new Array(WS,OS,error);
}


function crearSimpleNode(WS,OS){
    
    var error = 0;
	
    var nodo = OS.pop();
    if(WS.length>=1){
            nodo.addChild(WS.pop());
            WS.push(nodo);
    } else {
            error=7;
    }
    
    return new Array(WS,OS,error);
}


function toOneNode(WS,OS){
    
    var lp = 0;
    var rp = 1;
    var op = 2;
    var pal = 3;
	
    var error = 0;
    var woe; 
    
    if(OS[OS.length-1].type==op){
            if(OS[OS.length-1].valor<2){
                    var woe = crearSimpleNode(WS,OS);
                    WS = woe[0];
                    OS = woe[1];
                    error = woe[2];
            } else {
                    woe = crearNodo(WS,OS);
                    WS = woe[0];
                    OS = woe[1];
                    error = woe[2];
            }
            
            if(OS.length>0){
                    woe = toOneNode(WS,OS);
                    WS = woe[0];
                    OS = woe[1];
                    error = woe[2];
            }
    } else {
            error=8;
    }
    
    return new Array(WS,OS,error);
}


function crearArbolFijo(ex){
    
    var tokAfir = new Array("si","sí","sip","sipi","aja","ajá","claro","ok","venga","simon","simón","por_supuesto","seguro","seguramente","cierto","ciertamente","de_acuerdo","así_es","asi_es","obviamente","obvio","evidentemente","afirmativo","en_efecto","efectivamente");
    var tokAfir_conNeg = new Array("duda,dudar"); //sin duda, no lo dudo
    var tokDuda = new Array("quién_sabe","quien_sabe","ve_tú_a_saber","ve_tu_a_saber","quizá","quizás","quiza","quizas","a_lo_mejor","puede_ser","podría_ser","podria_ser");
    var tokDuda_conNeg = new Array("saber,entender,comprender,claro,idea,seguro"); //no sé, no lo entiendo, no me queda claro, ni idea, no estoy segura,...
    var tokNeg = new Array("no","nop","nope","nada","nunca","jamás","nadie","nel","en_absoluto","negativo","dos_tres","más_o_menos","mas_o_menos");
    var tokNeg_conNeg = new Array("modo,manera"); // de ningún modo, de ninguna manera, no hay manera
           
    var WS = new Array();
    
    if(ex=="DUDA"){
        var nodo = crearNodoFijo(tokDuda,tokDuda_conNeg);
        WS.push(nodo);
    } else if(ex=="NO"){
	var nodoNeg = crearNodoFijo(tokNeg,tokNeg_conNeg);
	var nodoDuda = crearNodoFijo(tokDuda,tokDuda_conNeg);
	var nodoNOT = new Nodo_arbol();
	nodoNOT.setToken("!");
	nodoNOT.addChild(nodoDuda);
	var nodo = new Nodo_arbol();
	nodo.setToken("&&");	
	nodo.addChild(nodoNOT);
	nodo.addChild(nodoNeg);
	WS.push(nodo);
    } else if(ex=="SÍ"){
	var nodoAfir = crearNodoFijo(tokAfir,tokAfir_conNeg);
	var nodoNeg = crearNodoFijo(tokNeg,tokNeg_conNeg);
	var nodoNOT = new Nodo_arbol();
	nodoNOT.setToken("!");
	nodoNOT.addChild(nodoNeg);
	var nodo = new Nodo_arbol();
	nodo.setToken("&&");
	nodo.addChild(nodoNOT);
	nodo.addChild(nodoAfir);
	WS.push(nodo);
    }
    
    return WS;
}


function crearNodoFijo(arrToks,arrToksNeg){
    
    var nodo = new Nodo_arbol();
    nodo.setToken("//");
    for(var t=0;t<arrToks.length;t++){
	var n = new Nodo_arbol();
	var arr = arrToks[t].split("_");
	if(arr.length==1){
	    n.setToken(arrToks[t]);
	} else {
	    n.setToken("_");
	    for(var a=arr.length-1;a>=0;a--){
		var hijo = new Nodo_arbol();
		hijo.setToken(arr[a]);
		n.addChild(hijo);
	    }
	}
	nodo.addChild(n);
    }

    var neg = new Nodo_arbol();
    neg.setToken("#");
    var hijo = new Nodo_arbol();
    hijo.setToken(arrToksNeg[0]);
    neg.addChild(hijo);
    nodo.addChild(neg);

    return nodo;
}