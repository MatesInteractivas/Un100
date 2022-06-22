var hChat;
var topBarra;
var bottomBarra;
var hBarra;
var pressing;


function setScroll(){
    
    hChat = parseInt($("#chat_globos").css("height").replace(/px/,""));
    topBarra = parseInt($("#scroll_flecha_arriba").css("top").replace(/px/,""))+parseInt($("#scroll_flecha_arriba").css("height").replace(/px/,""))
    bottomBarra = parseInt($("#scroll_flecha_abajo").css("bottom").replace(/px/,""))+parseInt($("#scroll_flecha_abajo").css("height").replace(/px/,""))    
    hBarra = $("#scroll_barra").height();

    $("#chat_globos").css("overflow","visible");
    
    document.getElementById("scroll_flecha_arriba").addEventListener("click",function(){scrollUp(hChat-40);},false);   
    document.getElementById("scroll_flecha_abajo").addEventListener("click",function(){scrollDown(hChat-40);},false);
    document.getElementById("scroll_flecha_arriba").addEventListener("mousedown",hold,false);
    document.getElementById("scroll_flecha_arriba").addEventListener("mouseup",release,false);
    document.getElementById("scroll_flecha_abajo").addEventListener("mousedown",hold,false);
    document.getElementById("scroll_flecha_abajo").addEventListener("mouseup",release,false);
}

function scrollDown(dst){
    if(parseInt($("#chat_globos").css("top").replace(/px/,""))>hChat-hTot-dst){
        $("#chat_globos").css("top",parseInt($("#chat_globos").css("top").replace(/px/,""))-dst);
    } else{
        $("#chat_globos").css("top",hChat-hTot-80);
    }
    updateBarra();
}

function scrollUp(dst){
    if(parseInt($("#chat_globos").css("top").replace(/px/,""))<-dst){
        $("#chat_globos").css("top",parseInt($("#chat_globos").css("top").replace(/px/,""))+dst);
    } else{
        $("#chat_globos").css("top",0);
    }
    updateBarra();
}

var  hold = function(event){
    pressing = setInterval(function(){
        if(event.target.id=="scroll_flecha_arriba"){
            scrollUp(hChat/2);
        } else {
            scrollDown(hChat/2);
        }        
    },500);
}

var  release = function(event){
    clearInterval(pressing);
}

function updateScroll(){
    if(hTot>hChat){
        $("#chat_scroll").css("display","block");
	$("#chat_globos").css("top",hChat-hTot-80);
        //$("#scroll_barra").css("bottom",bottomBarra);
        updateBarra();
    }
}

function updateBarra(){
    var posChat = parseInt($("#chat_globos").css("top").replace(/px/,""));
    var posRltv = -(posChat)/hTot;
    var posBarra = (hChat-topBarra-bottomBarra-hBarra)*posRltv;
    $("#scroll_barra").css("top",topBarra+posBarra);
}