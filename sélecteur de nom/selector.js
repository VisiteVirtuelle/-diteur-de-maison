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
			heightDispName : 18,
			widthDispName : 180,
			heightOkButton : 18,
			widthOkButton : 180
		};
	
	this.IsCursorSelector = function(cursPos) {
		return false;
	};
	this.InitNamesXML = function() {
		return false;
	};
	this.ScrollUp = function() {
		return false;
	};
	this.ScrollDown = function() {
		return false;
	};
	this.AssignName = function() {
		
	};
	this.DrawSelector = function() {
		ctx.lineWidth = 2;
		for(var i = 0; i <= m_sizeOf.nbDispName; i++){//Déssin du sélecteur
			ctx.fillStyle = "white";//déssin du fond du sélecteur
			if(i<m_sizeOf.nbDispName) ctx.fillRect(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + i * m_sizeOf.heightDispName, m_sizeOf.widthDispName, m_sizeOf.heightDispName);
			
			ctx.strokeStyle = "black";//déssin des lignes du sélecteur horizontales
			ctx.beginPath();
			ctx.moveTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y+ i*m_sizeOf.heightDispName);
			ctx.lineTo(m_sizeOf.widthDispName + SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + i*m_sizeOf.heightDispName);
			ctx.stroke();
			if(i<2){
				ctx.beginPath();
				ctx.moveTo(SELECTOR_OFFSET.x + i*m_sizeOf.widthDispName, SELECTOR_OFFSET.y);
				ctx.lineTo(SELECTOR_OFFSET.x + i*m_sizeOf.widthDispName, SELECTOR_OFFSET.y + m_sizeOf.heightDispName*m_sizeOf.nbDispName);
				ctx.stroke();
			}
		}
	/*	ctx.beginPath();//déssin des lignes verticales
		ctx.moveTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y);
		ctx.lineTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + m_sizeOf.heightDispName*m_sizeOf.nbDispName);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName, SELECTOR_OFFSET.y);
		ctx.lineTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName, SELECTOR_OFFSET.y + m_sizeOf.heightDispName*m_sizeOf.nbDispName);
		ctx.stroke();*/
	};
}
var selector = new CSelector();
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
            console.log('Left Mouse button pressed.');       
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