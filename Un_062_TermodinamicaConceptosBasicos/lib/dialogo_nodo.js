function Nodo(numPreg){
    
    this.numPreg = numPreg;
    this.obj = dialogo.questions[numPreg];
    this.nodosResp = new Array();
    this.multResp = false;
    this.respReq = this.obj.nrRequiredResponses;
    this.respCorrs = 0;
    
    this.getResps();
}

Nodo.prototype.getTxt = function() {
    return this.obj.text;
};


Nodo.prototype.getIdPreg = function() {
    return this.obj.id;
};

Nodo.prototype.getResps = function(){
    for(var i=0;i<this.obj.answers.length;i++){
	this.nodosResp.push(this.obj.answers[i]);
    }
}

