"use strict";
// constantes
const
GRID_OFFSET = {
	x : 20,
	y : 20
};
const
SELECTOR_OFFSET = {
	x : 623,
	y : 70
};
const
GRID_NB_ROW = 30;
const
GRID_NB_COL = 30;
const
GRID_SPACING_POINT = 20;
const
GRID_CROSS_LENGTH = 12;
const
COLOR_SELECTION_1 = "#A98C78";
const
COLOR_SELECTION_2 = "#CECECE";
// ////////////////////////////DÉCLARATION DES
// OBJETS////////////////////////////


function Room() {
	var m_polygone = new Array();
	var m_name = "";

	this.DrawRoom = function(ctx, color){
		 ctx = document.getElementById('myCanvas').getContext('2d');
		 ctx.fillStyle = color;
		 ctx.beginPath();
		 ctx.moveTo(GRID_OFFSET.x + m_polygone[0].x * GRID_SPACING_POINT, GRID_OFFSET.y + m_polygone[0].y * GRID_SPACING_POINT);
		 for(var i = 1; i < m_polygone.length;i++){
			 ctx.lineTo(GRID_OFFSET.x + m_polygone[i].x * GRID_SPACING_POINT,GRID_OFFSET.y + m_polygone[i].y * GRID_SPACING_POINT);
		 }
		 ctx.closePath();
		 ctx.fill();
		 ctx.font = "15px Consolas";
		 
		 ctx.strokeStyle = 'black';
		 ctx.lineWidth = 5;
		 ctx.strokeText(m_name.substring(0,20),
				 GRID_OFFSET.x + GRID_SPACING_POINT*this.FindRightPoint().x,
				 GRID_OFFSET.y + GRID_SPACING_POINT*this.FindRightPoint().y+8);
		 ctx.lineWidth = 2;
		 ctx.fillStyle = "white";
		 ctx.fillText(m_name.substring(0,20),
				 GRID_OFFSET.x + GRID_SPACING_POINT*this.FindRightPoint().x,
				 GRID_OFFSET.y + GRID_SPACING_POINT*this.FindRightPoint().y+8);
	};
	this.FindRightPoint = function(){
		var tempPoint = {
				x:0,
				y:0					
			};
		if(!m_polygone.length) return tempPoint;
		tempPoint.x = m_polygone[0].x;
		tempPoint.y = m_polygone[0].y;
		
		for(var i=1;i<m_polygone.length;i++){
			if(tempPoint.y>m_polygone[i].y){
				tempPoint.x=m_polygone[i].x;
				tempPoint.y=m_polygone[i].y;
			}else if(tempPoint.y==m_polygone[i].y){
				if(tempPoint.x>m_polygone[i].x){
					tempPoint.x=m_polygone[i].x;
					tempPoint.y=m_polygone[i].y;
				}
			}
		}
		return tempPoint;
	};
	this.PushPolygone = function(point){
		m_polygone.push(point);
	};
	this.GetPolygone = function(){
		return m_polygone;
	};
	this.GetName = function(){
		return m_name;
	};
	this.SetName = function(name){
		m_name = name;
	};
	this.Raycast = function(point){
		var x = point.x, y = point.y;

	    var inside = false;
	    
	    for (var i = 0, j = m_polygone.length - 1; i < m_polygone.length; j = i++) {
	        var xi = m_polygone[i].x, yi = m_polygone[i].y;
	        var xj = m_polygone[j].x, yj = m_polygone[j].y;

	        var intersect = ((yi > y) != (yj > y))
	            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
	        if (intersect) inside = !inside;
	    }
	    return inside;
	};
}

function Floor() {
	var m_rooms = new Array();
	var m_tempRoom = new Room();
	var iNewRoom=0;
	this.GetRooms = function() {
		return m_rooms;
	};
	this.DrawFloor = function(ctx, colors) {
		var tempColor = "";
		for(var i = 0; i<m_rooms.length;i++){
			tempColor = colors[i%colors.length];
			if(i == mainWindow.GetSelectedRoom()) tempColor = COLOR_SELECTION_1;
			m_rooms[i].DrawRoom(ctx, tempColor);
		}
	};
	this.AddRoom = function() {
		if(m_tempRoom.GetPolygone().length<=2){
			alert("La Pièce doit contenir plus de points !");
			return false;
		}
		m_tempRoom.SetName("nouvelle pièce " + (++iNewRoom));
		m_rooms.push(m_tempRoom);
		m_tempRoom = new Room();
		mainWindow.SetSelectedRoom(m_rooms.length-1);
		return true;
	};
	this.PushPointTempRoom = function(posx, posy){
		m_tempRoom.PushPolygone({x:posx,y:posy});
	};
	this.RaycastRooms = function(point){
		if(m_rooms.length < 1) return -1;
		var tempRoom;
		for(var i = 0; i < m_rooms.length; i++){
			tempRoom = m_rooms[i];
			if(tempRoom.Raycast(point)) return i;
		}
		return -1;
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
	for(var r=0;r<3;r++){//génération des couleurs
		for(var g=0; g<3; g++){
			for(var b=0; b<3; b++){
				if(r==0)m_roomColors.push("rgb("+ (255-g*85) +","+(255-b*85)+","+(r*85)+")");
				if(r==1)m_roomColors.push("rgb("+ (g*85) +","+(255-b*85)+","+(255-r*85)+")");
				if(r==2)m_roomColors.push("rgb("+ (255-g*85) +","+(b*85)+","+(255-r*85)+")");
				m_ctx.fillStyle = m_roomColors[m_roomColors.length-1];
				m_ctx.fillRect(620 +(40*b),
						300 +(40*g)+ (40*3*r),
						40,
						40);
			}
		}
	}
	for(var i=0;i<27;i++){
		m_ctx.fillStyle = m_roomColors[i];
		m_ctx.fillRect(745+i*15,
				300,
				15,
				15);
	}
	m_ctx.fillStyle = COLOR_SELECTION_1;
	m_ctx.fillRect(745,
			315,
			15+26*15,
			15);
	var m_status = 0;
	var m_statusValue = {
		IDLE : 0,
		DRAWING_ROOM : 1
	};
	var m_selectedFloor = -1;
	var m_hoveredRoom = -1;
	var m_selectedRoom= -1;
	// méthodes

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
		return m_floors[m_selectedFloor];
	};
	this.GetRoomColors = function(){
		return m_roomColors;
	};
	this.GetHoveredRoom = function(){
		return m_hoveredRoom;
	};
	this.SetCursorPosition = function(posx, posy) {
		m_cursorPosition.x = posx;
		m_cursorPosition.y = posy;
	};
	this.SetStatus = function(status){
		m_status = status;
	};
	this.SetSelectedRoom = function(selec){
		m_selectedRoom = selec;
	};
	this.DrawGrid = function() {
		m_ctx.fillStyle = "SILVER";
		m_ctx.fillRect(GRID_OFFSET.x - GRID_CROSS_LENGTH,
				GRID_OFFSET.y - GRID_CROSS_LENGTH ,
				GRID_SPACING_POINT * GRID_NB_COL + GRID_CROSS_LENGTH /2,
				GRID_SPACING_POINT * GRID_NB_ROW+ GRID_CROSS_LENGTH /2);
		m_ctx.lineWidth = 2;
	    m_ctx.strokeStyle = 'DimGray';
	    // déssin de la grille
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
		// affichage du numéro de l'étage
		m_ctx.fillStyle = "White";
		m_ctx.fillRect(390, 618, 110,30)
		m_ctx.fillStyle = "Black";
		m_ctx.font = '15px consolas';
		m_ctx.fillText('Étage : ' + ("00" + m_selectedFloor).slice(-2) + "/" + ("00" + (m_floors.length-1)).slice(-2), 390, 638);
		
	};
	
	this.NewFloor = function(){
		if(m_status == m_statusValue.DRAWING_ROOM) return;
		if(m_floors.length>99){
			alert("Vous ne pouvez plus faire d'étage")
			return;
		}
		m_selectedRoom=-1;
		m_floors.splice(++m_selectedFloor, 0, new Floor());
		this.DrawSelectedFloor();
	};
	
	this.DeleteFloor = function(){
		if(m_status == m_statusValue.DRAWING_ROOM) return;
		if(m_floors.length==1){
			alert("Impossible de supprimer cet étage");
			return;
		}
		m_selectedRoom=-1;
		m_floors.splice(m_selectedFloor, 1);
		if(m_selectedFloor) m_selectedFloor--;
		this.DrawSelectedFloor();
	};

	this.NewRoom = function(){
		if(m_status == m_statusValue.DRAWING_ROOM) return;
		m_status = m_statusValue.DRAWING_ROOM;
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
	this.GetCursorToGridForRaycast = function(){
		if(m_cursorPosition.x==null)return;
		var tempPoint = {x : null, y : null};
		tempPoint.x = (m_cursorPosition.x - GRID_OFFSET.x) / GRID_SPACING_POINT;
		tempPoint.y = (m_cursorPosition.y - GRID_OFFSET.y) / GRID_SPACING_POINT;
		if((tempPoint.x<0)||
				(tempPoint.y<0)||
				(tempPoint.x>GRID_NB_COL-1)||
				(tempPoint.y>GRID_NB_ROW-1)
				){
			return {x : null, y : null};
		}
		return tempPoint;
	};
	this.RaycastHoveredFloor = function(){
		m_hoveredRoom = m_floors[m_selectedFloor].RaycastRooms(this.GetCursorToGridForRaycast());
	};
	this.GoPrevFloor = function(){
		if(m_status == m_statusValue.DRAWING_ROOM) return;
		if(m_selectedFloor==0)return;
		m_selectedRoom=-1;
		m_selectedFloor--;
		this.DrawSelectedFloor();
	};
	this.GoNextFloor = function(){
		if(m_status == m_statusValue.DRAWING_ROOM) return;
		if(m_selectedFloor==m_floors.length-1)return;
		m_selectedRoom=-1;
		m_selectedFloor++;
		this.DrawSelectedFloor();
	};
	this.SetNameSelectedRoom = function(newName){
		if(m_selectedRoom == -1){
			alert("vous n'avez pas selectionné de pièce");
			return;
		}
		this.GetSelectedFloor().GetRooms()[m_selectedRoom].SetName(newName);
		this.DrawSelectedFloor();
	};
	this.DeleteSelectedRoom = function(){
		if(m_selectedRoom == -1){
			alert("vous n'avez pas selectionné de pièce");
			return;
		}
		this.GetSelectedFloor().GetRooms().splice(m_selectedRoom, 1);
		m_selectedRoom = -1;
		this.DrawSelectedFloor();
	};
	this.Save = function(){
		var xmlString = "<blueprint>";					//début de la balise blueprint
		
		for(var iFloor=0; iFloor<m_floors.length; iFloor++){
			xmlString += "<floor>";							//début de la balise floor
			
			var tempRooms = m_floors[iFloor].GetRooms();
			for(var iRoom=0; iRoom<tempRooms.length; iRoom++){
				var tempRoom = tempRooms[iRoom];
				
				xmlString += "<room>" +							//début balise room
				"<name>" + tempRoom.GetName() + "</name>"; 			//récupération du nom
				for(var j=0; j < tempRoom.GetPolygone().length; j++){
					
					xmlString += "<point>" +						//début balise point
					"<x>" + tempRoom.GetPolygone()[j].x + "</x>" +		//balise x
					"<y>" + tempRoom.GetPolygone()[j].y + "</y>" +		//balise y
					"</point>";										//fin balise point
				}
				xmlString += "</room>";							//fin balise room
			}
			xmlString += "</floor>";						//fin balise floor
		}
		xmlString += "</blueprint>";					//fin de la balise blueprint
		console.log(xmlString);
	};

	// désactivation du menu clique droit
	m_canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
	this.DrawSelectedFloor = function(){
		this.DrawGrid();
		m_floors[m_selectedFloor].DrawFloor(m_ctx, m_roomColors);
		m_ctx.fillStyle = "white";
		m_ctx.fillRect(620, 5, 560,30)
		m_ctx.fillStyle = "Black";
		m_ctx.font = '15px consolas';
		if(m_selectedRoom == -1){
			m_ctx.fillText("Pièce sélectionné : Aucune pièce sélectionné", 620, 20);
		}else{
			m_ctx.fillText("Pièce sélectionné : " + (this.GetSelectedFloor().GetRooms()[m_selectedRoom].GetName()).substring(0,47), 620, GRID_OFFSET.y);
		}
	};
	this.GetSelectedRoom = function(){
		return m_selectedRoom;
	};
}

function CSelector() {
	var m_roomNames = new Array();
	var m_selectedRoom = -1;
	var m_topName = 0;
	
	var m_sizeOf = {
			nbDispName : 10,
			heightDispName : 20,
			widthDispName : 180,
			heightAssignButton : 20,
			widthAssignButton : 100,
			nbCharDisp : 15,
			fontCorrection : 5
		};
	
	this.IsCursorInSelector = function(cursPos, mode) {
		if((cursPos.x > SELECTOR_OFFSET.x)&&
				(cursPos.x < SELECTOR_OFFSET.x + m_sizeOf.widthDispName + m_sizeOf.heightDispName)&&
				(cursPos.y > SELECTOR_OFFSET.y)&&
				(cursPos.y < SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName + m_sizeOf.heightAssignButton)){
			
			if(cursPos.x > SELECTOR_OFFSET.x + m_sizeOf.widthDispName){//BOUTON DE SCROLL
				if(cursPos.y < SELECTOR_OFFSET.y + m_sizeOf.heightDispName){
					if(mode) this.ScrollUp();
				}
				
				if((cursPos.y > SELECTOR_OFFSET.y + ((m_sizeOf.nbDispName-1) * m_sizeOf.heightDispName))&&
						(cursPos.y < SELECTOR_OFFSET.y + (m_sizeOf.nbDispName * m_sizeOf.heightDispName))){
					if(mode) this.ScrollDown();
				}
				
			}else if(cursPos.y < SELECTOR_OFFSET.y + m_sizeOf.nbDispName * m_sizeOf.heightDispName){//RECHERCHE DE LA PIECE SELECTIONNÉE
				var itemp = Math.floor((cursPos.y - SELECTOR_OFFSET.y)/m_sizeOf.heightDispName) + m_topName;
				if(itemp < m_roomNames.length){
					m_selectedRoom = itemp;
					if(mode) this.DrawSelector();
				}
			}else if(cursPos.x < SELECTOR_OFFSET.x + m_sizeOf.widthAssignButton){
				if(mode) this.AssignName();
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
		if(m_selectedRoom==-1){
			alert("Vous n'avez pas selectionné de nom");
			return false;
		}
		mainWindow.SetNameSelectedRoom(m_roomNames[m_selectedRoom]);
		return true;
	};
	this.DrawSelector = function() {
		mainWindow.GetCtx().lineWidth = 2;
		mainWindow.GetCtx().fillStyle = "white";//déssin du fond du sélecteur
		mainWindow.GetCtx().fillRect(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName, m_sizeOf.widthAssignButton, m_sizeOf.heightAssignButton);
		for(var i=0; i<2; i++){
			mainWindow.GetCtx().fillRect(SELECTOR_OFFSET.x + m_sizeOf.widthDispName, SELECTOR_OFFSET.y + i*m_sizeOf.heightDispName * (m_sizeOf.nbDispName-1), m_sizeOf.heightDispName, m_sizeOf.heightDispName);
		}
		for(var i = 0; i <= m_sizeOf.nbDispName; i++){//Déssin du sélecteur
			if(i+m_topName == m_selectedRoom)mainWindow.GetCtx().fillStyle = COLOR_SELECTION_2;
			else mainWindow.GetCtx().fillStyle = "white";//déssin du fond du sélecteur
			
			if(i<m_sizeOf.nbDispName) mainWindow.GetCtx().fillRect(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + i * m_sizeOf.heightDispName, m_sizeOf.widthDispName, m_sizeOf.heightDispName);
			mainWindow.GetCtx().strokeStyle = "black";//déssin des lignes du sélecteur horizontales
			mainWindow.GetCtx().beginPath();
			mainWindow.GetCtx().moveTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y+ i*m_sizeOf.heightDispName);
			mainWindow.GetCtx().lineTo(m_sizeOf.widthDispName + SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + i*m_sizeOf.heightDispName);
			mainWindow.GetCtx().stroke();
			
			//////AFFICHAGE DES NOMS DES PIECES
			mainWindow.GetCtx().font = m_sizeOf.heightDispName + "px Consolas";
			mainWindow.GetCtx().fillStyle = "black"
			if((i != m_sizeOf.nbDispName)&&(i < m_roomNames.length - m_topName)) mainWindow.GetCtx().fillText(m_roomNames[i+m_topName].substring(0,m_sizeOf.nbCharDisp),SELECTOR_OFFSET.x + m_sizeOf.fontCorrection,SELECTOR_OFFSET.y + m_sizeOf.heightDispName * (i+1) - m_sizeOf.fontCorrection);
		}
		mainWindow.GetCtx().beginPath();//déssin des lignes verticales
		mainWindow.GetCtx().moveTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y);
		mainWindow.GetCtx().lineTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + m_sizeOf.heightDispName*m_sizeOf.nbDispName);
		mainWindow.GetCtx().moveTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName, SELECTOR_OFFSET.y);
		mainWindow.GetCtx().lineTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName, SELECTOR_OFFSET.y + m_sizeOf.heightDispName*m_sizeOf.nbDispName);
		
		//déssin du bouton d'assignation
		for(var i=0; i<2; i++){
			mainWindow.GetCtx().moveTo(SELECTOR_OFFSET.x + i*m_sizeOf.widthAssignButton, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName);
			mainWindow.GetCtx().lineTo(SELECTOR_OFFSET.x + i*m_sizeOf.widthAssignButton, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName + m_sizeOf.heightAssignButton);
		}
		mainWindow.GetCtx().fillStyle = "black"
		mainWindow.GetCtx().moveTo(SELECTOR_OFFSET.x, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName+ m_sizeOf.heightAssignButton);
		mainWindow.GetCtx().lineTo(SELECTOR_OFFSET.x + m_sizeOf.widthAssignButton, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName + m_sizeOf.heightAssignButton);
		mainWindow.GetCtx().fillText("Assigner",SELECTOR_OFFSET.x + m_sizeOf.fontCorrection, SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName+ m_sizeOf.heightAssignButton - m_sizeOf.fontCorrection);
				
		//déssin des boutons de scroll
		for(var j=0; j<2; j++){
			for(var i=0; i<2; i++){
				mainWindow.GetCtx().moveTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName, SELECTOR_OFFSET.y + i * m_sizeOf.heightDispName + (j*m_sizeOf.heightDispName * (m_sizeOf.nbDispName-1)));
				mainWindow.GetCtx().lineTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName + m_sizeOf.heightDispName, SELECTOR_OFFSET.y + i * m_sizeOf.heightDispName+ (j*m_sizeOf.heightDispName * (m_sizeOf.nbDispName-1)));
			}
			mainWindow.GetCtx().moveTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName + m_sizeOf.heightDispName, SELECTOR_OFFSET.y + j*m_sizeOf.heightDispName * (m_sizeOf.nbDispName-1));
			mainWindow.GetCtx().lineTo(SELECTOR_OFFSET.x + m_sizeOf.widthDispName + m_sizeOf.heightDispName, SELECTOR_OFFSET.y + m_sizeOf.heightDispName+ j*m_sizeOf.heightDispName * (m_sizeOf.nbDispName-1));	
		}
		mainWindow.GetCtx().font = m_sizeOf.heightDispName + "px webdings";
		mainWindow.GetCtx().fillStyle = "black";
		mainWindow.GetCtx().fillText("5",SELECTOR_OFFSET.x + m_sizeOf.widthDispName,SELECTOR_OFFSET.y + m_sizeOf.heightDispName - m_sizeOf.fontCorrection);
		mainWindow.GetCtx().fillText("6",SELECTOR_OFFSET.x + m_sizeOf.widthDispName,SELECTOR_OFFSET.y + m_sizeOf.heightDispName * m_sizeOf.nbDispName - m_sizeOf.fontCorrection);
		mainWindow.GetCtx().stroke();
	};
}


var mainWindow = new WindowCanvas();
mainWindow.NewFloor();
var selector = new CSelector();
selector.InitNamesXML();
selector.DrawSelector();

$("#myCanvas").mousemove(
		function(event) {
			var m_canvas = document.getElementById('myCanvas'), x = event.pageX
					- m_canvas.offsetLeft, y = event.pageY - m_canvas.offsetTop;
			mainWindow.SetCursorPosition(x, y);
			if(mainWindow.GetStatus() == mainWindow.GetStatusValue().IDLE){
				mainWindow.RaycastHoveredFloor();
			}
		});
$('#myCanvas').mousedown(function(event) {
    switch (event.which) {
        case 1:
            selector.IsCursorInSelector(mainWindow.GetCursorPosition(), 1)
            if(mainWindow.GetStatus() == mainWindow.GetStatusValue().IDLE){
            	// si le mode est en attente
            	if(mainWindow.GetHoveredRoom() != -1){
            		mainWindow.SetSelectedRoom(mainWindow.GetHoveredRoom());
            		mainWindow.DrawSelectedFloor();
            	}else if(!selector.IsCursorInSelector(mainWindow.GetCursorPosition(), 0)){
            		mainWindow.SetSelectedRoom(-1);
            		mainWindow.DrawSelectedFloor();
            	}
            }else if(mainWindow.GetStatus() == mainWindow.GetStatusValue().DRAWING_ROOM){
            	// si le mode est en dessin
            	if(mainWindow.GetCursorToGrid().x!=null){
            		// dessin de la pièce
            		mainWindow.GetCtx().beginPath();// dessin du cercle
            		mainWindow.GetCtx().arc(GRID_OFFSET.x + mainWindow.GetCursorToGrid().x * GRID_SPACING_POINT,GRID_OFFSET.y + mainWindow.GetCursorToGrid().y * GRID_SPACING_POINT, GRID_CROSS_LENGTH/2, 2*Math.PI, false);
            		mainWindow.GetCtx().strokeStyle = COLOR_SELECTION_1;
            		mainWindow.GetCtx().stroke();
            		mainWindow.GetSelectedFloor().PushPointTempRoom(mainWindow.GetCursorToGrid().x,mainWindow.GetCursorToGrid().y);
            	}
            } 

            break;
        case 2:
            break;
        case 3:
        	if(mainWindow.GetStatus() == mainWindow.GetStatusValue().DRAWING_ROOM){
        		// ajout de la pièce
        		if(mainWindow.GetSelectedFloor().AddRoom()){
            		// déssin de la pièce SI la pièce peut être placé
            		mainWindow.DrawSelectedFloor();
            		mainWindow.SetStatus(mainWindow.GetStatusValue().IDLE);        			
        		}

        	}
            break;
        default:
    }
});