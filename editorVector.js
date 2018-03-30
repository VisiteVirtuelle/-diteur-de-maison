"use strict";
// constantes
const
GRID_OFFSET = {
	x : 20,
	y : 20
};
const
GRID_NB_ROW = 30;
const
GRID_NB_COL = 30;
const
GRID_SPACING_POINT = 20;
const
GRID_CROSS_LENGTH = 12;
// ////////////////////////////DÉCLARATION DES
// OBJETS////////////////////////////
function Room() {
	var m_polygone = new Array();
	var name = "";

	this.DrawRoom = function(ctx, color){
		 ctx = document.getElementById('myCanvas').getContext('2d');
		 ctx.fillStyle = color;
		 ctx.beginPath();
		 ctx.moveTo(GRID_OFFSET.x + m_polygone[0].x * GRID_SPACING_POINT, GRID_OFFSET.y + m_polygone[0].y * GRID_SPACING_POINT);
		 for(var i = 1; i < m_polygone.length;i++){
			 console.log(i);
			 ctx.lineTo(GRID_OFFSET.x + m_polygone[i].x * GRID_SPACING_POINT,GRID_OFFSET.y + m_polygone[i].y * GRID_SPACING_POINT);
		 }
		 ctx.closePath();
		 ctx.fill();
		 console.log("polygone draw");
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
	this.Raycast = function(point){
		
		for(var i=0; i < m_polygone.length; i++){
			
		}
	};
}

function Floor() {
	var m_rooms = new Array();
	var m_tempRoom = new Room();
	this.GetRooms = function() {
		return m_rooms;
	};
	this.DrawFloor = function(ctx, colors) {
		var tempColor = "";
		for(var i =0; i<m_rooms.length;i++){
			tempColor = colors[i%colors.length];
			m_rooms[i].DrawRoom(ctx, tempColor);
		}
	};
	this.AddRoom = function() {
		if(m_tempRoom.GetPolygone().length<=2){
			alert("La Pièce doit contenir plus de points !");
			return false;
		}
		m_rooms.push(m_tempRoom);
		m_tempRoom = new Room();
		return true;
	};
	this.PushPointTempRoom = function(posx, posy){
		m_tempRoom.PushPolygone({x:posx,y:posy});
		console.log("polygone :");
		console.log(m_tempRoom.GetPolygone());
	};
	this.ChangeNameTempRoom = function(name){
		m_tempRoom.m_name = name;
	};
	this.RaycastRoom = function(point){
		if(m_rooms.length < 1) return false;
		var tempRoom;
		for(var i = 0; i < m_rooms.length; i++){
			tempRoom = m_rooms[i];
			
		}
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
	m_roomColors.push("MediumVioletRed");
	m_roomColors.push("Tomato");
	m_roomColors.push("SlateBlue");
	m_roomColors.push("Green");
	m_roomColors.push("DodgerBlue");
	m_roomColors.push("BurlyWood");
	m_roomColors.push("SaddleBrown");
	m_roomColors.push("Red");
	var m_status = 0;
	var m_statusValue = {
		IDLE : 0,
		DRAWING_ROOM : 1
	};
	var m_selectedFloor = -1;

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
	this.GetRoomColors = function(){
		return m_roomColors;
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
	    //déssin de la grille
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
		//affichage du numéro de l'étage
		m_ctx.fillStyle = "White";
		m_ctx.fillRect(390, 618, 110,30)
		m_ctx.fillStyle = "Black";
		m_ctx.font = '15px consolas';
		m_ctx.fillText('Étage : ' + ("00" + m_selectedFloor).slice(-2) + "/" + ("00" + (m_floors.length-1)).slice(-2), 390, 638);
	};
	
	this.NewFloor = function(){
		if(m_floors.length>99){
			alert("Vous ne pouvez plus faire d'étage")
			return;
		}
		m_floors.splice(++m_selectedFloor, 0, new Floor());
		this.DrawGrid();
		console.log("étage push :");
		console.log(m_floors);
	};
	
	this.DeleteFloor = function(){
		if(m_floors.length==1){
			alert("Impossible de supprimer cet étage");
			return;
		}
		m_floors.splice(m_selectedFloor, 1);
		if(m_selectedFloor) m_selectedFloor--;
		this.DrawSelectedFloor();
		console.log("étage supprimé");
		console.log(m_floors);
	};

	this.NewRoom = function(){
		if(m_status == m_statusValue.DRAWING_ROOM) return;
		m_status = m_statusValue.DRAWING_ROOM;
		console.log("changement d'état :" + m_status)
	}
	this.GetCursorToGrid = function(){
		if(m_cursorPosition.x==null)return;
		var tempPoint = {x : null, y : null};
		tempPoint.x = Math.floor((m_cursorPosition.x - GRID_OFFSET.x + GRID_SPACING_POINT / 2) / GRID_SPACING_POINT);
		tempPoint.y = Math.floor((m_cursorPosition.y - GRID_OFFSET.y + GRID_SPACING_POINT / 2) / GRID_SPACING_POINT);
		if((tempPoint.x<0)||
				(tempPoint.y<0)||
				(tempPoint.x>GRID_NB_COL-1)||
				(tempPoint.y>GRID_NB_ROW-1)
				){
			return {x : null, y : null};
		}
		return tempPoint;
	};
	this.GoPrevFloor = function(){
		if(m_selectedFloor==0)return;
		m_selectedFloor--;
		this.DrawSelectedFloor();
	};
	this.GoNextFloor = function(){
		if(m_selectedFloor==m_floors.length-1)return;
		m_selectedFloor++;
		this.DrawSelectedFloor();
	};
	this.NewFloor();
	// désactivation du menu clique droit
	m_canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
	this.DrawSelectedFloor = function(){
		this.DrawGrid();
		m_floors[m_selectedFloor].DrawFloor(m_ctx, m_roomColors);
	};
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
            if((mainWindow.GetStatus() == mainWindow.GetStatusValue().DRAWING_ROOM) &&
            		(mainWindow.GetCursorToGrid().x!=null)
            		){
            	mainWindow.GetCtx().beginPath();//dessin du cercle
            	mainWindow.GetCtx().arc(GRID_OFFSET.x + mainWindow.GetCursorToGrid().x * GRID_SPACING_POINT,GRID_OFFSET.y + mainWindow.GetCursorToGrid().y * GRID_SPACING_POINT, GRID_CROSS_LENGTH/2, 2*Math.PI, false);
            	mainWindow.GetCtx().strokeStyle = "yellow";
            	mainWindow.GetCtx().stroke();
            	
            	mainWindow.GetFloors()[mainWindow.GetSelectedFloor()].PushPointTempRoom(mainWindow.GetCursorToGrid().x,mainWindow.GetCursorToGrid().y);
            }
            break;
        case 2:
        	console.log('Middle Mouse button pressed.');
            break;
        case 3:
        	console.log('Right Mouse button pressed.');
        	if(mainWindow.GetStatus() == mainWindow.GetStatusValue().DRAWING_ROOM){
        		//ajout de la pièce
        		if(mainWindow.GetFloors()[mainWindow.GetSelectedFloor()].AddRoom()){
            		//déssin de la pièce SI la pièce peut être placé
            		mainWindow.DrawSelectedFloor();
            		mainWindow.SetStatus(mainWindow.GetStatusValue().IDLE);        			
        		}

        	}
            break;
        default:
        	console.log('mouse buttun not assigned');
    }
});
