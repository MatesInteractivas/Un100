function Micromundo(obj){
    
    this.obj = obj;
    this.id = this.obj.id;
    this.url = this.obj.url;
    this.w = -1;
    this.h = -1;
    this.alFrente = this.obj.front;
    this.auto = this.obj.autoDisplay;
    this.txtLiga = this.obj.textLink;
    this.toNxtQstn = this.obj.toNextQuestionOnClose;
    this.closed = false;
    this.chatOff = this.obj.deactivateChat;
    this.statusKeys = new Array();
    this.reset = this.obj.reset;
}


Micromundo.prototype.getX = function() {
    if(this.obj.x==null || this.obj.x==undefined){
        return -1;
    } else {
        return this.obj.x;
    }
};

Micromundo.prototype.getY = function() {
    if(this.obj.y==null || this.obj.y==undefined){
        return -1;
    } else {
        return this.obj.y;
    }
};

Micromundo.prototype.getW = function() {
    if(this.obj.w==null || this.obj.w==undefined){
        return this.w;
    } else {
        return this.obj.w;
    }
};

Micromundo.prototype.getH = function() {
    if(this.obj.h==null || this.obj.h==undefined){
        return this.h;
    } else {
        return this.obj.h;
    }
};
