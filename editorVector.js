"use strict";
// constantes
const
GRID_OFFSET = {
	x : 20,
	y : 20
};
const
GRID_NB_ROW = 25;
const
GRID_NB_COL = 25;
const
GRID_SPACING_POINT = 15;
const
GRID_CROSS_LENGTH = 10;
// ////////////////////////////DÉCLARATION DES
// OBJETS////////////////////////////
function Room() {
	var m_polygone = new Array();
	var name = "";

	this.DrawRoom = function() {

	};
	this.FindMiddlePoint = function(){
		if(!m_polygone.length)return;
		// ...
	};
	this.PushPolygone = function(point){
		m_polygone.push(point);
	};
	this.GetPolygone = function(){
		return m_polygone;
	};
}

function Floor() {
	var m_rooms = new Array();
	var m_tempRoom = new Room();
	this.GetRooms = function() {
		return m_rooms;
	};
	this.DrawFloor = function() {

	};
	this.AddRoom = function() {
		m_rooms.push(m_tempRoom);
		m_tempRoom = new Room(); 
	};
	this.PushPointTempRoom = function(posx, posy){
		m_tempRoom.PushPolygone({x:posx,y:posy});
		console.log(m_tempRoom.GetPolygone());
	};
	this.ChangeNameTempRoom = function(name){
		m_tempRoom.m_name = name;
	};
}

function WindowCanvas() {
	var m_canvas = document.getElementById("myCanvas");
	var m_ctx = m_canvas.getContext("2d");
	var m_cursorPosition = {
		x : null,
		y : null
	};
	var m_floors = new Array();
	var m_roomColors = new Array();
	m_roomColors.push("LightCoral");
	m_roomColors.push("LightSalomon");
	m_roomColors.push("MediumVioletRed");
	m_roomColors.push("Tomato");
	m_roomColors.push("SlateBlue");
	m_roomColors.push("Green");
	m_roomColors.push("DodgerBlue");
	m_roomColors.push("BurlyWood");
	m_roomColors.push("SaddleBrown");
	var m_status = 0;
	var m_statusValue = {
		IDLE : 0,
		DRAWING_ROOM : 1
	};
	var m_selectedFloor = 0;

	this.GetCursorPosition = function() {
		return m_cursorPosition;
	};
	this.GetCanvas = function() {
		return m_canvas;
	};
	this.GetCtx = function() {
		return m_ctx;
	};
	this.GetStatusValue = function(){
		return m_statusValue;
	};
	this.GetStatus = function(){
		return m_status;
	};
	this.GetFloors = function(){
		return m_floors;
	};
	this.GetSelectedFloor = function(){
		return m_selectedFloor;
	}
	this.SetCursorPosition = function(posx, posy) {
		m_cursorPosition.x = posx;
		m_cursorPosition.y = posy;
	};
	this.SetStatus = function(status){
		m_status = status;
	};
	this.DrawGrid = function() {
		m_ctx.fillStyle = "SILVER";
		m_ctx.fillRect(GRID_OFFSET.x - GRID_CROSS_LENGTH,
				GRID_OFFSET.y - GRID_CROSS_LENGTH ,
				GRID_SPACING_POINT * GRID_NB_COL + GRID_CROSS_LENGTH /2,
				GRID_SPACING_POINT * GRID_NB_ROW+ GRID_CROSS_LENGTH /2);
		m_ctx.lineWidth = 2;
	    m_ctx.strokeStyle = 'DimGray';
		for ( var i = 0; i < GRID_NB_ROW; i++) {
			for ( var j = 0; j < GRID_NB_COL; j++) {		
				m_ctx.beginPath();
				m_ctx.moveTo(GRID_OFFSET.x - (GRID_CROSS_LENGTH / 2)
						+ GRID_SPACING_POINT * j, GRID_OFFSET.y
						+ GRID_SPACING_POINT * i);
				m_ctx.lineTo(GRID_OFFSET.x + (GRID_CROSS_LENGTH / 2)
						+ GRID_SPACING_POINT * j, GRID_OFFSET.y
						+ GRID_SPACING_POINT * i);
				m_ctx.stroke();
				m_ctx.beginPath();
				m_ctx.moveTo(GRID_OFFSET.x + GRID_SPACING_POINT * j,
						GRID_OFFSET.y - (GRID_CROSS_LENGTH / 2)
								+ GRID_SPACING_POINT * i);
				m_ctx.lineTo(GRID_OFFSET.x + GRID_SPACING_POINT * j,
						GRID_OFFSET.y + (GRID_CROSS_LENGTH / 2)
								+ GRID_SPACING_POINT * i);
				m_ctx.stroke();
			}
		}
	};
	
	this.NewFloor = function(){
		m_floors.push(new Floor());
		console.log("étage push :");
		console.log(m_floors);
	};
	
	this.DeleteFloor = function(){
		if(m_floors.length==1){
			alert("Impossible de supprimer cet étage");
			return;
		}
		m_floors.splice(m_selectedFloor, 1);
		console.log("étage supprimé");
		console.log(m_floors);
	};

	this.NewRoom = function(){
		if(m_status == m_statusValue.DRAWING_ROOM) return;
		m_status = m_statusValue.DRAWING_ROOM;
		console.log("changement d'état :" + m_status)
	}
	
	this.NewFloor();
	// désactivation du menu clique droit
	m_canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
}

var mainWindow = new WindowCanvas();
mainWindow.DrawGrid();


$("#myCanvas").mousemove(
		function() {
			var m_canvas = document.getElementById('myCanvas'), x = event.pageX
					- m_canvas.offsetLeft, y = event.pageY - m_canvas.offsetTop;
			mainWindow.SetCursorPosition(x, y);
		});
$('#myCanvas').mousedown(function(event) {
    switch (event.which) {
        case 1:
            console.log('Left Mouse button pressed.');
            if(mainWindow.GetStatus() == mainWindow.GetStatusValue().DRAWING_ROOM){
            	mainWindow.GetFloors()[mainWindow.GetSelectedFloor()].PushPointTempRoom(mainWindow.GetCursorPosition().x,mainWindow.GetCursorPosition().y);
            }
            break;
        case 2:
        	console.log('Middle Mouse button pressed.');
            break;
        case 3:
        	console.log('Right Mouse button pressed.');
        	if(mainWindow.GetStatus() == mainWindow.GetStatusValue().DRAWING_ROOM){
        		mainWindow.GetFloors()[mainWindow.GetSelectedFloor()].AddRoom();
        		mainWindow.SetStatus(mainWindow.GetStatusValue().IDLE);
        	}
            break;
        default:
        	console.log('mouse buttun not assigned');
    }
});
/*
 * var m_ctx = document.getElementById('myCanvas').getContext('2d');
 * m_ctx.fillStyle = '#f00'; m_ctx.beginPath(); m_ctx.moveTo(0, 0);
 * m_ctx.lineTo(100, 50); m_ctx.lineTo(50, 100); m_ctx.lineTo(0, 90);
 * m_ctx.closePath(); m_ctx.fill();
 */