"use strict";
// constantes
const
SIZE_SQUARE = 20;
const
SIZE_SQUARE_ROOM_TYPE = 40;
const
NB_COL = 35;
const
NB_ROW = 35;
const
STAGE_INIT_VALUE = 0;
const
MAX_ROOM_TYPE = 99;
const
SPACE_MATRIX_ROOM_TYPE = 50;
const
MATRIX_OFFSET = {
	x : 0,
	y : 0
};
const
ROOM_TYPES_OFFSET = {
	x : SIZE_SQUARE * NB_COL + SPACE_MATRIX_ROOM_TYPE + 10,
	y : 20
};
const
FONT_SIZE = 30;
const
FONT_SIZE_BUTTON = 30;

// ////////////////////////////DÉCLARATION DES
// OBJETS////////////////////////////
function WindowCanvas() {
	// attributs
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var floors = new Array();
	var roomTypes = new Map();
	roomTypes.set(0, "#D0D0D0");// Gris (Vide)
	roomTypes.set(1, "#FF2D00");// Rouge
	roomTypes.set(2, "#B86F3C");// Marron
	roomTypes.set(3, "#E3EE01");// Jaune
	roomTypes.set(4, "#89EE01");// Vert
	roomTypes.set(5, "#01EEE0");// Cyan
	roomTypes.set(6, "#0121EE");// Bleu
	roomTypes.set(7, "#7400FF");// Mauve
	roomTypes.set(8, "#FF00E8");// Magenta
	var roomTypesName = new Array();
	roomTypesName.push(new Map());
	roomTypesName[0].set(0, "Vide");// Gris (Vide)
	roomTypesName[0].set(1, "Salle 1");// Rouge
	roomTypesName[0].set(2, "Salle 2");// Marron
	roomTypesName[0].set(3, "Salle 3");// Jaune
	roomTypesName[0].set(4, "Salle 4");// Vert
	roomTypesName[0].set(5, "Salle 5");// Cyan
	roomTypesName[0].set(6, "Salle 5");// Bleu
	roomTypesName[0].set(7, "Salle 6");// Mauve
	roomTypesName[0].set(8, "Salle 7");// Magenta
	var selectedFloor = 0;
	var selectedRoomType = 0;
	var isMouseDown = false;
	var cursorPosition = {
		x : null,
		y : null
	};
	var buttons = new Array();
	var nbFloor = 1;

	// méthodes
	this.GetCursorPosition = function() {
		return cursorPosition;
	};
	this.GetCanvas = function() {
		return canvas;
	};
	this.GetCtx = function() {
		return ctx;
	};
	this.GetFloors = function() {
		return floors;
	};
	this.GetRoomTypes = function() {
		return roomTypes;
	};
	this.GetRoomTypesName = function() {
		return roomTypesName;
	};
	this.GetSelectedFloor = function() {
		return selectedFloor;
	};
	this.GetSelectedRoomType = function() {
		return selectedRoomType;
	};
	this.SetCursorPosition = function(posx, posy) {
		cursorPosition.x = posx;
		cursorPosition.y = posy;
	};
	this.NewFloor = function() {
		var stage = new Array();
		floors.splice(selectedFloor+1, 0, stage); // nouvelle étage
		for ( var x = 0; x < NB_COL; x++)
			stage.push(new Array());
		for ( var i = 0; i < NB_COL; i++) {
			for ( var j = 0; j < NB_ROW; j++) {
				stage[i].push(STAGE_INIT_VALUE);
			}
		}
		roomTypesName.push(new Map());
		roomTypesName[roomTypesName.length-1].set(0, "Vide");// Gris (Vide)
		roomTypesName[roomTypesName.length-1].set(1, "Salle 1");// Rouge
		roomTypesName[roomTypesName.length-1].set(2, "Salle 2");// Marron
		roomTypesName[roomTypesName.length-1].set(3, "Salle 3");// Jaune
		roomTypesName[roomTypesName.length-1].set(4, "Salle 4");// Vert
		roomTypesName[roomTypesName.length-1].set(5, "Salle 5");// Cyan
		roomTypesName[roomTypesName.length-1].set(6, "Salle 5");// Bleu
		roomTypesName[roomTypesName.length-1].set(7, "Salle 6");// Mauve
		roomTypesName[roomTypesName.length-1].set(8, "Salle 7");// Magenta
		if(floors.length>1){
			selectedFloor++;
			this.DrawFloor();
		}
		console.log("Étage créé : " + (selectedFloor));
		console.log(floors);
		console.log("étage sélectionné : " + selectedFloor);
	};
	this.DrawFloor = function() {
		ctx.strokeStyle = "black";
		var tempFloor = floors[selectedFloor];
		for ( var i = 0; i < NB_COL; i++) {
			for ( var j = 0; j < NB_ROW; j++) {

				ctx.fillStyle = roomTypes.get(tempFloor[i][j]);
				ctx.fillRect(i * SIZE_SQUARE + MATRIX_OFFSET.x, j * SIZE_SQUARE
						+ MATRIX_OFFSET.y, SIZE_SQUARE, SIZE_SQUARE);
			}
		}
		for ( var i = 0; i < NB_ROW + 1; i++) {// affichage des ligne
			// horizontales
			ctx.beginPath();
			ctx.moveTo(MATRIX_OFFSET.x, i * SIZE_SQUARE + MATRIX_OFFSET.y);
			ctx.lineTo(SIZE_SQUARE * NB_COL + MATRIX_OFFSET.x, i * SIZE_SQUARE
					+ MATRIX_OFFSET.y);
			ctx.stroke();
		}
		for ( var i = 0; i < NB_COL + 1; i++) {// affichage des ligne
			// verticales
			ctx.beginPath();
			ctx.moveTo(i * SIZE_SQUARE + MATRIX_OFFSET.x, MATRIX_OFFSET.y);
			ctx.lineTo(i * SIZE_SQUARE + MATRIX_OFFSET.x, SIZE_SQUARE * NB_ROW
					+ MATRIX_OFFSET.y);
			ctx.stroke();
		}
	};
	this.DrawRoomTypes = function() {
		ctx.strokeStyle = "black";
		ctx.fillStyle = "black";
		var textToDisplay = "Vide";
		for ( var i = 0; i < roomTypes.size; i++) {
			if (i > 0) {
				textToDisplay = this.GetRoomTypesName()[selectedFloor].get(i);// /////////////////////////////////////////////////////////////////////
			}
			ctx.font = FONT_SIZE + "px Consolas";
			ctx.fillText(" " + textToDisplay, ROOM_TYPES_OFFSET.x
					+ SIZE_SQUARE_ROOM_TYPE, ROOM_TYPES_OFFSET.y
					+ SIZE_SQUARE_ROOM_TYPE * (i + 1) - FONT_SIZE / 3);
		}
		for ( var i = 0; i < 2; i++) {// affichage des ligne horizontales
			ctx.beginPath();
			ctx.moveTo(ROOM_TYPES_OFFSET.x, ROOM_TYPES_OFFSET.y
					+ SIZE_SQUARE_ROOM_TYPE * roomTypes.size * i);
			ctx.lineTo(ROOM_TYPES_OFFSET.x + SIZE_SQUARE_ROOM_TYPE,
					ROOM_TYPES_OFFSET.y + SIZE_SQUARE_ROOM_TYPE
							* roomTypes.size * i);
			ctx.stroke();
		}
		for ( var i = 0; i < 2; i++) {// affichage des ligne verticales
			ctx.beginPath();
			ctx.moveTo(ROOM_TYPES_OFFSET.x + i * SIZE_SQUARE_ROOM_TYPE,
					ROOM_TYPES_OFFSET.y);
			ctx.lineTo(ROOM_TYPES_OFFSET.x + i * SIZE_SQUARE_ROOM_TYPE,
					ROOM_TYPES_OFFSET.y + SIZE_SQUARE_ROOM_TYPE
							* roomTypes.size);
			ctx.stroke();
		}

		for ( var i = 0; i < roomTypes.size; i++) {// affichage des carrés de
			// couleurs
			ctx.fillStyle = roomTypes.get(i);
			ctx.fillRect(ROOM_TYPES_OFFSET.x, SIZE_SQUARE_ROOM_TYPE * i
					+ ROOM_TYPES_OFFSET.y, SIZE_SQUARE_ROOM_TYPE,
					SIZE_SQUARE_ROOM_TYPE);
		}

		ctx.beginPath();
		for ( var i = 0; i < 2; i++) {// contour de la couleur selectionnée
			ctx.moveTo(ROOM_TYPES_OFFSET.x + SIZE_SQUARE_ROOM_TYPE * i,
					selectedRoomType * SIZE_SQUARE_ROOM_TYPE
							+ ROOM_TYPES_OFFSET.y);
			ctx.lineTo(ROOM_TYPES_OFFSET.x + SIZE_SQUARE_ROOM_TYPE * i,
					(1 + selectedRoomType) * SIZE_SQUARE_ROOM_TYPE
							+ ROOM_TYPES_OFFSET.y);
			ctx.stroke();
			ctx.moveTo(ROOM_TYPES_OFFSET.x, ROOM_TYPES_OFFSET.y
					+ SIZE_SQUARE_ROOM_TYPE * (selectedRoomType + i));
			ctx.lineTo(ROOM_TYPES_OFFSET.x + SIZE_SQUARE_ROOM_TYPE,
					ROOM_TYPES_OFFSET.y + SIZE_SQUARE_ROOM_TYPE
							* (i + selectedRoomType));
			ctx.stroke();
		}
	};
	this.FloorCaseHovering = function() {
		var posx = Math.floor((cursorPosition.x - MATRIX_OFFSET.x)
				/ SIZE_SQUARE);
		var posy = Math.floor((cursorPosition.y - MATRIX_OFFSET.y)
				/ SIZE_SQUARE);
		if ((posx >= NB_COL) || (posx < 0) || (posy >= NB_ROW) || (posy < 0))
			return {
				x : null,
				y : null
			};
		return {
			x : posx,
			y : posy
		};
	};
	this.RoomTypeHovering = function() {
		var posx = Math.floor((cursorPosition.x - ROOM_TYPES_OFFSET.x)
				/ SIZE_SQUARE_ROOM_TYPE);
		var posy = Math.floor((cursorPosition.y - ROOM_TYPES_OFFSET.y)
				/ SIZE_SQUARE_ROOM_TYPE);
		if ((posx >= 1) || (posx < 0) || (posy >= roomTypes.size) || (posy < 0))
			return {
				x : null,
				y : null
			};
		return {
			x : posx,
			y : posy
		};
	};
	this.SetCaseFloor = function(posx, posy) {
		if ((posx == null) || (posy == null))
			return;
		floors[selectedFloor][posx][posy] = selectedRoomType;
	};
	this.SetSelectedRoomType = function(idRoomType) {
		if ((idRoomType > roomTypes.size) || (idRoomType < 0)
				|| (idRoomType == null))
			return;

		selectedRoomType = idRoomType;
	};
	this.SetMouseDown = function(isDown) {
		isMouseDown = isDown;
	};
	this.IsMouseDown = function() {
		return isMouseDown;
	};
	this.DestroyFloor = function(){
		if(floors.length>1)
		{
			floors.splice(selectedFloor,1);
			roomTypesName.splice(selectedFloor,1);
			if(selectedFloor>0) selectedFloor--;
			this.DrawFloor();
			console.log("étage détruit");
			console.log(floors);
			console.log("étage sélectionné : " + selectedFloor);
		}
		else{
			console.log("impossible de détruire cette étage");
		}
	}
	this.GoPrevFloor=function(){
		if(selectedFloor>0)
		{
			selectedFloor--;
			this.DrawFloor();
			console.log("étage précédant : " + selectedFloor);
		}else{
			console.log("impossible d'accéder a l'étage précédant");
		}
	}
	this.GoNextFloor=function(){
		if(selectedFloor<floors.length-1)
		{
			selectedFloor++;
			this.DrawFloor();
			console.log("étage suivant : " + selectedFloor);
		}else{
			console.log("impossible d'accéder a l'étage suivant");
		}
	}
	this.Save = function(){
		var XML = new XMLWriter();
		for(var i=0;i<floors.lenght;i++){
			XML.BeginNode("Foo");
			XML.WriteString("Hello World");
			XML.EndNode();
		}
	}
	// initialisation
	this.NewFloor();
}
// DECLARATION DES VARIABLES NECESSAIRES DU PROGRAMME///////////////////////
var mainWindow = new WindowCanvas();
// CODE
mainWindow.DrawFloor();
mainWindow.DrawRoomTypes();

console.log("Fin du programme");

$("#myCanvas").mouseup(function() {
	mainWindow.SetMouseDown(false);
});
$("#myCanvas").mousedown(
		function() {

			mainWindow.SetSelectedRoomType(mainWindow.RoomTypeHovering().y);
			mainWindow.SetMouseDown(true);

			if (mainWindow.IsMouseDown()) {
				mainWindow.SetCaseFloor(mainWindow.FloorCaseHovering().x,
						mainWindow.FloorCaseHovering().y);
				mainWindow.DrawFloor();
				mainWindow.DrawRoomTypes();
			}
		});
$("#myCanvas").mousemove(
		function() {
			var canvas = document.getElementById('myCanvas'), x = event.pageX
					- canvas.offsetLeft, y = event.pageY - canvas.offsetTop;
			mainWindow.SetCursorPosition(x, y);
			if (mainWindow.IsMouseDown()) {
				mainWindow.SetCaseFloor(mainWindow.FloorCaseHovering().x,
						mainWindow.FloorCaseHovering().y);
				mainWindow.DrawFloor();
				mainWindow.DrawRoomTypes();
			}
		});
