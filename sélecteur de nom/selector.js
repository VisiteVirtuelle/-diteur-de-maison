"use strict";
const
SELECTOR_OFFSET = {
		x : 10,
		y : 10
	};

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var mousePos = {x:0,y:0};

function CSelector() {
	var m_roomNames = new Array();
	var m_selectedRoom = -1;
	var m_topName = 0;
	
	var m_sizeOf = {
			nbDispName : 4,
			heightDispName : 20,
			widthDispName : 180,
			heightAssignButton : 20,
			widthAssignButton : 100,
			nbCharDisp : 15,
			fontCorrection : 5
		};
	
	this.IsCursorInSelector = function(cursPos) {
		if((cursPos.x > SELECTOR_OFFSET.x)&&
				(cursPos.x < SELECTOR_OFFSET.x + m_sizeOf.widthDispName + m_sizeOf.heightDispName)&&
				(cursPos.y > SELECTOR_OFFSET.y)&&
				(cursPos.y < SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName + m_sizeOf.heightAssignButton)){
			
			if(cursPos.x > SELECTOR_OFFSET.x + m_sizeOf.widthDispName){//BOUTON DE SCROLL
				if(cursPos.y < SELECTOR_OFFSET.y + m_sizeOf.heightDispName){
					this.ScrollUp();
					//console.log("up");
				}
				
				if((cursPos.y > SELECTOR_OFFSET.y + ((m_sizeOf.nbDispName-1) * m_sizeOf.heightDispName))&&
						(cursPos.y < SELECTOR_OFFSET.y + (m_sizeOf.nbDispName * m_sizeOf.heightDispName))){
					this.ScrollDown();
					//console.log("down");
				}
				
			}else if(cursPos.y < SELECTOR_OFFSET.y + m_sizeOf.nbDispName * m_sizeOf.heightDispName){//RECHERCHE DE LA PIECE SELECTIONNÉE
				var itemp = Math.floor((cursPos.y - SELECTOR_OFFSET.y)/m_sizeOf.heightDispName) + m_topName;
				if(itemp < m_roomNames.length){
					m_selectedRoom = itemp;
					//console.log(itemp);
					this.DrawSelector();
				}
			}else if(cursPos.x < SELECTOR_OFFSET.x + m_sizeOf.widthAssignButton){
				//console.log("Assign");
			}
			
			return true;
		}
		
		return false;
	};
	this.InitNamesXML = function() {
		var xmlhttp;
		var xmlDoc;
		
		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp = new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
		  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		xmlhttp.open("GET","visit.xml",false);
		xmlhttp.send();
		xmlDoc = xmlhttp.responseXML;
		xmlDoc = (new DOMParser()).parseFromString(xmlhttp.responseText, "text/xml");
		
		var xmlRoom = xmlDoc.getElementsByTagName("room");
		for(var i=0; i<xmlRoom.length; i++){
			m_roomNames.push(xmlRoom[i].getElementsByTagName("name")[0].childNodes[0].nodeValue);
		}
		console.log(m_roomNames);
		return false;
	};
	this.ScrollUp = function() {
		if(m_topName == 0) return false;
		m_topName--;
		this.DrawSelector();
		return true;
	};
	this.ScrollDown = function() {
		if(m_topName >= m_roomNames.length - m_sizeOf.nbDispName) return false;
		m_topName++;
		this.DrawSelector();
		return true;
	};
	this.AssignName = function() {
		
	};
	this.DrawSelector = function() {
		ctx.lineWidth = 2;
		ctx.fillStyle = "white";//déssin du fond du sélecteur
		ctx.fillRect(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName, m_sizeOf.widthAssignButton, m_sizeOf.heightAssignButton);
		for(var i=0; i<2; i++){
			ctx.fillRect(SELECTOR_OFFSET.x + m_sizeOf.widthDispName, SELECTOR_OFFSET.y + i*m_sizeOf.heightDispName * (m_sizeOf.nbDispName-1), m_sizeOf.heightDispName, m_sizeOf.heightDispName);
		}
		for(var i = 0; i <= m_sizeOf.nbDispName; i++){//Déssin du sélecteur
			if(i+m_topName == m_selectedRoom)ctx.fillStyle = "cyan";
			else ctx.fillStyle = "white";//déssin du fond du sélecteur
			
			if(i<m_sizeOf.nbDispName) ctx.fillRect(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + i * m_sizeOf.heightDispName, m_sizeOf.widthDispName, m_sizeOf.heightDispName);
			ctx.strokeStyle = "black";//déssin des lignes du sélecteur horizontales
			ctx.beginPath();
			ctx.moveTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y+ i*m_sizeOf.heightDispName);
			ctx.lineTo(m_sizeOf.widthDispName + SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + i*m_sizeOf.heightDispName);
			ctx.stroke();
			
			//////AFFICHAGE DES NOMS DES PIECES
			ctx.font = m_sizeOf.heightDispName + "px Consolas";
			ctx.fillStyle = "black"
			if((i != m_sizeOf.nbDispName)&&(i < m_roomNames.length - m_topName)) ctx.fillText(m_roomNames[i+m_topName].substring(0,m_sizeOf.nbCharDisp),SELECTOR_OFFSET.x + m_sizeOf.fontCorrection,SELECTOR_OFFSET.y + m_sizeOf.heightDispName * (i+1) - m_sizeOf.fontCorrection);
		}
		ctx.beginPath();//déssin des lignes verticales
		ctx.moveTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y);
		ctx.lineTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + m_sizeOf.heightDispName*m_sizeOf.nbDispName);
		ctx.moveTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName, SELECTOR_OFFSET.y);
		ctx.lineTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName, SELECTOR_OFFSET.y + m_sizeOf.heightDispName*m_sizeOf.nbDispName);
		
		//déssin du bouton d'assignation
		for(var i=0; i<2; i++){
			ctx.moveTo(SELECTOR_OFFSET.x + i*m_sizeOf.widthAssignButton, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName);
			ctx.lineTo(SELECTOR_OFFSET.x + i*m_sizeOf.widthAssignButton, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName + m_sizeOf.heightAssignButton);
		}
		ctx.moveTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName+ m_sizeOf.heightAssignButton);
		ctx.lineTo(SELECTOR_OFFSET.x + m_sizeOf.widthAssignButton, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName + m_sizeOf.heightAssignButton);
		ctx.fillText("Assigner",SELECTOR_OFFSET.x + m_sizeOf.fontCorrection, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName+ m_sizeOf.heightAssignButton - m_sizeOf.fontCorrection);
				
		//déssin des boutons de scroll
		for(var j=0; j<2; j++){
			for(var i=0; i<2; i++){
				ctx.moveTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName, SELECTOR_OFFSET.y + i * m_sizeOf.heightDispName + (j*m_sizeOf.heightDispName * (m_sizeOf.nbDispName-1)));
				ctx.lineTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName + m_sizeOf.heightDispName, SELECTOR_OFFSET.y + i * m_sizeOf.heightDispName+ (j*m_sizeOf.heightDispName * (m_sizeOf.nbDispName-1)));
			}
			ctx.moveTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName + m_sizeOf.heightDispName, SELECTOR_OFFSET.y + j*m_sizeOf.heightDispName * (m_sizeOf.nbDispName-1));
			ctx.lineTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName + m_sizeOf.heightDispName, SELECTOR_OFFSET.y + m_sizeOf.heightDispName+ j*m_sizeOf.heightDispName * (m_sizeOf.nbDispName-1));	
		}
		ctx.font = m_sizeOf.heightDispName + "px webdings";
		ctx.fillStyle = "black"
		ctx.fillText("5",SELECTOR_OFFSET.x + m_sizeOf.widthDispName,SELECTOR_OFFSET.y + m_sizeOf.heightDispName - m_sizeOf.fontCorrection);
		ctx.fillText("6",SELECTOR_OFFSET.x + m_sizeOf.widthDispName,SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName - m_sizeOf.fontCorrection);
		ctx.stroke();
	};
}
var selector = new CSelector();
selector.InitNamesXML();
selector.DrawSelector();

$("#myCanvas").mousemove(
		function(event) {
			var m_canvas = document.getElementById('myCanvas'), x = event.pageX
					- m_canvas.offsetLeft, y = event.pageY - m_canvas.offsetTop;
			mousePos.x = x;
			mousePos.y = y;
		});
$('#myCanvas').mousedown(function(event) {
    switch (event.which) {
        case 1:
            //console.log('Left Mouse button pressed.');
            if(selector.IsCursorInSelector({x:mousePos.x, y:mousePos.y})){
            	
            }
            break;
        case 2:
        	console.log('Middle Mouse button pressed.');
            break;
        case 3:
        	console.log('Right Mouse button pressed.');
            break;
        default:
        	console.log('mouse buttun not assigned');
    }
});