function Nodo_arbol(){
    
    this.token;
    this.type;
    this.valor;
    this.children = new Array();
    
    this.lp = 0;
    this.rp = 1;
    this.op = 2;
    this.pal = 3;
    
    this.match;
    this.datosPos = new Array();
    this.datosPosTmp = new Array();
    this.lemasMatched = new Array();
    this.esNeg = false;
    this.neg = false;
    
}

Nodo_arbol.prototype.setToken = function(t) {
    
    this.token = t;
    this.setType();
}


Nodo_arbol.prototype.setType = function() {
    
    var re = /(\+\+|-\>|&&|\/\/|&\+|\!|#|_)/;
    
    if(this.token == "("){
            this.type = this.lp;
    } else if(this.token == ")"){
            this.type = this.rp;	
    } else if(re.test(this.token)){
            this.type = this.op;
            this.setValor();
    } else {
            this.type = this.pal;
    }
}


Nodo_arbol.prototype.setValor = function() {
    
    if(this.token=="#"){
            this.valor = 0;
    } else if(this.token=="!"){
            this.valor = 1;
    } else if(this.token=="&&" || this.token=="&+" || this.token=="_"){
            this.valor = 2;
    } else if(this.token=="//" || this.token=="++" || this.token=="->"){
            this.valor = 3;
    }
}


Nodo_arbol.prototype.addChild = function(nodo) {
    this.children.unshift(nodo);
}


Nodo_arbol.prototype.reset = function() {	
        this.match = false;
        this.datosPos = new Array();
        this.datosPosTmp = new Array();
        this.lemasMatched = new Array();
        this.esNeg = false;
        this.neg = false;
}


Nodo_arbol.prototype.analizar = function(n) {
                
        if(this.children.length>1){
            
                if(n==2){
                        this.reset();
                }

                if(this.token == "//"){
                    
                    this.match = false;
                    for(var i=0;i<this.children.length;i++){
                            if(this.children[i].analizar(n)){
                                    this.match = true;
                            }
                    }
                        
                } else {
                
                    this.match = true;
                    for(var i=0;i<this.children.length;i++){
                            if(!this.children[i].analizar(n)){
                                    this.match = false;
                            }
                    }
                    
                    if(this.token != "&&"){
                    
                        if(this.match){
                            
                            var arrPos = new Array();
                            for(var i=0;i<this.children.length;i++){
                                    arrPos.push(this.children[i].getPos(new Array()));
                            }
                            
                            switch (this.token) {
                                    
                                case "++":  this.match = this.checarPos(arrPos,"++");
                                            break;
                                        
                                case "&+":  this.match = this.checarPos(arrPos,"&+");
                                            break;
                                        
                                case "_":   this.match = this.checarPos(arrPos,"_");
                                            break;
                                
                                case "->":  this.match = this.checarPos(arrPos,"++");
                                            if(this.match){
                                                this.match = this.checarCausa(arrPos);
                                            }
                                            break;
                            }
                        }           
                    }
                }
                
        } else if(this.children.length==1){
            
                if(n==2){
                        this.reset();
                }

                switch (this.token) {
                    
                        case "!" :  this.match = !(this.children[0].analizar(n));
                                    break;
                                
                        case "#" :  this.match = this.children[0].checkMatch(0) && this.children[0].negacion(true);
                                    if(this.match){
                                            this.children[0].match = true; //se necesita para función getPos del child
                                    }
                                    break;
                }
        } else {
            if(n==1){
                    this.match = this.checkMatch(1);
            } else if(n==2){
                    if(this.neg==false){
                            this.reset();
                            this.match = this.checkMatch(1);
                    } else {
                            if(this.checkPosNeg()){
                                    this.reset();
                                    this.match = this.checkMatch(2);
                            } else {
                                    this.match = false;
                            }
                    }
            }
        }
        
        return this.match;
}



Nodo_arbol.prototype.checkMatch = function(checkNeg) {
		        
        var m = false;
        var pals = this.token.split(",");
        
        for(var f=0;f<arrLemas.length;f++){
                for(var p=0;p<arrLemas[f].length;p++){	
                        for(var lema in arrLemas[f][p]){
                                for(var i=0;i<pals.length;i++){
                                        if(lema==pals[i]){
                                                this.lemasMatched.push(lema);
                                                this.datosPosTmp.push(new Array(f,p));
                                        }
                                }
                        }
                }
        }
                        
        if(this.lemasMatched.length>0){
                if(checkNeg==1){
                        m = !(this.negacion(false));
                } else if(checkNeg==2){
                        this.datosPos = this.datosPosTmp;
                        m = true;
		} else {
                        m = true;
                }
        } 
        
        return m;
}


Nodo_arbol.prototype.negacion = function(desdeNEG) {
    
    var hayNeg = false;
    
    var negs = new Array("no","nunca","jamás","jamas","nada","nadie","ningún","ningun","ninguno","ninguna","ni","nul","sin","falta","faltan","faltó","falto","faltaron");
    var nexosSubord = new Array("que","quien","donde","cuando","cual","cuales");
                            
    for(var i=0;i<this.datosPosTmp.length;i++){
            
            var arrPos = this.datosPosTmp[i];
            var mf = arrPos[0];  // match frase
            var mp = arrPos[1];  // match pos
                            
            //negación antes y después de subordinación (no creo que no ...)
            var negAnt=0;
            var negDesp=0;
            var subord=false;
            var mpSub=-1;
            
            for(var p=0;p<mp;p++){
                    
                    for(var lema in arrLemas[mf][p]){
                            
                            if(inArray(lema,negs)){
                                    arrPosNeg.push(new Array(mf,p));
                                    if(subord){
                                            negDesp++;
                                    } else {
                                            negAnt++;
                                    }
                                    break;
                            } else if(inArray(lema,nexosSubord)){
                                    subord = true;
                                    mpSub = p;
                                    break;
                            }
                    }
            }
                            
            if( (subord==false && negAnt>0) ||  (subord==true && ( (negAnt==0 && negDesp>0) || (negAnt>0 && negDesp==0) ) ) ){
                    if(desdeNEG){
                            hayNeg = true;
                            this.esNeg = true;
                            huboNeg = true;
                            this.datosPos.push(this.datosPosTmp[i]);
                    } 
            } else {
                    if(desdeNEG==false){
                            this.datosPos.push(this.datosPosTmp[i]);
                    }
            }
    }
    
    if(desdeNEG==false && this.datosPos.length==0){
            hayNeg = true;
            this.neg = true;
            huboNegado = true;
    }
                                            
    return hayNeg;
}


	
Nodo_arbol.prototype.checkPosNeg = function() {
		        
        var negAnt = false;
        
        for(var i=0;i<arrPosNeg.length;i++){

                var posNeg = arrPosNeg[i];
                
                for(var j=0;j<this.datosPosTmp.length;j++){
                    
                        var pos = this.datosPosTmp[j];
                        
                        //Si están en la misma frase y la negación antecede la palabra
                        if(posNeg[0]==pos[0] && posNeg[1]<pos[1]){
                                negAnt = true;
                                break;
                        }               
                }
        }
        
        return negAnt;
}



/// FUNCIONES PARA OBTENER POSICIÓN DE PALS EN ORACIÓN


Nodo_arbol.prototype.getPos = function(arrDatos) {	
		
    if(this.match){
            if(this.children.length>0){
                    for(var i=0;i<this.children.length;i++){
                            var dCh = this.children[i].getPos(arrDatos);
                            if(dCh.length > 0){
                                    arrDatos = this.compararDatos(arrDatos,dCh);						
                            }
                    }
            } else {
                    if(this.datosPos.length>0){ //Hubo que agregar esta condición porque this.match daba true incorrectamente en algunos casos
                            arrDatos = this.getIniFin();
                    } else {
                            arrDatos = new Array();
                    }
            }
    }
    
    return arrDatos;
}


Nodo_arbol.prototype.getIniFin = function(){
    
    var newDatos = new Array();
    
    for(var i=0;i<this.datosPos.length;i++){
                    
            var arrPos = this.datosPos[i];
            var f = arrPos[0];
            var p = arrPos[1];
    
            newDatos.push(f+","+f+","+p+","+p);
    }
    
    return newDatos;
}


Nodo_arbol.prototype.compararDatos = function (arrViejo,arrNuevo){
    
    var newDatos = new Array();
    
    for(var n=0;n<arrNuevo.length;n++){
            
            var arrDNuevos = arrNuevo[n].split(",");
            var fi = arrDNuevos[0];
            var ff = arrDNuevos[1];
            var pi = arrDNuevos[2];
            var pf = arrDNuevos[3];

            
            if(arrViejo.length==0){
                    
                    newDatos.push(fi+","+ff+","+pi+","+pf);
                    
            } else {
                    
                    for(var v=0;v<arrViejo.length;v++){
                    
                            var arrDViejos = arrViejo[v].split(",");
                            var fIni = arrDViejos[0];
                            var fFin = arrDViejos[1];
                            var pIni = arrDViejos[2];
                            var pFin = arrDViejos[3];
                    
                            if(fi<fIni){
                                    fIni=fi;
                                    pIni = pi;
                            } else {
                                    if(pi<pIni){
                                            pIni=pi;
                                    }
                            }
                            
                            if(ff>fFin){
                                    fFin = ff;
                                    pFin = pf;
                            } else {
                                    if(pf>pFin){
                                            pFin=pf;
                                    }
                            }
                            
                            newDatos.push(fIni+","+fFin+","+pIni+","+pFin);
                    }
            }
    }
    
    return newDatos;
}



///FUNCIONES PARA CHECAR POSICIÓN DE LAS PALABRAS

Nodo_arbol.prototype.checarPos = function (arrPos,op){
		
    var ok = true;
    
    var pIni1;
    var pFin1;
    var pIni2;
    var pFin2;
    
    
    //Hay que checar y comparar cada 2 conjuntos de posiciones
    for(var i=0;i<arrPos.length-1;i++){
	                                    
            var okLoc = false;
            
            var arrPos1 = arrPos[i];
            var arrPos2 = arrPos[i+1];
            
            for(var s=0;s<arrPos1.length;s++){
                                    
                    var pos1 = arrPos1[s].split(",");
                    var arr1 = this.getPosGlobal(pos1);
                    pIni1 = arr1[0];
                    pFin1 = arr1[1];
                    
                    for(var t=0;t<arrPos2.length;t++){
                                                                    
                            var pos2 = arrPos2[t].split(",");
                            var arr2 = this.getPosGlobal(pos2);
                            pIni2 = arr2[0];
                            pFin2 = arr2[1];
                            
                            if(op=="++"){
                                    if( (pIni1<pIni2 && pFin1<pIni2) || (pIni1>pFin2 && pFin1>pFin2) ){
                                        okLoc=true;
                                        break;
                                    }
                            } else if(op=="&+"){
                                    if(pFin1<pIni2){
					okLoc=true;
					break;
                                    }
                            } else if(op=="_"){
                                    if(pIni1 == pIni2-1){
					okLoc=true;
					break;	
                                    }
                            }
                    }
                    
                    if(okLoc){
                            break;
                    }
            }
            	    
            if(okLoc==false){
                    ok=false;
                    break;
            }
    }
    
    return ok;
}


Nodo_arbol.prototype.getPosGlobal = function(arr){
                        
    var n = 0;
    var pIni;
    var pFin;
    
    for(var j=0;j<arrLemas.length;j++){  
        if(j==arr[0]){
            pIni = n+parseInt(arr[2]);
        }
        if(j==arr[1]){
            pFin = n+parseInt(arr[3]);
        }
        n+=arrLemas[j].length;
    }
                    
    return new Array(pIni,pFin);
}




//// FUNCIONES PARA CHECAR POSICIÓN DE CAUSA Y EFECTO


Nodo_arbol.prototype.checarCausa = function(arrPos){
            
    var ok = false;
    
    //En causa 1 y 2 hay que agregar "POR" seguido de un infinitivo. También: TAN ... que ...
    var cnctrsCausa1 = new Array("dado que","ya que","porque","por que","a causa de","debido a","se debe a","se debería a","en vista de","como","si"); //--> Se encuentran al inicio de la oración, antes de la causa
    var cnctrsCausa2 = new Array("dado que","ya que","porque","por que","a causa de","debido a","se debe a","se debería a","en vista de","pues","si"); //--> Se encuentran al inicio de la causa, en la 2a parte de la oración
    var cnctrsEfecto1 = new Array("para","a fin de","con el objeto de"); //--> Se encuentran al inicio de la oración, antes del efecto o la condición
    var cnctrsEfecto2 = new Array("por eso","por esto","por lo mismo","por lo que","por lo cual","debido a eso","debido a lo que","entonces","caus","para","de modo que","de manera que","así","a fin de"); //--> Se encuentran al inicio del efecto, en la 2a parte de la oración
    
    ok = this.checkPosCtrCausa(cnctrsCausa1,arrPos,"c1");
    if(ok==false){
        ok = this.checkPosCtrCausa(cnctrsCausa2,arrPos,"c2");
    }
    if(ok==false){
        ok = this.checkPosCtrCausa(cnctrsEfecto1,arrPos,"e1");
    }
    if(ok==false){
        ok = this.checkPosCtrCausa(cnctrsEfecto2,arrPos,"e2");
    }

    return ok;
}


Nodo_arbol.prototype.checkPosCtrCausa = function(ctrs,arrPos,tipo){
                        
        var match = false;
        
        var str="(";
        for(var c=0;c<ctrs.length;c++){
            var ctr = ctrs[c];
            if(str!="("){
                    str+="//";
            }
            str += "(" + ctr.replace(/ /g,'_') + ")";
        }
        str+=")";
        
        var toks = getTokens(str);
        var arr = parsear(toks);
        var WSloc = arr[0];
        match = WSloc[0].analizar(1);
        
        if(match){
            var posCtr = WSloc[0].getPos(new Array());
            match = this.checarPosCausa(posCtr,arrPos,tipo);
        }
        
        return match;
}


Nodo_arbol.prototype.checarPosCausa = function(arrPosCtr,arrPos,tipo){
        
        var ok = false;
                        
        if(arrPos.length==2){
                
                var arrPosC = arrPos[0];
                var arrPosE = arrPos[1];
                
                for(var i=0;i<arrPosCtr.length;i++){
                                        
                        var posCtr = arrPosCtr[i].split(",");
                        var arrCtr = this.getPosGlobal(posCtr);
                        var pIniCtr = arrCtr[0];
                        var pFinCtr = arrCtr[1];
                
                        for(var c=0;c<arrPosC.length;c++){
                                                                
                                var posC = arrPosC[c].split(",");
                                var arrC = this.getPosGlobal(posC);
                                var pIniC = arrC[0];
                                var pFinC = arrC[1];
                                
                                for(var e=0;e<arrPosE.length;e++){
                                                                                
                                        var posE = arrPosE[e].split(",");
                                        var arrE = this.getPosGlobal(posE);
                                        var pIniE = arrE[0];
                                        var pFinE = arrE[1];
                                
                                        if(tipo=="c1"){
                                                if( pFinCtr<pIniC && pFinC<pIniE ){
                                                        ok = true;
                                                        break;
                                                }
                                        } else if(tipo=="c2"){
                                                if( pFinE<pIniCtr && pFinCtr<pIniC ){
                                                        ok = true;
                                                        break;
                                                }
                                        } else if(tipo=="e1"){
                                                if( pFinCtr<pIniE && pFinE<pIniC ){
                                                        ok = true;
                                                        break;
                                                }
                                        } else if(tipo=="e2"){
                                                if( pFinC<pIniCtr && pFinCtr<pIniE ){
                                                        ok = true;
                                                        break;
                                                }
                                        }
                                }
                                                        
                                if(ok){
                                        break;
                                }
                        }
                        
                        if(ok){
                                break;
                        }
                        
                }
                
        } else {
                alert("El operador CAU puede unir 2 y sólo 2 expresiones.");
        }
                        
        return ok;
}
